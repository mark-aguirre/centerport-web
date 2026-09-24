-- =============================================================================
-- Resynchronize cmsi_seq with existing seafarer_profiles data.
--
-- Profiles imported by the patient-migration were inserted with explicit
-- profile_id values (format CMSI + 8 digits) taken from the source system,
-- but cmsi_seq was never advanced. As a result the sequence continued to
-- hand out low numbers (CMSI00000001, ...002, ...) that collide with already
-- migrated rows, causing:
--   duplicate key value violates unique constraint "seafarer_profiles_profile_id_key"
--
-- This migration bumps cmsi_seq to one past the highest existing CMSI number
-- so future BusinessIdGenerator.generateId("CMSI") calls produce unused IDs.
--
-- setval(..., n, true) means the *next* nextval() returns n + 1.
-- COALESCE handles an empty/unmigrated table (falls back to the current
-- sequence value so the sequence is never moved backwards).
-- =============================================================================

SELECT setval(
    'cmsi_seq',
    GREATEST(
        COALESCE(
            (SELECT MAX(CAST(SUBSTRING(profile_id FROM 5) AS BIGINT))
             FROM seafarer_profiles
             WHERE profile_id ~ '^CMSI[0-9]+$'),
            0
        ),
        (SELECT last_value FROM cmsi_seq)
    ),
    true
);
