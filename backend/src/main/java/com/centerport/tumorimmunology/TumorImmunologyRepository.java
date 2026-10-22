package com.centerport.tumorimmunology;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link TumorImmunology} entities.
 *
 * Inherits standard CRUD, paging/sorting, and specification-based filtering
 * from {@link JpaRepository} and {@link JpaSpecificationExecutor}.
 *
 * @see TumorImmunologyService consumer of this repository
 */
public interface TumorImmunologyRepository extends JpaRepository<TumorImmunology, UUID>,
        JpaSpecificationExecutor<TumorImmunology> {
}
