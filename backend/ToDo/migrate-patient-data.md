Here's a refined prompt you can give to an AI agent (Claude, Kiro, GPT, Cursor, etc.):

Database Migration Task

You need to migrate patient records from a Microsoft SQL Server database into a PostgreSQL database.

Source Database (MSSQL)
Server: MSSQL Server
Database: Centerport_Medical
Table: m_patient

Target Database (PostgreSQL)
Host: localhost
Port: 5434
Username: postgres
Password: postgres
Database: centerport
Table: seafarer_profiles

Requirements
Read all records from:
Centerport_Medical.dbo.m_patient

Insert the corresponding records into:
public.seafarer_profiles

Important: The table schemas are NOT identical.
Migration Rules
First inspect the schema of both tables.
Analyze column names, data types, nullability, constraints, indexes, identity columns, and default values.
Do NOT assume columns have matching names.
Create a detailed field-to-field mapping before writing any migration logic.
Identify:
Direct mappings
Renamed fields
Fields requiring transformation
Fields requiring concatenation/splitting
Missing fields on either side
Fields that should use default values
Generate a mapping report before performing inserts.
Data Quality Requirements
Handle NULL values safely.
Trim leading/trailing spaces.
Preserve UTF-8 characters.
Convert dates to PostgreSQL-compatible formats.
Validate phone numbers, emails, and identifiers where applicable.
Prevent duplicate records in seafarer_profiles.
Log any skipped or failed records.
Safety Requirements

Run migration initially in dry-run mode.

Display:

Total source records
Total target records
Records to be inserted
Records skipped
Records with validation issues

Only execute actual inserts after the mapping has been reviewed.

Deliverables

Generate:

Source table schema analysis (m_patient)
Target table schema analysis (seafarer_profiles)
Field mapping document
Data transformation rules
Validation rules
Migration SQL/script
Dry-run report
Final migration execution script
Recommended Approach
Connect to both databases.
Extract schemas.
Produce a column mapping table.
Highlight any ambiguous mappings and ask for confirmation.
Generate migration SQL.
Run dry-run validation.
Execute migration after validation passes.
Output Format

Provide the following in order:

1. Source Schema
2. Target Schema
3. Mapping Matrix
4. Data Conversion Rules
5. Migration Script
6. Dry Run Results
7. Final Insert Script


Do not perform blind column-to-column inserts. Schema analysis and mapping validation must be completed first because m_patient and seafarer_profiles are not structurally identical.