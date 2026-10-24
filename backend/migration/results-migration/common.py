"""Shared plumbing for the legacy result-CSV migrations.

The exported CSVs in ``backend/migration/exported`` are denormalized joins of a
legacy result-master row, the legacy patient master, and one module-specific
detail table. Every target table already exists in the CenterPort schema, so
this package performs **data-only** INSERTs. No DDL is ever issued.

Each module contributes a mapping module under ``mappings/`` that declares
where its CSV lives, which table it targets, and how to turn one source row
into one target row. This module owns everything that is identical across
modules: connecting, indexing papins, allocating business IDs, normalizing
legacy values, validating against the live schema, and the dry-run report.
"""

from __future__ import annotations

import csv
import json
import logging
import os
import re
import sys
import uuid
from collections import Counter
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Callable, Iterable, Mapping, Sequence

import psycopg2
from psycopg2.extras import execute_batch

# Legacy CSVs embed large free-text findings; the default 128 KB field cap is
# not enough and raises _csv.Error on a handful of radiology rows.
csv.field_size_limit(10_000_000)

LOG = logging.getLogger("results-migration")

MIGRATION_ACTOR = "migration"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXPORT_DIR = os.path.normpath(os.path.join(BASE_DIR, "..", "exported"))


# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------

def connect():
    """Opens a connection using PG_* environment variables.

    Defaults match the CenterPort development database. The password has no
    default on purpose, so a misconfigured run fails loudly instead of
    silently targeting the wrong instance.
    """
    return psycopg2.connect(
        host=os.environ.get("PG_HOST", "192.168.100.46"),
        port=int(os.environ.get("PG_PORT", "5432")),
        dbname=os.environ.get("PG_DB", "centerport"),
        user=os.environ.get("PG_USER", "postgres"),
        password=os.environ["PG_PASSWORD"],
    )


def load_papin_index(conn) -> dict[str, str]:
    """Maps legacy PAPIN -> seafarer_profiles.id.

    ``profile_id`` is the column the earlier patient migration populated with
    the legacy papin, so it is the only join key available between the result
    CSVs and the profiles already in Postgres.
    """
    with conn.cursor() as cur:
        cur.execute(
            "select profile_id, id from public.seafarer_profiles "
            "where profile_id is not null"
        )
        return {row[0].strip(): str(row[1]) for row in cur.fetchall()}


def load_column_types(conn, table: str) -> dict[str, tuple[str, int | None]]:
    """Returns {column: (data_type, character_maximum_length)} for a table.

    Used to reject a row before it reaches Postgres when a legacy value is
    wider than the column, which is the most common failure mode in this data.
    """
    with conn.cursor() as cur:
        cur.execute(
            """
            select column_name, data_type, character_maximum_length
              from information_schema.columns
             where table_schema = 'public' and table_name = %s
            """,
            (table,),
        )
        return {name: (dtype, maxlen) for name, dtype, maxlen in cur.fetchall()}


def sequence_last_value(conn, sequence: str) -> int:
    """Reads a sequence's current position without consuming a value.

    ``nextval`` would burn IDs on every dry run, and ``currval`` is only valid
    inside a session that already called ``nextval``, so this reads
    ``pg_sequences`` instead.
    """
    with conn.cursor() as cur:
        cur.execute(
            "select last_value from pg_sequences "
            "where schemaname = 'public' and sequencename = %s",
            (sequence,),
        )
        row = cur.fetchone()
    if row is None:
        raise RuntimeError(f"sequence {sequence!r} does not exist")
    # pg_sequences.last_value is NULL until the sequence has been used, and
    # otherwise holds the last value it handed out.
    return 0 if row[0] is None else int(row[0])


def resync_sequence(conn, sequence: str, value: int) -> None:
    """Points a sequence past the IDs this migration consumed.

    Mirrors ``V35__resync_cmsi_seq.sql`` so the application's own
    BusinessIdGenerator keeps producing unique IDs after the load.
    """
    with conn.cursor() as cur:
        cur.execute("select setval(%s, %s, true)", (sequence, value))


# ---------------------------------------------------------------------------
# Business IDs
# ---------------------------------------------------------------------------

def format_business_id(prefix: str, n: int) -> str:
    """Reproduces BusinessIdGenerator.generateId: PREFIX + 8-digit zero pad."""
    return f"{prefix.upper()}{n:08d}"


