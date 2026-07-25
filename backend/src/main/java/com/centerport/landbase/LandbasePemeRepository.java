package com.centerport.landbase;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * Spring Data JPA repository for LandbasePeme entities.
 */
public interface LandbasePemeRepository extends JpaRepository<LandbasePeme, UUID> {
}
