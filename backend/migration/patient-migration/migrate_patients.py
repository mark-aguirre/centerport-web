#!/usr/bin/env python3
"""
Patient data migration: MSSQL dbo.m_patient  ->  PostgreSQL public.seafarer_profiles

Schema-aware, non-destructive by default. See MAPPING.md for the full field
mapping, conversion rules, and validation rules.

Usage
-----
  # 1. Dry run (default): reads source, applies mapping, reports counts. NO writes.
  python migrate_patients.py

  # 2. Execute the migration (inserts into PostgreSQL inside a transaction):
  python migrate_patients.py --execute

  # Optional flags:
  #   --include-test-rows   also migrate rows flagged test_data (default: skip)
  #   --overwrite           update existing target rows on profile_id collision
  #   --limit N             only process the first N source rows (debugging)
  #   --log-file PATH       where to write the detailed log (default: migration.log)

Connection settings can be overridden with environment variables
(MSSQL_SERVER, MSSQL_DATABASE, MSSQL_TRUSTED, MSSQL_USER, MSSQL_PASSWORD,
 PG_HOST, PG_PORT, PG_DB, PG_USER, PG_PASSWORD).
"""
from __future__ import annotations

import argparse
import logging
import os
import sys
from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Any, Optional

try:
    import pyodbc
except ImportError:  # pragma: no cover
    pyodbc = None

try:
    import psycopg2
    import psycopg2.extras
except ImportError:  # pragma: no cover
    psycopg2 = None


# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #
SOURCE = {
    "server": os.getenv("MSSQL_SERVER", r"DESKTOP-KIIKPT8\SQLEXPRESS"),
    "database": os.getenv("MSSQL_DATABASE", "Centerport_Medical"),
    "trusted": os.getenv("MSSQL_TRUSTED", "yes"),   # Windows auth by default
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

PROFILE_ID_MAXLEN = 12
CREATED_BY = "migration"
BATCH_SIZE = 500

# Source columns we read (order matters for the SELECT).
SOURCE_COLUMNS = [
    "papin", "lastname", "firstname", "middlename", "address_1", "address_2",
    "city", "district", "contact_1", "contact_2", "position", "marital_status",
    "gender", "birthdate", "place_of_birth", "type_of_job", "employer",
    "passport_no", "seamansbook_no", "registration_date", "remarks",
    "nationality", "religion", "test_data", "father_name", "father_occupation",
    "mother_name", "no_of_brothers", "no_of_sisters", "birth_order",
    "spouse_name", "spouse_occupation", "no_of_children", "elementary",
    "highschool", "college", "course", "highest_level_attended",
    "mother_occupation", "prev_work_start", "prev_work_end", "prev_company",
    "prev_position", "prev_leave_reason", "prev_years", "date_last_updated",
    "sirb", "designation", "country_destination", "cn", "country",
]

# Target insert columns (excludes the DB-generated id).
TARGET_COLUMNS = [
    "profile_id", "created_date", "updated_date", "created_by", "photo_url",
    "last_name", "first_name", "middle_name", "address", "city", "contact_no",
    "birthdate", "age", "gender", "marital_status", "place_of_birth",
    "religion", "nationality", "country", "employer", "designation",
    "passport_no", "seamans_book_no", "position", "country_of_destination",
    "father_name", "father_occupation", "mother_name", "mother_occupation",
    "no_of_brothers", "no_of_sisters", "birth_order", "spouse_name",
    "spouse_occupation", "no_of_children", "elementary", "high_school",
    "college_university", "course", "highest_level_attended",
    "prev_date_started", "prev_date_end", "prev_length_of_stay", "prev_company",
    "prev_position", "prev_reason_of_leaving", "remark",
]

log = logging.getLogger("migrate_patients")


# --------------------------------------------------------------------------- #
# Transformation helpers
# --------------------------------------------------------------------------- #
def clean(value: Any) -> Optional[str]:
    """Trim whitespace; turn empty / placeholder values into None."""
    if value is None:
        return None
    s = str(value).strip()
    if s == "" or s in {".", "-", "N/A", "n/a", "NA"}:
        return None
    return s


def clean_upper(value: Any) -> Optional[str]:
    s = clean(value)
    return s.upper() if s else None


TITLE_GENDER = {"MALE": "Male", "FEMALE": "Female", "M": "Male", "F": "Female"}
MARITAL = {
    "SINGLE": "Single", "MARRIED": "Married", "WIDOW": "Widowed",
    "WIDOWED": "Widowed", "WD": "Widowed", "SEPARATED": "Separated",
    "DIVORCED": "Divorced", "S": "Single", "M": "Married",
}


def norm_gender(value: Any) -> Optional[str]:
    s = clean(value)
    if not s:
        return None
    return TITLE_GENDER.get(s.upper(), s.title())


def norm_marital(value: Any) -> Optional[str]:
    s = clean(value)
    if not s:
        return None
    return MARITAL.get(s.upper(), s.title())


def join_address(a1: Any, a2: Any) -> Optional[str]:
    parts = [p for p in (clean(a1), clean(a2)) if p]
    return ", ".join(parts) if parts else None


_DATETIME_FORMATS = [
    "%Y-%m-%d %H:%M:%S.%f", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d %I:%M:%S %p",
    "%Y-%m-%d %I:%M %p", "%Y-%m-%d %H:%M", "%Y-%m-%d",
    "%m/%d/%Y %H:%M:%S", "%m/%d/%Y %I:%M:%S %p",
    "%m/%d/%Y %I:%M %p", "%m/%d/%Y %H:%M", "%m/%d/%Y",
    "%m/%d/%y %I:%M %p", "%m/%d/%y",
]


def parse_datetime(value: Any) -> Optional[datetime]:
    s = clean(value)
    if not s:
        return None
    for fmt in _DATETIME_FORMATS:
        try:
            return datetime.strptime(s, fmt)
        except ValueError:
            continue
    return None


_DATE_FORMATS = ["%m/%d/%Y", "%m/%d/%y", "%Y-%m-%d", "%d/%m/%Y"]


def parse_birthdate(value: Any) -> tuple[Optional[str], Optional[date]]:
    """Return (normalized_text, date_or_None). Keeps raw text if unparseable."""
    s = clean(value)
    if not s:
        return None, None
    for fmt in _DATE_FORMATS:
        try:
            d = datetime.strptime(s, fmt).date()
            if 1900 <= d.year <= date.today().year:
                return d.isoformat(), d
        except ValueError:
            continue
    return s, None  # keep original text, no computable age


def compute_age(birth: Optional[date]) -> Optional[str]:
    if not birth:
        return None
    today = date.today()
    years = today.year - birth.year - (
        (today.month, today.day) < (birth.month, birth.day)
    )
    return str(years) if 0 <= years <= 120 else None


# --------------------------------------------------------------------------- #
# Row mapping
# --------------------------------------------------------------------------- #
@dataclass
class Stats:
    total_source: int = 0
    target_before: int = 0
    duplicates_in_source: int = 0
    collisions_skipped: int = 0
    collisions_overwritten: int = 0
    junk_skipped: int = 0
    truncated_ids: int = 0
    pictures_dropped: int = 0
    reg_date_defaulted: int = 0
    to_insert: int = 0
    to_update: int = 0
    validation_warnings: list[str] = field(default_factory=list)


def map_row(src: dict[str, Any], stats: Stats) -> Optional[dict[str, Any]]:
    """Apply the field mapping. Returns a target dict or None to skip the row."""
    papin = clean(src.get("papin"))
    last = clean(src.get("lastname"))
    first = clean(src.get("firstname"))

    # Junk guard: no id and no name -> unusable.
    if not papin and not last and not first:
        stats.junk_skipped += 1
        log.info("SKIP junk row cn=%s (no papin/name)", src.get("cn"))
        return None

    # profile_id validation. Over-length papins are NOT truncated, because
    # truncation can silently collide with a different, valid papin and merge
    # two distinct people. Instead we keep the row but null its profile_id and
    # preserve the original value in the log + remark for manual reconciliation.
    profile_id = papin
    overlong_papin = None
    if profile_id and len(profile_id) > PROFILE_ID_MAXLEN:
        overlong_papin = profile_id
        log.warning(
            "OVERLONG profile_id cn=%s '%s' (%d chars) -> stored as NULL, kept in remark",
            src.get("cn"), profile_id, len(profile_id),
        )
        stats.truncated_ids += 1
        profile_id = None

    # Dates.
    created_dt = parse_datetime(src.get("registration_date"))
    if created_dt is None:
        created_dt = datetime.now()
        stats.reg_date_defaulted += 1
    updated_dt = parse_datetime(src.get("date_last_updated")) or created_dt

    # Birthdate + age.
    bd_text, bd_date = parse_birthdate(src.get("birthdate"))
    age = compute_age(bd_date)

    # Picture blob cannot become a text URL.
    if src.get("picture_present"):
        stats.pictures_dropped += 1

    # remark (+ sirb + any over-length papin appended so nothing is lost).
    remark = clean(src.get("remarks"))
    sirb = clean(src.get("sirb"))
    if sirb:
        remark = f"{remark}\nSIRB: {sirb}" if remark else f"SIRB: {sirb}"
    if overlong_papin:
        note = f"LEGACY PAPIN: {overlong_papin}"
        remark = f"{remark}\n{note}" if remark else note

    return {
        "profile_id": profile_id,
        "created_date": created_dt,
        "updated_date": updated_dt,
        "created_by": CREATED_BY,
        "photo_url": None,
        "last_name": last,
        "first_name": first,
        "middle_name": clean(src.get("middlename")),
        "address": join_address(src.get("address_1"), src.get("address_2")),
        "city": clean(src.get("city")),
        "contact_no": clean(src.get("contact_1")),
        "birthdate": bd_text,
        "age": age,
        "gender": norm_gender(src.get("gender")),
        "marital_status": norm_marital(src.get("marital_status")),
        "place_of_birth": clean(src.get("place_of_birth")),
        "religion": clean(src.get("religion")),
        "nationality": clean(src.get("nationality")),
        "country": clean(src.get("country")),
        "employer": clean(src.get("employer")),
        "designation": clean(src.get("designation")),
        "passport_no": clean_upper(src.get("passport_no")),
        "seamans_book_no": clean_upper(src.get("seamansbook_no")),
        "position": clean(src.get("position")),
        "country_of_destination": clean(src.get("country_destination")),
        "father_name": clean(src.get("father_name")),
        "father_occupation": clean(src.get("father_occupation")),
        "mother_name": clean(src.get("mother_name")),
        "mother_occupation": clean(src.get("mother_occupation")),
        "no_of_brothers": clean(src.get("no_of_brothers")),
        "no_of_sisters": clean(src.get("no_of_sisters")),
        "birth_order": clean(src.get("birth_order")),
        "spouse_name": clean(src.get("spouse_name")),
        "spouse_occupation": clean(src.get("spouse_occupation")),
        "no_of_children": clean(src.get("no_of_children")),
        "elementary": clean(src.get("elementary")),
        "high_school": clean(src.get("highschool")),
        "college_university": clean(src.get("college")),
        "course": clean(src.get("course")),
        "highest_level_attended": clean(src.get("highest_level_attended")),
        "prev_date_started": clean(src.get("prev_work_start")),
        "prev_date_end": clean(src.get("prev_work_end")),
        "prev_length_of_stay": clean(src.get("prev_years")),
        "prev_company": clean(src.get("prev_company")),
        "prev_position": clean(src.get("prev_position")),
        "prev_reason_of_leaving": clean(src.get("prev_leave_reason")),
        "remark": remark,
    }


# --------------------------------------------------------------------------- #
# Database access
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
            f"DATABASE={SOURCE['database']};UID={SOURCE['user']};"
            f"PWD={SOURCE['password']};"
        )
    log.info("Connecting to MSSQL via driver '%s'", driver)
    conn = pyodbc.connect(conn_str)
    # The source DB collation is SQL_Latin1_General_CP1_CI_AS (Windows-1252),
    # so legacy VARCHAR/CHAR data is stored as cp1252, not UTF-8. Decode it as
    # cp1252 so accented names (e.g. PEÑA -> byte 0xD1) survive intact; values
    # are then re-encoded to UTF-8 when written to PostgreSQL. This is
    # deterministic across client machines (unlike the driver's locale default).
    conn.setdecoding(pyodbc.SQL_CHAR, encoding="cp1252")
    return conn


