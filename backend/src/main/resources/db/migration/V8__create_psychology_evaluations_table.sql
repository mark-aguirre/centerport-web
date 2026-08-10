-- =============================================================================
-- V8: Create psychology_evaluations table and sequence
-- =============================================================================

CREATE TABLE psychology_evaluations (
    id                              UUID PRIMARY KEY,
    eval_id                         VARCHAR(16) UNIQUE,
    seafarer_profile_id             UUID NOT NULL REFERENCES seafarer_profiles(id),
    created_date                    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_date                    TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Patient Information (denormalized)
    date_of_birth                   VARCHAR(20),
    age                             VARCHAR(10),

    -- Examination Details
    date_of_examination             VARCHAR(20),
    psychometrician                 VARCHAR(255),
    psychometrician_license_no      VARCHAR(100),
    psychologist                    VARCHAR(255),
    psychologist_license_no         VARCHAR(100),

    -- Tests Used
    intelligence_test_used          BOOLEAN DEFAULT FALSE,
    intelligence_test_name          VARCHAR(255),
    personal_test_used              BOOLEAN DEFAULT FALSE,
    personal_test_name              VARCHAR(255),
    others_test_used                BOOLEAN DEFAULT FALSE,
    others_test_name                VARCHAR(255),

    -- I. Intellectual Level
    intellectual_level              VARCHAR(50),

    -- II. Personality Traits (1-7 rating scale)
    -- Sense of Responsibility
    trait_perseverance              VARCHAR(5),
    trait_obedience                 VARCHAR(5),
    trait_self_discipline           VARCHAR(5),
    trait_enthusiasm                VARCHAR(5),
    trait_initiative                VARCHAR(5),

    -- Emotional Stability
    trait_withstand_boredom         VARCHAR(5),
    trait_stress_tolerance          VARCHAR(5),
    trait_faces_reality             VARCHAR(5),
    trait_confidence                VARCHAR(5),
    trait_relaxed                   VARCHAR(5),

    -- Objectivity
    trait_tough_mindedness          VARCHAR(5),
    trait_adaptability              VARCHAR(5),
    trait_practicality              VARCHAR(5),

    -- Motivation
    trait_assertiveness             VARCHAR(5),
    trait_independence              VARCHAR(5),
    trait_resourcefulness           VARCHAR(5),

    -- Interpersonal and Personal Adjustment
    trait_teamwork                  VARCHAR(5),
    trait_deference                 VARCHAR(5),
    trait_self_esteem               VARCHAR(5),
    trait_aggressive_tendencies     VARCHAR(5),

    -- Goal Orientation
    trait_goal_orientation          VARCHAR(5),

    -- III. Conclusion/Remarks
    conclusion                      VARCHAR(50),
    remarks                         TEXT
);

-- Index for profile lookups
CREATE INDEX idx_psychology_evaluations_profile_id ON psychology_evaluations(seafarer_profile_id);

-- Sequence for business ID generation (format: PSYCH00000001)
CREATE SEQUENCE psych_seq START 1 INCREMENT 1;
