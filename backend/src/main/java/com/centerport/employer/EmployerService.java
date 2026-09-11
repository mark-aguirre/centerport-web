package com.centerport.employer;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.NotFoundException;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.config.RedisCacheConfig;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service layer for Employer CRUD operations.
 *
 * Manages transactional boundaries, business-ID generation on create,
 * and search functionality for the employer selection field.
 *
 * Business ID Format:
 * Generated IDs use the prefix {@code EMPL} followed by an 8-digit
 * zero-padded sequence number (e.g., {@code EMPL00000001}).
 *
 * @see EmployerRepository
 * @see BusinessIdGenerator
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class EmployerService {

    private static final String BUSINESS_ID_PREFIX = "EMPL";

    private final EmployerRepository repository;
    private final EmployerMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;

    // === Queries ===

    /**
     * Returns paginated employers, optionally filtered by a search keyword.
     *
     * When a search term is provided, employers are matched against name
     * using case-insensitive LIKE. Only active employers are returned.
     *
     * @param search   optional keyword (null or blank returns all active employers)
     * @param pageable pagination and sorting parameters
     * @return paged response of employer DTOs
     */
    @Cacheable(cacheNames = RedisCacheConfig.EMPLOYER_CACHE,
            key = "'all:' + (#search == null ? '' : #search) + ':' + #pageable.pageNumber + ':' + #pageable.pageSize + ':' + #pageable.sort")
    public PagedResponse<EmployerDto> findAll(String search, Pageable pageable) {
        Specification<Employer> spec = activeSpec().and(buildSearchSpec(search));
        Page<Employer> page = repository.findAll(spec, pageable);
        List<EmployerDto> content = page.getContent().stream()
                .map(mapper::toDto)
                .toList();
        return PagedResponse.of(content, page);
    }

    /**
     * Returns all active employers matching the search keyword (unpaginated).
     * Used by the employer selection field for quick lookup.
     *
     * @param search optional keyword to filter by name
     * @return list of matching active employer DTOs
     */
    @Cacheable(cacheNames = RedisCacheConfig.EMPLOYER_CACHE,
            key = "'search:' + (#search == null ? '' : #search)")
    public List<EmployerDto> search(String search) {
        Specification<Employer> spec = activeSpec().and(buildSearchSpec(search));
        List<Employer> results = repository.findAll(spec);
        return results.stream()
                .map(mapper::toDto)
                .toList();
    }

    /**
     * Finds an employer by UUID or throws {@link NotFoundException}.
     *
     * @param id the employer UUID
     * @return the matching employer DTO
     * @throws NotFoundException if no employer exists with the given ID
     */
    @Cacheable(cacheNames = RedisCacheConfig.EMPLOYER_CACHE, key = "'id:' + #id")
    public EmployerDto findById(UUID id) {
        Employer entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Employer", id));
        return mapper.toDto(entity);
    }

    // === Commands ===

    /**
     * Creates a new employer record.
     *
     * Client-supplied system fields (id, employerId, createdDate, updatedDate)
     * are cleared before persistence. A business ID with prefix {@code EMPL}
     * is generated server-side.
     *
     * @param dto the employer data from the client
     * @return the persisted employer with server-generated fields populated
     */
    @Transactional
    @CacheEvict(cacheNames = RedisCacheConfig.EMPLOYER_CACHE, allEntries = true)
    public EmployerDto create(EmployerDto dto) {
        Employer entity = mapper.toEntity(dto);
        clearSystemFields(entity);
        entity.setEmployerId(businessIdGenerator.generateId(BUSINESS_ID_PREFIX));

        if (entity.getActive() == null) {
            entity.setActive(true);
        }

        Employer saved = repository.save(entity);
        log.info("Employer created — employerId: {}, name: {}", saved.getEmployerId(), saved.getName());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing employer record.
     *
     * Mutable data fields are updated from the DTO; system fields
     * (id, employerId, createdDate) are preserved.
     *
     * @param id  the UUID of the employer to update
     * @param dto the updated employer data
     * @return the updated employer DTO
     * @throws NotFoundException if no employer exists with the given ID
     */
    @Transactional
    @CacheEvict(cacheNames = RedisCacheConfig.EMPLOYER_CACHE, allEntries = true)
    public EmployerDto update(UUID id, EmployerDto dto) {
        Employer existing = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Employer", id));

        mapper.updateEntity(dto, existing);

        Employer saved = repository.save(existing);
        log.info("Employer updated — employerId: {}, id: {}", saved.getEmployerId(), id);
        return mapper.toDto(saved);
    }

    // === Helpers ===

    /**
     * Clears system-managed fields so client-supplied values are never persisted.
     */
    private void clearSystemFields(Employer entity) {
        entity.setId(null);
        entity.setEmployerId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }

    /**
     * Builds a specification that filters only active employers.
     */
    private Specification<Employer> activeSpec() {
        return (root, query, cb) -> cb.equal(root.get("active"), true);
    }

    /**
     * Builds a JPA Specification for searching employers by keyword.
     *
     * Matches the search term (case-insensitive) against name.
     * Returns an unrestricted spec when the search term is null or blank.
     *
     * @param search the keyword to match
     * @return a Specification for filtering
     */
    private Specification<Employer> buildSearchSpec(String search) {
        if (search == null || search.isBlank()) {
            return Specification.where(null);
        }
        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get("name")), pattern);
    }
}
