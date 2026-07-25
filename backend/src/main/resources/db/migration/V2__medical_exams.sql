-- Medical Exams table
CREATE TABLE medical_exams (
    id                              UUID PRIMARY KEY,
    exam_id                         VARCHAR(12) UNIQUE,
    created_date                    TIMESTAMP NOT NULL,
    updated_date                    TIMESTAMP NOT NULL,

    -- Personal Information
    last_name                       VARCHAR(255),
    first_name                      VARCHAR(255),
    middle_name                     VARCHAR(255),
    place_of_birth                  VARCHAR(255),
    passport_no                     VARCHAR(255),
    religion                        VARCHAR(255),
    nationality                     VARCHAR(255),
    gender                          VARCHAR(50),
    civil_status                    VARCHAR(50),
    address                         TEXT,
    contact_no                      VARCHAR(255),
    employer                        VARCHAR(255),
    position                        VARCHAR(255),
    date_of_birth                   VARCHAR(255),
    age                             VARCHAR(10),

    -- Physical Examination - Vital Signs
    pe_height                       VARCHAR(50),
    pe_bp_systolic                  VARCHAR(50),
    pe_bp_diastolic                 VARCHAR(50),
    pe_pulse_rate                   VARCHAR(50),
    pe_respiration                  VARCHAR(50),
    pe_body_temperature             VARCHAR(50),
    pe_weight                       VARCHAR(50),
    pe_mm_ym                        VARCHAR(50),
    pe_bmi                          VARCHAR(50),
    blood_pressure                  VARCHAR(50),
    bp_classification               VARCHAR(50),
    heart_rate                      VARCHAR(50),
    respiratory_rate                VARCHAR(50),
    temperature                     VARCHAR(50),
    weight                          VARCHAR(50),
    height                          VARCHAR(50),
    bmi                             VARCHAR(50),
    oxygen_saturation               VARCHAR(50),

    -- Vision
    vision_far_od                   VARCHAR(50),
    vision_far_os                   VARCHAR(50),
    vision_near_od                  VARCHAR(50),
    vision_near_os                  VARCHAR(50),
    vision_uncorrected_far_od       VARCHAR(50),
    vision_uncorrected_far_os       VARCHAR(50),
    vision_uncorrected_near_od      VARCHAR(50),
    vision_uncorrected_near_os      VARCHAR(50),
    vision_corrected_far_od         VARCHAR(50),
    vision_corrected_far_os         VARCHAR(50),
    vision_corrected_near_od        VARCHAR(50),
    vision_corrected_near_os        VARCHAR(50),
    vision_color                    VARCHAR(50),
    vision_visual_acuity            VARCHAR(50),
    vision_meets_stcw               VARCHAR(50),
    vision_contact_lenses           VARCHAR(50),
    vision_date_taken               VARCHAR(50),

    -- Audiometry
    audio_hearing_by                VARCHAR(255),
    audio_as_right_1                VARCHAR(50),
    audio_as_right_2                VARCHAR(50),
    audio_as_left_1                 VARCHAR(50),
    audio_as_left_2                 VARCHAR(50),
    audio_ad_right_1                VARCHAR(50),
    audio_ad_right_2                VARCHAR(50),
    audio_ad_left_1                 VARCHAR(50),
    audio_ad_left_2                 VARCHAR(50),
    audio_satisfactory              VARCHAR(50),

    -- Speech
    speech_impaired_hearing         VARCHAR(255),

    -- Condition questions
    condition_aggravated_sea        VARCHAR(255),
    identification_docs_checked     VARCHAR(255),
    fit_for_lookout                 VARCHAR(255),

    -- Physical Examination - Systems
    skin                            VARCHAR(50),
    skin_remarks                    TEXT,
    heent                           VARCHAR(50),
    heent_remarks                   TEXT,
    neck                            VARCHAR(50),
    neck_remarks                    TEXT,
    chest_lungs                     VARCHAR(50),
    chest_lungs_remarks             TEXT,
    cardiovascular                  VARCHAR(50),
    cardiovascular_remarks          TEXT,
    abdomen                         VARCHAR(50),
    abdomen_remarks                 TEXT,
    extremities                     VARCHAR(50),
    extremities_remarks             TEXT,
    neurological                    VARCHAR(50),
    neurological_remarks            TEXT,

    -- JSONB Maps: Findings
    findings_a                      JSONB,
    findings_b                      JSONB,
    findings_c                      JSONB,

    -- Visual Acuity (legacy)
    visual_acuity_right             VARCHAR(50),
    visual_acuity_left              VARCHAR(50),
    visual_acuity_corrected         VARCHAR(50),
    color_vision                    VARCHAR(50),

    -- Questionnaire
    questionnaire                   JSONB,
    questionnaire_comments          TEXT,
    questionnaire_medications_detail TEXT,

    -- Medical History
    medical_history                 JSONB,
    medical_history_others          TEXT,
    consulted_doctor_past           TEXT,
    maintenance_medications         TEXT,
    surgical_history                TEXT,
    family_history                  TEXT,
    allergies                       TEXT,
    current_medications             TEXT,
    smoking_history                 TEXT,
    alcohol_history                 TEXT,

    -- Ancillary Examinations
    xray_no                         VARCHAR(255),
    ancillary_chest_xray            VARCHAR(255),
    ancillary_chest_xray_findings   TEXT,
    ancillary_ecg                   VARCHAR(255),
    ancillary_ecg_findings          TEXT,
    ancillary_cbc                   VARCHAR(255),
    ancillary_cbc_findings          TEXT,
    ancillary_urinalysis            VARCHAR(255),
    ancillary_urinalysis_findings   TEXT,
    ancillary_stool_exam            VARCHAR(255),
    ancillary_stool_exam_findings   TEXT,
    ancillary_hbsag                 VARCHAR(255),
    ancillary_hiv_aids              VARCHAR(255),
    ancillary_pregnancy_test        VARCHAR(255),
    ancillary_rpr                   VARCHAR(255),
    ancillary_rpr_findings          TEXT,
    ancillary_blood_type            VARCHAR(255),
    ancillary_psychological_test    VARCHAR(255),
    ancillary_additional_tests      TEXT,

    -- Laboratory Results
    cbc_result                      VARCHAR(50),
    cbc_remarks                     TEXT,
    urinalysis_result               VARCHAR(50),
    urinalysis_remarks              TEXT,
    blood_chemistry_result          VARCHAR(50),
    blood_chemistry_remarks         TEXT,
    chest_xray_result               VARCHAR(50),
    chest_xray_remarks              TEXT,
    ecg_result                      VARCHAR(50),
    ecg_remarks                     TEXT,
    drug_test_result                VARCHAR(50),
    drug_test_remarks               TEXT,
    hepatitis_b_result              VARCHAR(50),
    hepatitis_b_remarks             TEXT,
    hiv_result                      VARCHAR(50),
    hiv_remarks                     TEXT,
    additional_labs                  TEXT,

    -- Final Recommendation
    recommendation_remarks          TEXT,
    cert_basic_ooh                  VARCHAR(255),
    cert_basic_ooh_findings         TEXT,
    cert_additional_labs            VARCHAR(255),
    cert_additional_labs_findings   TEXT,
    cert_flagpost                   VARCHAR(255),
    cert_flagpost_findings          TEXT,

    -- Fitness
    fitness_deck_services           VARCHAR(255),
    fitness_engine_services         VARCHAR(255),
    fitness_catering_services       VARCHAR(255),
    fitness_other_services          VARCHAR(255),
    visual_aids_required            VARCHAR(255),

    -- Dates and Certification
    date_initial_peme               VARCHAR(255),
    date_of_fitness                 VARCHAR(255),
    valid_until                     VARCHAR(255),
    authorized_physician            VARCHAR(255),
    medical_certification_no        VARCHAR(255),
    medical_director                VARCHAR(255),

    -- Diagnosis
    primary_diagnosis               TEXT,
    secondary_diagnosis             TEXT,
    icd_code                        VARCHAR(255),

    -- Treatment Plan
    treatment_plan                  TEXT,
    medications_prescribed          TEXT,
    follow_up_date                  VARCHAR(255),
    referral_to                     VARCHAR(255),
    consultation_status             VARCHAR(50),

    -- Remarks
    remarks                         TEXT,

    -- Physician
    examining_physician             VARCHAR(255),
    license_no                      VARCHAR(255)
);

-- Sequence for generating MED business IDs
CREATE SEQUENCE med_seq START WITH 1 INCREMENT BY 1;
