package com.centerport.panama;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * Spring Data JPA repository for PanamaCertificate entities.
 */
public interface PanamaCertificateRepository extends JpaRepository<PanamaCertificate, UUID> {
}
