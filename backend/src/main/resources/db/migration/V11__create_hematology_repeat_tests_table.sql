-- =============================================================================
-- V11: Create hematology_repeat_tests table and sequence
-- =============================================================================

CREATE TABLE hematology_repeat_tests (
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

    -- Hematology CBC
    hemoglobin                      VARCHAR(20),
    hemoglobin_normal_min           VARCHAR(20),
    hemoglobin_normal_max           VARCHAR(20),

    hematocrit                      VARCHAR(20),
    hematocrit_normal_min           VARCHAR(20),
    hematocrit_normal_max           VARCHAR(20),

    rbc_count                       VARCHAR(20),
    rbc_count_normal_min            VARCHAR(20),
    rbc_count_normal_max            VARCHAR(20),

    wbc_count                       VARCHAR(20),
    wbc_count_normal_min            VARCHAR(20),
    wbc_count_normal_max            VARCHAR(20),

    platelet                        VARCHAR(20),
    platelet_normal_min             VARCHAR(20),
    platelet_normal_max             VARCHAR(20),

    blood_type                      VARCHAR(10),

    esr                             VARCHAR(20),
    esr_normal_male                 VARCHAR(50),
    esr_normal_female               VARCHAR(50),

    -- Differential Count
    lymphocytes                     VARCHAR(20),
    lymphocytes_normal_min          VARCHAR(20),
    lymphocytes_normal_max          VARCHAR(20),

    segmenters                      VARCHAR(20),
    eosinophils                     VARCHAR(20),
    monocytes                       VARCHAR(20),
    myelocytes                      VARCHAR(20),
    juveniles                       VARCHAR(20),

    stab_cells                      VARCHAR(20),
    stab_cells_normal_min           VARCHAR(20),
    stab_cells_normal_max           VARCHAR(20),

    basophils                       VARCHAR(20),
    others_diff                     VARCHAR(50)
);

-- Index for laboratory report lookups
CREATE INDEX idx_hematology_repeat_tests_report_id ON hematology_repeat_tests(laboratory_report_id);

-- Sequence for business ID generation (format: HEMA11, HEMA12, ...)
CREATE SEQUENCE hema_repeat_seq START 1 INCREMENT 1;
