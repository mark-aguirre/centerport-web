#!/usr/bin/env python3
"""
Patient photo backfill: MSSQL dbo.m_patient.picture  ->  SeaweedFS (S3 gateway)

Run this AFTER migrate_patients.py has created the seafarer_profiles rows.

For every migrated profile that has no photo yet, this reads the legacy
``picture`` BLOB from MSSQL, uploads it to the SeaweedFS S3 bucket using the same
object-key convention as the backend (``{uuid}_{name}``), and sets
``seafarer_profiles.photo_url = '/api/files/{key}'`` so the existing
``GET /api/files/{key}`` endpoint serves it unchanged.

Design notes
------------
* **Source-driven & index-friendly.** ``papin`` is not indexed in the source
  table (only ``cn``, the clustered PK, is), so we stream rows ordered by ``cn``
  and match them to already-migrated profiles by ``profile_id`` (= papin). This
  uses the clustered index and reads each large BLOB exactly once.
* **Resumable.** Only profiles whose ``photo_url IS NULL`` are candidates, so a
  re-run picks up wherever a previous run stopped (e.g. after a network blip to
  the SeaweedFS host). Uploads + DB updates are committed in batches.
* **Keep-last semantics** match migrate_patients.py: duplicate papins are
  streamed in ascending ``cn`` order, so the highest ``cn`` wins the final
  ``photo_url``.

Usage
-----
  python migrate_photos.py                 # dry run: report only, no writes
  python migrate_photos.py --execute       # upload to SeaweedFS + update photo_url
  python migrate_photos.py --execute --limit 50   # process first 50 candidates

Connection / storage settings come from environment variables (matching
backend/.env): MSSQL_*, PG_*, and S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY,
S3_SECRET_KEY, S3_REGION, S3_PATH_STYLE_ACCESS.
"""
from __future__ import annotations

import argparse
import logging
import os
import sys
import uuid
from dataclasses import dataclass

try:
    import pyodbc
except ImportError:  # pragma: no cover
    pyodbc = None

try:
    import psycopg2
except ImportError:  # pragma: no cover
    psycopg2 = None

try:
    import boto3
    from botocore.client import Config as BotoConfig
    from botocore.exceptions import ClientError
except ImportError:  # pragma: no cover
    boto3 = None


# --------------------------------------------------------------------------- #
# Configuration (mirrors backend/.env)
# --------------------------------------------------------------------------- #
SOURCE = {
    "server": os.getenv("MSSQL_SERVER", r"DESKTOP-KIIKPT8\SQLEXPRESS"),
    "database": os.getenv("MSSQL_DATABASE", "Centerport_Medical"),
    "trusted": os.getenv("MSSQL_TRUSTED", "yes"),
    "user": os.getenv("MSSQL_USER", ""),
    "password": os.getenv("MSSQL_PASSWORD", ""),
}

TARGET = {
    "host": os.getenv("PG_HOST", "localhost"),
    "port": int(os.getenv("PG_PORT", "5434")),
    "dbname": os.getenv("PG_DB", "centerport"),
    "user": os.getenv("PG_USER", "postgres"),
    "password": os.getenv("PG_PASSWORD", "postgres"),
}

S3 = {
    "endpoint": os.getenv("S3_ENDPOINT", "http://192.168.0.15:8333"),
    "region": os.getenv("S3_REGION", "us-east-1"),
    "bucket": os.getenv("S3_BUCKET", "patient-photos"),
    "access_key": os.getenv("S3_ACCESS_KEY", "admin"),
    "secret_key": os.getenv("S3_SECRET_KEY", "change-this-password"),
    "path_style": os.getenv("S3_PATH_STYLE_ACCESS", "true").lower() in {"yes", "true", "1"},
}

# Only touch rows created by the profile migration, so a stray manual upload is
# never clobbered. Set MIGRATION_CREATED_BY="" to consider every null-photo row.
CREATED_BY = os.getenv("MIGRATION_CREATED_BY", "migration")

FETCH_BATCH = 50      # source rows (BLOBs) pulled per round trip
COMMIT_EVERY = 100    # profile updates per PG commit

log = logging.getLogger("migrate_photos")


# --------------------------------------------------------------------------- #
# Image type detection (magic bytes)
# --------------------------------------------------------------------------- #
def detect_image(data: bytes) -> tuple[str, str]:
    """Return (extension, content_type) from magic bytes. Defaults to PNG-safe binary."""
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "png", "image/png"
    if data[:3] == b"\xff\xd8\xff":
        return "jpg", "image/jpeg"
    if data[:6] in (b"GIF87a", b"GIF89a"):
        return "gif", "image/gif"
    if data[:2] == b"BM":
        return "bmp", "image/bmp"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp", "image/webp"
    log.warning("Unknown image signature (first bytes: %s); uploading as octet-stream",
                data[:8].hex())
    return "bin", "application/octet-stream"


