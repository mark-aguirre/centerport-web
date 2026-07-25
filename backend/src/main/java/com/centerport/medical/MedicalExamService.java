package com.centerport.medical;

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
 * Service layer for MedicalExam CRUD operations.
 *
 * Responsibilities:
 * - Transactional boundary management for all persistence operations
 * - Business-ID generation with prefix {@code MED} on record creation
 * - Enforcement that client-supplied system fields are never persisted
 * - Mapping between entity and DTO via {@link MedicalExamMapper}
 *
 * Business ID:
 * Each new exam receives a unique sequential ID in the format
 * {@code MED00000001} generated from the PostgreSQL sequence {@code med_seq}.
 *
 * @see MedicalExamRepository
 * @see MedicalExamMapper
 * @see com.centerport.common.BusinessIdGenerator
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MedicalExamService {

    private static final String BUSINESS_ID_PREFIX = "MED";

    private final MedicalExamRepository repository;
    private final MedicalExamMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;

    // =======================================================================
    // Query Operations
    // =======================================================================

    /**
     * Returns all medical exams sorted by creation date descending.
     *
     * @param limit optional cap on the number of results; {@code null} or
     *              non-positive returns all
     * @return list of exam DTOs, possibly truncated to {@code limit}
     */
    @Transactional(readOnly = true)
    public List<MedicalExamDto> findAll(Integer limit) {
        List<MedicalExamDto> results = repository
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
     * Finds a medical exam by UUID.
     *
     * @param id the exam's primary key
     * @return the matching exam DTO
     * @throws NotFoundException if no exam exists with the given ID
     */
    @Transactional(readOnly = true)
    public MedicalExamDto findById(UUID id) {
        MedicalExam entity = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Medical exam not found — id: {}", id);
                    return new NotFoundException("MedicalExam", id);
                });
        return mapper.toDto(entity);
    }

    // =======================================================================
    // Mutation Operations
    // =======================================================================

    /**
     * Creates a new medical exam record.
     *
     * Client-supplied system fields (id, examId, createdDate, updatedDate) are
     * cleared before persistence. A business ID is generated server-side.
     *
     * @param dto the exam data to persist
     * @return the created exam including server-generated system fields
     */
    public MedicalExamDto create(MedicalExamDto dto) {
        MedicalExam entity = mapper.toEntity(dto);
        clearSystemFields(entity);

        String examId = businessIdGenerator.generateId(BUSINESS_ID_PREFIX);
        entity.setExamId(examId);
        log.debug("Business ID generated — examId: {}", examId);

        MedicalExam saved = repository.save(entity);
        log.info("Medical exam created — examId: {}, id: {}, patient: {}",
                saved.getExamId(), saved.getId(), saved.getLastName());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing medical exam record.
     *
     * Mutable data fields are updated from the DTO; system fields (id, examId,
     * createdDate) are preserved. {@code updatedDate} is refreshed automatically
     * via {@link com.centerport.common.BaseEntity#onUpdate()}.
     *
     * @param id  the exam's primary key
     * @param dto the updated exam data
     * @return the updated exam DTO
     * @throws NotFoundException if no exam exists with the given ID
     */
    public MedicalExamDto update(UUID id, MedicalExamDto dto) {
        MedicalExam existing = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Medical exam not found for update — id: {}", id);
                    return new NotFoundException("MedicalExam", id);
                });

        mapper.updateEntity(dto, existing);

        MedicalExam saved = repository.save(existing);
        log.info("Medical exam updated — examId: {}, id: {}", saved.getExamId(), id);
        return mapper.toDto(saved);
    }

    // =======================================================================
    // Private Helpers
    // =======================================================================

    /**
     * Clears server-managed system fields to prevent client-supplied values
     * from being persisted.
     */
    private void clearSystemFields(MedicalExam entity) {
        entity.setId(null);
        entity.setExamId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }
}
