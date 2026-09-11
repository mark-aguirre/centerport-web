-- ============================================================================
-- V30: Create employers table
-- ============================================================================
-- Master/reference table for manning-agencies / employers used to populate the
-- employer selection field across profile and visit registration forms.
-- Previously these values lived as a hardcoded array in the frontend
-- (lib/suggestions.ts EMPLOYERS); they are now sourced from the database.
-- ============================================================================

CREATE TABLE employers (
    id            UUID PRIMARY KEY,
    employer_id   VARCHAR(12) UNIQUE,
    name          VARCHAR(255) NOT NULL,
    active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_date  TIMESTAMP NOT NULL,
    updated_date  TIMESTAMP NOT NULL
);

-- Business ID sequence
CREATE SEQUENCE empl_seq START WITH 1 INCREMENT BY 1;

-- Search / uniqueness indexes
CREATE UNIQUE INDEX idx_employers_name ON employers (LOWER(name));
CREATE INDEX idx_employers_active ON employers (active);

-- ============================================================================
-- Seed data: migrated from the frontend EMPLOYERS array
-- ============================================================================
INSERT INTO employers (id, employer_id, name, active, created_date, updated_date)
VALUES
    (gen_random_uuid(), 'EMPL00000001', 'Magsaysay Maritime',                     TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000002', 'NYK-Fil Ship Management',                TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000003', 'Marlow Navigation',                      TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000004', 'Anglo-Eastern',                          TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000005', 'V.Ships',                                TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000006', 'BSM (Bernhard Schulte Shipmanagement)',  TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000007', 'Döhle Seafront',                         TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000008', 'OSM Maritime',                           TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000009', 'Synergy Marine',                         TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000010', 'Thome Ship Management',                  TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000011', 'Fleet Management Limited',               TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000012', 'Wilhelmsen Ship Management',             TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000013', 'Columbia Shipmanagement',                TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000014', 'CF Sharp Crew Management',               TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000015', 'Jebsen Maritime',                        TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000016', 'Pacific Basin Shipping',                 TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000017', 'Eastern Pacific Shipping',               TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000018', 'Oceanic Marine Contractors',             TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000019', 'United Philippine Lines',                TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'EMPL00000020', 'Philippine Transmarine Carriers',        TRUE, NOW(), NOW());

-- Update the sequence to start after seed data
ALTER SEQUENCE empl_seq RESTART WITH 21;
