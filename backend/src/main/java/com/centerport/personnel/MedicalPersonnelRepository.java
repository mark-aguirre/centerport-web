package com.centerport.personnel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link MedicalPersonnel} entities.
 *
 * Inherits standard CRUD, paging/sorting, and specification-based filtering
 * from {@link JpaRepository} and {@link JpaSpecificationExecutor}.
 *
 * @see MedicalPersonnelService consumer of this repository
 */
public interface MedicalPersonnelRepository extends JpaRepository<MedicalPersonnel, UUID>,
        JpaSpecificationExecutor<MedicalPersonnel> {

    /**
     * Finds all active personnel holding the given role, ordered by name for a
     * stable, deterministic pick. Used to resolve a module's default signatory
     * when no explicit assignment exists.
     *
     * @param role the role to match
     * @return active personnel with that role, name-ascending (may be empty)
     */
    List<MedicalPersonnel> findByRoleAndActiveTrueOrderByNameAsc(PersonnelRole role);
}
