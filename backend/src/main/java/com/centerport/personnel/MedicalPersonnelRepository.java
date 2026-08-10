package com.centerport.personnel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

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
}
