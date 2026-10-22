package com.centerport.clinicalchemistry;

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
 * Service layer for {@link ClinicalChemistry} CRUD and search.
 *
 * Manages transactional boundaries and case-insensitive keyword search across
 * the {@code name} label. These are configuration records (no business ID, no
 * patient link), so create simply clears any client-supplied system fields and
 * persists the row.
 *
 * @see ClinicalChemistryRepository
 * @see ClinicalChemistryMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ClinicalChemistryService {

    private static final String ENTITY_NAME = "ClinicalChemistry";

    private final ClinicalChemistryRepository repository;
    private final ClinicalChemistryMapper mapper;

    // === Queries ===

    /**
     * Returns paginated clinical-chemistry sets, optionally filtered by a
     * search keyword matching the name label.
     *
     * @param search   optional keyword (matches name, case-insensitive)
     * @param pageable pagination and sorting parameters
     * @return paged response of clinical-chemistry DTOs
     */
    public PagedResponse<ClinicalChemistryDto> findAll(String search, Pageable pageable) {
        Specification<ClinicalChemistry> spec = buildSearchSpec(search);
        Page<ClinicalChemistry> page = repository.findAll(spec, pageable);
        List<ClinicalChemistryDto> content = page.getContent().stream()
                .map(mapper::toDto)
                .toList();
        return PagedResponse.of(content, page);
    }

    /**
     * Finds a clinical-chemistry set by UUID or throws {@link NotFoundException}.
     *
     * @param id the record UUID
     * @return the matching DTO
     * @throws NotFoundException if no record exists with the given ID
     */
    public ClinicalChemistryDto findById(UUID id) {
        ClinicalChemistry entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException(ENTITY_NAME, id));
        return mapper.toDto(entity);
    }

    // === Commands ===

    /**
     * Creates a new clinical-chemistry set. Client-supplied system fields are
     * cleared.
     *
     * @param dto the data from the client
     * @return the persisted record with server-generated fields populated
     */
    @Transactional
    public ClinicalChemistryDto create(ClinicalChemistryDto dto) {
        ClinicalChemistry entity = mapper.toEntity(dto);
        clearSystemFields(entity);

        ClinicalChemistry saved = repository.save(entity);
        log.info("ClinicalChemistry created — id: {}, name: {}", saved.getId(), saved.getName());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing clinical-chemistry set. System fields (id,
     * createdDate) are preserved.
     *
     * @param id  the UUID of the record to update
     * @param dto the updated data
     * @return the updated DTO
     * @throws NotFoundException if no record exists with the given ID
     */
    @Transactional
    public ClinicalChemistryDto update(UUID id, ClinicalChemistryDto dto) {
        ClinicalChemistry existing = repository.findById(id)
                .orElseThrow(() -> new NotFoundException(ENTITY_NAME, id));

        mapper.updateEntity(dto, existing);

        ClinicalChemistry saved = repository.save(existing);
        log.info("ClinicalChemistry updated — id: {}, name: {}", id, saved.getName());
        return mapper.toDto(saved);
    }

    /**
     * Deletes a clinical-chemistry set by UUID.
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
        log.info("ClinicalChemistry deleted — id: {}", id);
    }

    // === Helpers ===

    /** Clears system-managed fields so client-supplied values are never persisted. */
    private void clearSystemFields(ClinicalChemistry entity) {
        entity.setId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }

    /**
     * Builds a case-insensitive keyword specification matching the name label.
     * Returns an unrestricted spec when the term is null or blank.
     */
    private Specification<ClinicalChemistry> buildSearchSpec(String search) {
        if (search == null || search.isBlank()) {
            return Specification.where(null);
        }
        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get("name")), pattern);
    }
}
