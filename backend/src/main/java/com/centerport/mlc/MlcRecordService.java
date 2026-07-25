package com.centerport.mlc;

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
 * Service layer for MLC (Maritime Labour Convention) record CRUD operations.
 *
 * Responsibilities:
 * - Transactional boundary management for all persistence operations
 * - Business-ID generation with prefix {@code MLC} on record creation
 * - Enforcement that client-supplied system fields are never persisted
 * - Mapping between entity and DTO via {@link MlcRecordMapper}
 *
 * Business ID:
 * Each new record receives a unique sequential ID in the format
 * {@code MLC00000001} generated from the PostgreSQL sequence {@code mlc_seq}.
 *
 * @see MlcRecordRepository
 * @see MlcRecordMapper
 * @see com.centerport.common.BusinessIdGenerator
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MlcRecordService {

    private static final String BUSINESS_ID_PREFIX = "MLC";

    private final MlcRecordRepository repository;
    private final MlcRecordMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;

    // =======================================================================
    // Query Operations
    // =======================================================================

    /**
     * Returns all MLC records sorted by creation date descending.
     *
     * @param limit optional cap on the number of results; {@code null} or
     *              non-positive returns all
     * @return list of MLC record DTOs, possibly truncated to {@code limit}
     */
    @Transactional(readOnly = true)
    public List<MlcRecordDto> findAll(Integer limit) {
        List<MlcRecordDto> results = repository
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
     * Finds an MLC record by UUID.
     *
     * @param id the record's primary key
     * @return the matching MLC record DTO
     * @throws NotFoundException if no record exists with the given ID
     */
    @Transactional(readOnly = true)
    public MlcRecordDto findById(UUID id) {
        MlcRecord entity = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("MLC record not found — id: {}", id);
                    return new NotFoundException("MlcRecord", id);
                });
        return mapper.toDto(entity);
    }

    // =======================================================================
    // Mutation Operations
    // =======================================================================

    /**
     * Creates a new MLC record.
     *
     * Client-supplied system fields (id, mlcId, createdDate, updatedDate) are
     * cleared before persistence. A business ID is generated server-side.
     *
     * @param dto the MLC record data to persist
     * @return the created record including server-generated system fields
     */
    public MlcRecordDto create(MlcRecordDto dto) {
        MlcRecord entity = mapper.toEntity(dto);
        clearSystemFields(entity);

        String mlcId = businessIdGenerator.generateId(BUSINESS_ID_PREFIX);
        entity.setMlcId(mlcId);
        log.debug("Business ID generated — mlcId: {}", mlcId);

        MlcRecord saved = repository.save(entity);
        log.info("MLC record created — mlcId: {}, id: {}, patient: {}",
                saved.getMlcId(), saved.getId(), saved.getLastName());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing MLC record.
     *
     * Mutable data fields are updated from the DTO; system fields (id, mlcId,
     * createdDate) are preserved. {@code updatedDate} is refreshed automatically
     * via {@link com.centerport.common.BaseEntity#onUpdate()}.
     *
     * @param id  the record's primary key
     * @param dto the updated record data
     * @return the updated MLC record DTO
     * @throws NotFoundException if no record exists with the given ID
     */
    public MlcRecordDto update(UUID id, MlcRecordDto dto) {
        MlcRecord existing = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("MLC record not found for update — id: {}", id);
                    return new NotFoundException("MlcRecord", id);
                });

        mapper.updateEntity(dto, existing);

        MlcRecord saved = repository.save(existing);
        log.info("MLC record updated — mlcId: {}, id: {}", saved.getMlcId(), id);
        return mapper.toDto(saved);
    }

    // =======================================================================
    // Private Helpers
    // =======================================================================

    /**
     * Clears server-managed system fields to prevent client-supplied values
     * from being persisted.
     */
    private void clearSystemFields(MlcRecord entity) {
        entity.setId(null);
        entity.setMlcId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }
}
