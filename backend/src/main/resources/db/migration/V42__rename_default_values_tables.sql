-- =============================================================================
-- V42: Rename reference-value tables to the *_default_values convention
-- =============================================================================
-- These three tables all hold named sets of laboratory reference / "normal
-- value" strings (configuration data, no patient link). Rename them so the
-- table name makes the "default values" purpose explicit and consistent:
--   default_values     -> hematology_default_values
--   clinical_chemistry -> clinical_chemistry_default_values
--   tumor_immunology   -> tumor_immunology_default_values

ALTER TABLE default_values     RENAME TO hematology_default_values;
ALTER TABLE clinical_chemistry RENAME TO clinical_chemistry_default_values;
ALTER TABLE tumor_immunology   RENAME TO tumor_immunology_default_values;
