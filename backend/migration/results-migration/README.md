# Result Migration

Loads the ten exported legacy result CSVs in [`../exported`](../exported) into
the existing CenterPort PostgreSQL tables.

**Data only.** Every target table, column and sequence already exists. These
scripts issue `INSERT` statements and a sequence `setval`. They never run DDL
and never alter the schema.

Dry run is the default. Nothing is written until you pass `--execute`.

## What goes where

| CSV | rows | linkable | target table |
|---|---|---|---|
| `xray.csv` | 3,553 | 3,533 | `xray_reports` |
| `ultrasound.csv` | 2,724 | 2,707 | `ultrasound_reports` |
| `hiv.csv` | 3,806 | 3,766 | `hiv_reports` |
| `immunology.csv` | 5,839 | 5,782 | `immunology_reports` |
| `psychology.csv` | 6,820 | 6,718 | `psychology_evaluations` |
| `laboratory.csv` | 8,268 | 8,184 | `laboratory_reports` |
| `seafarer_mlc.csv` | 3,527 | 3,508 | `mlc_records` |
| `landbase.csv` | 5,201 | 5,162 | `landbase_pemes` |
| `seabase.csv` | 3,725 | 3,697 | `medical_exams` |
| `panama.csv` | 1,570 | 1,569 | `panama_certificates` |
| | **45,033** | **44,626** | |

Each CSV is a denormalized join of a legacy result-master row (`rm_*`), the
legacy patient master (`pat_*`) and one or more module detail tables. The
export is already reduced to roughly one latest result per patient per module,
so every source row becomes at most one target row — there is no fan-out.

The four `*_repeat_tests` tables are intentionally left empty. Every
`*_repeat_test_id` in `laboratory.csv` merely echoes its parent result id and
`rm_repeat_test_tag` is `N` wherever populated, so the export contains no
repeat runs.

## Prerequisites

Python 3.10+ and `psycopg2`. A virtualenv already exists one level up and is
shared with the patient migration:

```powershell
cd backend\migration
python -m venv .venv                     # only if it does not exist yet
.\.venv\Scripts\python.exe -m pip install -r results-migration\requirements.txt
```

## Configure the connection

Settings come from environment variables. Only `PG_PASSWORD` is mandatory —
the script refuses to run without it rather than guessing.

```powershell
$env:PG_HOST = "192.168.100.46"
$env:PG_PORT = "5432"
$env:PG_DB   = "centerport"
$env:PG_USER = "postgres"
$env:PG_PASSWORD = "..."
```

## Run

```powershell
cd backend\migration\results-migration

# 1. Dry run everything and read the report.
..\.venv\Scripts\python.exe migrate_results.py

# 2. Dry run one module, with the first prepared row printed in full.
..\.venv\Scripts\python.exe migrate_results.py --module panama --show-sample

# 3. Load one module.
..\.venv\Scripts\python.exe migrate_results.py --module xray --execute

# 4. Load everything.
..\.venv\Scripts\python.exe migrate_results.py --execute
```

| Flag | Effect |
|---|---|
| `--module NAME` | Migrate one module; repeatable. Defaults to all ten. |
| `--execute` | Perform the inserts. Omit for a dry run. |
| `--limit N` | Only process the first N source rows (debugging). |
| `--show-sample` | Print the first prepared row as JSON. |
| `--log-file PATH` | Detailed log destination (default `results-migration.log`). |

Each module runs in its own transaction and commits only after its inserts
succeed. A failure rolls that module back and the run continues with the next
one, so a bad module never leaves a half-loaded table.

## Reading the dry-run report

```
  source rows                 3725     rows read from the CSV
  rows to insert              3697     rows that will be written
  skipped, papin blank           0     no legacy PAPIN on the row at all
  skipped, papin unresolved     28     PAPIN has no matching seafarer profile
  values truncated to fit        2     a legacy cell was wider than its column
  business ids          MED00000025 .. MED00003721
```

It also lists, when present:

- **unresolved papins** — the legacy PAPINs with no `seafarer_profiles` row.
- **truncated values** — which column, and from what length to what.
- **legacy values with no app vocabulary match** — a legacy code the mapping
  could not translate. These are dropped to NULL so the field renders as
  unset, except where the mapping deliberately passes the value through
  (blood types without an Rh sign). Worth reading before an `--execute`.
- **legacy fields intentionally not migrated** — fields with no target column,
  listed with how many rows carried a value.

## How the mapping works

`common.py` owns everything shared: connecting, indexing PAPINs, generating
business IDs, normalizing legacy values, validating against the live column
widths, and the report. One module per file under `mappings/` declares its CSV,
its target table and a `build_row` function. `mappings/__init__.py` registers
them in load order.

Adding or correcting a mapping means editing one file in `mappings/`. The
engine rejects any column the target table does not have, so a typo surfaces
on the dry run instead of at INSERT time.

### Linkage

`rm_papin` / `pat_papin` (and the module-specific equivalents) join to
`seafarer_profiles.profile_id`, which the earlier patient migration populated
with the legacy PAPIN. Rows whose PAPIN has no profile are skipped and listed.

