# Patient Data Migration

Migrates seafarer/patient records from the legacy **MSSQL** database
(`Centerport_Medical.dbo.m_patient`) into the **PostgreSQL** `centerport`
database (`public.seafarer_profiles`).

The migration is **schema-aware** — source and target are not structurally
identical, so columns are mapped, renamed, transformed, and validated per
[`MAPPING.md`](./MAPPING.md). It runs **dry-run first** and never writes unless
you pass `--execute`.

## Files

| File | Purpose |
|------|---------|
| `MAPPING.md` | Source + target schema analysis, field mapping matrix, conversion & validation rules. |
| `migrate_patients.py` | Profile row migration (dry-run + execute). |
| `migrate_photos.py` | Photo BLOB backfill into SeaweedFS (dry-run + execute). |
| `requirements.txt` | Python dependencies. |
| `migration.log` / `photo-migration.log` | Detailed per-run logs. |

## Two-step workflow

1. **Profiles:** `migrate_patients.py` moves the row data into `seafarer_profiles`
   (leaving `photo_url` NULL).
2. **Photos:** `migrate_photos.py` uploads each legacy `picture` BLOB to SeaweedFS
   and sets `photo_url = /api/files/{key}`, matching the backend's own upload
   convention. Run it **after** the profile migration.

## Prerequisites

- Python 3.10+
- Microsoft ODBC Driver for SQL Server (e.g. "ODBC Driver 17 for SQL Server").
  The script auto-detects any installed `SQL Server` driver.
- Network access to the MSSQL instance, PostgreSQL on `localhost:5434`, and
  (for photos) the SeaweedFS S3 gateway on `192.168.0.15:8333`.

## Install

```powershell
cd backend\migration\patient-migration
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Configure connections

Defaults are baked in (MSSQL Windows auth to `DESKTOP-KIIKPT8\SQLEXPRESS`,
PostgreSQL `postgres/postgres` on `localhost:5434/centerport`). Override any of
them with environment variables:

```powershell
# MSSQL (use SQL auth instead of Windows auth)
$env:MSSQL_SERVER   = "DESKTOP-KIIKPT8\SQLEXPRESS"
$env:MSSQL_DATABASE = "Centerport_Medical"
$env:MSSQL_TRUSTED  = "no"
$env:MSSQL_USER     = "sa"
$env:MSSQL_PASSWORD = "..."

# PostgreSQL
$env:PG_HOST = "localhost"; $env:PG_PORT = "5434"
$env:PG_DB   = "centerport"; $env:PG_USER = "postgres"; $env:PG_PASSWORD = "postgres"

# SeaweedFS S3 gateway (photos) — defaults match backend/.env
$env:S3_ENDPOINT = "http://192.168.0.15:8333"; $env:S3_BUCKET = "patient-photos"
$env:S3_ACCESS_KEY = "admin"; $env:S3_SECRET_KEY = "change-this-password"
$env:S3_PATH_STYLE_ACCESS = "true"
```

## Run

**1. Dry run (default, no writes):**

```powershell
python migrate_patients.py
```

Prints a report with total source records, target records, records to insert,
records skipped (collisions / junk), and validation issues. Review it, then:

**2. Execute:**

```powershell
python migrate_patients.py --execute
```

All inserts happen inside a single PostgreSQL transaction — any error rolls the
whole thing back.

### `migrate_patients.py` options

| Flag | Effect |
|------|--------|
| `--execute` | Perform the inserts. Omit for dry-run. |
| `--overwrite` | On `profile_id` collision, UPDATE the existing target row instead of skipping. |
| `--include-test-rows` | Also migrate rows flagged in `test_data` (skipped by default). |
| `--limit N` | Only process the first N source rows (debugging). |
| `--log-file PATH` | Detailed log destination (default `migration.log`). |

**3. Backfill photos (after the profile migration):**

```powershell
python migrate_photos.py            # dry-run: sizes the workload, no uploads
python migrate_photos.py --execute  # upload PNGs to SeaweedFS + set photo_url
```

The dry-run reports candidate profiles, matched pictures, and total MB without
transferring any BLOB. Execute uploads each `picture` to the `patient-photos`
bucket and sets `photo_url = /api/files/{key}`. It's **resumable** — only
profiles with a NULL `photo_url` are processed, so re-running continues after an
interruption. Updates commit every 100 rows.

### `migrate_photos.py` options

| Flag | Effect |
|------|--------|
| `--execute` | Upload photos and update `photo_url`. Omit for dry-run. |
| `--limit N` | Only process the first N source pictures (debugging). |
| `--log-file PATH` | Detailed log destination (default `photo-migration.log`). |

## What to expect (from live inspection)

- ~6,400 source rows; 2 duplicate `papin` values are collapsed (latest kept).
- The target already contains `CMSI00000001` (test data). Without `--overwrite`
  the matching source row is **skipped** to respect the `profile_id` unique
  constraint.
- `picture` blobs (~5,839 rows, all raw PNG) are migrated to SeaweedFS by
  `migrate_photos.py`, not stored inline.
- Rows with a blank `registration_date` get `created_date = NOW()` because that
  column is `NOT NULL`.
- One `papin` longer than 12 chars is stored with a NULL `profile_id` (its
  original value is preserved in `remark`), because truncating it would collide
  with a different real seafarer.

## Rollback

If you executed and want to undo a migration run (before other data references
these rows), the migrated rows are identifiable by `created_by = 'migration'`:

```sql
-- photos (object keys are recorded in photo_url); clears the reference
UPDATE public.seafarer_profiles SET photo_url = NULL WHERE created_by = 'migration';
-- then the rows themselves
DELETE FROM public.seafarer_profiles WHERE created_by = 'migration';
```

Do this with care if child records (medical exams, lab reports, etc.) already
reference the migrated profiles. Note: deleting rows does **not** remove the
uploaded objects from SeaweedFS — those can be pruned separately from the
`patient-photos` bucket if needed (a re-run of `migrate_photos.py` will create
fresh objects with new UUID keys).
