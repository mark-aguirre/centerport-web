package com.centerport.panama;

import com.centerport.common.BusinessIdGenerator;
import com.centerport.common.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service layer for Panama certificate CRUD operations.
 *
 * Responsibilities:
 * - Transactional boundary management for all persistence operations
 * - Business-ID generation with prefix {@code PAN} on certificate creation
 * - Enforcement that client-supplied system fields are never persisted
 * - Mapping between entity and DTO via {@link PanamaCertificateMapper}
 *
 * Business ID:
 * Each new certificate receives a unique sequential ID in the format
 * {@code PAN00000001} generated from the PostgreSQL sequence {@code pan_seq}.
 *
 * @see PanamaCertificateRepository
 * @see PanamaCertificateMapper
 * @see com.centerport.common.BusinessIdGenerator
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class PanamaCertificateService {

    private static final String BUSINESS_ID_PREFIX = "PAN";

    private final PanamaCertificateRepository repository;
    private final PanamaCertificateMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;

    // =======================================================================
    // Query Operations
    // =======================================================================

    /**
     * Returns all Panama certificates sorted by creation date descending.
     *
     * @param limit optional cap on the number of results; {@code null} or
     *              non-positive returns all
     * @return list of Panama certificate DTOs, possibly truncated to {@code limit}
     */
    @Transactional(readOnly = true)
    public List<PanamaCertificateDto> findAll(Integer limit) {
        List<PanamaCertificateDto> results = repository
                .findAll(Sort.by(Sort.Direction.DESC, "createdDate"))
                .stream()
                .map(mapper::toDto)
                .toList();

        if (limit != null && limit > 0 && limit < results.size()) {
            log.debug("findAll truncated — total: {}, limit applied: {}", results.size(), limit);
            return results.subList(0, limit);
        }

        log.debug("findAll completed — count: {}", results.size());
        return results;
    }

    /**
     * Finds a Panama certificate by UUID.
     *
     * @param id the certificate's primary key
     * @return the matching Panama certificate DTO
     * @throws NotFoundException if no certificate exists with the given ID
     */
    @Transactional(readOnly = true)
    public PanamaCertificateDto findById(UUID id) {
        PanamaCertificate entity = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Panama certificate not found — id: {}", id);
                    return new NotFoundException("PanamaCertificate", id);
                });
        return mapper.toDto(entity);
    }

    // =======================================================================
    // Mutation Operations
    // =======================================================================

    /**
     * Creates a new Panama certificate.
     *
     * Client-supplied system fields (id, panamaId, createdDate, updatedDate)
     * are cleared before persistence. A business ID is generated server-side.
     *
     * @param dto the Panama certificate data to persist
     * @return the created certificate including server-generated system fields
     */
    public PanamaCertificateDto create(PanamaCertificateDto dto) {
        PanamaCertificate entity = mapper.toEntity(dto);
        clearSystemFields(entity);

        String panamaId = businessIdGenerator.generateId(BUSINESS_ID_PREFIX);
        entity.setPanamaId(panamaId);
        log.debug("Business ID generated — panamaId: {}", panamaId);

        PanamaCertificate saved = repository.save(entity);
        log.info("Panama certificate created — panamaId: {}, id: {}, patient: {}",
                saved.getPanamaId(), saved.getId(), saved.getFullName());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing Panama certificate.
     *
     * Mutable data fields are updated from the DTO; system fields (id, panamaId,
     * createdDate) are preserved. {@code updatedDate} is refreshed automatically
     * via {@link com.centerport.common.BaseEntity#onUpdate()}.
     *
     * @param id  the certificate's primary key
     * @param dto the updated certificate data
     * @return the updated Panama certificate DTO
     * @throws NotFoundException if no certificate exists with the given ID
     */
    public PanamaCertificateDto update(UUID id, PanamaCertificateDto dto) {
        PanamaCertificate existing = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Panama certificate not found for update — id: {}", id);
                    return new NotFoundException("PanamaCertificate", id);
                });

        mapper.updateEntity(dto, existing);

        PanamaCertificate saved = repository.save(existing);
        log.info("Panama certificate updated — panamaId: {}, id: {}",
                saved.getPanamaId(), id);
        return mapper.toDto(saved);
    }

    // =======================================================================
    // Private Helpers
    // =======================================================================

    /**
     * Clears server-managed system fields to prevent client-supplied values
     * from being persisted.
     */
    private void clearSystemFields(PanamaCertificate entity) {
        entity.setId(null);
        entity.setPanamaId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }
}
