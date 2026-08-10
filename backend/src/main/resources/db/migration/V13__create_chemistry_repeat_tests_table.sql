-- =============================================================================
-- V13: Create chemistry_repeat_tests table and sequence
-- =============================================================================

CREATE TABLE chemistry_repeat_tests (
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

    -- FBS
    fbs_result_si                   VARCHAR(20),
    fbs_result_conv                 VARCHAR(20),
    fbs_high                        BOOLEAN DEFAULT FALSE,

    -- BUN
    bun_result_si                   VARCHAR(20),
    bun_result_conv                 VARCHAR(20),
    bun_high                        BOOLEAN DEFAULT FALSE,

    -- Creatinine
    creatinine_result_si            VARCHAR(20),
    creatinine_result_conv          VARCHAR(20),
    creatinine_high                 BOOLEAN DEFAULT FALSE,

    -- Cholesterol
    cholesterol_result_si           VARCHAR(20),
    cholesterol_result_conv         VARCHAR(20),
    cholesterol_high                BOOLEAN DEFAULT FALSE,

    -- Triglycerides
    triglycerides_result_si         VARCHAR(20),
    triglycerides_result_conv       VARCHAR(20),
    triglycerides_high              BOOLEAN DEFAULT FALSE,

    -- Uric Acid
    uric_acid_result_si             VARCHAR(20),
    uric_acid_result_conv           VARCHAR(20),
    uric_acid_high                  BOOLEAN DEFAULT FALSE,

    -- SGOT
    sgot_result_si                  VARCHAR(20),
    sgot_result_conv                VARCHAR(20),
    sgot_high                       BOOLEAN DEFAULT FALSE,

    -- SGPT
    sgpt_result_si                  VARCHAR(20),
    sgpt_result_conv                VARCHAR(20),
    sgpt_high                       BOOLEAN DEFAULT FALSE,

    -- ALK. PHOS
    alk_phos_result_si              VARCHAR(20),
    alk_phos_result_conv            VARCHAR(20),
    alk_phos_high                   BOOLEAN DEFAULT FALSE,

    -- HbA1c
    hba1c_result                    VARCHAR(20),
    hba1c_high                      BOOLEAN DEFAULT FALSE,

    -- Serology/Immunology
    rpr                             VARCHAR(50),
    hbsag                           VARCHAR(50),
    widal_test                      VARCHAR(50),
    malarial_smear                  VARCHAR(50)
);

-- Index for laboratory report lookups
CREATE INDEX idx_chemistry_repeat_tests_report_id ON chemistry_repeat_tests(laboratory_report_id);

-- Sequence for business ID generation (format: CHEM00000001)
CREATE SEQUENCE chem_repeat_seq START 1 INCREMENT 1;
