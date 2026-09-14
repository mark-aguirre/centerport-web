# Patient Data Migration — `m_patient` → `seafarer_profiles`

Migrates seafarer/patient records from the legacy **MSSQL** system into the
**PostgreSQL** `centerport` database.

- **Source:** `Centerport_Medical.dbo.m_patient` (MSSQL, DESKTOP-KIIKPT8\SQLEXPRESS)
- **Target:** `centerport.public.seafarer_profiles` (PostgreSQL, localhost:5434)

> There are **two** `m_patient` tables in the source DB: `dbo.m_patient` (6,400 rows, 52 cols)
> and `db_owner.m_patient` (3,729 rows, 51 cols). Per the task, we migrate **`dbo.m_patient`** only.

---

## 1. Source Schema — `dbo.m_patient` (52 columns)

| # | Column | Type | Notes |
|---|--------|------|-------|
| 1 | papin | varchar(50) | Business ID, e.g. `CMSI00000001`. Natural key. |
| 2 | lastname | varchar(50) | |
| 3 | firstname | varchar(50) | |
| 4 | middlename | varchar(50) | |
| 5 | address_1 | varchar(100) | |
| 6 | address_2 | varchar(50) | |
| 7 | city | varchar(50) | |
| 8 | district | varchar(50) | No target column |
| 9 | contact_1 | varchar(15) | |
| 10 | contact_2 | varchar(15) | No target column |
| 11 | position | varchar(50) | |
| 12 | marital_status | varchar(10) | |
| 13 | gender | varchar(10) | |
| 14 | birthdate | varchar(50) | `M/D/YYYY` string, sometimes trailing spaces |
| 15 | place_of_birth | varchar(50) | |
| 16 | type_of_job | varchar(20) | No target column |
| 17 | employer | varchar(50) | |
| 18 | passport_no | varchar(50) | |
| 19 | seamansbook_no | varchar(50) | → `seamans_book_no` |
| 20 | picture | varbinary(max) | Binary blob. Cannot map to `photo_url` (text). Skipped. |
| 21 | registration_date | varchar(100) | datetime string → `created_date` |
| 22 | remarks | varchar(254) | → `remark` |
| 23 | nationality | varchar(15) | |
| 24 | religion | varchar(100) | |
| 25 | test_data | varchar(10) | Flag for test rows. Used to filter, not migrated. |
| 26 | father_name | varchar(20) | |
| 27 | father_occupation | varchar(20) | |
| 28 | mother_name | varchar(20) | |
| 29 | no_of_brothers | varchar(10) | |
| 30 | no_of_sisters | varchar(10) | |
| 31 | birth_order | varchar(10) | |
| 32 | spouse_name | varchar(20) | |
| 33 | spouse_occupation | varchar(20) | |
| 34 | no_of_children | varchar(10) | |
| 35 | elementary | varchar(20) | |
| 36 | highschool | varchar(20) | → `high_school` |
| 37 | college | varchar(20) | → `college_university` |
| 38 | course | varchar(20) | |
| 39 | highest_level_attended | varchar(20) | |
| 40 | mother_occupation | varchar(20) | |
| 41 | prev_work_start | varchar(20) | → `prev_date_started` |
| 42 | prev_work_end | varchar(20) | → `prev_date_end` |
| 43 | prev_company | varchar(20) | |
| 44 | prev_position | varchar(20) | |
| 45 | prev_leave_reason | varchar(20) | → `prev_reason_of_leaving` |
| 46 | prev_years | varchar(20) | → `prev_length_of_stay` |
| 47 | date_last_updated | varchar(20) | datetime string → `updated_date` |
| 48 | sirb | varchar(20) | Seaman's Identification & Record Book. No distinct target; see notes. |
| 49 | designation | varchar(20) | |
| 50 | country_destination | varchar(20) | → `country_of_destination` |
| 51 | cn | int (identity) | Source PK. Used for ordering/dedup only. |
| 52 | country | varchar(255) | |

---

## 2. Target Schema — `public.seafarer_profiles` (48 columns)

Primary key `id` (uuid). Unique constraint on `profile_id` (varchar(12)).
`created_date` and `updated_date` are **NOT NULL** timestamps. All other data
fields are nullable. Referenced by 6 child tables via `seafarer_profile_id` FKs.

System / audit columns: `id`, `profile_id`, `created_date`, `updated_date`, `created_by`.

---

## 3. Mapping Matrix

Legend: **D** = direct, **R** = renamed, **T** = transform, **C** = concatenate, **G** = generated, **X** = not migrated.

