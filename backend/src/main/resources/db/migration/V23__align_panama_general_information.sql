-- Align Panama General Information storage with the current certificate form.
ALTER TABLE panama_certificates
    ADD COLUMN routine_duties TEXT,
    ADD COLUMN emergency_duties TEXT,
    ADD COLUMN trade_area_details TEXT;

-- The legacy field combined both kinds of duty. Preserve its complete text in
-- both new fields so neither routine nor emergency information is hidden.
UPDATE panama_certificates
SET routine_duties = COALESCE(routine_duties, routine_emergency_duties),
    emergency_duties = COALESCE(emergency_duties, routine_emergency_duties)
WHERE routine_emergency_duties IS NOT NULL;

-- Existing trade_area values are intentionally left unchanged to preserve
-- historical meaning and rollback compatibility. The application normalizes
-- legacy values for display and writes the new Panama form values going forward.
