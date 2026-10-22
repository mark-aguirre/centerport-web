-- =============================================================================
-- V41: Create tumor_immunology table
-- =============================================================================
-- Named sets of "FORM LAB 33" reference values (Tumor Marker + Immunological
-- Test) maintained by Laboratory staff. Configuration data — no patient link.
-- All values stored as free text (S.I. Unit).

CREATE TABLE tumor_immunology (
    id              UUID PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    created_date    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_date    TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Tumor Marker (unit: ML)
    psa             VARCHAR(50),
    afp             VARCHAR(50),
    tumor_others    VARCHAR(50),

    -- Immunological Test
    anti_hbs        VARCHAR(50),
    anti_hbc_total  VARCHAR(50),
    anti_hcv        VARCHAR(50),
    hbsag           VARCHAR(50),
    immuno_extra    VARCHAR(50),
    immuno_others   VARCHAR(50)
);
