package com.centerport.mlc;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * Spring Data JPA repository for MlcRecord entities.
 */
public interface MlcRecordRepository extends JpaRepository<MlcRecord, UUID> {
}
