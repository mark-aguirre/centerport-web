package com.centerport.personnel.assignment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * Spring Data JPA repository for the append-only
 * {@link PersonnelAssignmentAudit} log.
 */
public interface PersonnelAssignmentAuditRepository extends JpaRepository<PersonnelAssignmentAudit, UUID> {

    /** Audit history for a single module, most recent first. */
    Page<PersonnelAssignmentAudit> findByModuleOrderByChangedAtDesc(PersonnelModule module, Pageable pageable);
}
