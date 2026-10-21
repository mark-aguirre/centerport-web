package com.centerport.immunology;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link ImmunologyReport} entities.
 *
 * Provides standard CRUD, paging/sorting via {@link JpaRepository}, and
 * specification-based dynamic filtering via {@link JpaSpecificationExecutor}
 * (used by {@link ImmunologyReportService} for keyword search across
 * linked profile fields).
 *
 * @see ImmunologyReportService
 */
public interface ImmunologyReportRepository extends JpaRepository<ImmunologyReport, UUID>,
        JpaSpecificationExecutor<ImmunologyReport> {

    /**
     * Finds all immunology reports linked to a specific seafarer profile.
     *
     * @param profileId the seafarer profile UUID
     * @param sort      sorting criteria
     * @return list of immunology reports for the given profile
     */
    List<ImmunologyReport> findBySeafarerProfileId(UUID profileId, Sort sort);
}
