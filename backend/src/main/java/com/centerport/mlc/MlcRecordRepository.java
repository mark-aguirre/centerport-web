package com.centerport.mlc;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
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

    /**
     * Counts distinct vessel names across all MLC records.
     *
     * @return the number of unique vessels
     */
    @Query("SELECT COUNT(DISTINCT m.vesselName) FROM MlcRecord m WHERE m.vesselName IS NOT NULL")
    long countDistinctVessels();

    /**
     * Counts distinct vessel names with recently created MLC records.
     *
     * Approximates "in port" vessels by filtering to records created on or after
     * the given date.
     *
     * @param since the start date (inclusive)
     * @return count of distinct vessels with records created since that date
     */
    @Query("SELECT COUNT(DISTINCT m.vesselName) FROM MlcRecord m WHERE m.vesselName IS NOT NULL AND m.createdDate >= :since")
    long countDistinctVesselsCreatedSince(@Param("since") LocalDateTime since);
}
