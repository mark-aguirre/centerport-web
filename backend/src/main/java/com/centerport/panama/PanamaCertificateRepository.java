package com.centerport.panama;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
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

    /**
     * Finds all Panama certificates linked to a specific seafarer profile.
     *
     * @param profileId the seafarer profile UUID
     * @param sort      sorting criteria
     * @return list of Panama certificates for the given profile
     */
    List<PanamaCertificate> findBySeafarerProfileId(UUID profileId, Sort sort);
}
