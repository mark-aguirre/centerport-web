package com.centerport.profile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link SeafarerProfile} entities.
 *
 * Inherits standard CRUD, paging/sorting, and specification-based filtering
 * from {@link JpaRepository} and {@link JpaSpecificationExecutor}.
 *
 * @see SeafarerProfileService consumer of this repository
 */
public interface SeafarerProfileRepository extends JpaRepository<SeafarerProfile, UUID>,
        JpaSpecificationExecutor<SeafarerProfile> {
}
