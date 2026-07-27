-- Re-add medical_history and medical_history_others columns
-- that were dropped by the original V2 migration.

ALTER TABLE medical_exams
    ADD COLUMN IF NOT EXISTS medical_history JSONB,
    ADD COLUMN IF NOT EXISTS medical_history_others TEXT;
