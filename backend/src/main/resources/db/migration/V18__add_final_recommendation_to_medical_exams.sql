ALTER TABLE medical_exams
    ADD COLUMN IF NOT EXISTS final_recommendation VARCHAR(100);
