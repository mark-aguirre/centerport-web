-- ============================================================================
-- V32: Extend medical_personnel with structured role, signature, and audit
-- ============================================================================
-- Adds:
--   * role           — structured PersonnelRole (upper-snake code)
--   * signature_url   — URL of an uploaded signature image
--   * created_by      — username of the admin who created the record
--   * updated_by      — username of the admin who last updated the record
-- and backfills `role` from the existing free-text `specialization` values so
-- current personnel become assignable immediately.
-- ============================================================================

ALTER TABLE medical_personnel
    ADD COLUMN role          VARCHAR(40),
    ADD COLUMN signature_url VARCHAR(512),
    ADD COLUMN created_by    VARCHAR(255),
    ADD COLUMN updated_by    VARCHAR(255);

-- Backfill structured role from the legacy free-text specialization.
-- Matching is case-insensitive and tolerant of common variants.
UPDATE medical_personnel SET role = 'MED_TECH'
    WHERE role IS NULL AND (
        LOWER(specialization) LIKE '%med%tech%'
        OR LOWER(specialization) LIKE '%medical technolog%');

UPDATE medical_personnel SET role = 'PATHOLOGIST'
    WHERE role IS NULL AND LOWER(specialization) LIKE '%patholog%';

UPDATE medical_personnel SET role = 'MEDICAL_DIRECTOR'
    WHERE role IS NULL AND LOWER(specialization) LIKE '%director%';

UPDATE medical_personnel SET role = 'PSYCHOMETRICIAN'
    WHERE role IS NULL AND LOWER(specialization) LIKE '%psychometric%';

UPDATE medical_personnel SET role = 'PSYCHOLOGIST'
    WHERE role IS NULL AND LOWER(specialization) LIKE '%psycholog%';

-- Any remaining physicians (generic "Physician" specialization) map to the
-- authorized-physician role used by Seabase/MLC/Landbase.
UPDATE medical_personnel SET role = 'AUTHORIZED_PHYSICIAN'
    WHERE role IS NULL AND LOWER(specialization) LIKE '%physician%';

-- Seed audit columns for existing rows migrated before auditing existed.
UPDATE medical_personnel SET created_by = 'system', updated_by = 'system'
    WHERE created_by IS NULL;

CREATE INDEX idx_medical_personnel_role ON medical_personnel (role);
