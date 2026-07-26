package com.centerport.panama;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

/**
 * Spring Data JPA repository for {@link PanamaCertificate} entities.
 *
 * Provides standard CRUD, paging/sorting, and specification-based filtering.
 *
 * @see PanamaCertificate
 * @see PanamaCertificateService
 */
public interface PanamaCertificateRepository extends JpaRepository<PanamaCertificate, UUID>,
        JpaSpecificationExecutor<PanamaCertificate> {
}
