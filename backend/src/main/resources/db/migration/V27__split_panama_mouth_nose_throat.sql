-- Split the Panama physical-exploration "mouth_nose_throat" key into three
-- separate keys: "mouth", "nose", and "throat".
--
-- The physical_exploration column is a schemaless JSONB map. For existing rows
-- that hold the combined "mouth_nose_throat" value, copy that value into each
-- of the three new keys, then drop the old combined key.
--
-- Rows without a "mouth_nose_throat" key are left untouched (the concatenation
-- of the three "set" operations is a no-op when the source key is absent, and
-- the trailing "-" removal only affects the old key when present).

UPDATE panama_certificates
SET physical_exploration =
    (physical_exploration
        || jsonb_build_object('mouth',  physical_exploration -> 'mouth_nose_throat')
        || jsonb_build_object('nose',   physical_exploration -> 'mouth_nose_throat')
        || jsonb_build_object('throat', physical_exploration -> 'mouth_nose_throat'))
    - 'mouth_nose_throat'
WHERE physical_exploration ? 'mouth_nose_throat';
