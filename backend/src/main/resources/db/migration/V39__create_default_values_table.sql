-- =============================================================================
-- V39: Create default_values table
-- =============================================================================
-- Named sets of laboratory (hematology) reference / "normal value" strings
-- maintained by Laboratory staff. Configuration data — no patient link.
-- Range values (e.g. '11-17', '150,000-450,000') are stored as free text.

CREATE TABLE default_values (
    id              UUID PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    created_date    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_date    TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Left column — primary hematology values
    hemoglobin      VARCHAR(50),
    hematocrit      VARCHAR(50),
    rbc_count       VARCHAR(50),
    wbc_count       VARCHAR(50),
    platelet        VARCHAR(50),
    blood_type      VARCHAR(50),
    esr_male        VARCHAR(50),
    esr_female      VARCHAR(50),

    -- Middle column — differential count (percentages)
    lymphocytes     VARCHAR(50),
    segmenters      VARCHAR(50),
    eosinophils     VARCHAR(50),
    monocytes       VARCHAR(50),
    myelocytes      VARCHAR(50),
    juveniles       VARCHAR(50),

    -- Right column — additional differential (percentages)
    stab_cells      VARCHAR(50),
    basophils       VARCHAR(50),
    others          VARCHAR(50)
);
