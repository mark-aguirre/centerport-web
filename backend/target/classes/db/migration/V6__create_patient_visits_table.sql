-- =============================================================================
-- Patient Visits table
-- Tracks each clinic visit linked to a seafarer profile.
-- =============================================================================

CREATE TABLE patient_visits (
    id                      UUID PRIMARY KEY,
    visit_id                VARCHAR(12) UNIQUE,
    created_date            TIMESTAMP NOT NULL,
    updated_date            TIMESTAMP NOT NULL,
    seafarer_profile_id     UUID NOT NULL,
    purpose_of_visit        TEXT,
    sirb                    VARCHAR(255),
    visit_date              DATE NOT NULL
);

CREATE INDEX idx_patient_visits_visit_date ON patient_visits(visit_date);
CREATE INDEX idx_patient_visits_profile_id ON patient_visits(seafarer_profile_id);

CREATE SEQUENCE vst_seq START WITH 1 INCREMENT BY 1;
