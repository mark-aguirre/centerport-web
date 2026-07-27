package com.centerport.panama;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.NotFoundException;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.panama.event.PanamaCertificateCreatedEvent;
import com.centerport.panama.event.PanamaCertificateUpdatedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
 * @see PanamaCertificateRepository
 * @see PanamaCertificateMapper
 * @see BusinessIdGenerator
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PanamaCertificateService {

    private static final String BUSINESS_ID_PREFIX = "PAN";

    private final PanamaCertificateRepository repository;
    private final PanamaCertificateMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;
    private final ApplicationEventPublisher eventPublisher;

    // === Queries ===

    /**
     * Returns paginated Panama certificates.
     *
     * @param pageable pagination and sorting parameters
     * @return paged response of certificate DTOs
     */
    public PagedResponse<PanamaCertificateDto> findAll(Pageable pageable) {
        Page<PanamaCertificate> page = repository.findAll(pageable);
        List<PanamaCertificateDto> content = page.getContent().stream()
                .map(mapper::toDto)
                .toList();
        return PagedResponse.of(content, page);
    }

    /**
     * Finds a Panama certificate by UUID.
     *
     * @param id the certificate's primary key
     * @return the matching Panama certificate DTO
     * @throws NotFoundException if no certificate exists with the given ID
     */
    public PanamaCertificateDto findById(UUID id) {
        PanamaCertificate entity = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Panama certificate not found — id: {}", id);
                    return new NotFoundException("PanamaCertificate", id);
                });
        return mapper.toDto(entity);
    }

    // === Commands ===

    /**
     * Creates a new Panama certificate.
     *
     * @param dto the Panama certificate data to persist
     * @return the created certificate including server-generated system fields
     */
    @Transactional
    public PanamaCertificateDto create(PanamaCertificateDto dto) {
        PanamaCertificate entity = mapper.toEntity(dto);
        clearSystemFields(entity);

        String panamaId = businessIdGenerator.generateId(BUSINESS_ID_PREFIX);
        entity.setPanamaId(panamaId);
        log.debug("Business ID generated — panamaId: {}", panamaId);

        PanamaCertificate saved = repository.save(entity);

        eventPublisher.publishEvent(new PanamaCertificateCreatedEvent(
                saved.getId(), saved.getPanamaId(),
                saved.getSeafarerProfile().getLastName() + " " + saved.getSeafarerProfile().getFirstName()));

        log.info("Panama certificate created — panamaId: {}, id: {}, patient: {}",
                saved.getPanamaId(), saved.getId(),
                saved.getSeafarerProfile().getLastName());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing Panama certificate.
     *
     * @param id  the certificate's primary key
     * @param dto the updated certificate data
     * @return the updated Panama certificate DTO
     * @throws NotFoundException if no certificate exists with the given ID
     */
    @Transactional
    public PanamaCertificateDto update(UUID id, PanamaCertificateDto dto) {
        PanamaCertificate existing = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Panama certificate not found for update — id: {}", id);
                    return new NotFoundException("PanamaCertificate", id);
                });

        mapper.updateEntity(dto, existing);

        PanamaCertificate saved = repository.save(existing);

        eventPublisher.publishEvent(new PanamaCertificateUpdatedEvent(
                saved.getId(), saved.getPanamaId()));

        log.info("Panama certificate updated — panamaId: {}, id: {}",
                saved.getPanamaId(), id);
        return mapper.toDto(saved);
    }

    // === Helpers ===

    private void clearSystemFields(PanamaCertificate entity) {
        entity.setId(null);
        entity.setPanamaId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }
}
