package com.centerport.profile;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link SeafarerProfile} entities.
 *
 * Inherits standard CRUD and paging/sorting operations from
 * {@link org.springframework.data.jpa.repository.JpaRepository}.
 *
 * @see SeafarerProfileService consumer of this repository
 */
public interface SeafarerProfileRepository extends JpaRepository<SeafarerProfile, UUID> {
}
