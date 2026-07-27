-- =============================================================================
-- CenterPort Database Schema
-- Consolidated migration script
-- =============================================================================

-- =============================================================================
-- 1. SEAFARER PROFILES
-- =============================================================================

CREATE TABLE seafarer_profiles (
    id                          UUID PRIMARY KEY,
    profile_id                  VARCHAR(12) UNIQUE,
    created_date                TIMESTAMP NOT NULL,
    updated_date                TIMESTAMP NOT NULL,
    created_by                  VARCHAR(255),
    photo_url                   TEXT,
    last_name                   VARCHAR(255),
    first_name                  VARCHAR(255),
    middle_name                 VARCHAR(255),
    address                     TEXT,
    city                        VARCHAR(255),
    contact_no                  VARCHAR(255),
    birthdate                   VARCHAR(255),
    age                         VARCHAR(10),
    gender                      VARCHAR(50),
    marital_status              VARCHAR(50),
    place_of_birth              VARCHAR(255),
    religion                    VARCHAR(255),
    nationality                 VARCHAR(255),
    country                     VARCHAR(255),
    employer                    VARCHAR(255),
    designation                 VARCHAR(255),
    passport_no                 VARCHAR(255),
    seamans_book_no             VARCHAR(255),
    position                    VARCHAR(255),
    country_of_destination      VARCHAR(255),
    father_name                 VARCHAR(255),
    father_occupation           VARCHAR(255),
    mother_name                 VARCHAR(255),
    mother_occupation           VARCHAR(255),
    no_of_brothers              VARCHAR(10),
    no_of_sisters               VARCHAR(10),
    birth_order                 VARCHAR(10),
    spouse_name                 VARCHAR(255),
    spouse_occupation           VARCHAR(255),
    no_of_children              VARCHAR(10),
    elementary                  VARCHAR(255),
    high_school                 VARCHAR(255),
    college_university          VARCHAR(255),
    course                      VARCHAR(255),
    highest_level_attended      VARCHAR(255),
    prev_date_started           VARCHAR(255),
    prev_date_end               VARCHAR(255),
    prev_length_of_stay         VARCHAR(255),
    prev_company                VARCHAR(255),
    prev_position               VARCHAR(255),
    prev_reason_of_leaving      TEXT,
    remark                      TEXT
);

CREATE SEQUENCE cmsi_seq START WITH 1 INCREMENT BY 1;

-- =============================================================================
-- 2. MEDICAL EXAMS
-- =============================================================================

CREATE TABLE medical_exams (
    id                              UUID PRIMARY KEY,
    exam_id                         VARCHAR(12) UNIQUE,
    created_date                    TIMESTAMP NOT NULL,
    updated_date                    TIMESTAMP NOT NULL,

    -- FK to seafarer profile
    seafarer_profile_id             UUID NOT NULL,

    -- Additional personal fields specific to exam
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
    license_no                      VARCHAR(255),

    -- Foreign Key
    CONSTRAINT fk_medical_exam_seafarer_profile
        FOREIGN KEY (seafarer_profile_id) REFERENCES seafarer_profiles(id)
);

CREATE INDEX idx_medical_exams_seafarer_profile_id ON medical_exams(seafarer_profile_id);
CREATE SEQUENCE med_seq START WITH 1 INCREMENT BY 1;

-- =============================================================================
-- 3. LANDBASE PEME (Pre-Employment Medical Examination)
-- =============================================================================

CREATE TABLE landbase_pemes (
    id                          UUID PRIMARY KEY,
    peme_id                     VARCHAR(12) UNIQUE,
    created_date                TIMESTAMP NOT NULL,
    updated_date                TIMESTAMP NOT NULL,

    -- FK to seafarer profile
    seafarer_profile_id         UUID NOT NULL,

    -- Past Medical History
    medical_history             JSONB,
    medical_history_others      TEXT,
    consulted_doctor            BOOLEAN,
    maintenance_medications     TEXT,

    -- Questionnaire
    questionnaire_1             VARCHAR(50),
    questionnaire_2             VARCHAR(50),
    questionnaire_3             VARCHAR(50),
    questionnaire_4             VARCHAR(50),
    questionnaire_5             VARCHAR(50),
    questionnaire_6             VARCHAR(50),
    questionnaire_7             VARCHAR(50),
    questionnaire_comments      TEXT,
    questionnaire_8             VARCHAR(50),
    questionnaire_8_details     TEXT,

    -- Ancillary Examinations
    xray_no                     VARCHAR(255),
    chest_xray                  VARCHAR(50),
    cbc                         VARCHAR(50),
    cec                         VARCHAR(50),
    pregnancy_test              VARCHAR(50),
    urinalysis                  VARCHAR(50),
    stool_exam                  VARCHAR(50),
    hbsag                       VARCHAR(50),
    hiv_aids_test               VARCHAR(50),
    apb                         VARCHAR(50),
    blood_type                  VARCHAR(50),
    drug_test                   VARCHAR(50),
    psychological_test          VARCHAR(50),
    additional_tests            TEXT,

    -- Remarks
    remarks                     TEXT,

    -- Results
    basic_peme_result           VARCHAR(50),
    additional_lab_result       VARCHAR(50),
    flag_medical_lab_result     VARCHAR(50),

    -- Recommendation
    recommendation              VARCHAR(50),
    date_initial_peme           VARCHAR(255),
    date_of_fitness             VARCHAR(255),
    valid_until                 VARCHAR(255),
    authorized_physician        VARCHAR(255),
    medical_certification_no    VARCHAR(255),
    medical_director            VARCHAR(255),

    -- Foreign Key
    CONSTRAINT fk_landbase_peme_seafarer_profile
        FOREIGN KEY (seafarer_profile_id) REFERENCES seafarer_profiles(id)
);

