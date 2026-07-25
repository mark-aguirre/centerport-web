package com.centerport.profile;

import com.centerport.common.BusinessIdGenerator;
import com.centerport.common.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service layer for SeafarerProfile CRUD operations.
 * Manages transactional boundaries, business-ID generation on create,
 * and ensures client-supplied system fields are ignored.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class SeafarerProfileService {

    private final SeafarerProfileRepository repository;
    private final SeafarerProfileMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;

    /**
     * Returns all profiles sorted by createdDate descending.
     */
    @Transactional(readOnly = true)
    public List<SeafarerProfileDto> findAll() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "createdDate"))
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    /**
     * Finds a profile by UUID or throws NotFoundException.
     */
    @Transactional(readOnly = true)
    public SeafarerProfileDto findById(UUID id) {
        SeafarerProfile entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("SeafarerProfile", id));
        return mapper.toDto(entity);
    }

    /**
     * Creates a new profile. Client-supplied system fields (id, profileId, createdDate,
     * updatedDate) are ignored. A business ID with prefix CMSI is generated server-side.
     */
    public SeafarerProfileDto create(SeafarerProfileDto dto) {
        SeafarerProfile entity = mapper.toEntity(dto);

        // Ignore any client-supplied system fields
        entity.setId(null);
        entity.setProfileId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);

        // Generate server-managed business ID
        entity.setProfileId(businessIdGenerator.generateId("CMSI"));

        SeafarerProfile saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing profile. Mutable data fields are updated from the DTO;
     * system fields (id, profileId, createdDate) are preserved. updatedDate is
     * refreshed automatically via BaseEntity's @PreUpdate.
     */
    public SeafarerProfileDto update(UUID id, SeafarerProfileDto dto) {
        SeafarerProfile existing = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("SeafarerProfile", id));

        // Update mutable fields only; system fields are ignored by the mapper
        mapper.updateEntity(dto, existing);

        SeafarerProfile saved = repository.save(existing);
        return mapper.toDto(saved);
    }
}