About 310 rows across all ten files are unresolved, from two causes:

1. **Legacy patients newer than the profile snapshot.** `CMSI00008763` and up
   appear in the result exports but `seafarer_profiles` stops at
   `CMSI00008762`. Re-running `../patient-migration/migrate_patients.py` tops
   these up, after which re-running a module here picks up the extra rows.
2. **Rows the profile migration intentionally skipped**, including the
   malformed 14-character `CMSI0000425606` that cannot fit
   `profile_id VARCHAR(12)`.

### Business IDs

Reproduces `BusinessIdGenerator.generateId`: uppercase prefix plus an
eight-digit zero-padded counter (`MED00000025`). The counter continues from the
live sequence's current value, and after a successful load the sequence is
advanced with `setval` so the application keeps producing unique IDs.

| module | prefix | sequence | id column |
|---|---|---|---|
| xray | `XRAY` | `xray_seq` | `report_id` |
| ultrasound | `UTZ` | `utz_seq` | `report_id` |
| hiv | `HIV` | `hiv_seq` | `report_id` |
| immunology | `IMM` | `imm_seq` | `report_id` |
| psychology | `PSYCH` | `psych_seq` | `eval_id` |
| laboratory | `LAB` | `lab_seq` | `report_id` |
| mlc | `MLC` | `mlc_seq` | `mlc_id` |
| landbase | `PEME` | `peme_seq` | `peme_id` |
| seabase | `MED` | `med_seq` | `exam_id` |
| panama | `PAN` | `pan_seq` | `panama_id` |

### Dates

Every date column in these tables is a VARCHAR holding an ISO `YYYY-MM-DD`
string, because the forms render them as native `type="date"` inputs. The
export mixes `MM/DD/YYYY`, `YYYY-MM-DD HH:MM:SS`, `Mon DD YYYY H:MMAM`,
day-first `DD/MM/YYYY` (MLC and Panama), space-padded `18 / 11 / 2025`
(Panama diagnostics) and compact `DDMMYYYY` (Panama Covid test). All are
normalized. `00/00/0000` and `1900-01-01` placeholders become NULL.

Panama is the exception on storage: it keeps dates decomposed into
`day` / `month` / `year` triples where the month is an abbreviated name
(`Nov`), matching the form's month select.

### JSONB columns

These are written as a JSON document rather than NULL, because the medical
findings grid dereferences `findings_a[key]` with no null guard:

| table | columns |
|---|---|
| `medical_exams` | `medical_history`, `questionnaire`, `findings_a/b/c`, `findings_a/b/c_remarks` |
| `landbase_pemes` | `medical_history` |
| `panama_certificates` | `conditions`, `physical_exploration`, `lab_tests`, `lab_other_tests` |
| `mlc_records` | `visual_aids` (a JSON **array**; `[]` means no aids worn) |

Keys are reproduced byte-for-byte from the frontend, including the trailing
colon on `"Allergies (Specify):"` and the post-V25/V26/V27/V28 Panama
snake_case condition and physical-exploration keys. A near-miss key renders as
unanswered, so these tables should not be "tidied up".

### Things to know before trusting a column

- **`landbase_pemes.pe_*`** are always written explicitly. Their DDL default
  is the string `'NORMAL'`, which matches neither radio option, so an omitted
  column would look unanswered.
- **Legacy column reuse.** `pe_CONVERSATIONAL_AD` holds the body temperature
  and `an_remarks` holds the chest x-ray number; both are mapped accordingly.
  `chem_cholesterol_elev` holds the triglycerides result (the legacy form
  reused the cholesterol row), confirmed by the SI-to-conventional ratio.
- **`laboratory_reports` reference ranges** are copied from the current
  `hematology_default_values` / `clinical_chemistry_default_values` rows, which
  is what the app stores when an examiner creates a report. Change those admin
  rows before loading if the historical ranges differed.
- **Unanswered is not "no".** A legacy cell holding `-` or blank is omitted
  from the JSONB map rather than defaulted, so a migrated record never claims
  the seafarer denied a condition nobody asked about.
- **Dropped fields.** `chem_vdrl` / `chem_hbsag` / `chem_widal_test` /
  `chem_malarial_smear` have no column on `laboratory_reports` (that serology
  now lives on `immunology_reports`). Psychology's `psy_PTR_*` and
  `psy_Lic_Validity_*` practitioner details have no target column. Each module
  reports its own dropped fields with a row count.

## Rollback

Each module writes a contiguous business-ID range, printed in its report, so a
run is reversible by that range. Replace the bounds with the ones your run
reported:

```sql
-- Example: undo the xray load reported as XRAY00000001 .. XRAY00003533
DELETE FROM public.xray_reports
 WHERE report_id BETWEEN 'XRAY00000001' AND 'XRAY00003533';
SELECT setval('xray_seq', 0, false);
```

The same shape works for the other nine tables using their own id column and
sequence from the table above. Do this with care if anything already
references the migrated rows.
