package com.centerport.panama;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link PanamaCertificate} entities.
 *
 * Provides standard CRUD and sorting operations. Custom query methods can be
 * added here as the domain grows (e.g., find by panamaId, search by patient
 * name).
 *
 * @see PanamaCertificate
 * @see PanamaCertificateService
 */
public interface PanamaCertificateRepository extends JpaRepository<PanamaCertificate, UUID> {
}
