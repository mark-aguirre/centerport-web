ALTER TABLE medical_exams
    ADD COLUMN IF NOT EXISTS findings_a_remarks JSONB,
    ADD COLUMN IF NOT EXISTS findings_b_remarks JSONB,
    ADD COLUMN IF NOT EXISTS findings_c_remarks JSONB;
