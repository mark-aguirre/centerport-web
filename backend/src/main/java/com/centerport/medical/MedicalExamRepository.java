package com.centerport.medical;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link MedicalExam} entities.
 *
 * Provides standard CRUD, paging/sorting, and specification-based filtering.
 *
 * @see MedicalExam
 * @see MedicalExamService
 */
public interface MedicalExamRepository extends JpaRepository<MedicalExam, UUID>,
        JpaSpecificationExecutor<MedicalExam> {

    /**
     * Finds all medical exam records linked to a specific seafarer profile.
     *
     * @param profileId the seafarer profile UUID
     * @param sort      sorting criteria
     * @return list of medical exams for the given profile
     */
    List<MedicalExam> findBySeafarerProfileId(UUID profileId, Sort sort);

    /**
     * Counts medical exams created on or after the given date.
     *
     * @param since the start date (inclusive)
     * @return count of records created since that date
     */
    @Query("SELECT COUNT(e) FROM MedicalExam e WHERE e.createdDate >= :since")
    long countCreatedSince(@Param("since") LocalDateTime since);
}