# ---------------------------------------------------------------------------
# Value normalization
# ---------------------------------------------------------------------------

# Legacy placeholders that all mean "no value recorded".
_BLANKS = {"", "-", "--", "n/a", "na", "[n/a]", "[other]", "none given", "null", "."}

_ZERO_DATES = {"00/00/0000", "0000-00-00", "1900-01-01", "1900-01-01 00:00:00"}


def clean(value: Any) -> str | None:
    """Trims a legacy cell and collapses placeholder junk to None."""
    if value is None:
        return None
    text = str(value).strip()
    if text.lower() in _BLANKS:
        return None
    return text or None


def text(value: Any, limit: int | None = None) -> str | None:
    """Cleans a free-text cell, optionally truncating to a column width."""
    out = clean(value)
    if out is not None and limit is not None and len(out) > limit:
        out = out[:limit]
    return out


def yes_no(value: Any) -> str | None:
    """Normalizes legacy truthy/falsy spellings to the app's "yes"/"no".

    Returns None for unrecognized or placeholder input so the field stays
    unset rather than guessing an answer the examiner never gave.
    """
    out = clean(value)
    if out is None:
        return None
    upper = out.upper()
    if upper in {"Y", "YES", "1", "TRUE", "T", "X"}:
        return "yes"
    if upper in {"N", "NO", "0", "FALSE", "F"}:
        return "no"
    return None


def boolean(value: Any) -> bool | None:
    """Normalizes legacy 0/1/Y/N flags to a real BOOLEAN."""
    answer = yes_no(value)
    if answer is None:
        return None
    return answer == "yes"


def upper(value: Any) -> str | None:
    out = clean(value)
    return out.upper() if out is not None else None


def title_case_name(value: Any) -> str | None:
    """Collapses runs of whitespace in a practitioner name.

    Legacy names carry double spaces ("MARY JANE MENDOZA.  M.D.,FPCR.") which
    make otherwise-identical signatories look like different people.
    """
    out = clean(value)
    return re.sub(r"\s+", " ", out) if out is not None else None


def number_like(value: Any) -> str | None:
    """Keeps a numeric measurement as text, dropping thousands separators.

    These columns are VARCHAR in the schema, so the value stays a string;
    this only removes the commas legacy entry used ("4,600" -> "4600") and
    rejects cells that are pure punctuation noise (a stray backtick or comma
    appears in a handful of chemistry rows).
    """
    out = clean(value)
    if out is None:
        return None
    out = out.replace(",", "")
    if not re.search(r"\d", out):
        return None
    return out


def iso_date(value: Any, day_first: bool = False) -> str | None:
    """Converts any legacy date spelling to the app's ISO ``YYYY-MM-DD``.

    Every date column in these modules is a VARCHAR holding an ISO string,
    because the forms render them as native ``type="date"`` inputs. The export
    mixes at least five spellings, plus ``00/00/0000`` and ``1900-01-01``
    zero-date placeholders which become None.

    ``day_first`` disambiguates the ambiguous ``NN/NN/YYYY`` case; the MLC
    export writes day-first while the result-master columns write month-first.
    An unambiguous first component (> 12) always wins over the flag.
    """
    out = clean(value)
    if out is None or out in _ZERO_DATES:
        return None

    # Legacy sometimes pads the separators: "18 / 11 / 2025".
    out = re.sub(r"\s*([/-])\s*", r"\1", out)

    # Drop any time component: "2021-08-24 00:00:00", "May 13 2026  7:35AM".
    iso_match = re.match(r"^(\d{4})-(\d{2})-(\d{2})(?:[ T].*)?$", out)
    if iso_match:
        y, m, d = (int(g) for g in iso_match.groups())
        return _safe_date(y, m, d)

    slash = re.match(r"^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:[ T].*)?$", out)
    if slash:
        first, second, year = (int(g) for g in slash.groups())
        if first > 12:
            day, month = first, second
        elif second > 12:
            month, day = first, second
        elif day_first:
            day, month = first, second
        else:
            month, day = first, second
        return _safe_date(year, month, day)

    for fmt in ("%b %d %Y %I:%M%p", "%b %d %Y", "%B %d, %Y", "%b. %d, %Y", "%B %Y", "%b %Y"):
        try:
            return datetime.strptime(re.sub(r"\s+", " ", out), fmt).date().isoformat()
        except ValueError:
            continue
    return None