# --------------------------------------------------------------------------- #
# Connections
# --------------------------------------------------------------------------- #
def connect_source():
    if pyodbc is None:
        raise RuntimeError("pyodbc is not installed. See requirements.txt.")
    drivers = [d for d in pyodbc.drivers() if "SQL Server" in d]
    if not drivers:
        raise RuntimeError("No 'SQL Server' ODBC driver found on this machine.")
    driver = drivers[-1]
    if SOURCE["trusted"].lower() in {"yes", "true", "1"}:
        conn_str = (
            f"DRIVER={{{driver}}};SERVER={SOURCE['server']};"
            f"DATABASE={SOURCE['database']};Trusted_Connection=yes;"
        )
    else:
        conn_str = (
            f"DRIVER={{{driver}}};SERVER={SOURCE['server']};"
            f"DATABASE={SOURCE['database']};UID={SOURCE['user']};PWD={SOURCE['password']};"
        )
    log.info("Connecting to MSSQL via driver '%s'", driver)
    conn = pyodbc.connect(conn_str)
    conn.setdecoding(pyodbc.SQL_CHAR, encoding="cp1252")
    return conn


def connect_target():
    if psycopg2 is None:
        raise RuntimeError("psycopg2 is not installed. See requirements.txt.")
    log.info("Connecting to PostgreSQL %s:%s/%s", TARGET["host"], TARGET["port"], TARGET["dbname"])
    return psycopg2.connect(**TARGET)


def build_s3_client():
    if boto3 is None:
        raise RuntimeError("boto3 is not installed. See requirements.txt.")
    log.info("Connecting to SeaweedFS S3 gateway %s (bucket '%s')", S3["endpoint"], S3["bucket"])
    client = boto3.client(
        "s3",
        endpoint_url=S3["endpoint"],
        region_name=S3["region"],
        aws_access_key_id=S3["access_key"],
        aws_secret_access_key=S3["secret_key"],
        config=BotoConfig(s3={"addressing_style": "path" if S3["path_style"] else "auto"}),
    )
    return client


def ensure_bucket(client) -> None:
    """Verify the bucket exists, creating it if missing (mirrors S3StorageService.init)."""
    try:
        client.head_bucket(Bucket=S3["bucket"])
        log.debug("S3 bucket '%s' present", S3["bucket"])
    except ClientError:
        log.info("S3 bucket '%s' not found — creating", S3["bucket"])
        client.create_bucket(Bucket=S3["bucket"])


# --------------------------------------------------------------------------- #
# Backfill
# --------------------------------------------------------------------------- #
@dataclass
class Stats:
    candidates: int = 0             # migrated profiles missing a photo
    source_pictures_seen: int = 0   # source rows with a picture that match a candidate
    uploaded: int = 0
    updated: int = 0
    bytes_uploaded: int = 0
    upload_errors: int = 0
    no_match: int = 0               # source pictures with no matching candidate profile


def load_candidates(pg_cur) -> dict[str, str]:
    """profile_id (papin) -> profile UUID, for migrated rows that still need a photo."""
    where_created = "AND created_by = %s" if CREATED_BY else ""
    params = (CREATED_BY,) if CREATED_BY else ()
    pg_cur.execute(
        f"""
        SELECT profile_id, id FROM public.seafarer_profiles
        WHERE photo_url IS NULL AND profile_id IS NOT NULL {where_created}
        """,
        params,
    )
    return {row[0]: str(row[1]) for row in pg_cur.fetchall()}


def stream_source_pictures(src_cur, limit: int | None):
    """Yield (cn, papin, picture_bytes) for source rows that have a picture, ordered by cn.

    Used only on the --execute path: it transfers the (large) BLOB payload.
    """
    top = f"TOP {int(limit)} " if limit else ""
    src_cur.execute(
        f"SELECT {top}cn, papin, picture FROM dbo.m_patient "
        f"WHERE picture IS NOT NULL ORDER BY cn"
    )
    while True:
        rows = src_cur.fetchmany(FETCH_BATCH)
        if not rows:
            break
        for cn, papin, picture in rows:
            yield cn, (papin.strip() if papin else None), picture


def stream_source_picture_meta(src_cur, limit: int | None):
    """Yield (papin, byte_len) for source rows with a picture — no BLOB transfer.

    Used on the dry-run path so we can size the workload without moving ~800 MB.
    """
    top = f"TOP {int(limit)} " if limit else ""
    src_cur.execute(
        f"SELECT {top}papin, DATALENGTH(picture) AS len FROM dbo.m_patient "
        f"WHERE picture IS NOT NULL ORDER BY cn"
    )
    while True:
        rows = src_cur.fetchmany(500)
        if not rows:
            break
        for papin, length in rows:
            yield (papin.strip() if papin else None), int(length or 0)


