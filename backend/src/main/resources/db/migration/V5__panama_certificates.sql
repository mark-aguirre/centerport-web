-- Panama Medical Certificate table
CREATE TABLE panama_certificates (
    id                                  UUID PRIMARY KEY,
    panama_id                           VARCHAR(12) UNIQUE,
    created_date                        TIMESTAMP NOT NULL,
    updated_date                        TIMESTAMP NOT NULL,

    -- General Information
    full_name                           VARCHAR(255),
    day                                 VARCHAR(10),
    month                               VARCHAR(10),
    year                                VARCHAR(10),
    sex                                 VARCHAR(50),
    rh_typing                           VARCHAR(50),
    passport_seaman_no                  VARCHAR(255),
    home_address                        TEXT,
    department                          VARCHAR(255),
    crew_position                       VARCHAR(255),
    lookout_duties                      VARCHAR(255),
    routine_emergency_duties            TEXT,
    type_of_ship                        VARCHAR(50),
    trade_area                          VARCHAR(50),

    -- Conditions (JSONB map)
    conditions                          JSONB,
    conditions_details                  TEXT,

    -- Additional Questions (37–44)
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
    physician_signature                 TEXT
);

-- Sequence for generating PAN business IDs
CREATE SEQUENCE pan_seq START WITH 1 INCREMENT BY 1;
