-- =============================================================================
-- V10: Create laboratory_reports table and sequence
-- =============================================================================

CREATE TABLE laboratory_reports (
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
    -- HEMATOLOGY
    -- ==========================================================================
    hematology_result_date          VARCHAR(20),

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
    others_diff                     VARCHAR(50),

    -- ==========================================================================
    -- CLINICAL CHEMISTRY AND SEROLOGY/IMMUNOLOGY
    -- ==========================================================================
    chemistry_result_date           VARCHAR(20),

    -- FBS
    fbs_si                          VARCHAR(20),
    fbs_si_normal                   VARCHAR(30),
    fbs_conv                        VARCHAR(20),
    fbs_result_si                   VARCHAR(20),
    fbs_result_conv                 VARCHAR(20),
    fbs_high                        BOOLEAN,

    -- BUN
    bun_si                          VARCHAR(20),
    bun_si_normal                   VARCHAR(30),
    bun_conv                        VARCHAR(20),
    bun_result_si                   VARCHAR(20),
    bun_result_conv                 VARCHAR(20),
    bun_high                        BOOLEAN,

    -- Creatinine
    creatinine_si                   VARCHAR(20),
    creatinine_si_normal            VARCHAR(30),
    creatinine_conv                 VARCHAR(20),
    creatinine_result_si            VARCHAR(20),
    creatinine_result_conv          VARCHAR(20),
    creatinine_high                 BOOLEAN,

    -- Cholesterol
    cholesterol_si                  VARCHAR(20),
    cholesterol_si_normal           VARCHAR(30),
    cholesterol_conv                VARCHAR(20),
    cholesterol_result_si           VARCHAR(20),
    cholesterol_result_conv         VARCHAR(20),
    cholesterol_high                BOOLEAN,

    -- Triglycerides
    triglycerides_si                VARCHAR(20),
    triglycerides_si_normal         VARCHAR(30),
    triglycerides_conv              VARCHAR(20),
    triglycerides_result_si         VARCHAR(20),
    triglycerides_result_conv       VARCHAR(20),
    triglycerides_high              BOOLEAN,

    -- Uric Acid
    uric_acid_si                    VARCHAR(20),
    uric_acid_si_normal             VARCHAR(30),
    uric_acid_conv                  VARCHAR(20),
    uric_acid_result_si             VARCHAR(20),
    uric_acid_result_conv           VARCHAR(20),
    uric_acid_high                  BOOLEAN,

    -- SGOT
    sgot_si                         VARCHAR(20),
    sgot_result_si                  VARCHAR(20),
    sgot_result_conv                VARCHAR(20),
    sgot_high                       BOOLEAN,

    -- SGPT
    sgpt_si                         VARCHAR(20),
    sgpt_result_si                  VARCHAR(20),
    sgpt_result_conv                VARCHAR(20),
    sgpt_high                       BOOLEAN,

    -- ALK. PHOS
    alk_phos_si                     VARCHAR(20),
    alk_phos_result_si              VARCHAR(20),
    alk_phos_result_conv            VARCHAR(20),
    alk_phos_high                   BOOLEAN,

    -- HbA1c
    hba1c_normal                    VARCHAR(20),
    hba1c_result                    VARCHAR(20),
    hba1c_high                      BOOLEAN,

    -- ==========================================================================
    -- URINALYSIS
    -- ==========================================================================
    urinalysis_result_date          VARCHAR(20),

    -- Macroscopic
    urine_color                     VARCHAR(50),
    urine_transparency              VARCHAR(50),

    -- Chemical
    urine_leucocytes                VARCHAR(50),
    urine_nitrite                   VARCHAR(50),
    urine_urobilinogen              VARCHAR(50),
    urine_protein                   VARCHAR(50),
    urine_ph                        VARCHAR(20),
    urine_blood                     VARCHAR(50),
    urine_specific_gravity          VARCHAR(20),
    urine_ketone                    VARCHAR(50),
    urine_bilirubin                 VARCHAR(50),
    urine_glucose                   VARCHAR(50),
    urine_others                    VARCHAR(100),

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
    urine_cast_others               VARCHAR(50),

    -- ==========================================================================
    -- FECALYSIS
    -- ==========================================================================
    fecalysis_result_date           VARCHAR(20),

    fecal_color                     VARCHAR(50),
    fecal_consistency               VARCHAR(50),

    fecal_rbc                       VARCHAR(50),
    fecal_rbc_hpf                   VARCHAR(20),
    fecal_wbc                       VARCHAR(50),
    fecal_wbc_hpf                   VARCHAR(20),
    fecal_others                    VARCHAR(100),

    fecal_ova_parasite              VARCHAR(100),
    fecal_ova_parasite_lpf          VARCHAR(20),
    fecal_amoeba                    VARCHAR(100),
    fecal_amoeba_lpf                VARCHAR(20),
    fecal_occult_blood              VARCHAR(50)
);

-- Index for profile lookups
CREATE INDEX idx_laboratory_reports_profile_id ON laboratory_reports(seafarer_profile_id);

-- Sequence for business ID generation (format: LAB00000001)
CREATE SEQUENCE lab_seq START 1 INCREMENT 1;
