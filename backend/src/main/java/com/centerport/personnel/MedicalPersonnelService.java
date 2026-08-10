package com.centerport.personnel;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.NotFoundException;
import com.centerport.common.util.BusinessIdGenerator;

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
 * Service layer for MedicalPersonnel CRUD operations.
 *
 * Manages transactional boundaries, business-ID generation on create,
 * and search functionality for the personnel lookup dialog.
 *
 * Business ID Format:
 * Generated IDs use the prefix {@code PERS} followed by an 8-digit
 * zero-padded sequence number (e.g., {@code PERS00000001}).
 *
 * @see MedicalPersonnelRepository
 * @see BusinessIdGenerator
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MedicalPersonnelService {

    private static final String BUSINESS_ID_PREFIX = "PERS";

    private final MedicalPersonnelRepository repository;
    private final MedicalPersonnelMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;

    // === Queries ===

    /**
     * Returns paginated personnel, optionally filtered by a search keyword.
     *
     * When a search term is provided, personnel are matched against
     * name, licenseNo, or specialization using case-insensitive LIKE.
     * Only active personnel are returned by default.
     *
     * @param search   optional keyword (null or blank returns all active personnel)
     * @param pageable pagination and sorting parameters
     * @return paged response of personnel DTOs
     */
    public PagedResponse<MedicalPersonnelDto> findAll(String search, Pageable pageable) {
        Specification<MedicalPersonnel> spec = activeSpec().and(buildSearchSpec(search));
        Page<MedicalPersonnel> page = repository.findAll(spec, pageable);
        List<MedicalPersonnelDto> content = page.getContent().stream()
                .map(mapper::toDto)
                .toList();
        return PagedResponse.of(content, page);
    }

    /**
     * Returns all active personnel matching the search keyword (unpaginated).
     * Used by the medical personnel selection dialog for quick lookup.
     *
     * @param search optional keyword to filter by name, license, or specialization
     * @return list of matching active personnel DTOs
     */
    public List<MedicalPersonnelDto> search(String search) {
        Specification<MedicalPersonnel> spec = activeSpec().and(buildSearchSpec(search));
        List<MedicalPersonnel> results = repository.findAll(spec);
        return results.stream()
                .map(mapper::toDto)
                .toList();
    }

    /**
     * Finds personnel by UUID or throws {@link NotFoundException}.
     *
     * @param id the personnel UUID
     * @return the matching personnel DTO
     * @throws NotFoundException if no personnel exists with the given ID
     */
    public MedicalPersonnelDto findById(UUID id) {
        MedicalPersonnel entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("MedicalPersonnel", id));
        return mapper.toDto(entity);
    }

    // === Commands ===

    /**
     * Creates a new medical personnel record.
     *
     * Client-supplied system fields (id, personnelId, createdDate, updatedDate)
     * are cleared before persistence. A business ID with prefix {@code PERS}
     * is generated server-side.
     *
     * @param dto the personnel data from the client
     * @return the persisted personnel with server-generated fields populated
     */
    @Transactional
    public MedicalPersonnelDto create(MedicalPersonnelDto dto) {
        MedicalPersonnel entity = mapper.toEntity(dto);
        clearSystemFields(entity);
        entity.setPersonnelId(businessIdGenerator.generateId(BUSINESS_ID_PREFIX));

        if (entity.getActive() == null) {
            entity.setActive(true);
        }

        MedicalPersonnel saved = repository.save(entity);
        log.info("Medical personnel created — personnelId: {}, name: {}", saved.getPersonnelId(), saved.getName());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing medical personnel record.
     *
     * Mutable data fields are updated from the DTO; system fields
     * (id, personnelId, createdDate) are preserved.
     *
     * @param id  the UUID of the personnel to update
     * @param dto the updated personnel data
     * @return the updated personnel DTO
     * @throws NotFoundException if no personnel exists with the given ID
     */
    @Transactional
    public MedicalPersonnelDto update(UUID id, MedicalPersonnelDto dto) {
        MedicalPersonnel existing = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("MedicalPersonnel", id));

        mapper.updateEntity(dto, existing);

        MedicalPersonnel saved = repository.save(existing);
        log.info("Medical personnel updated — personnelId: {}, id: {}", saved.getPersonnelId(), id);
        return mapper.toDto(saved);
    }

    // === Helpers ===

    /**
     * Clears system-managed fields so client-supplied values are never persisted.
     */
    private void clearSystemFields(MedicalPersonnel entity) {
        entity.setId(null);
        entity.setPersonnelId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }

    /**
     * Builds a specification that filters only active personnel.
     */
    private Specification<MedicalPersonnel> activeSpec() {
        return (root, query, cb) -> cb.equal(root.get("active"), true);
    }

    /**
     * Builds a JPA Specification for searching personnel by keyword.
     *
     * Matches the search term (case-insensitive) against name, licenseNo, or specialization.
     * Returns an unrestricted spec when the search term is null or blank.
     *
     * @param search the keyword to match
     * @return a Specification for filtering
     */
    private Specification<MedicalPersonnel> buildSearchSpec(String search) {
        if (search == null || search.isBlank()) {
            return Specification.where(null);
        }
        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), pattern),
                cb.like(cb.lower(root.get("licenseNo")), pattern),
                cb.like(cb.lower(root.get("specialization")), pattern)
        );
    }
}
