-- MLC (Maritime Labour Convention) records table
CREATE TABLE mlc_records (
    id                              UUID PRIMARY KEY,
    mlc_id                          VARCHAR(12) UNIQUE,
    created_date                    TIMESTAMP NOT NULL,
    updated_date                    TIMESTAMP NOT NULL,

    -- Personal Information
    last_name                       VARCHAR(255),
    first_name                      VARCHAR(255),
    middle_name                     VARCHAR(255),
    place_of_birth                  VARCHAR(255),
    passport_no                     VARCHAR(255),
    religion                        VARCHAR(255),
    nationality                     VARCHAR(255),
    gender                          VARCHAR(50),
    civil_status                    VARCHAR(50),
    address                         TEXT,
    contact_no                      VARCHAR(255),
    employer                        VARCHAR(255),
    position                        VARCHAR(255),

    -- Additional Seafarer Details
    date_of_birth                   VARCHAR(255),
    age                             VARCHAR(10),
    sirb_no                         VARCHAR(255),
    rank                            VARCHAR(255),
    vessel_name                     VARCHAR(255),
    vessel_type                     VARCHAR(255),
    shipping_company                VARCHAR(255),
    manning_agency                  VARCHAR(255),

    -- Certificate Details
    certificate_type                VARCHAR(50),
    fitness_determination           VARCHAR(50),
    date_of_examination             VARCHAR(255),
    date_issued                     VARCHAR(255),
    valid_until                     VARCHAR(255),
    issuing_authority               VARCHAR(255),
    examining_physician             VARCHAR(255),
    medical_director                VARCHAR(255),
    limitations_remarks             TEXT,

    -- Declaration of the Authorized Physician
    id_documents_checked            VARCHAR(50),
    hearing_meets_standards         VARCHAR(50),
    unaided_hearing_satisfactory    VARCHAR(50),
    visual_acuity_meets_standards   VARCHAR(50),
    colour_vision_meets_standards   VARCHAR(50),
    visual_aids                     JSONB,
    date_colour_vision_test         VARCHAR(255),
    fit_for_lookout                 VARCHAR(50),
    no_limitations                  VARCHAR(50),
    limitations_details             TEXT,
    applicant_condition_risk        VARCHAR(50),

    -- Final Recommendation
    date_initial_peme               VARCHAR(255),
    date_of_fitness                 VARCHAR(255),
    valid_until_date                VARCHAR(255),
    medical_certification_no        VARCHAR(255)
);

-- Sequence for generating MLC business IDs
CREATE SEQUENCE mlc_seq START WITH 1 INCREMENT BY 1;
