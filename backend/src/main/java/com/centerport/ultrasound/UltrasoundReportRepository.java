package com.centerport.ultrasound;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link UltrasoundReport} entities.
 *
 * Provides standard CRUD, paging/sorting via {@link JpaRepository}, and
 * specification-based dynamic filtering via {@link JpaSpecificationExecutor}
 * (used by {@link UltrasoundReportService} for keyword search across linked
 * profile fields).
 *
 * @see UltrasoundReportService
 */
public interface UltrasoundReportRepository extends JpaRepository<UltrasoundReport, UUID>,
        JpaSpecificationExecutor<UltrasoundReport> {

    /**
     * Finds all ultrasound reports linked to a specific seafarer profile.
     *
     * @param profileId the seafarer profile UUID
     * @param sort      sorting criteria
     * @return list of ultrasound reports for the given profile
     */
    List<UltrasoundReport> findBySeafarerProfileId(UUID profileId, Sort sort);
}