def connect_target():
    if psycopg2 is None:
        raise RuntimeError("psycopg2 is not installed. See requirements.txt.")
    log.info("Connecting to PostgreSQL %s:%s/%s", TARGET["host"], TARGET["port"], TARGET["dbname"])
    return psycopg2.connect(**TARGET)


def fetch_source_rows(cur, include_test: bool, limit: Optional[int]) -> list[dict]:
    # Read picture presence without pulling the blob payload.
    select_cols = ", ".join(
        c for c in SOURCE_COLUMNS
    )
    where = "" if include_test else "WHERE ISNULL(test_data, '') NOT IN ('1', 'Y', 'YES', 'TRUE')"
    top = f"TOP {int(limit)} " if limit else ""
    sql = (
        f"SELECT {top}{select_cols}, "
        f"CASE WHEN picture IS NULL THEN 0 ELSE 1 END AS picture_present "
        f"FROM dbo.m_patient {where} ORDER BY cn"
    )
    cur.execute(sql)
    columns = [d[0] for d in cur.description]
    return [dict(zip(columns, row)) for row in cur.fetchall()]


def existing_profile_ids(pg_cur) -> set[str]:
    pg_cur.execute("SELECT profile_id FROM public.seafarer_profiles WHERE profile_id IS NOT NULL")
    return {r[0] for r in pg_cur.fetchall()}


