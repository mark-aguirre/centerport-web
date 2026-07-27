package com.centerport.mlc;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA repository for {@link MlcRecord} entities.
 *
 * Provides standard CRUD, paging/sorting, and specification-based filtering.
 *
 * @see MlcRecord
 * @see MlcRecordService
 */
public interface MlcRecordRepository extends JpaRepository<MlcRecord, UUID>,
        JpaSpecificationExecutor<MlcRecord> {

    /**
     * Finds all MLC records linked to a specific seafarer profile.
     *
     * @param profileId the seafarer profile UUID
     * @param sort      sorting criteria
     * @return list of MLC records for the given profile
     */
    List<MlcRecord> findBySeafarerProfileId(UUID profileId, Sort sort);
}