| Target column | Kind | Source | Rule |
|---|---|---|---|
| id | G | — | `gen_random_uuid()` per row |
| profile_id | R+T | papin | Trim. Must be unique & ≤ 12 chars. **Over-length papins are stored as NULL** (not truncated — truncation can collide with a different valid papin and merge two people). The original value is preserved in `remark` as `LEGACY PAPIN: <value>`. |
| created_date | R+T | registration_date | Parse datetime; fallback to `NOW()` if blank/unparseable (NOT NULL). |
| updated_date | R+T | date_last_updated | Parse datetime; fallback to `created_date` if blank/unparseable (NOT NULL). |
| created_by | G | — | Constant `'migration'`. |
| photo_url | T | picture | Set to NULL by `migrate_patients.py`, then **backfilled by `migrate_photos.py`**: the PNG blob is uploaded to SeaweedFS and `photo_url` is set to `/api/files/{uuid}_{papin}.png` (same convention the backend's `FileUploadController` produces). |
| last_name | D | lastname | Trim, empty→NULL. |
| first_name | D | firstname | Trim, empty→NULL. |
| middle_name | D | middlename | Trim, empty→NULL. |
| address | C | address_1 + address_2 | Join non-empty parts with `", "`. |
| city | D | city | Trim (source is sometimes `char`, so RTRIM matters). |
| contact_no | R | contact_1 | Trim. (`contact_2` dropped — no target.) |
| birthdate | T | birthdate | Trim; normalize `M/D/YYYY` → `YYYY-MM-DD` when parseable, else keep raw. Stored as text. |
| age | G | birthdate | Computed from birthdate vs. today when parseable, else NULL. |
| gender | T | gender | Trim; title-case normalize (`MALE`→`Male`). |
| marital_status | T | marital_status | Trim; normalize common codes (`WD`→`Widowed`, etc.). |
| place_of_birth | D | place_of_birth | Trim. |
| religion | D | religion | Trim. |
| nationality | D | nationality | Trim. |
| country | D | country | Trim; empty→NULL. |
| employer | D | employer | Trim. |
| designation | D | designation | Trim. |
| passport_no | D | passport_no | Trim, uppercase. |
| seamans_book_no | R | seamansbook_no | Trim, uppercase. |
| position | D | position | Trim. |
| country_of_destination | R | country_destination | Trim. |
| father_name | D | father_name | Trim. |
| father_occupation | D | father_occupation | Trim. |
| mother_name | D | mother_name | Trim. |
| mother_occupation | D | mother_occupation | Trim. |
| no_of_brothers | D | no_of_brothers | Trim. |
| no_of_sisters | D | no_of_sisters | Trim. |
| birth_order | D | birth_order | Trim. |
| spouse_name | D | spouse_name | Trim. |
| spouse_occupation | D | spouse_occupation | Trim. |
| no_of_children | D | no_of_children | Trim. |
| elementary | D | elementary | Trim. |
| high_school | R | highschool | Trim. |
| college_university | R | college | Trim. |
| course | D | course | Trim. |
| highest_level_attended | D | highest_level_attended | Trim. |
| prev_date_started | R | prev_work_start | Trim. |
| prev_date_end | R | prev_work_end | Trim. |
| prev_length_of_stay | R | prev_years | Trim. |
| prev_company | D | prev_company | Trim. |
| prev_position | D | prev_position | Trim. |
| prev_reason_of_leaving | R | prev_leave_reason | Trim. |
| remark | R+C | remarks (+ sirb) | Trim remarks. `sirb` (if present) appended as `"SIRB: <value>"` since it has no dedicated target. |

### Source columns intentionally NOT migrated
- `district` — no target column (folded into nothing; kept out of `address` to match target semantics).
- `contact_2` — no target (only one `contact_no`).
- `type_of_job` — no target column.
- `picture` — handled separately by `migrate_photos.py` (uploaded to SeaweedFS,
  not stored inline). See section 7.
- `test_data` — used to **exclude** test rows (configurable), not stored.
- `cn` — source identity PK, used only for stable ordering & dedup.
- `sirb` — no dedicated target; preserved by appending to `remark`.

### Target columns with no source (left NULL/default)
- `photo_url` (binary can't map), plus any field with no legacy equivalent.

---

## 4. Data Conversion Rules

1. **Whitespace:** every text value is `strip()`-ed. `char(n)` source columns are right-padded, so trimming is required.
2. **Empty → NULL:** empty strings and `'.'`-only address fragments become NULL (except NOT NULL targets).
3. **Encoding:** the source DB collation is `SQL_Latin1_General_CP1_CI_AS`, so legacy
   `VARCHAR`/`CHAR` data is **Windows-1252 (cp1252)**, not UTF-8. The script decodes it
   as cp1252 (verified against names like `PEÑAFLOR`, `NIÑO`, `NUÑEZ`) and lets psycopg2
   re-encode to UTF-8 on write, so accented characters are preserved end-to-end.
4. **Dates:**
   - `registration_date` / `date_last_updated`: parsed from formats
     `YYYY-MM-DD HH:MM:SS`, `YYYY-MM-DD HH:MM:SS AM/PM`, `M/D/YYYY`, etc. → `timestamp`.
   - `birthdate`: `M/D/YYYY` → `YYYY-MM-DD` text; unparseable kept verbatim.
5. **created_date NOT NULL:** blank/unparseable `registration_date` → `NOW()`.
6. **updated_date NOT NULL:** blank/unparseable `date_last_updated` → the row's `created_date`.
7. **Concatenation:** `address = address_1 [, address_2]` joining only non-empty parts.
8. **Normalization:** gender & marital_status mapped to consistent labels; passport / seaman's book uppercased.

## 5. Validation Rules

- `profile_id` (papin) must be ≤ 12 chars; longer values (only 1 known: `CMSI0000425606`) are **stored as NULL and preserved in `remark`** for manual reconciliation. They are NOT truncated, because `CMSI0000425606` truncated to `CMSI00004256` collides with a *different* real seafarer (verified: LAMBOON ANDREW vs BALITE JASON).
- Duplicate `papin` within source → keep the **latest** (highest `cn`), skip the rest (logged).
- `papin` already present in target → **skip** (logged) to prevent unique-constraint violations.
- A row with no usable name **and** no papin is skipped as junk (logged).
- Phone/email/identifier checks: contact numbers are digit-normalized for logging only (not rejected), no email column exists in source.

## 6. Dry-Run Results (live inspection, verified)
- Source rows (test filter applied): **6,400**.
- Duplicate papins collapsed in source: **2** (`CMSI00005358`, `CMSI00005828`; latest by `cn` kept).
- `registration_date` blank on **481** rows → those get `NOW()` for `created_date`.
  (Mixed date formats incl. `MM/DD/YYYY HH:MM AM` are parsed, not defaulted.)
- **5,839** rows carry a `picture` blob (all raw PNG, ~120–150 KB each) →
  backfilled to SeaweedFS by `migrate_photos.py` (see section 7).
- 1 `papin` exceeds 12 chars (`CMSI0000425606`) → `profile_id` set NULL, value kept in `remark`.
- Target already contains **1** row: `CMSI00000001` (test "keith Tomas") → the source
  `CMSI00000001` is **skipped** as a collision unless `--overwrite` is used.
- **Records to INSERT: 6,397** (= 6,400 − 2 duplicates − 1 collision). Projected target total: **6,398**.

---

## 7. Photo Backfill (`migrate_photos.py` → SeaweedFS)

The legacy `dbo.m_patient.picture` column holds the seafarer photo as a
`varbinary(max)` BLOB. In the new system, images live in **SeaweedFS** (via its
S3 gateway) and a profile only stores a reference in `photo_url`, served by the
backend's `GET /api/files/{key}` endpoint.

### How the backend stores images (verified from backend code)
- `S3StorageService` (active when `app.storage.type=s3`) uploads to the
  SeaweedFS S3 gateway (`.env`: `S3_ENDPOINT=http://192.168.0.15:8333`,
  bucket `patient-photos`, path-style access).
- Object key convention: `{uuid}_{sanitized_original_filename}`.
- `FileUploadController` persists `photo_url = "/api/files/" + key` and serves
  it back from the same key. `migrate_photos.py` reproduces this exactly.

### Backfill rules
- **Format:** every sampled `picture` is a raw **PNG** (magic `89 50 4E 47`),
  no OLE wrapper. `migrate_photos.py` still sniffs magic bytes and picks the
  right extension/content-type (PNG/JPEG/GIF/BMP/WebP), falling back to
  `application/octet-stream` with a warning for anything unrecognized.
- **Key / URL:** `key = {uuid4}_{papin}.png`, `photo_url = /api/files/{key}`.
- **Correlation:** matched to the migrated profile by `profile_id` (= papin).
  `papin` is not indexed in the source (only `cn`, the clustered PK), so the
  script streams source rows ordered by `cn` and reads each BLOB once.
- **Keep-last:** duplicate papins are streamed ascending by `cn`, so the highest
  `cn` wins — consistent with the profile migration's dedup.
- **Resumable:** only profiles with `photo_url IS NULL` (and `created_by =
  'migration'`) are candidates, so re-running continues after any interruption.
  Uploads + `photo_url` updates commit every 100 rows.
- **Non-fatal errors:** a failed upload for one row is logged and skipped; it
  does not abort the run (and will be retried on the next run).

### Order of operations
1. `python migrate_patients.py --execute` — creates the profile rows (photo_url NULL).
2. `python migrate_photos.py --execute` — uploads ~5,839 PNGs to SeaweedFS and
   sets each `photo_url`.

Run `migrate_photos.py` (dry-run) first to size the workload; it reports
candidate profiles, matched pictures, and total MB **without** transferring any
BLOB (it uses `DATALENGTH`).
