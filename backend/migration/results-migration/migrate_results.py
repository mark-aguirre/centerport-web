"""Migrates the exported legacy result CSVs into the CenterPort database.

Data only: every target table already exists, so this script issues INSERTs
and a sequence ``setval``, never DDL.

Dry-run is the default. Nothing is written until ``--execute`` is passed, and
each module's inserts run inside a single transaction that is rolled back on
any error.

    python migrate_results.py                       # dry-run, every module
    python migrate_results.py --module xray         # dry-run, one module
    python migrate_results.py --module xray --execute
    python migrate_results.py --execute             # load everything

Connection settings come from PG_HOST / PG_PORT / PG_DB / PG_USER /
PG_PASSWORD; only PG_PASSWORD is mandatory.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from common import (  # noqa: E402  (path shim must run first)
    LOG,
    build_rows,
    configure_logging,
    connect,
    insert_rows,
    load_column_types,
    load_papin_index,
    read_csv,
    resync_sequence,
    sequence_last_value,
)
from mappings import ALL_MODULES, REGISTRY  # noqa: E402


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Load the exported legacy result CSVs into CenterPort.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--module",
        action="append",
        choices=ALL_MODULES,
        help="Module to migrate; repeatable. Defaults to every module.",
    )
    parser.add_argument(
        "--execute",
        action="store_true",
        help="Perform the inserts. Omit for a dry run.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        help="Only process the first N source rows (debugging).",
    )
    parser.add_argument(
        "--log-file",
        default="results-migration.log",
        help="Detailed log destination (default results-migration.log).",
    )
    parser.add_argument(
        "--show-sample",
        action="store_true",
        help="Print the first prepared row for each module.",
    )
    return parser.parse_args(argv)


def run_module(conn, spec, *, execute: bool, limit: int | None, show_sample: bool) -> bool:
    """Prepares and optionally inserts one module. Returns False on failure."""
    if not os.path.exists(spec.csv_path):
        LOG.error("%s: %s not found", spec.name, spec.csv_path)
        return False

    LOG.info("%s: reading %s", spec.name, spec.csv_path)
    source = read_csv(spec.csv_path)
    if limit:
        source = source[:limit]

    papin_index = load_papin_index(conn)
    column_types = load_column_types(conn, spec.table)
    if not column_types:
        LOG.error("%s: table public.%s does not exist", spec.name, spec.table)
        return False

    start = sequence_last_value(conn, spec.sequence)
    constants = spec.load_constants(conn) if spec.load_constants else None
    if constants:
        LOG.info(
            "%s: applying %d constant columns from the default-values tables",
            spec.name,
            len(constants),
        )

    rows, report = build_rows(
        spec, source, papin_index, column_types, start, constants=constants
    )
    print(report.render())
    if spec.notes:
        print(f"  notes: {spec.notes}")

    if show_sample and report.sample:
        print("  first prepared row:")
        print(
            json.dumps(
                {k: _printable(v) for k, v in sorted(report.sample.items())},
                indent=4,
                ensure_ascii=False,
            )
        )

    if not execute:
        LOG.info("%s: dry run, nothing written", spec.name)
        return True
    if not rows:
        LOG.warning("%s: no rows to insert", spec.name)
        return True

    LOG.info("%s: inserting %d rows into public.%s", spec.name, len(rows), spec.table)
    insert_rows(conn, spec.table, rows, spec.jsonb_columns)
    resync_sequence(conn, spec.sequence, start + len(rows))
    LOG.info(
        "%s: inserted %d rows, %s advanced to %d",
        spec.name,
        len(rows),
        spec.sequence,
        start + len(rows),
    )
    return True


def _printable(value):
    return value.isoformat() if isinstance(value, datetime) else value


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    configure_logging(args.log_file)

    selected = args.module or ALL_MODULES
    mode = "EXECUTE" if args.execute else "DRY RUN"
    LOG.info("%s: %s", mode, ", ".join(selected))

    if "PG_PASSWORD" not in os.environ:
        LOG.error("PG_PASSWORD is not set; refusing to guess a database password")
        return 2

    conn = connect()
    try:
        with conn.cursor() as cur:
            cur.execute("select current_database(), inet_server_addr()")
            database, host = cur.fetchone()
        LOG.info("connected to %s on %s", database, host)

        failures = []
        for name in selected:
            spec = REGISTRY[name]
            try:
                ok = run_module(
                    conn,
                    spec,
                    execute=args.execute,
                    limit=args.limit,
                    show_sample=args.show_sample,
                )
            except Exception:
                conn.rollback()
                LOG.exception("%s: failed, transaction rolled back", name)
                failures.append(name)
                continue
            if not ok:
                failures.append(name)
                continue
            if args.execute:
                conn.commit()
                LOG.info("%s: committed", name)

        if failures:
            LOG.error("failed modules: %s", ", ".join(failures))
            return 1
        LOG.info("%s complete", mode)
        return 0
    finally:
        conn.close()


if __name__ == "__main__":
    raise SystemExit(main())
