-- =============================================================================
-- V7: Add Physical Examination fields to landbase_pemes
-- Covers Section II of the Detailed Medical Examination Report:
--   - Vital Signs (weight, height, BMI, pulse rate, BP, respiration, body temp)
--   - Vision Acuity (far/near vision, Ishihara color)
--   - Hearing Audiometry
--   - Physical Exploration (columns A, B, C with findings)
-- =============================================================================

ALTER TABLE landbase_pemes

    -- DOH / Certificate identifiers
    ADD COLUMN doh_accreditation_no     VARCHAR(255),
    ADD COLUMN ref_no                   VARCHAR(255),

    -- Vital Signs
    ADD COLUMN pe_weight                VARCHAR(50),
    ADD COLUMN pe_height                VARCHAR(50),
    ADD COLUMN pe_bmi                   VARCHAR(50),
    ADD COLUMN pe_pulse_rate            VARCHAR(50),
    ADD COLUMN pe_blood_pressure        VARCHAR(50),
    ADD COLUMN pe_respiration           VARCHAR(50),
    ADD COLUMN pe_body_temperature      VARCHAR(50),

    -- Vision Acuity - Far Vision
    ADD COLUMN vision_far_od_uncorrected    VARCHAR(50),
    ADD COLUMN vision_far_os_uncorrected    VARCHAR(50),
    ADD COLUMN vision_far_od_corrected      VARCHAR(50),
    ADD COLUMN vision_far_os_corrected      VARCHAR(50),

    -- Vision Acuity - Near Vision
    ADD COLUMN vision_near_od_uncorrected   VARCHAR(50),
    ADD COLUMN vision_near_os_uncorrected   VARCHAR(50),
    ADD COLUMN vision_near_od_corrected     VARCHAR(50),
    ADD COLUMN vision_near_os_corrected     VARCHAR(50),

    -- Ishihara Color Vision
    ADD COLUMN vision_color_adequate    BOOLEAN DEFAULT TRUE,

    -- Hearing Audiometry
    ADD COLUMN hearing_ad               VARCHAR(255),
    ADD COLUMN hearing_as               VARCHAR(255),

    -- Physical Exploration - Column A
    ADD COLUMN pe_skin                  VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_skin_findings         TEXT,
    ADD COLUMN pe_head_scalp            VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_head_scalp_findings   TEXT,
    ADD COLUMN pe_eyes_external         VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_eyes_external_findings TEXT,
    ADD COLUMN pe_pupils                VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_pupils_findings       TEXT,
    ADD COLUMN pe_ears                  VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_ears_findings         TEXT,
    ADD COLUMN pe_nose_sinuses          VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_nose_sinuses_findings TEXT,
    ADD COLUMN pe_mouth_throat          VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_mouth_throat_findings TEXT,

    -- Physical Exploration - Column B
    ADD COLUMN pe_neck_lymph_nodes      VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_neck_lymph_nodes_findings TEXT,
    ADD COLUMN pe_breast_axilla         VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_breast_axilla_findings TEXT,
    ADD COLUMN pe_chest_lungs           VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_chest_lungs_findings  TEXT,
    ADD COLUMN pe_heart                 VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_heart_findings        TEXT,
    ADD COLUMN pe_abdomen               VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_abdomen_findings      TEXT,
    ADD COLUMN pe_back                  VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_back_findings         TEXT,

    -- Physical Exploration - Column C
    ADD COLUMN pe_anus_rectum           VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_anus_rectum_findings  TEXT,
    ADD COLUMN pe_genito_urinary        VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_genito_urinary_findings TEXT,
    ADD COLUMN pe_inguinals_genitals    VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_inguinals_genitals_findings TEXT,
    ADD COLUMN pe_extremities           VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_extremities_findings  TEXT,
    ADD COLUMN pe_reflexes              VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_reflexes_findings     TEXT,
    ADD COLUMN pe_dental                VARCHAR(50) DEFAULT 'NORMAL',
    ADD COLUMN pe_dental_findings       TEXT;
