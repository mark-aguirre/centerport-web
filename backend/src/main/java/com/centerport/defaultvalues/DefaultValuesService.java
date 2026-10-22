package com.centerport.defaultvalues;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.NotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service layer for {@link DefaultValues} CRUD and search.
 *
 * Manages transactional boundaries and case-insensitive keyword search across
 * the {@code name} label. These are configuration records (no business ID, no
 * patient link), so create simply clears any client-supplied system fields and
 * persists the row.
 *
 * @see DefaultValuesRepository
 * @see DefaultValuesMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DefaultValuesService {

    private static final String ENTITY_NAME = "DefaultValues";

    private final DefaultValuesRepository repository;
    private final DefaultValuesMapper mapper;

    // === Queries ===

    /**
     * Returns paginated default-value sets, optionally filtered by a search
     * keyword matching the name label.
     *
     * @param search   optional keyword (matches name, case-insensitive)
     * @param pageable pagination and sorting parameters
     * @return paged response of default-value DTOs
     */
    public PagedResponse<DefaultValuesDto> findAll(String search, Pageable pageable) {
        Specification<DefaultValues> spec = buildSearchSpec(search);
        Page<DefaultValues> page = repository.findAll(spec, pageable);
        List<DefaultValuesDto> content = page.getContent().stream()
                .map(mapper::toDto)
                .toList();
        return PagedResponse.of(content, page);
    }

    /**
     * Finds a default-value set by UUID or throws {@link NotFoundException}.
     *
     * @param id the record UUID
     * @return the matching DTO
     * @throws NotFoundException if no record exists with the given ID
     */
    public DefaultValuesDto findById(UUID id) {
        DefaultValues entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException(ENTITY_NAME, id));
        return mapper.toDto(entity);
    }

    // === Commands ===

    /**
     * Creates a new default-value set. Client-supplied system fields are cleared.
     *
     * @param dto the data from the client
     * @return the persisted record with server-generated fields populated
     */
    @Transactional
    public DefaultValuesDto create(DefaultValuesDto dto) {
        DefaultValues entity = mapper.toEntity(dto);
        clearSystemFields(entity);

        DefaultValues saved = repository.save(entity);
        log.info("DefaultValues created — id: {}, name: {}", saved.getId(), saved.getName());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing default-value set. System fields (id, createdDate) are
     * preserved.
     *
     * @param id  the UUID of the record to update
     * @param dto the updated data
     * @return the updated DTO
     * @throws NotFoundException if no record exists with the given ID
     */
    @Transactional
    public DefaultValuesDto update(UUID id, DefaultValuesDto dto) {
        DefaultValues existing = repository.findById(id)
                .orElseThrow(() -> new NotFoundException(ENTITY_NAME, id));

        mapper.updateEntity(dto, existing);

        DefaultValues saved = repository.save(existing);
        log.info("DefaultValues updated — id: {}, name: {}", id, saved.getName());
        return mapper.toDto(saved);
    }

    /**
     * Deletes a default-value set by UUID.
     *
     * @param id the record UUID
     * @throws NotFoundException if no record exists with the given ID
     */
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException(ENTITY_NAME, id);
        }
        repository.deleteById(id);
        log.info("DefaultValues deleted — id: {}", id);
    }

    // === Helpers ===

    /** Clears system-managed fields so client-supplied values are never persisted. */
    private void clearSystemFields(DefaultValues entity) {
        entity.setId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }

    /**
     * Builds a case-insensitive keyword specification matching the name label.
     * Returns an unrestricted spec when the term is null or blank.
     */
    private Specification<DefaultValues> buildSearchSpec(String search) {
        if (search == null || search.isBlank()) {
            return Specification.where(null);
        }
        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get("name")), pattern);
    }
}
