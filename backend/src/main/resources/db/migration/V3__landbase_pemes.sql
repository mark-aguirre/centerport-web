-- Landbase PEME (Pre-Employment Medical Examination) table
CREATE TABLE landbase_pemes (
    id                          UUID PRIMARY KEY,
    peme_id                     VARCHAR(12) UNIQUE,
    created_date                TIMESTAMP NOT NULL,
    updated_date                TIMESTAMP NOT NULL,

    -- Personal Information
    last_name                   VARCHAR(255),
    first_name                  VARCHAR(255),
    middle_name                 VARCHAR(255),
    place_of_birth              VARCHAR(255),
    passport_no                 VARCHAR(255),
    religion                    VARCHAR(255),
    nationality                 VARCHAR(255),
    gender                      VARCHAR(50),
    civil_status                VARCHAR(50),
    address                     TEXT,
    contact_no                  VARCHAR(255),
    employer                    VARCHAR(255),
    position                    VARCHAR(255),

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
    medical_director            VARCHAR(255)
);

-- Sequence for generating PEME business IDs
CREATE SEQUENCE peme_seq START WITH 1 INCREMENT BY 1;
