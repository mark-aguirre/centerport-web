package com.centerport.xray;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link XrayReport} entities.
 *
 * Provides standard CRUD, paging/sorting via {@link JpaRepository}, and
 * specification-based dynamic filtering via {@link JpaSpecificationExecutor}
 * (used by {@link XrayReportService} for keyword search across linked
 * profile fields).
 *
 * @see XrayReportService
 */
public interface XrayReportRepository extends JpaRepository<XrayReport, UUID>,
        JpaSpecificationExecutor<XrayReport> {

    /**
     * Finds all x-ray reports linked to a specific seafarer profile.
     *
     * @param profileId the seafarer profile UUID
     * @param sort      sorting criteria
     * @return list of x-ray reports for the given profile
     */
    List<XrayReport> findBySeafarerProfileId(UUID profileId, Sort sort);
}
