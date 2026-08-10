package com.centerport.panama;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
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

    /**
     * Counts certificates that have lab test data populated (non-null lab_tests JSONB).
     * Each certificate with lab tests represents a completed lab test set.
     *
     * @return count of certificates with lab tests
     */
    @Query("SELECT COUNT(p) FROM PanamaCertificate p WHERE p.labTests IS NOT NULL")
    long countWithLabTests();

    /**
     * Counts certificates created since a given date that have no assessment of fitness yet
     * (pending lab results — certificates where lab tests exist but fitness has not been determined).
     *
     * @param since the start date (inclusive)
     * @return count of pending lab test certificates
     */
    @Query("SELECT COUNT(p) FROM PanamaCertificate p WHERE p.labTests IS NOT NULL AND p.createdDate >= :since AND p.fitnessLookout IS NULL")
    long countPendingLabTests(@Param("since") LocalDateTime since);
}
