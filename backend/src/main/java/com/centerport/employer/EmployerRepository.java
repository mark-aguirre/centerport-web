package com.centerport.employer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link Employer} entities.
 *
 * Inherits standard CRUD, paging/sorting, and specification-based filtering
 * from {@link JpaRepository} and {@link JpaSpecificationExecutor}.
 *
 * @see EmployerService consumer of this repository
 */
public interface EmployerRepository extends JpaRepository<Employer, UUID>,
        JpaSpecificationExecutor<Employer> {
}