CREATE INDEX idx_landbase_pemes_seafarer_profile_id ON landbase_pemes(seafarer_profile_id);
CREATE SEQUENCE peme_seq START WITH 1 INCREMENT BY 1;

-- =============================================================================
-- 4. MLC RECORDS (Maritime Labour Convention)
-- =============================================================================

CREATE TABLE mlc_records (
    id                              UUID PRIMARY KEY,
    mlc_id                          VARCHAR(12) UNIQUE,
    created_date                    TIMESTAMP NOT NULL,
    updated_date                    TIMESTAMP NOT NULL,

    -- FK to seafarer profile
    seafarer_profile_id             UUID NOT NULL,

    -- Additional Seafarer Details
    date_of_birth                   VARCHAR(255),
    age                             VARCHAR(10),
    sirb_no                         VARCHAR(255),
    rank                            VARCHAR(255),
    vessel_name                     VARCHAR(255),
    vessel_type                     VARCHAR(255),
    shipping_company                VARCHAR(255),
    manning_agency                  VARCHAR(255),

    -- Certificate Details
    certificate_type                VARCHAR(50),
    fitness_determination           VARCHAR(50),
    date_of_examination             VARCHAR(255),
    date_issued                     VARCHAR(255),
    valid_until                     VARCHAR(255),
    issuing_authority               VARCHAR(255),
    examining_physician             VARCHAR(255),
    medical_director                VARCHAR(255),
    limitations_remarks             TEXT,

    -- Declaration of the Authorized Physician
    id_documents_checked            VARCHAR(50),
    hearing_meets_standards         VARCHAR(50),
    unaided_hearing_satisfactory    VARCHAR(50),
    visual_acuity_meets_standards   VARCHAR(50),
    colour_vision_meets_standards   VARCHAR(50),
    visual_aids                     JSONB,
    date_colour_vision_test         VARCHAR(255),
    fit_for_lookout                 VARCHAR(50),
    no_limitations                  VARCHAR(50),
    limitations_details             TEXT,
    applicant_condition_risk        VARCHAR(50),

    -- Final Recommendation
    date_initial_peme               VARCHAR(255),
    date_of_fitness                 VARCHAR(255),
    valid_until_date                VARCHAR(255),
    medical_certification_no        VARCHAR(255),

    -- Foreign Key
    CONSTRAINT fk_mlc_record_seafarer_profile
        FOREIGN KEY (seafarer_profile_id) REFERENCES seafarer_profiles(id)
);

CREATE INDEX idx_mlc_records_seafarer_profile_id ON mlc_records(seafarer_profile_id);
CREATE SEQUENCE mlc_seq START WITH 1 INCREMENT BY 1;

-- =============================================================================
-- 5. PANAMA CERTIFICATES
-- =============================================================================

