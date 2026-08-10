-- =============================================================================
-- V15: Create urinalysis_repeat_tests table and sequence
-- =============================================================================

CREATE TABLE urinalysis_repeat_tests (
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
    urine_color                     VARCHAR(50),
    urine_transparency              VARCHAR(50),

    -- Chemical
    urine_leucocytes                VARCHAR(20),
    urine_nitrite                   VARCHAR(20),
    urine_urobilinogen              VARCHAR(20),
    urine_protein                   VARCHAR(20),
    urine_ph                        VARCHAR(20),
    urine_blood                     VARCHAR(20),
    urine_specific_gravity          VARCHAR(20),
    urine_ketone                    VARCHAR(20),
    urine_bilirubin                 VARCHAR(20),
    urine_glucose                   VARCHAR(20),
    urine_others                    VARCHAR(50),

    -- Microscopic
    urine_rbc                       VARCHAR(20),
    urine_wbc                       VARCHAR(20),
    urine_amorphous_urates          VARCHAR(20),
    urine_amorphous_phosphate       VARCHAR(20),
    urine_epithelial_cells          VARCHAR(20),
    urine_mucus_threads             VARCHAR(20),
    urine_microscopic_others        VARCHAR(50),

    -- Crystals
    urine_uric_acid                 VARCHAR(20),
    urine_calcium_oxalate           VARCHAR(20),
    urine_crystals_others           VARCHAR(50),

    -- Cast
    urine_fine_granular             VARCHAR(20),
    urine_coarse_granular           VARCHAR(20),
    urine_cast_others               VARCHAR(50)
);

-- Index for laboratory report lookups
CREATE INDEX idx_urinalysis_repeat_tests_report_id ON urinalysis_repeat_tests(laboratory_report_id);

-- Sequence for business ID generation (format: URIN00000001)
CREATE SEQUENCE urin_seq START 1 INCREMENT 1;
