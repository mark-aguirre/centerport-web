package com.centerport.landbase;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.NotFoundException;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.landbase.event.LandbasePemeCreatedEvent;
import com.centerport.landbase.event.LandbasePemeUpdatedEvent;

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
 * Service layer for LandbasePeme CRUD operations.
 * Manages transactional boundaries, business-ID generation (PEME prefix) on create,
 * and ensures client-supplied system fields are ignored.
 *
 * @see LandbasePemeRepository
 * @see LandbasePemeMapper
 * @see BusinessIdGenerator
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class LandbasePemeService {

    private static final String BUSINESS_ID_PREFIX = "PEME";

    private final LandbasePemeRepository repository;
    private final LandbasePemeMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;
    private final ApplicationEventPublisher eventPublisher;

    // === Queries ===

    /**
     * Returns paginated landbase PEMEs.
     *
     * @param pageable pagination and sorting parameters
     * @return paged response of PEME DTOs
     */
    public PagedResponse<LandbasePemeDto> findAll(Pageable pageable) {
        Page<LandbasePeme> page = repository.findAll(pageable);
        List<LandbasePemeDto> content = page.getContent().stream()
                .map(mapper::toDto)
                .toList();
        return PagedResponse.of(content, page);
    }

    /**
     * Finds a landbase PEME by UUID or throws NotFoundException.
     *
     * @param id the record UUID
     * @return the matching PEME DTO
     * @throws NotFoundException if no record exists with the given ID
     */
    public LandbasePemeDto findById(UUID id) {
        LandbasePeme entity = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Landbase PEME not found — id: {}", id);
                    return new NotFoundException("LandbasePeme", id);
                });
        return mapper.toDto(entity);
    }

    // === Commands ===

    /**
     * Creates a new landbase PEME. Client-supplied system fields (id, pemeId, createdDate,
     * updatedDate) are ignored. A business ID with prefix PEME is generated server-side.
     *
     * @param dto the PEME data from the client
     * @return the persisted PEME with server-generated fields populated
     */
    @Transactional
    public LandbasePemeDto create(LandbasePemeDto dto) {
        LandbasePeme entity = mapper.toEntity(dto);
        clearSystemFields(entity);

        String pemeId = businessIdGenerator.generateId(BUSINESS_ID_PREFIX);
        entity.setPemeId(pemeId);

        LandbasePeme saved = repository.save(entity);

        eventPublisher.publishEvent(new LandbasePemeCreatedEvent(
                saved.getId(), saved.getPemeId(),
                saved.getLastName(), saved.getFirstName()));

        log.info("Landbase PEME created — id: {}, pemeId: {}, lastName: {}",
                saved.getId(), saved.getPemeId(), saved.getLastName());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing landbase PEME. Mutable data fields are updated from the DTO;
     * system fields (id, pemeId, createdDate) are preserved.
     *
     * @param id  the UUID of the record to update
     * @param dto the updated PEME data
     * @return the updated PEME DTO
     * @throws NotFoundException if no record exists with the given ID
     */
    @Transactional
    public LandbasePemeDto update(UUID id, LandbasePemeDto dto) {
        LandbasePeme existing = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Landbase PEME not found for update — id: {}", id);
                    return new NotFoundException("LandbasePeme", id);
                });

        mapper.updateEntity(dto, existing);

        LandbasePeme saved = repository.save(existing);

        eventPublisher.publishEvent(new LandbasePemeUpdatedEvent(
                saved.getId(), saved.getPemeId()));

        log.info("Landbase PEME updated — id: {}, pemeId: {}", saved.getId(), saved.getPemeId());
        return mapper.toDto(saved);
    }

    // === Helpers ===

    private void clearSystemFields(LandbasePeme entity) {
        entity.setId(null);
        entity.setPemeId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }
}
