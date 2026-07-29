package com.centerport.visit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link PatientVisit} entities.
 */
public interface PatientVisitRepository extends JpaRepository<PatientVisit, UUID> {

    /**
     * Find all visits for a specific date, ordered by creation time.
     */
    Page<PatientVisit> findByVisitDate(LocalDate visitDate, Pageable pageable);

    /**
     * Find all visits for a specific patient profile.
     */
    Page<PatientVisit> findBySeafarerProfileId(UUID seafarerProfileId, Pageable pageable);
}
