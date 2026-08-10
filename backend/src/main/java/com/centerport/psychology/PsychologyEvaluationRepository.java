package com.centerport.psychology;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link PsychologyEvaluation} entities.
 *
 * Provides standard CRUD, paging/sorting, and specification-based filtering.
 *
 * @see PsychologyEvaluation
 * @see PsychologyEvaluationService
 */
public interface PsychologyEvaluationRepository extends JpaRepository<PsychologyEvaluation, UUID>,
        JpaSpecificationExecutor<PsychologyEvaluation> {

    /**
     * Finds all psychology evaluations linked to a specific seafarer profile.
     *
     * @param profileId the seafarer profile UUID
     * @param sort      sorting criteria
     * @return list of evaluations for the given profile
     */
    List<PsychologyEvaluation> findBySeafarerProfileId(UUID profileId, Sort sort);

    /**
     * Counts psychology evaluations created on or after the given date.
     *
     * @param since the start date (inclusive)
     * @return count of records created since that date
     */
    @Query("SELECT COUNT(e) FROM PsychologyEvaluation e WHERE e.createdDate >= :since")
    long countCreatedSince(@Param("since") LocalDateTime since);
}
