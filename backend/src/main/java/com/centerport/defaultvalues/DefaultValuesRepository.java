package com.centerport.defaultvalues;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link DefaultValues} entities.
 *
 * Inherits standard CRUD, paging/sorting, and specification-based filtering
 * from {@link JpaRepository} and {@link JpaSpecificationExecutor}.
 *
 * @see DefaultValuesService consumer of this repository
 */
public interface DefaultValuesRepository extends JpaRepository<DefaultValues, UUID>,
        JpaSpecificationExecutor<DefaultValues> {
}
