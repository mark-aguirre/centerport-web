package com.centerport.landbase;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link LandbasePeme} entities.
 *
 * Provides standard CRUD, paging/sorting, and specification-based filtering.
 *
 * @see LandbasePeme
 * @see LandbasePemeService
 */
public interface LandbasePemeRepository extends JpaRepository<LandbasePeme, UUID>,
        JpaSpecificationExecutor<LandbasePeme> {
}