def _safe_date(year: int, month: int, day: int) -> str | None:
    try:
        return datetime(year, month, day).date().isoformat()
    except ValueError:
        return None


def iso_timestamp(value: Any) -> datetime | None:
    """Parses a legacy audit timestamp for created_date / updated_date."""
    out = clean(value)
    if out is None or out in _ZERO_DATES:
        return None
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M:%S.%f", "%Y-%m-%d"):
        try:
            return datetime.strptime(out, fmt)
        except ValueError:
            continue
    day = iso_date(out)
    return datetime.fromisoformat(day) if day else None


def split_iso_date(value: Any, day_first: bool = False) -> tuple[str | None, str | None, str | None]:
    """Decomposes a date into Panama's (day, "Mon", year) column triple."""
    day = iso_date(value, day_first=day_first)
    if day is None:
        return None, None, None
    parsed = datetime.fromisoformat(day)
    return str(parsed.day), parsed.strftime("%b"), str(parsed.year)


def age_from_birthdate(birthdate: Any, as_of: Any = None) -> str | None:
    """Computes age at examination, which legacy stored only as a birthdate."""
    born = iso_date(birthdate)
    if born is None:
        return None
    reference = iso_date(as_of) if as_of is not None else None
    ref = datetime.fromisoformat(reference) if reference else datetime.now()
    b = datetime.fromisoformat(born)
    years = ref.year - b.year - ((ref.month, ref.day) < (b.month, b.day))
    return str(years) if 0 <= years <= 120 else None


def mapped(
    value: Any,
    table: Mapping[str, str],
    *,
    unmapped: Counter | None = None,
    label: str = "",
    passthrough: bool = False,
) -> str | None:
    """Translates a legacy code to an app vocabulary value.

    Lookup is case-insensitive and whitespace-insensitive. Anything not in the
    table is recorded in ``unmapped`` for the dry-run report, then either
    dropped (the default, so the field renders as unset) or kept verbatim when
    ``passthrough`` is set (used for free-text columns such as blood type,
    where preserving the legacy string is better than losing it).
    """
    out = clean(value)
    if out is None:
        return None
    key = re.sub(r"\s+", " ", out).strip().lower()
    if key in table:
        return table[key]
    if unmapped is not None:
        unmapped[f"{label}={out}"] += 1
    return out if passthrough else None


def jsonb(value: Any) -> str | None:
    """Serializes a dict/list for a JSONB column.

    Always returns a JSON document rather than NULL for an empty container:
    the medical FindingsGrid dereferences ``findings_a[key]`` with no null
    guard, so a NULL JSONB would break the form on an inserted row.
    """
    if value is None:
        return None
    return json.dumps(value, ensure_ascii=False)


# Vocabulary tables shared by more than one module.

EXAM_RESULT = {
    "normal": "normal",
    "with_f": "with_findings",
    "with findings": "with_findings",
    "withf": "with_findings",
    "abnormal": "with_findings",
}

# Immunology spells this "Non Reactive"; HIV spells it "Nonreactive". The
# difference is deliberate in the frontend, so each module keeps its own table.
REACTIVE_SNAKE = {
    "nonreactive": "non_reactive",
    "non reactive": "non_reactive",
    "non-reactive": "non_reactive",
    "negative": "non_reactive",
    "reactive": "reactive",
    "positive": "reactive",
}