def upload_photo(client, papin: str, data: bytes) -> str:
    ext, content_type = detect_image(data)
    key = f"{uuid.uuid4()}_{papin}.{ext}"
    client.put_object(
        Bucket=S3["bucket"], Key=key, Body=data, ContentType=content_type
    )
    return key


def run(args) -> int:
    stats = Stats()
    src_conn = connect_source()
    tgt_conn = connect_target()
    s3 = build_s3_client() if args.execute else None
    try:
        if s3 is not None:
            ensure_bucket(s3)

        tgt_cur = tgt_conn.cursor()
        candidates = load_candidates(tgt_cur)
        stats.candidates = len(candidates)
        log.info("Candidate profiles missing a photo: %d", stats.candidates)

        src_cur = src_conn.cursor()

        # Dry run: size the workload from metadata only (no BLOB transfer).
        if not args.execute:
            for papin, length in stream_source_picture_meta(src_cur, args.limit):
                if not papin or papin not in candidates:
                    if papin:
                        stats.no_match += 1
                    continue
                if length <= 0:
                    continue
                stats.source_pictures_seen += 1
                stats.bytes_uploaded += length
            _print_report(stats, args)
            log.info("DRY RUN — no photos uploaded, no rows updated.")
            return 0

        # Execute: stream BLOBs, upload each, update photo_url.
        pending_commit = 0
        for cn, papin, picture in stream_source_pictures(src_cur, args.limit):
            if not papin or papin not in candidates:
                if papin:
                    stats.no_match += 1
                continue
            data = bytes(picture) if picture is not None else b""
            if not data:
                continue
            stats.source_pictures_seen += 1

            profile_uuid = candidates[papin]
            try:
                key = upload_photo(s3, papin, data)
            except Exception:  # noqa: BLE001 - log and continue, don't abort the whole run
                stats.upload_errors += 1
                log.exception("UPLOAD failed papin=%s cn=%s — skipping", papin, cn)
                continue

            stats.uploaded += 1
            stats.bytes_uploaded += len(data)
            tgt_cur.execute(
                "UPDATE public.seafarer_profiles SET photo_url = %s WHERE id = %s",
                (f"/api/files/{key}", profile_uuid),
            )
            stats.updated += 1
            pending_commit += 1
            if pending_commit >= COMMIT_EVERY:
                tgt_conn.commit()
                log.info("committed %d photo updates (last cn=%s)", stats.updated, cn)
                pending_commit = 0

        if pending_commit:
            tgt_conn.commit()

        _print_report(stats, args)
        return 0
    except Exception:
        tgt_conn.rollback()
        log.exception("Photo backfill failed; last uncommitted batch rolled back.")
        return 1
    finally:
        src_conn.close()
        tgt_conn.close()


def _print_report(stats: Stats, args) -> None:
    mode = "EXECUTE" if args.execute else "DRY-RUN"
    mb = stats.bytes_uploaded / (1024 * 1024)
    lines = [
        "",
        "=" * 60,
        f" PHOTO BACKFILL REPORT  [{mode}]",
        "=" * 60,
        f" Candidate profiles missing a photo:   {stats.candidates}",
        f" Source pictures matched to candidates: {stats.source_pictures_seen}",
        f" Source pictures with no profile match: {stats.no_match}",
        f" Photos uploaded to SeaweedFS:          {stats.uploaded}",
        f" photo_url values updated:              {stats.updated}",
        f" Upload errors (skipped):               {stats.upload_errors}",
        f" Data volume {'to upload' if not args.execute else 'uploaded'}:"
        f"{'':<15}{mb:.1f} MB",
        "=" * 60,
    ]
    report = "\n".join(lines)
    print(report)
    log.info(report)


def build_arg_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Backfill patient photos into SeaweedFS")
    p.add_argument("--execute", action="store_true", help="upload + update (default is dry-run)")
    p.add_argument("--limit", type=int, default=None, help="only process first N source pictures")
    p.add_argument("--log-file", default="photo-migration.log", help="detailed log output path")
    return p


def main() -> int:
    args = build_arg_parser().parse_args()
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)-7s %(message)s",
        handlers=[
            logging.FileHandler(args.log_file, mode="w", encoding="utf-8"),
            logging.StreamHandler(sys.stdout),
        ],
    )
    return run(args)


if __name__ == "__main__":
    raise SystemExit(main())