# --------------------------------------------------------------------------- #
# Main migration flow
# --------------------------------------------------------------------------- #
def run(args) -> int:
    stats = Stats()

    src_conn = connect_source()
    tgt_conn = connect_target()
    try:
        src_cur = src_conn.cursor()
        tgt_cur = tgt_conn.cursor()

        raw_rows = fetch_source_rows(src_cur, args.include_test_rows, args.limit)
        stats.total_source = len(raw_rows)

        tgt_cur.execute("SELECT COUNT(*) FROM public.seafarer_profiles")
        stats.target_before = tgt_cur.fetchone()[0]
        existing = existing_profile_ids(tgt_cur)

        # Dedup within source: keep the last occurrence (rows are ordered by cn asc).
        by_papin: dict[str, dict] = {}
        no_papin_rows: list[dict] = []
        for row in raw_rows:
            mapped = map_row(row, stats)
            if mapped is None:
                continue
            pid = mapped["profile_id"]
            if pid is None:
                no_papin_rows.append(mapped)
                continue
            if pid in by_papin:
                stats.duplicates_in_source += 1
                log.warning("DUP source papin '%s' (cn=%s) overrides earlier row", pid, row.get("cn"))
            by_papin[pid] = mapped

        inserts: list[dict] = []
        updates: list[dict] = []
        for pid, mapped in by_papin.items():
            if pid in existing:
                if args.overwrite:
                    updates.append(mapped)
                    stats.collisions_overwritten += 1
                else:
                    stats.collisions_skipped += 1
                    log.info("SKIP collision profile_id '%s' already in target", pid)
            else:
                inserts.append(mapped)
        # Rows without a papin still get inserted (no unique key to collide on).
        inserts.extend(no_papin_rows)

        stats.to_insert = len(inserts)
        stats.to_update = len(updates)

        if args.execute:
            _do_writes(tgt_cur, inserts, updates)
            tgt_conn.commit()
            log.info("COMMITTED %d inserts, %d updates", len(inserts), len(updates))
        else:
            log.info("DRY RUN — no writes performed.")

        _print_report(stats, args)
        return 0
    except Exception:
        tgt_conn.rollback()
        log.exception("Migration failed; PostgreSQL transaction rolled back.")
        return 1
    finally:
        src_conn.close()
        tgt_conn.close()


