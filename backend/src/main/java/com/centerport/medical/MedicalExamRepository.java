package com.centerport.medical;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

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
}
