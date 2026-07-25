package com.centerport.mlc;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link MlcRecord} entities.
 *
 * Provides standard CRUD and pagination operations against the
 * {@code mlc_records} table. No custom query methods are needed at
 * this time — the service layer uses inherited {@code findAll(Sort)}
 * for sorted listing and {@code findById(UUID)} for single-record lookup.
 *
 * @see MlcRecord
 * @see MlcRecordService
 */
public interface MlcRecordRepository extends JpaRepository<MlcRecord, UUID> {
}
