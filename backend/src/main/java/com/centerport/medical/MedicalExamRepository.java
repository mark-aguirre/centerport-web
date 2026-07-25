package com.centerport.medical;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link MedicalExam} entities.
 *
 * Provides standard CRUD and sorting operations. Custom query methods can
 * be added here as the domain evolves (e.g., search by patient name,
 * filter by consultation status, date range queries).
 *
 * @see MedicalExam
 * @see MedicalExamService
 */
public interface MedicalExamRepository extends JpaRepository<MedicalExam, UUID> {
}
