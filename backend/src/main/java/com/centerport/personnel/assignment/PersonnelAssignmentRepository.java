package com.centerport.personnel.assignment;

import com.centerport.personnel.PersonnelRole;
import org.springframework.data.jpa.repository.JpaRepository;

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
}
