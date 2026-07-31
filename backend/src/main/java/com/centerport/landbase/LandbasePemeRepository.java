package com.centerport.landbase;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
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

    /**
     * Finds all PEME records linked to a specific seafarer profile.
     *
     * @param profileId the seafarer profile UUID
     * @param sort      sorting criteria
     * @return list of PEME records for the given profile
     */
    List<LandbasePeme> findBySeafarerProfileId(UUID profileId, Sort sort);

    /**
     * Finds a PEME record by ID with its associated seafarer profile eagerly fetched.
     * Used by the report service to avoid LazyInitializationException.
     *
     * @param id the PEME UUID
     * @return the PEME with profile loaded, or empty if not found
     */
    @Query("SELECT p FROM LandbasePeme p JOIN FETCH p.seafarerProfile WHERE p.id = :id")
    Optional<LandbasePeme> findWithProfileById(@Param("id") UUID id);
}
