-- =============================================================================
-- V44: Create xray_reports table and sequence
-- =============================================================================

CREATE TABLE xray_reports (
    id                              UUID PRIMARY KEY,
    report_id                       VARCHAR(16) UNIQUE,
    seafarer_profile_id             UUID NOT NULL REFERENCES seafarer_profiles(id),
    created_date                    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_date                    TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Report Header
    result_date                     VARCHAR(20),
    xray_tech                       VARCHAR(255),
    xray_tech_license_no            VARCHAR(100),
    radiologist                     VARCHAR(255),
    radiologist_license_no          VARCHAR(100),

    -- ==========================================================================
    -- X-RAY RESULT
    -- ==========================================================================
    xray_no                         VARCHAR(100),
    radiology_findings              TEXT,
    impression                      TEXT
);

-- Index for profile lookups
CREATE INDEX idx_xray_reports_profile_id ON xray_reports(seafarer_profile_id);

-- Sequence for business ID generation (format: XRAY00000001)
CREATE SEQUENCE xray_seq START 1 INCREMENT 1;
