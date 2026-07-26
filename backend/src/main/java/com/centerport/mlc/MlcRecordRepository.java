package com.centerport.mlc;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

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
}
