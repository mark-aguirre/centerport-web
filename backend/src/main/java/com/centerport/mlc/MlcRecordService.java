package com.centerport.mlc;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.NotFoundException;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.mlc.event.MlcRecordCreatedEvent;
import com.centerport.mlc.event.MlcRecordUpdatedEvent;

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
 * Service layer for MLC (Maritime Labour Convention) record CRUD operations.
 *
 * Responsibilities:
 * - Transactional boundary management for all persistence operations
 * - Business-ID generation with prefix {@code MLC} on record creation
 * - Enforcement that client-supplied system fields are never persisted
 * - Mapping between entity and DTO via {@link MlcRecordMapper}
 *
 * @see MlcRecordRepository
 * @see MlcRecordMapper
 * @see BusinessIdGenerator
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MlcRecordService {

    private static final String BUSINESS_ID_PREFIX = "MLC";

    private final MlcRecordRepository repository;
    private final MlcRecordMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;
    private final ApplicationEventPublisher eventPublisher;

    // === Queries ===

    /**
     * Returns paginated MLC records.
     *
     * @param pageable pagination and sorting parameters
     * @return paged response of MLC record DTOs
     */
    public PagedResponse<MlcRecordDto> findAll(Pageable pageable) {
        Page<MlcRecord> page = repository.findAll(pageable);
        List<MlcRecordDto> content = page.getContent().stream()
                .map(mapper::toDto)
                .toList();
        return PagedResponse.of(content, page);
    }

    /**
     * Finds an MLC record by UUID.
     *
     * @param id the record's primary key
     * @return the matching MLC record DTO
     * @throws NotFoundException if no record exists with the given ID
     */
    public MlcRecordDto findById(UUID id) {
        MlcRecord entity = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("MLC record not found — id: {}", id);
                    return new NotFoundException("MlcRecord", id);
                });
        return mapper.toDto(entity);
    }

    // === Commands ===

    /**
     * Creates a new MLC record.
     *
     * @param dto the MLC record data to persist
     * @return the created record including server-generated system fields
     */
    @Transactional
    public MlcRecordDto create(MlcRecordDto dto) {
        MlcRecord entity = mapper.toEntity(dto);
        clearSystemFields(entity);

        String mlcId = businessIdGenerator.generateId(BUSINESS_ID_PREFIX);
        entity.setMlcId(mlcId);
        log.debug("Business ID generated — mlcId: {}", mlcId);

        MlcRecord saved = repository.save(entity);

        eventPublisher.publishEvent(new MlcRecordCreatedEvent(
                saved.getId(), saved.getMlcId(),
                saved.getLastName(), saved.getFirstName()));

        log.info("MLC record created — mlcId: {}, id: {}, patient: {}",
                saved.getMlcId(), saved.getId(), saved.getLastName());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing MLC record.
     *
     * @param id  the record's primary key
     * @param dto the updated record data
     * @return the updated MLC record DTO
     * @throws NotFoundException if no record exists with the given ID
     */
    @Transactional
    public MlcRecordDto update(UUID id, MlcRecordDto dto) {
        MlcRecord existing = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("MLC record not found for update — id: {}", id);
                    return new NotFoundException("MlcRecord", id);
                });

        mapper.updateEntity(dto, existing);

        MlcRecord saved = repository.save(existing);

        eventPublisher.publishEvent(new MlcRecordUpdatedEvent(
                saved.getId(), saved.getMlcId()));

        log.info("MLC record updated — mlcId: {}, id: {}", saved.getMlcId(), id);
        return mapper.toDto(saved);
    }

    // === Helpers ===

    private void clearSystemFields(MlcRecord entity) {
        entity.setId(null);
        entity.setMlcId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }
}
