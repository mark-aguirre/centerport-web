package com.centerport.clinicalchemistry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link ClinicalChemistry} entities.
 *
 * Inherits standard CRUD, paging/sorting, and specification-based filtering
 * from {@link JpaRepository} and {@link JpaSpecificationExecutor}.
 *
 * @see ClinicalChemistryService consumer of this repository
 */
public interface ClinicalChemistryRepository extends JpaRepository<ClinicalChemistry, UUID>,
        JpaSpecificationExecutor<ClinicalChemistry> {
}
