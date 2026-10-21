-- =============================================================================
-- V36: Create immunology_reports table and sequence
-- =============================================================================

CREATE TABLE immunology_reports (
    id                              UUID PRIMARY KEY,
    report_id                       VARCHAR(16) UNIQUE,
    seafarer_profile_id             UUID NOT NULL REFERENCES seafarer_profiles(id),
    created_date                    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_date                    TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Report Header
    result_date                     VARCHAR(20),
    med_tech                        VARCHAR(255),
    med_tech_license_no             VARCHAR(100),
    pathologist                     VARCHAR(255),
    pathologist_license_no          VARCHAR(100),
    laboratory_no                   VARCHAR(100),

    -- ==========================================================================
    -- IMMUNOLOGY / SEROLOGY TESTS
    -- ==========================================================================
    psa_reference                   VARCHAR(50),
    psa_result                      VARCHAR(100),

    other_test_name                 VARCHAR(255),
    other_reference                 VARCHAR(100),
    other_result                    VARCHAR(100),

    hbsag_result                    VARCHAR(20),
    rpr_result                      VARCHAR(20),

    anti_hbs_result                 VARCHAR(20),
    anti_hbs_cut_off                VARCHAR(50),
    anti_hbs_result_line            VARCHAR(100)
);

-- Index for profile lookups
CREATE INDEX idx_immunology_reports_profile_id ON immunology_reports(seafarer_profile_id);

-- Sequence for business ID generation (format: IMM00000001)
CREATE SEQUENCE imm_seq START 1 INCREMENT 1;
