package com.centerport.visit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
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

    /**
     * Finds the most recent visits for the dashboard activity feed. Ordering and
     * result limit are supplied by the caller via {@code pageable} (e.g.
     * {@code PageRequest.of(0, n, Sort.by(DESC, "createdDate"))}).
     *
     * <p>Unlike the other activity sources, {@link PatientVisit} references its
     * seafarer profile by plain UUID (no JPA association), so the caller resolves
     * the profile separately when building the activity description.
     *
     * @param pageable paging/sort (typically page 0 with the desired limit)
     * @return the requested page of visits as a list
     */
    List<PatientVisit> findBy(Pageable pageable);
}
