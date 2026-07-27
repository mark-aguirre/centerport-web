package com.centerport.mlc;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.NotFoundException;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.mlc.event.MlcRecordCreatedEvent;
import com.centerport.mlc.event.MlcRecordUpdatedEvent;
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
 * Service layer for MLC (Maritime Labour Convention) record CRUD operations.
 *
 * Responsibilities:
 * - Transactional boundary management for all persistence operations
 * - Business-ID generation with prefix {@code MLC} on record creation
 * - Seafarer profile resolution from the provided seafarerProfileId
 * - Search across linked profile fields and MLC business ID
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
    private final SeafarerProfileRepository profileRepository;

    // === Queries ===

    /**
     * Returns paginated MLC records, optionally filtered by a search keyword.
     *
     * When a search term is provided, records are matched against the linked
     * seafarer profile's lastName, firstName, or the MLC's mlcId using
     * case-insensitive LIKE.
     *
     * @param search   optional keyword (null or blank returns all)
     * @param pageable pagination and sorting parameters
     * @return paged response of MLC record DTOs
     */
    public PagedResponse<MlcRecordDto> findAll(String search, Pageable pageable) {
        Specification<MlcRecord> spec = buildSearchSpec(search);
        Page<MlcRecord> page = repository.findAll(spec, pageable);
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
     * Creates a new MLC record. Client-supplied system fields (id, mlcId, createdDate,
     * updatedDate) are ignored. A business ID with prefix MLC is generated server-side.
     * The seafarer profile is resolved from the provided seafarerProfileId.
     *
     * @param dto the MLC record data to persist
     * @return the created record including server-generated system fields
     * @throws NotFoundException if the referenced seafarer profile does not exist
     */
    @Transactional
    public MlcRecordDto create(MlcRecordDto dto) {
        SeafarerProfile profile = resolveProfile(dto.getSeafarerProfileId());

        MlcRecord entity = mapper.toEntity(dto);
        clearSystemFields(entity);
        entity.setSeafarerProfile(profile);

        String mlcId = businessIdGenerator.generateId(BUSINESS_ID_PREFIX);
        entity.setMlcId(mlcId);
        log.debug("Business ID generated — mlcId: {}", mlcId);

        MlcRecord saved = repository.save(entity);
        saved.setSeafarerProfile(profile);

        eventPublisher.publishEvent(new MlcRecordCreatedEvent(
                saved.getId(), saved.getMlcId(),
                profile.getLastName(), profile.getFirstName()));

        log.info("MLC record created — mlcId: {}, id: {}, profileId: {}",
                saved.getMlcId(), saved.getId(), profile.getProfileId());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing MLC record. Mutable data fields are updated from the DTO;
     * system fields (id, mlcId, createdDate) are preserved. If a different
     * seafarerProfileId is provided, the profile link is updated.
     *
     * @param id  the record's primary key
     * @param dto the updated record data
     * @return the updated MLC record DTO
     * @throws NotFoundException if no record exists with the given ID or profile not found
     */
    @Transactional
    public MlcRecordDto update(UUID id, MlcRecordDto dto) {
        MlcRecord existing = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("MLC record not found for update — id: {}", id);
                    return new NotFoundException("MlcRecord", id);
                });

        SeafarerProfile profile = resolveProfile(dto.getSeafarerProfileId());
        existing.setSeafarerProfile(profile);

        mapper.updateEntity(dto, existing);

        MlcRecord saved = repository.save(existing);
        saved.setSeafarerProfile(profile);

        eventPublisher.publishEvent(new MlcRecordUpdatedEvent(
                saved.getId(), saved.getMlcId()));

        log.info("MLC record updated — mlcId: {}, id: {}", saved.getMlcId(), id);
        return mapper.toDto(saved);
    }

    // === Helpers ===

    private SeafarerProfile resolveProfile(UUID profileId) {
        return profileRepository.findById(profileId)
                .orElseThrow(() -> {
                    log.warn("Seafarer profile not found — id: {}", profileId);
                    return new NotFoundException("SeafarerProfile", profileId);
                });
    }

    private void clearSystemFields(MlcRecord entity) {
        entity.setId(null);
        entity.setMlcId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }

    /**
     * Builds a JPA Specification for searching MLC records by keyword.
     *
     * Matches the search term (case-insensitive) against the linked seafarer
     * profile's lastName, firstName, or the MLC's mlcId.
     * Returns an unrestricted spec when the search term is null or blank.
     *
     * @param search the keyword to match
     * @return a Specification for filtering
     */
    private Specification<MlcRecord> buildSearchSpec(String search) {
        if (search == null || search.isBlank()) {
            return Specification.where(null);
        }
        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, cb) -> {
            Join<MlcRecord, SeafarerProfile> profile = root.join("seafarerProfile");
            return cb.or(
                    cb.like(cb.lower(profile.get("lastName")), pattern),
                    cb.like(cb.lower(profile.get("firstName")), pattern),
                    cb.like(cb.lower(root.get("mlcId")), pattern)
            );
        };
    }
}