BLOOD_TYPES = {
    bt.lower(): bt
    for bt in ("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
}


def blood_type(value: Any, unmapped: Counter | None = None, label: str = "blood_type") -> str | None:
    """Normalizes a blood type, tolerating legacy spacing like ``"B -"``.

    A bare group with no Rh sign (legacy seabase stores plain ``"O"``) cannot
    be completed without inventing data, so it is passed through verbatim and
    reported; the select renders unset but the value is not lost.
    """
    out = clean(value)
    if out is None:
        return None
    compact = re.sub(r'[\s"\']', "", out).upper()
    # Legacy entry occasionally typed a zero for the letter O ("0+").
    compact = re.sub(r"^0(?=[+-]?$)", "O", compact)
    if compact.lower() in BLOOD_TYPES:
        return BLOOD_TYPES[compact.lower()]
    if unmapped is not None:
        unmapped[f"{label}={out}"] += 1
    return compact


# ---------------------------------------------------------------------------
# Module contract
# ---------------------------------------------------------------------------

@dataclass
class ModuleSpec:
    """Declares how one legacy CSV maps onto one existing target table."""

    name: str
    csv_file: str
    table: str
    business_id_column: str
    business_id_prefix: str
    sequence: str
    papin_columns: Sequence[str]
    build_row: Callable[[Mapping[str, str], "RowContext"], dict[str, Any]]
    #: Columns that must be cast to jsonb in the INSERT. These are written with
    #: a literal JSON document rather than NULL, because parts of the frontend
    #: dereference them without a null guard.
    jsonb_columns: Sequence[str] = ()
    #: Legacy column holding the record's creation timestamp, when the export
    #: carries one. Falls back to the run time.
    created_date_column: str | None = None
    #: Optional hook returning columns that are identical on every inserted
    #: row and have to be read from the database first. Laboratory uses it to
    #: copy the admin-maintained reference ranges onto each report, which is
    #: what the app itself stores when an examiner creates a report.
    load_constants: Callable[[Any], dict[str, Any]] | None = None
    notes: str = ""

    @property
    def csv_path(self) -> str:
        return os.path.join(EXPORT_DIR, self.csv_file)


@dataclass
class RowContext:
    """Per-row scratch space handed to a mapping's ``build_row``."""

    profile_id: str
    papin: str
    unmapped: Counter = field(default_factory=Counter)
    dropped: Counter = field(default_factory=Counter)

    def drop(self, label: str) -> None:
        """Records a legacy field deliberately not carried over."""
        self.dropped[label] += 1


# ---------------------------------------------------------------------------
# Loader engine
# ---------------------------------------------------------------------------

@dataclass
class LoadReport:
    module: str
    table: str
    source_rows: int = 0
    inserted: int = 0
    skipped_no_papin: int = 0
    skipped_unresolved: int = 0
    truncated: int = 0
    unresolved_papins: Counter = field(default_factory=Counter)
    oversize: Counter = field(default_factory=Counter)
    unmapped: Counter = field(default_factory=Counter)
    dropped: Counter = field(default_factory=Counter)
    first_business_id: str | None = None
    last_business_id: str | None = None
    sample: dict[str, Any] | None = None

    def render(self) -> str:
        lines = [
            "",
            "=" * 72,
            f"{self.module}  ->  public.{self.table}",
            "=" * 72,
            f"  source rows                 {self.source_rows}",
            f"  rows to insert              {self.inserted}",
            f"  skipped, papin blank        {self.skipped_no_papin}",
            f"  skipped, papin unresolved   {self.skipped_unresolved}",
            f"  values truncated to fit     {self.truncated}",
        ]
        if self.first_business_id:
            lines.append(
                f"  business ids                {self.first_business_id} .. {self.last_business_id}"
            )
        if self.unresolved_papins:
            lines.append(f"  unresolved papins ({len(self.unresolved_papins)} distinct):")
            for papin, n in self.unresolved_papins.most_common(10):
                lines.append(f"      {papin}  x{n}")
            if len(self.unresolved_papins) > 10:
                lines.append(f"      ... and {len(self.unresolved_papins) - 10} more")
        if self.oversize:
            lines.append("  truncated values:")
            for item, n in self.oversize.most_common(15):
                lines.append(f"      {item}  x{n}")
        if self.unmapped:
            lines.append("  legacy values with no app vocabulary match:")
            for item, n in self.unmapped.most_common(25):
                lines.append(f"      {item}  x{n}")
            if len(self.unmapped) > 25:
                lines.append(f"      ... and {len(self.unmapped) - 25} more distinct values")
        if self.dropped:
            lines.append("  legacy fields intentionally not migrated:")
            for item, n in sorted(self.dropped.items()):
                lines.append(f"      {item}  (populated in {n} rows)")
        return "\n".join(lines)


def read_csv(path: str) -> list[dict[str, str]]:
    with open(path, newline="", encoding="utf-8-sig", errors="replace") as fh:
        return list(csv.DictReader(fh))


def _papin_of(row: Mapping[str, str], columns: Sequence[str]) -> str | None:
    for column in columns:
        value = clean(row.get(column))
        if value:
            return value
    return None


def build_rows(
    spec: ModuleSpec,
    source: Iterable[Mapping[str, str]],
    papin_index: Mapping[str, str],
    column_types: Mapping[str, tuple[str, int | None]],
    start_sequence: int,
    constants: Mapping[str, Any] | None = None,
) -> tuple[list[dict[str, Any]], LoadReport]:
    """Turns source rows into insertable dicts, collecting a dry-run report.

    Rows are validated against the live column widths here rather than at
    INSERT time so a single bad legacy cell reports itself instead of
    aborting the whole transaction.
    """
    report = LoadReport(module=spec.name, table=spec.table)
    rows: list[dict[str, Any]] = []
    counter = start_sequence
    now = datetime.now()

    for source_row in source:
        report.source_rows += 1

        papin = _papin_of(source_row, spec.papin_columns)
        if papin is None:
            report.skipped_no_papin += 1
            continue
        profile_id = papin_index.get(papin)
        if profile_id is None:
            report.skipped_unresolved += 1
            report.unresolved_papins[papin] += 1
            continue

        ctx = RowContext(profile_id=profile_id, papin=papin)
        row = spec.build_row(source_row, ctx)
        if constants:
            # Row-level values win, so a mapping can override a constant.
            row = {**constants, **row}
        report.unmapped.update(ctx.unmapped)
        report.dropped.update(ctx.dropped)

        row["id"] = str(uuid.uuid4())
        row["seafarer_profile_id"] = profile_id

        created = None
        if spec.created_date_column:
            created = iso_timestamp(source_row.get(spec.created_date_column))
        row.setdefault("created_date", created or now)
        row.setdefault("updated_date", row["created_date"])

        unknown = [c for c in row if c not in column_types]
        if unknown:
            raise RuntimeError(
                f"{spec.name}: mapping produced columns absent from "
                f"public.{spec.table}: {', '.join(sorted(unknown))}"
            )

        # A single malformed legacy cell should not cost the whole record, so
        # an over-wide value is truncated and reported rather than dropping
        # the row. In this data the offenders are junk vitals (a 141-character
        # "weight"), not real content.
        for note in _trim_oversize(row, column_types):
            report.oversize[note] += 1
            report.truncated += 1

        counter += 1
        row[spec.business_id_column] = format_business_id(spec.business_id_prefix, counter)
        if report.first_business_id is None:
            report.first_business_id = row[spec.business_id_column]
            report.sample = dict(row)
        report.last_business_id = row[spec.business_id_column]
        rows.append(row)

    report.inserted = len(rows)
    return rows, report


def _trim_oversize(
    row: dict[str, Any], column_types: Mapping[str, tuple[str, int | None]]
) -> list[str]:
    """Truncates any value wider than its column, in place.

    Returns one description per truncation so the caller can report exactly
    what was shortened.
    """
    trimmed: list[str] = []
    for column, value in list(row.items()):
        if not isinstance(value, str):
            continue
        _, maxlen = column_types.get(column, (None, None))
        if maxlen and len(value) > maxlen:
            row[column] = value[:maxlen]
            trimmed.append(f"{column} truncated {len(value)} -> {maxlen}")
    return trimmed


def insert_rows(conn, table: str, rows: Sequence[Mapping[str, Any]], jsonb_columns: Sequence[str]) -> None:
    """Inserts the prepared rows in batches inside the caller's transaction."""
    if not rows:
        return
    columns = sorted({column for row in rows for column in row})
    placeholders = ", ".join(
        f"%({column})s::jsonb" if column in jsonb_columns else f"%({column})s"
        for column in columns
    )
    statement = (
        f'insert into public."{table}" ({", ".join(columns)}) values ({placeholders})'
    )
    payload = [{column: row.get(column) for column in columns} for row in rows]
    with conn.cursor() as cur:
        execute_batch(cur, statement, payload, page_size=500)


def configure_logging(log_file: str | None, verbose: bool = False) -> None:
    handlers: list[logging.Handler] = [logging.StreamHandler(sys.stdout)]
    if log_file:
        handlers.append(logging.FileHandler(log_file, mode="w", encoding="utf-8"))
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(asctime)s %(levelname)-7s %(message)s",
        handlers=handlers,
    )
