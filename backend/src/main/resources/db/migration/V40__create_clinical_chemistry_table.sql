-- =============================================================================
-- V40: Create clinical_chemistry table
-- =============================================================================
-- Named sets of Clinical Chemistry & Serology/Immunology reference / "normal
-- value" strings maintained by Laboratory staff. Configuration data — no
-- patient link. Each examination keeps an S.I. Unit value and a Conventional
-- Unit value, both stored as free text (e.g. '3.8 - 5.8', '70 - 105').

CREATE TABLE clinical_chemistry (
    id                      UUID PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    created_date            TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_date            TIMESTAMP NOT NULL DEFAULT NOW(),

    fbs_si                  VARCHAR(50),
    fbs_conv                VARCHAR(50),

    bun_si                  VARCHAR(50),
    bun_conv                VARCHAR(50),

    creatinine_si           VARCHAR(50),
    creatinine_conv         VARCHAR(50),

    cholesterol_si          VARCHAR(50),
    cholesterol_conv        VARCHAR(50),

    triglycerides_si        VARCHAR(50),
    triglycerides_conv      VARCHAR(50),

    uric_acid_si            VARCHAR(50),
    uric_acid_conv          VARCHAR(50),

    sgot_si                 VARCHAR(50),
    sgot_conv               VARCHAR(50),

    sgpt_si                 VARCHAR(50),
    sgpt_conv               VARCHAR(50),

    alk_phos_si             VARCHAR(50),
    alk_phos_conv           VARCHAR(50)
);