def _do_writes(cur, inserts: list[dict], updates: list[dict]) -> None:
    col_list = ", ".join(TARGET_COLUMNS)
    placeholders = ", ".join(["%s"] * len(TARGET_COLUMNS))
    insert_sql = (
        f"INSERT INTO public.seafarer_profiles (id, {col_list}) "
        f"VALUES (gen_random_uuid(), {placeholders})"
    )
    batch: list[tuple] = []
    for row in inserts:
        batch.append(tuple(row[c] for c in TARGET_COLUMNS))
        if len(batch) >= BATCH_SIZE:
            psycopg2.extras.execute_batch(cur, insert_sql, batch)
            batch.clear()
    if batch:
        psycopg2.extras.execute_batch(cur, insert_sql, batch)

    if updates:
        set_clause = ", ".join(f"{c} = %s" for c in TARGET_COLUMNS if c != "profile_id")
        update_sql = (
            f"UPDATE public.seafarer_profiles SET {set_clause} WHERE profile_id = %s"
        )
        upd_cols = [c for c in TARGET_COLUMNS if c != "profile_id"]
        upd_batch = [
            tuple([row[c] for c in upd_cols] + [row["profile_id"]]) for row in updates
        ]
        psycopg2.extras.execute_batch(cur, update_sql, upd_batch)


def _print_report(stats: Stats, args) -> None:
    mode = "EXECUTE" if args.execute else "DRY-RUN"
    lines = [
        "",
        "=" * 60,
        f" MIGRATION REPORT  [{mode}]",
        "=" * 60,
        f" Total source records (after test filter): {stats.total_source}",
        f" Target records before migration:          {stats.target_before}",
        f" Duplicate papins collapsed in source:     {stats.duplicates_in_source}",
        f" Collisions with existing target rows:      {stats.collisions_skipped} skipped"
        + (f", {stats.collisions_overwritten} overwritten" if args.overwrite else ""),
        f" Junk rows skipped (no id/name):           {stats.junk_skipped}",
        f" Over-length profile_ids nulled (kept in remark): {stats.truncated_ids}",
        f" Picture blobs dropped (no text target):   {stats.pictures_dropped}",
        f" registration_date defaulted to NOW():     {stats.reg_date_defaulted}",
        "-" * 60,
        f" Records to INSERT: {stats.to_insert}",
        f" Records to UPDATE: {stats.to_update}",
        f" Projected target total after run:          "
        f"{stats.target_before + stats.to_insert}",
        "=" * 60,
    ]
    report = "\n".join(lines)
    print(report)
    log.info(report)


def build_arg_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Migrate m_patient -> seafarer_profiles")
    p.add_argument("--execute", action="store_true", help="perform inserts (default is dry-run)")
    p.add_argument("--include-test-rows", action="store_true", help="include rows flagged test_data")
    p.add_argument("--overwrite", action="store_true", help="update existing target rows on collision")
    p.add_argument("--limit", type=int, default=None, help="only process first N source rows")
    p.add_argument("--log-file", default="migration.log", help="detailed log output path")
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
