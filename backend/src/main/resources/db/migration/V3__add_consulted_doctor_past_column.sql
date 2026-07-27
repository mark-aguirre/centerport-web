-- Re-add columns that were dropped by the original V2 migration
-- but are still needed by the MedicalExam entity.

ALTER TABLE medical_exams
    ADD COLUMN IF NOT EXISTS consulted_doctor_past TEXT,
    ADD COLUMN IF NOT EXISTS maintenance_medications TEXT;
