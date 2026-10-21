-- =============================================================================
-- V37: Create hiv_reports table and sequence
-- =============================================================================

CREATE TABLE hiv_reports (
    id                              UUID PRIMARY KEY,
    report_id                       VARCHAR(16) UNIQUE,
    seafarer_profile_id             UUID NOT NULL REFERENCES seafarer_profiles(id),
    created_date                    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_date                    TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Report Header
    med_tech                        VARCHAR(255),
    hiv_proficiency_cert_no         VARCHAR(100),
    pathologist                     VARCHAR(255),
    pathologist_license_no          VARCHAR(100),
    examining_physician             VARCHAR(255),
    physician_license_no            VARCHAR(100),
    result_date                     VARCHAR(20),
    expire_date                     VARCHAR(20),

    -- ==========================================================================
    -- HIV (HIV-1) SCREEN TEST
    -- ==========================================================================
    test_rapid                      BOOLEAN,
    test_particle_agglutination     BOOLEAN,
    test_eia_cma_elfa               BOOLEAN,
    test_others                     VARCHAR(255),
    result                          VARCHAR(20)
);

-- Index for profile lookups
CREATE INDEX idx_hiv_reports_profile_id ON hiv_reports(seafarer_profile_id);

-- Sequence for business ID generation (format: HIV00000001)
CREATE SEQUENCE hiv_seq START 1 INCREMENT 1;
