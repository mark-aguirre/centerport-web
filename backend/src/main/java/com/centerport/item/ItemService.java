package com.centerport.item;

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
 * Service layer for {@link Item} CRUD and search.
 *
 * Manages transactional boundaries, business-ID generation on create
 * (prefix {@code ITM}), and keyword search across name and description used by
 * both the Item Listing grid and the product selector.
 *
 * @see ItemRepository
 * @see BusinessIdGenerator
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ItemService {

    private static final String BUSINESS_ID_PREFIX = "ITM";

    private final ItemRepository repository;
    private final ItemMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;

    // === Queries ===

    /**
     * Returns paginated items, optionally filtered by a search keyword.
     *
     * @param search   optional keyword (matches name or description, case-insensitive)
     * @param pageable pagination and sorting parameters
     * @return paged response of item DTOs
     */
    @Cacheable(cacheNames = RedisCacheConfig.ITEM_CACHE,
            key = "'all:' + (#search == null ? '' : #search) + ':' + #pageable.pageNumber + ':' + #pageable.pageSize + ':' + #pageable.sort")
    public PagedResponse<ItemDto> findAll(String search, Pageable pageable) {
        Specification<Item> spec = buildSearchSpec(search);
        Page<Item> page = repository.findAll(spec, pageable);
        List<ItemDto> content = page.getContent().stream()
                .map(mapper::toDto)
                .toList();
        return PagedResponse.of(content, page);
    }

    /**
     * Returns active items matching the search keyword (unpaginated). Used by
     * the product selector in the transaction workspace.
     *
     * @param search optional keyword matching name or description
     * @return list of matching active item DTOs
     */
    @Cacheable(cacheNames = RedisCacheConfig.ITEM_CACHE,
            key = "'search:' + (#search == null ? '' : #search)")
    public List<ItemDto> search(String search) {
        Specification<Item> spec = activeSpec().and(buildSearchSpec(search));
        return repository.findAll(spec).stream()
                .map(mapper::toDto)
                .toList();
    }

    /**
     * Finds an item by UUID or throws {@link NotFoundException}.
     *
     * @param id the item UUID
     * @return the matching item DTO
     * @throws NotFoundException if no item exists with the given ID
     */
    @Cacheable(cacheNames = RedisCacheConfig.ITEM_CACHE, key = "'id:' + #id")
    public ItemDto findById(UUID id) {
        Item entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Item", id));
        return mapper.toDto(entity);
    }

    // === Commands ===

    /**
     * Creates a new item record. Client-supplied system fields are cleared and a
     * business ID (prefix {@code ITM}) is generated server-side.
     *
     * @param dto the item data from the client
     * @return the persisted item with server-generated fields populated
     */
    @Transactional
    @CacheEvict(cacheNames = RedisCacheConfig.ITEM_CACHE, allEntries = true)
    public ItemDto create(ItemDto dto) {
        Item entity = mapper.toEntity(dto);
        clearSystemFields(entity);
        entity.setItemId(businessIdGenerator.generateId(BUSINESS_ID_PREFIX));
        applyDefaults(entity);

        Item saved = repository.save(entity);
        log.info("Item created — itemId: {}, name: {}", saved.getItemId(), saved.getName());
        return mapper.toDto(saved);
    }

    /**
     * Updates an existing item record. System fields (id, itemId, createdDate)
     * are preserved.
     *
     * @param id  the UUID of the item to update
     * @param dto the updated item data
     * @return the updated item DTO
     * @throws NotFoundException if no item exists with the given ID
     */
    @Transactional
    @CacheEvict(cacheNames = RedisCacheConfig.ITEM_CACHE, allEntries = true)
    public ItemDto update(UUID id, ItemDto dto) {
        Item existing = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Item", id));

        mapper.updateEntity(dto, existing);
        applyDefaults(existing);

        Item saved = repository.save(existing);
        log.info("Item updated — itemId: {}, id: {}", saved.getItemId(), id);
        return mapper.toDto(saved);
    }

    /**
     * Deletes an item by UUID.
     *
     * @param id the item UUID
     * @throws NotFoundException if no item exists with the given ID
     */
    @Transactional
    @CacheEvict(cacheNames = RedisCacheConfig.ITEM_CACHE, allEntries = true)
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Item", id);
        }
        repository.deleteById(id);
        log.info("Item deleted — id: {}", id);
    }

    // === Helpers ===

    /** Clears system-managed fields so client-supplied values are never persisted. */
    private void clearSystemFields(Item entity) {
        entity.setId(null);
        entity.setItemId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }

    /** Applies non-null defaults for optional flags/amounts. */
    private void applyDefaults(Item entity) {
        if (entity.getPrice() == null) {
            entity.setPrice(java.math.BigDecimal.ZERO);
        }
        if (entity.getProfessionalFee() == null) {
            entity.setProfessionalFee(java.math.BigDecimal.ZERO);
        }
        if (entity.getIsPackage() == null) {
            entity.setIsPackage(false);
        }
        if (entity.getActive() == null) {
            entity.setActive(true);
        }
    }

    /** Filters only active items. */
    private Specification<Item> activeSpec() {
        return (root, query, cb) -> cb.equal(root.get("active"), true);
    }

    /**
     * Builds a case-insensitive keyword specification matching name or
     * description. Returns an unrestricted spec when the term is null or blank.
     */
    private Specification<Item> buildSearchSpec(String search) {
        if (search == null || search.isBlank()) {
            return Specification.where(null);
        }
        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), pattern),
                cb.like(cb.lower(root.get("description")), pattern));
    }
}
