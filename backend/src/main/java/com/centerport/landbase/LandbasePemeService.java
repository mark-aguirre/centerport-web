package com.centerport.landbase;

import com.centerport.common.BusinessIdGenerator;
import com.centerport.common.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service layer for LandbasePeme CRUD operations.
 * Manages transactional boundaries, business-ID generation (PEME prefix) on create,
 * and ensures client-supplied system fields are ignored.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class LandbasePemeService {

    private final LandbasePemeRepository repository;
    private final LandbasePemeMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;

    /**
     * Returns all landbase PEMEs sorted by createdDate descending.
     */
    @Transactional(readOnly = true)
    public List<LandbasePemeDto> findAll() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "createdDate"))
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    /**
     * Finds a landbase PEME by UUID or throws NotFoundException.
     */
    @Transactional(readOnly = true)
    public LandbasePemeDto findById(UUID id) {
        LandbasePeme entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("LandbasePeme", id));
        return mapper.toDto(entity);
    }

    /**
     * Creates a new landbase PEME. Client-supplied system fields (id, pemeId, createdDate,
     * updatedDate) are ignored. A business ID with prefix PEME is generated server-side.
     */
    public LandbasePemeDto create(LandbasePemeDto dto) {
        LandbasePeme entity = mapper.toEntity(dto);

        // Ignore any client-supplied system fields
        entity.setId(null);
        entity.setPemeId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);

        // Generate server-managed business ID
        entity.setPemeId(businessIdGenerator.generateId("PEME"));

        LandbasePeme saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing landbase PEME. Mutable data fields are updated from the DTO;
     * system fields (id, pemeId, createdDate) are preserved. updatedDate is refreshed
     * automatically via BaseEntity's @PreUpdate.
     */
    public LandbasePemeDto update(UUID id, LandbasePemeDto dto) {
        LandbasePeme existing = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("LandbasePeme", id));

        // Update mutable fields only; system fields are ignored by the mapper
        mapper.updateEntity(dto, existing);

        LandbasePeme saved = repository.save(existing);
        return mapper.toDto(saved);
    }
}
