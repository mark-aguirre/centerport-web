-- Split the Panama visual-field columns into separate Normal/Defective values
-- per eye. Existing single-value data is preserved by moving it into the new
-- "normal" columns.

ALTER TABLE panama_certificates
    ADD COLUMN IF NOT EXISTS sight_fields_right_normal    VARCHAR(255),
    ADD COLUMN IF NOT EXISTS sight_fields_right_defective VARCHAR(255),
    ADD COLUMN IF NOT EXISTS sight_fields_left_normal     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS sight_fields_left_defective  VARCHAR(255);

UPDATE panama_certificates
SET sight_fields_right_normal = sight_fields_right,
    sight_fields_left_normal  = sight_fields_left
WHERE sight_fields_right IS NOT NULL
   OR sight_fields_left IS NOT NULL;

ALTER TABLE panama_certificates
    DROP COLUMN IF EXISTS sight_fields_right,
    DROP COLUMN IF EXISTS sight_fields_left;
