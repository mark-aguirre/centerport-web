-- Persist Panama General Information values shown on the certificate form.
ALTER TABLE panama_certificates
    ADD COLUMN department VARCHAR(255),
    ADD COLUMN type_of_ship_details VARCHAR(255);
