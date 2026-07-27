package com.centerport.medical;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.NotFoundException;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.medical.event.MedicalExamCreatedEvent;
import com.centerport.medical.event.MedicalExamUpdatedEvent;
import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileRepository;

import jakarta.persistence.criteria.Join;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
 * @see com.centerport.common.util.BusinessIdGenerator
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MedicalExamService {

    private static final String BUSINESS_ID_PREFIX = "MED";

    private final MedicalExamRepository repository;
    private final MedicalExamMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;
    private final ApplicationEventPublisher eventPublisher;
    private final SeafarerProfileRepository profileRepository;

    // =======================================================================
    // Query Operations
    // =======================================================================

    /**
     * Returns paginated medical exams, optionally filtered by a search keyword.
     *
     * When a search term is provided, records are matched against the linked
     * seafarer profile's lastName, firstName, or the exam's examId using
     * case-insensitive LIKE.
     *
     * @param search   optional keyword (null or blank returns all)
     * @param pageable pagination and sorting parameters
     * @return paged response of exam DTOs
     */
    public PagedResponse<MedicalExamDto> findAll(String search, Pageable pageable) {
        Specification<MedicalExam> spec = buildSearchSpec(search);
        Page<MedicalExam> page = repository.findAll(spec, pageable);
        List<MedicalExamDto> content = page.getContent().stream()
                .map(mapper::toDto)
                .toList();
        return PagedResponse.of(content, page);
    }

    /**
     * Finds a medical exam by UUID.
     *
     * @param id the exam's primary key
     * @return the matching exam DTO
     * @throws NotFoundException if no exam exists with the given ID
     */
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
    @Transactional
    public MedicalExamDto create(MedicalExamDto dto) {
        SeafarerProfile profile = resolveProfile(dto.getSeafarerProfileId());

        MedicalExam entity = mapper.toEntity(dto);
        clearSystemFields(entity);
        entity.setSeafarerProfile(profile);

        String examId = businessIdGenerator.generateId(BUSINESS_ID_PREFIX);
        entity.setExamId(examId);
        log.debug("Business ID generated — examId: {}", examId);

        MedicalExam saved = repository.save(entity);

        eventPublisher.publishEvent(new MedicalExamCreatedEvent(
                saved.getId(), saved.getExamId(),
                profile.getLastName(), profile.getFirstName()));

        log.info("Medical exam created — examId: {}, id: {}, patient: {}",
                saved.getExamId(), saved.getId(), profile.getLastName());
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
    @Transactional
    public MedicalExamDto update(UUID id, MedicalExamDto dto) {
        MedicalExam existing = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Medical exam not found for update — id: {}", id);
                    return new NotFoundException("MedicalExam", id);
                });

        SeafarerProfile profile = resolveProfile(dto.getSeafarerProfileId());
        existing.setSeafarerProfile(profile);

        mapper.updateEntity(dto, existing);

        MedicalExam saved = repository.save(existing);

        eventPublisher.publishEvent(new MedicalExamUpdatedEvent(
                saved.getId(), saved.getExamId()));

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

    /**
     * Resolves a SeafarerProfile by UUID or throws NotFoundException.
     */
    private SeafarerProfile resolveProfile(UUID profileId) {
        return profileRepository.findById(profileId)
                .orElseThrow(() -> {
                    log.warn("Seafarer profile not found — id: {}", profileId);
                    return new NotFoundException("SeafarerProfile", profileId);
                });
    }

    /**
     * Builds a JPA Specification for searching medical exam records by keyword.
     *
     * Matches the search term (case-insensitive) against the linked seafarer
     * profile's lastName, firstName, or the exam's examId.
     * Returns an unrestricted spec when the search term is null or blank.
     */
    private Specification<MedicalExam> buildSearchSpec(String search) {
        if (search == null || search.isBlank()) {
            return Specification.where(null);
        }
        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, cb) -> {
            Join<MedicalExam, SeafarerProfile> profile = root.join("seafarerProfile");
            return cb.or(
                    cb.like(cb.lower(profile.get("lastName")), pattern),
                    cb.like(cb.lower(profile.get("firstName")), pattern),
                    cb.like(cb.lower(root.get("examId")), pattern)
            );
        };
    }
}
