package com.centerport.medical;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link MedicalExam} entities.
 *
 * Provides standard CRUD, paging/sorting, and specification-based filtering.
 * Custom query methods can be added here as the domain evolves (e.g., search
 * by patient name, filter by consultation status, date range queries).
 *
 * @see MedicalExam
 * @see MedicalExamService
 */
public interface MedicalExamRepository extends JpaRepository<MedicalExam, UUID>,
        JpaSpecificationExecutor<MedicalExam> {
}
