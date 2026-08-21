ALTER TABLE medical_exams
    ADD COLUMN IF NOT EXISTS pe_rhythm VARCHAR(50),
    ADD COLUMN IF NOT EXISTS audio_unaided_hearing VARCHAR(255);
