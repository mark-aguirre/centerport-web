-- Store the specification requested when Panama Covid-19 question 4 is answered Yes.
ALTER TABLE panama_certificates
    ADD COLUMN covid_4_details TEXT;
