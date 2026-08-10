package com.centerport.laboratory.repeattest;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link ChemistryRepeatTest} entities.
 *
 * Provides standard CRUD and paging/sorting. Repeat tests are always
 * queried in the context of their parent {@link com.centerport.laboratory.LaboratoryReport}.
 *
 * @see ChemistryRepeatTestService
 */
public interface ChemistryRepeatTestRepository extends JpaRepository<ChemistryRepeatTest, UUID> {

    /**
     * Finds all chemistry repeat tests linked to a specific laboratory report.
     *
     * @param laboratoryReportId the parent laboratory report UUID
     * @param sort               sorting criteria
     * @return list of repeat tests for the given report
     */
    List<ChemistryRepeatTest> findByLaboratoryReportId(UUID laboratoryReportId, Sort sort);
}
