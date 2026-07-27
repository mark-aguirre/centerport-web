-- Add maintenance_medications column back to medical_exams table

ALTER TABLE medical_exams
    ADD COLUMN IF NOT EXISTS maintenance_medications TEXT;
