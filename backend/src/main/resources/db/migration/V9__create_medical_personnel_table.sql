-- ============================================================================
-- V9: Create medical_personnel table
-- ============================================================================
-- Master table for all licensed medical professionals (doctors, psychologists,
-- psychometricians, physicians, medical directors) used in personnel selection
-- dialogs across the application.
-- ============================================================================

CREATE TABLE medical_personnel (
    id              UUID PRIMARY KEY,
    personnel_id    VARCHAR(12) UNIQUE,
    name            VARCHAR(255) NOT NULL,
    license_no      VARCHAR(50)  NOT NULL,
    specialization  VARCHAR(100),
    title           VARCHAR(50),
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_date    TIMESTAMP NOT NULL,
    updated_date    TIMESTAMP NOT NULL
);

-- Business ID sequence
CREATE SEQUENCE pers_seq START WITH 1 INCREMENT BY 1;

-- Index for search queries
CREATE INDEX idx_medical_personnel_name ON medical_personnel (LOWER(name));
CREATE INDEX idx_medical_personnel_license_no ON medical_personnel (LOWER(license_no));
CREATE INDEX idx_medical_personnel_active ON medical_personnel (active);

-- ============================================================================
-- Seed data: Initial medical personnel records
-- ============================================================================
INSERT INTO medical_personnel (id, personnel_id, name, license_no, specialization, title, active, created_date, updated_date)
VALUES
    (gen_random_uuid(), 'PERS00000001', 'Dr. Juan Dela Cruz',    'PRC-0012345', 'Psychologist',       'Dr.', TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'PERS00000002', 'Dr. Maria Santos',      'PRC-0023456', 'Psychologist',       'Dr.', TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'PERS00000003', 'Dr. Jose Rizal',        'PRC-0034567', 'Psychometrician',    'Dr.', TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'PERS00000004', 'Dr. Ana Reyes',         'PRC-0045678', 'Psychometrician',    'Dr.', TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'PERS00000005', 'Dr. Patricia Garcia',   'PRC-0056789', 'Psychologist',       'Dr.', TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'PERS00000006', 'Dr. Roberto Aquino',    'PRC-0067890', 'Medical Director',   'Dr.', TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'PERS00000007', 'Dr. Carmen Velasco',    'PRC-0078901', 'Physician',          'Dr.', TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'PERS00000008', 'Dr. Miguel Torres',     'PRC-0089012', 'Physician',          'Dr.', TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'PERS00000009', 'Dr. Lourdes Bautista',  'PRC-0090123', 'Psychologist',       'Dr.', TRUE, NOW(), NOW()),
    (gen_random_uuid(), 'PERS00000010', 'Dr. Fernando Reyes',    'PRC-0101234', 'Psychometrician',    'Dr.', TRUE, NOW(), NOW());

-- Update the sequence to start after seed data
ALTER SEQUENCE pers_seq RESTART WITH 11;
