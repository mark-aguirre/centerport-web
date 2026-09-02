-- Split the Panama physical-exploration "lungs_and_chest" key into two
-- separate keys: "lungs" and "chest".
--
-- The physical_exploration column is a schemaless JSONB map. For existing rows
-- that hold the combined "lungs_and_chest" value, copy that value into each of
-- the two new keys, then drop the old combined key.
--
-- Rows without a "lungs_and_chest" key are left untouched.

UPDATE panama_certificates
SET physical_exploration =
    (physical_exploration
        || jsonb_build_object('lungs', physical_exploration -> 'lungs_and_chest')
        || jsonb_build_object('chest', physical_exploration -> 'lungs_and_chest'))
    - 'lungs_and_chest'
WHERE physical_exploration ? 'lungs_and_chest';
