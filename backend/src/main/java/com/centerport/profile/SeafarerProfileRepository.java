package com.centerport.profile;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * Spring Data JPA repository for SeafarerProfile entities.
 */
public interface SeafarerProfileRepository extends JpaRepository<SeafarerProfile, UUID> {
}
