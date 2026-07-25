package com.centerport.landbase;

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
 * Service layer for LandbasePeme CRUD operations.
 * Manages transactional boundaries, business-ID generation (PEME prefix) on create,
 * and ensures client-supplied system fields are ignored.
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class LandbasePemeService {

    private final LandbasePemeRepository repository;
    private final LandbasePemeMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;

    /**
     * Returns all landbase PEMEs sorted by createdDate descending.
     *
     * @param limit optional cap on the number of results; {@code null} or non-positive returns all
     * @return list of PEME DTOs, possibly truncated to {@code limit}
     */
    @Transactional(readOnly = true)
    public List<LandbasePemeDto> findAll(Integer limit) {
        List<LandbasePemeDto> results = repository.findAll(Sort.by(Sort.Direction.DESC, "createdDate"))
                .stream()
                .map(mapper::toDto)
                .toList();
        if (limit != null && limit > 0 && limit < results.size()) {
            log.debug("findAll truncated — total: {}, limit: {}", results.size(), limit);
            return results.subList(0, limit);
        }
        log.debug("findAll completed — count: {}", results.size());
        return results;
    }

    /**
     * Finds a landbase PEME by UUID or throws NotFoundException.
     */
    @Transactional(readOnly = true)
    public LandbasePemeDto findById(UUID id) {
        log.debug("findById — id: {}", id);
        LandbasePeme entity = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Landbase PEME not found — id: {}", id);
                    return new NotFoundException("LandbasePeme", id);
                });
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
        String pemeId = businessIdGenerator.generateId("PEME");
        entity.setPemeId(pemeId);

        LandbasePeme saved = repository.save(entity);
        log.info("Landbase PEME created — id: {}, pemeId: {}, lastName: {}",
                saved.getId(), saved.getPemeId(), saved.getLastName());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing landbase PEME. Mutable data fields are updated from the DTO;
     * system fields (id, pemeId, createdDate) are preserved. updatedDate is refreshed
     * automatically via BaseEntity's @PreUpdate.
     */
    public LandbasePemeDto update(UUID id, LandbasePemeDto dto) {
        LandbasePeme existing = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Landbase PEME not found for update — id: {}", id);
                    return new NotFoundException("LandbasePeme", id);
                });

        // Update mutable fields only; system fields are ignored by the mapper
        mapper.updateEntity(dto, existing);

        LandbasePeme saved = repository.save(existing);
        log.info("Landbase PEME updated — id: {}, pemeId: {}", saved.getId(), saved.getPemeId());
        return mapper.toDto(saved);
    }
}
