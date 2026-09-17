package com.centerport.personnel.assignment;

import com.centerport.common.entity.BaseEntity;
import com.centerport.personnel.MedicalPersonnel;
import com.centerport.personnel.PersonnelRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

/**
 * Assigns a {@link MedicalPersonnel} as the default signatory for a given
 * {@link PersonnelModule} + {@link PersonnelRole} combination.
 *
 * <p>There is exactly one active assignment per (module, role) pair — enforced
 * by a unique constraint — so the system can resolve a single default signatory
 * for each field on a report form. Updating an assignment repoints it to a
 * different person (and records the change in {@code personnel_assignment_audit}).
 *
 * <p>Unlike report signatory fields (which snapshot the name/license as strings),
 * this table holds a real foreign key to {@code medical_personnel}, so the
 * resolved default always reflects the person's current name/license/signature.
 */
@Getter
@Setter
@Entity
@Table(name = "personnel_assignments",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_personnel_assignment_module_role",
                columnNames = {"module", "role"}))
public class PersonnelAssignment extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "module", nullable = false, length = 40)
    private PersonnelModule module;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 40)
    private PersonnelRole role;

    /** The assigned personnel (the resolved default signatory). */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "personnel_id", nullable = false,
            foreignKey = @jakarta.persistence.ForeignKey(name = "fk_assignment_personnel"))
    private MedicalPersonnel personnel;

    /** Username of the administrator who created the assignment. */
    @Column(name = "created_by", updatable = false)
    private String createdBy;

    /** Username of the administrator who last updated the assignment. */
    @Column(name = "updated_by")
    private String updatedBy;
}