CREATE TABLE panama_certificates (
    id                                  UUID PRIMARY KEY,
    panama_id                           VARCHAR(12) UNIQUE,
    created_date                        TIMESTAMP NOT NULL,
    updated_date                        TIMESTAMP NOT NULL,

    -- FK to seafarer profile
    seafarer_profile_id                 UUID NOT NULL,

    -- General Information
    day                                 VARCHAR(10),
    month                               VARCHAR(10),
    year                                VARCHAR(10),
    rh_typing                           VARCHAR(50),
    lookout_duties                      VARCHAR(255),
    routine_emergency_duties            TEXT,
    type_of_ship                        VARCHAR(50),
    trade_area                          VARCHAR(50),

    -- Conditions (JSONB map)
    conditions                          JSONB,
    conditions_details                  TEXT,

    -- Additional Questions (37-44)
    question_37                         VARCHAR(50),
    question_38                         VARCHAR(50),
    question_39                         VARCHAR(50),
    question_40                         VARCHAR(50),
    question_41                         VARCHAR(50),
    question_42                         VARCHAR(50),
    question_43                         VARCHAR(50),
    question_44                         VARCHAR(50),
    declaration_comments                TEXT,

    -- Medication Question (45)
    question_45                         VARCHAR(50),
    question_45_details                 TEXT,

    -- Covid-19
    covid_1                             VARCHAR(50),
    covid_2                             VARCHAR(50),
    covid_3_date                        VARCHAR(255),
    covid_4                             VARCHAR(50),
    covid_5                             VARCHAR(50),
    covid_6_vaccine_type                VARCHAR(255),
    covid_6_num_doses                   VARCHAR(50),
    covid_6_boosters                    VARCHAR(50),

    -- Statement
    statement_name                      VARCHAR(255),
    statement_signature                 TEXT,
    statement_day                       VARCHAR(10),
    statement_month                     VARCHAR(10),
    statement_year                      VARCHAR(10),
    statement_witness_name              VARCHAR(255),
    statement_practitioner_name         VARCHAR(255),
    statement_practitioner_signature    TEXT,
    statement_practitioner_date_day     VARCHAR(10),
    statement_practitioner_date_month   VARCHAR(10),
    statement_practitioner_date_year    VARCHAR(10),
    statement_practitioner_witness      VARCHAR(255),
    statement_previous_exam_details     TEXT,

    -- Clinical Data
    height_cm                           VARCHAR(50),
    weight_kg                           VARCHAR(50),
    bmi                                 VARCHAR(50),
    oxygen_saturation                   VARCHAR(50),
    heart_rate                          VARCHAR(50),
    respiratory_rate                    VARCHAR(50),
    blood_pressure_systolic             VARCHAR(50),
    blood_pressure_diastolic            VARCHAR(50),

    -- Sight
    sight_glasses_contact               VARCHAR(255),
    sight_unaided_distant_right         VARCHAR(50),
    sight_unaided_distant_left          VARCHAR(50),
    sight_unaided_distant_binocular     VARCHAR(50),
    sight_unaided_short_right           VARCHAR(50),
    sight_unaided_short_left            VARCHAR(50),
    sight_aided_distant_right           VARCHAR(50),
    sight_aided_distant_left            VARCHAR(50),
    sight_aided_distant_binocular       VARCHAR(50),
    sight_aided_short_right             VARCHAR(50),
    sight_aided_short_left              VARCHAR(50),
    sight_fields_right                  VARCHAR(255),
    sight_fields_left                   VARCHAR(255),
    sight_color_vision                  VARCHAR(255),
    sight_color_method                  VARCHAR(255),

    -- Hearing
    hearing_right_500                   VARCHAR(50),
    hearing_right_1000                  VARCHAR(50),
    hearing_right_2000                  VARCHAR(50),
    hearing_right_3000                  VARCHAR(50),
    hearing_right_4000                  VARCHAR(50),
    hearing_right_6000                  VARCHAR(50),
    hearing_right_8000                  VARCHAR(50),
    hearing_left_500                    VARCHAR(50),
    hearing_left_1000                   VARCHAR(50),
    hearing_left_2000                   VARCHAR(50),
    hearing_left_3000                   VARCHAR(50),
    hearing_left_4000                   VARCHAR(50),
    hearing_left_6000                   VARCHAR(50),
    hearing_left_8000                   VARCHAR(50),

    -- Physical Exploration (JSONB map)
    physical_exploration                JSONB,
    physical_exploration_comments       TEXT,

    -- Laboratory Tests (JSONB maps)
    lab_tests                           JSONB,
    lab_other_tests                     JSONB,
    lab_mandatory_text                  TEXT,

    -- Other Diagnostic Tests
    other_diag_test                     TEXT,
    other_diag_result                   TEXT,
    other_diag_comments                 TEXT,

    -- Fitness
    fitness_lookout                     VARCHAR(255),
    fitness_deck_fit                    BOOLEAN,
    fitness_deck_unfit                  BOOLEAN,
    fitness_engine_fit                  BOOLEAN,
    fitness_engine_unfit                BOOLEAN,
    fitness_catering_fit                BOOLEAN,
    fitness_catering_unfit              BOOLEAN,
    fitness_other_fit                   BOOLEAN,
    fitness_other_unfit                 BOOLEAN,
    fitness_restriction                 VARCHAR(255),
    fitness_restriction_details         TEXT,
    fitness_visual_aid                  VARCHAR(50),
    cert_expiry_day                     VARCHAR(10),
    cert_expiry_month                   VARCHAR(10),
    cert_expiry_year                    VARCHAR(10),
    cert_issued_day                     VARCHAR(10),
    cert_issued_month                   VARCHAR(10),
    cert_issued_year                    VARCHAR(10),
    cert_number                         VARCHAR(255),
    physician_name                      VARCHAR(255),
    physician_signature                 TEXT,

    -- Foreign Key
    CONSTRAINT fk_panama_certificate_seafarer_profile
        FOREIGN KEY (seafarer_profile_id) REFERENCES seafarer_profiles(id)
);

CREATE INDEX idx_panama_certificates_seafarer_profile_id ON panama_certificates(seafarer_profile_id);
CREATE SEQUENCE pan_seq START WITH 1 INCREMENT BY 1;
