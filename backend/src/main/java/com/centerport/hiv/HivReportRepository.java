package com.centerport.hiv;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link HivReport} entities.
 *
 * Provides standard CRUD, paging/sorting via {@link JpaRepository}, and
 * specification-based dynamic filtering via {@link JpaSpecificationExecutor}
 * (used by {@link HivReportService} for keyword search across linked
 * profile fields).
 *
 * @see HivReportService
 */
public interface HivReportRepository extends JpaRepository<HivReport, UUID>,
        JpaSpecificationExecutor<HivReport> {

    /**
     * Finds all HIV reports linked to a specific seafarer profile.
     *
     * @param profileId the seafarer profile UUID
     * @param sort      sorting criteria
     * @return list of HIV reports for the given profile
     */
    List<HivReport> findBySeafarerProfileId(UUID profileId, Sort sort);
}
