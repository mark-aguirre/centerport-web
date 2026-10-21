package com.centerport.personnel.assignment;

import com.centerport.personnel.PersonnelRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link PersonnelAssignment}.
 *
 * Provides lookup by the unique (module, role) key used both for upsert
 * semantics in the service and for resolving report-form defaults.
 */
public interface PersonnelAssignmentRepository extends JpaRepository<PersonnelAssignment, UUID> {

    /** Finds the single assignment for a module + role, if one exists. */
    Optional<PersonnelAssignment> findByModuleAndRole(PersonnelModule module, PersonnelRole role);

    /** All assignments for a module (typically 2, one per allowed role). */
    List<PersonnelAssignment> findByModule(PersonnelModule module);

    /**
     * Deletes every default-signatory assignment pointing at the given person.
     * Used when a personnel record is force-deleted: the FK from
     * {@code personnel_assignments} to {@code medical_personnel} has no cascade,
     * so these rows must be cleared first to avoid a constraint violation.
     *
     * @param personnelId the UUID of the personnel being removed
     * @return the number of assignment rows deleted
     */
    @Modifying
    long deleteByPersonnelId(UUID personnelId);
}
