package com.centerport.laboratory;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link LaboratoryReport} entities.
 *
 * Provides standard CRUD, paging/sorting via {@link JpaRepository}, and
 * specification-based dynamic filtering via {@link JpaSpecificationExecutor}
 * (used by {@link LaboratoryReportService} for keyword search across
 * linked profile fields).
 *
 * @see LaboratoryReportService
 */
public interface LaboratoryReportRepository extends JpaRepository<LaboratoryReport, UUID>,
        JpaSpecificationExecutor<LaboratoryReport> {

    /**
     * Finds all laboratory reports linked to a specific seafarer profile.
     *
     * @param profileId the seafarer profile UUID
     * @param sort      sorting criteria
     * @return list of laboratory reports for the given profile
     */
    List<LaboratoryReport> findBySeafarerProfileId(UUID profileId, Sort sort);
}
