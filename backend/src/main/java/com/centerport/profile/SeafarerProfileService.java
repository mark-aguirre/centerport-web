package com.centerport.profile;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.NotFoundException;
import com.centerport.common.util.BusinessIdGenerator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service layer for SeafarerProfile CRUD operations.
 *
 * Manages transactional boundaries, business-ID generation on create,
 * and ensures client-supplied system fields are ignored during persistence.
 *
 * Business ID Format:
 * Generated IDs use the prefix {@code CMSI} followed by an 8-digit
 * zero-padded sequence number (e.g., {@code CMSI00000042}).
 *
 * @see SeafarerProfileRepository
 * @see BusinessIdGenerator
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SeafarerProfileService {

    private static final String BUSINESS_ID_PREFIX = "CMSI";

    private final SeafarerProfileRepository repository;
    private final SeafarerProfileMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;

    // === Queries ===

    /**
     * Returns paginated profiles.
     *
     * @param pageable pagination and sorting parameters
     * @return paged response of profile DTOs
     */
    public PagedResponse<SeafarerProfileDto> findAll(Pageable pageable) {
        Page<SeafarerProfile> page = repository.findAll(pageable);
        List<SeafarerProfileDto> content = page.getContent().stream()
                .map(mapper::toDto)
                .toList();
        return PagedResponse.of(content, page);
    }

    /**
     * Finds a profile by UUID or throws {@link NotFoundException}.
     *
     * @param id the profile UUID
     * @return the matching profile DTO
     * @throws NotFoundException if no profile exists with the given ID
     */
    public SeafarerProfileDto findById(UUID id) {
        SeafarerProfile entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("SeafarerProfile", id));
        return mapper.toDto(entity);
    }

    // === Commands ===

    /**
     * Creates a new seafarer profile.
     *
     * Client-supplied system fields (id, profileId, createdDate, updatedDate)
     * are cleared before persistence. A business ID with prefix {@code CMSI}
     * is generated server-side.
     *
     * @param dto the profile data from the client
     * @return the persisted profile with server-generated fields populated
     */
    @Transactional
    public SeafarerProfileDto create(SeafarerProfileDto dto) {
        SeafarerProfile entity = mapper.toEntity(dto);
        clearSystemFields(entity);
        entity.setProfileId(businessIdGenerator.generateId(BUSINESS_ID_PREFIX));

        SeafarerProfile saved = repository.save(entity);
        log.info("Profile created — profileId: {}, lastName: {}", saved.getProfileId(), saved.getLastName());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing seafarer profile.
     *
     * Mutable data fields are updated from the DTO; system fields
     * (id, profileId, createdDate) are preserved. The {@code updatedDate}
     * is refreshed automatically via {@link com.centerport.common.BaseEntity#onUpdate()}.
     *
     * @param id  the UUID of the profile to update
     * @param dto the updated profile data
     * @return the updated profile DTO
     * @throws NotFoundException if no profile exists with the given ID
     */
    @Transactional
    public SeafarerProfileDto update(UUID id, SeafarerProfileDto dto) {
        SeafarerProfile existing = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("SeafarerProfile", id));

        mapper.updateEntity(dto, existing);

        SeafarerProfile saved = repository.save(existing);
        log.info("Profile updated — profileId: {}, id: {}", saved.getProfileId(), id);
        return mapper.toDto(saved);
    }

    // === Helpers ===

    /**
     * Clears system-managed fields so client-supplied values are never persisted.
     */
    private void clearSystemFields(SeafarerProfile entity) {
        entity.setId(null);
        entity.setProfileId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }
}
