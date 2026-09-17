package com.centerport.personnel.assignment;

import com.centerport.personnel.PersonnelRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Immutable audit record of a single change to a {@link PersonnelAssignment}.
 *
 * <p>One row is written every time an assignment is created or repointed,
 * capturing who made the change, when, the module/role affected, and the
 * previous and new assigned personnel (by id and by display name for
 * human-readable history even if a person is later renamed or removed).
 *
 * <p>This is an append-only log and deliberately does not extend
 * {@code BaseEntity}: it has no {@code updatedDate} because rows are never
 * modified after insertion.
 */
@Getter
@Setter
@Entity
@Table(name = "personnel_assignment_audit")
public class PersonnelAssignmentAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "module", nullable = false, length = 40)
    private PersonnelModule module;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 40)
    private PersonnelRole role;

    /** Type of change: CREATED or UPDATED. */
    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false, length = 20)
    private PersonnelAssignmentAuditAction action;

    /** Previously assigned personnel id (null on first assignment). */
    @Column(name = "previous_personnel_id")
    private UUID previousPersonnelId;

    /** Previously assigned personnel display name (null on first assignment). */
    @Column(name = "previous_personnel_name")
    private String previousPersonnelName;

    /** Newly assigned personnel id. */
    @Column(name = "new_personnel_id", nullable = false)
    private UUID newPersonnelId;

    /** Newly assigned personnel display name. */
    @Column(name = "new_personnel_name", nullable = false)
    private String newPersonnelName;

    /** Username of the administrator who performed the change. */
    @Column(name = "changed_by", nullable = false)
    private String changedBy;

    /** When the change occurred. */
    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    /** The kind of change captured by an audit row. */
    public enum PersonnelAssignmentAuditAction {
        CREATED,
        UPDATED
    }
}
