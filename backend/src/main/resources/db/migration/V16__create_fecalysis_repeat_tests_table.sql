-- =============================================================================
-- V16: Create fecalysis_repeat_tests table and sequence
-- =============================================================================

CREATE TABLE fecalysis_repeat_tests (
    id                              UUID PRIMARY KEY,
    result_id                       VARCHAR(16) UNIQUE,
    laboratory_report_id            UUID NOT NULL REFERENCES laboratory_reports(id),
    created_date                    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_date                    TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Metadata
    result_date                     VARCHAR(20),
    laboratory_no                   VARCHAR(100),
    med_tech                        VARCHAR(255),
    med_tech_license_no             VARCHAR(100),
    pathologist                     VARCHAR(255),
    pathologist_license_no          VARCHAR(100),
    requested_by                    VARCHAR(255),
    remarks                         VARCHAR(500),

    -- Macroscopic
    fecal_color                     VARCHAR(50),
    fecal_consistency               VARCHAR(50),

    -- Microscopic
    fecal_rbc                       VARCHAR(20),
    fecal_rbc_hpf                   VARCHAR(20),
    fecal_wbc                       VARCHAR(20),
    fecal_wbc_hpf                   VARCHAR(20),
    fecal_others                    VARCHAR(50),

    -- Ova/Parasite & Amoeba
    fecal_ova_parasite              VARCHAR(50),
    fecal_ova_parasite_lpf          VARCHAR(20),
    fecal_amoeba                    VARCHAR(50),
    fecal_amoeba_lpf                VARCHAR(20),

    -- Occult Blood
    fecal_occult_blood              VARCHAR(50)
);

-- Index for laboratory report lookups
CREATE INDEX idx_fecalysis_repeat_tests_report_id ON fecalysis_repeat_tests(laboratory_report_id);

-- Sequence for business ID generation (format: FECL00000001)
CREATE SEQUENCE fecl_seq START 1 INCREMENT 1;
