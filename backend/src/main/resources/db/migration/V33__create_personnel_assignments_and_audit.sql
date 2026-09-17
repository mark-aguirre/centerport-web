-- ============================================================================
-- V33: Personnel module/role assignments + assignment audit log
-- ============================================================================
-- personnel_assignments: one active default signatory per (module, role).
--   Enforced unique on (module, role); FK to medical_personnel keeps the
--   resolved default in sync with the person's current name/license/signature.
--
-- personnel_assignment_audit: append-only history of assignment changes
--   (who / when / module / role / previous -> new personnel).
-- ============================================================================

CREATE TABLE personnel_assignments (
    id            UUID PRIMARY KEY,
    module        VARCHAR(40) NOT NULL,
    role          VARCHAR(40) NOT NULL,
    personnel_id  UUID NOT NULL,
    created_by    VARCHAR(255),
    updated_by    VARCHAR(255),
    created_date  TIMESTAMP NOT NULL,
    updated_date  TIMESTAMP NOT NULL,
    CONSTRAINT uq_personnel_assignment_module_role UNIQUE (module, role),
    CONSTRAINT fk_assignment_personnel FOREIGN KEY (personnel_id)
        REFERENCES medical_personnel (id)
);

CREATE INDEX idx_personnel_assignments_module ON personnel_assignments (module);
CREATE INDEX idx_personnel_assignments_personnel ON personnel_assignments (personnel_id);

CREATE TABLE personnel_assignment_audit (
    id                       UUID PRIMARY KEY,
    module                   VARCHAR(40)  NOT NULL,
    role                     VARCHAR(40)  NOT NULL,
    action                   VARCHAR(20)  NOT NULL,
    previous_personnel_id    UUID,
    previous_personnel_name  VARCHAR(255),
    new_personnel_id         UUID         NOT NULL,
    new_personnel_name       VARCHAR(255) NOT NULL,
    changed_by               VARCHAR(255) NOT NULL,
    changed_at               TIMESTAMP    NOT NULL
);

CREATE INDEX idx_assignment_audit_module ON personnel_assignment_audit (module);
CREATE INDEX idx_assignment_audit_changed_at ON personnel_assignment_audit (changed_at);
