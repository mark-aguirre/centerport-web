package com.centerport.landbase;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.NotFoundException;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.landbase.event.LandbasePemeCreatedEvent;
import com.centerport.landbase.event.LandbasePemeUpdatedEvent;
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
 * Service layer for LandbasePeme CRUD operations.
 * Manages transactional boundaries, business-ID generation (PEME prefix) on create,
 * seafarer profile resolution, and search across profile fields.
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
    private final SeafarerProfileRepository profileRepository;

    // === Queries ===

    /**
     * Returns paginated landbase PEMEs, optionally filtered by a search keyword.
     *
     * When a search term is provided, records are matched against the linked
     * seafarer profile's lastName, firstName, or the PEME's pemeId using
     * case-insensitive LIKE.
     *
     * @param search   optional keyword (null or blank returns all)
     * @param pageable pagination and sorting parameters
     * @return paged response of PEME DTOs
     */
    public PagedResponse<LandbasePemeDto> findAll(String search, Pageable pageable) {
        Specification<LandbasePeme> spec = buildSearchSpec(search);
        Page<LandbasePeme> page = repository.findAll(spec, pageable);
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
     * The seafarer profile is resolved from the provided seafarerProfileId.
     *
     * @param dto the PEME data from the client
     * @return the persisted PEME with server-generated fields populated
     * @throws NotFoundException if the referenced seafarer profile does not exist
     */
    @Transactional
    public LandbasePemeDto create(LandbasePemeDto dto) {
        SeafarerProfile profile = resolveProfile(dto.getSeafarerProfileId());

        LandbasePeme entity = mapper.toEntity(dto);
        clearSystemFields(entity);
        entity.setSeafarerProfile(profile);

        String pemeId = businessIdGenerator.generateId(BUSINESS_ID_PREFIX);
        entity.setPemeId(pemeId);

        LandbasePeme saved = repository.save(entity);

        eventPublisher.publishEvent(new LandbasePemeCreatedEvent(
                saved.getId(), saved.getPemeId(),
                profile.getLastName(), profile.getFirstName()));

        log.info("Landbase PEME created — id: {}, pemeId: {}, profileId: {}",
                saved.getId(), saved.getPemeId(), profile.getProfileId());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing landbase PEME. Mutable data fields are updated from the DTO;
     * system fields (id, pemeId, createdDate) are preserved. If a different
     * seafarerProfileId is provided, the profile link is updated.
     *
     * @param id  the UUID of the record to update
     * @param dto the updated PEME data
     * @return the updated PEME DTO
     * @throws NotFoundException if no record exists with the given ID or profile not found
     */
    @Transactional
    public LandbasePemeDto update(UUID id, LandbasePemeDto dto) {
        LandbasePeme existing = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Landbase PEME not found for update — id: {}", id);
                    return new NotFoundException("LandbasePeme", id);
                });

        SeafarerProfile profile = resolveProfile(dto.getSeafarerProfileId());
        existing.setSeafarerProfile(profile);

        mapper.updateEntity(dto, existing);

        LandbasePeme saved = repository.save(existing);

        eventPublisher.publishEvent(new LandbasePemeUpdatedEvent(
                saved.getId(), saved.getPemeId()));

        log.info("Landbase PEME updated — id: {}, pemeId: {}", saved.getId(), saved.getPemeId());
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

    private void clearSystemFields(LandbasePeme entity) {
        entity.setId(null);
        entity.setPemeId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }

    /**
     * Builds a JPA Specification for searching PEME records by keyword.
     *
     * Matches the search term (case-insensitive) against the linked seafarer
     * profile's lastName, firstName, or the PEME's pemeId.
     * Returns an unrestricted spec when the search term is null or blank.
     *
     * @param search the keyword to match
     * @return a Specification for filtering
     */
    private Specification<LandbasePeme> buildSearchSpec(String search) {
        if (search == null || search.isBlank()) {
            return Specification.where(null);
        }
        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, cb) -> {
            Join<LandbasePeme, SeafarerProfile> profile = root.join("seafarerProfile");
            return cb.or(
                    cb.like(cb.lower(profile.get("lastName")), pattern),
                    cb.like(cb.lower(profile.get("firstName")), pattern),
                    cb.like(cb.lower(root.get("pemeId")), pattern)
            );
        };
    }
}
