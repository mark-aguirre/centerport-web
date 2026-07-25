package com.centerport.medical;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * Spring Data JPA repository for MedicalExam entities.
 */
public interface MedicalExamRepository extends JpaRepository<MedicalExam, UUID> {
}
