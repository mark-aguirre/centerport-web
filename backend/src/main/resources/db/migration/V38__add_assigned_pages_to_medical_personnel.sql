-- ============================================================================
-- V38: Per-person page assignments for medical_personnel
-- ============================================================================
-- Adds a multi-valued "assigned pages" relationship to medical_personnel,
-- backing the new "Pages" column on the Personnel roster. This is an
-- independent, person-centric assignment and is intentionally SEPARATE from
-- the default-signatory matrix (personnel_assignments, added in V33):
--   * personnel_assignments answers "who is the Laboratory pathologist?"
--   * this table answers "which pages does this person serve on?"
--
-- Pages are stored as upper-snake PersonnelModule codes
-- (LABORATORY, SEABASE, MLC, LANDBASE, PSYCHOLOGY, IMMUNOLOGY). Mapped in JPA
-- via an @ElementCollection on MedicalPersonnel#assignedPages.
-- ============================================================================

CREATE TABLE medical_personnel_assigned_pages (
    personnel_id UUID         NOT NULL REFERENCES medical_personnel (id) ON DELETE CASCADE,
    page         VARCHAR(40)  NOT NULL,
    PRIMARY KEY (personnel_id, page)
);

-- Lookup by page (e.g. "all personnel assigned to IMMUNOLOGY").
CREATE INDEX idx_mp_assigned_pages_page ON medical_personnel_assigned_pages (page);
