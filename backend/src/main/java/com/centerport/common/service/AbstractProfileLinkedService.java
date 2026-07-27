package com.centerport.common.service;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.entity.BaseEntity;
import com.centerport.common.exception.NotFoundException;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileRepository;

import jakarta.persistence.criteria.Join;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Abstract base service for domain entities that link to a {@link SeafarerProfile}.
 *
 * Encapsulates the shared CRUD lifecycle common to all examination/certificate
 * modules: paginated search with profile-field filtering, find-by-id, find-by-profile,
 * create (with business-ID generation), and update (with profile re-linking).
 *
 * Template Method Hooks:
 * Subclasses implement thin hooks to supply module-specific details:
 * - {@link #getBusinessIdPrefix()} — the sequence prefix (e.g., "PEME", "MED")
 * - {@link #getEntityName()} — display name for error messages
 * - {@link #getBusinessIdField()} — entity field holding the business ID
 * - {@link #toDto(BaseEntity)} — entity-to-DTO conversion
 * - {@link #toEntity(Object)} — DTO-to-entity conversion
 * - {@link #updateEntityFromDto(Object, BaseEntity)} — partial update mapping
 * - {@link #setBusinessId(BaseEntity, String)} — sets the generated business ID
 * - {@link #setEntityProfile(BaseEntity, SeafarerProfile)} — links the profile
 * - {@link #getProfileId(Object)} — extracts the profile UUID from the DTO
 * - {@link #publishCreatedEvent(BaseEntity, SeafarerProfile)} — domain event on create
 * - {@link #publishUpdatedEvent(BaseEntity)} — domain event on update
 *
 * Thread Safety:
 * Instances are Spring singletons. All mutable state is scoped to individual
 * method invocations (no shared mutable fields).
 *
 * @param <E> the entity type (must extend {@link BaseEntity})
 * @param <D> the DTO type
 * @see BaseEntity
 * @see BusinessIdGenerator
 * @see SeafarerProfileRepository
 */
@Slf4j
public abstract class AbstractProfileLinkedService<E extends BaseEntity, D> {

    protected final BusinessIdGenerator businessIdGenerator;
    protected final ApplicationEventPublisher eventPublisher;
    protected final SeafarerProfileRepository profileRepository;

    protected AbstractProfileLinkedService(BusinessIdGenerator businessIdGenerator,
                                           ApplicationEventPublisher eventPublisher,
                                           SeafarerProfileRepository profileRepository) {
        this.businessIdGenerator = businessIdGenerator;
        this.eventPublisher = eventPublisher;
        this.profileRepository = profileRepository;
    }

    // =======================================================================
    // Template Method Hooks — Subclasses Must Implement
    // =======================================================================

    /**
     * Returns the repository for the entity type.
     *
     * @return JPA repository supporting CRUD, paging, and specification queries
     */
    protected abstract <R extends JpaRepository<E, UUID> & JpaSpecificationExecutor<E>> R getRepository();

    /**
     * Returns the business ID prefix for sequence generation (e.g., "PEME", "MED", "MLC", "PAN").
     */
    protected abstract String getBusinessIdPrefix();

    /**
     * Returns the entity display name used in error messages and logs.
     */
    protected abstract String getEntityName();

    /**
     * Returns the entity field name holding the business ID (e.g., "pemeId", "examId").
     * Used in search specification construction.
     */
    protected abstract String getBusinessIdField();

    /**
     * Converts an entity to its DTO representation.
     *
     * @param entity the entity to convert
     * @return the corresponding DTO
     */
    protected abstract D toDto(E entity);

    /**
     * Converts a DTO to a new entity instance (for create operations).
     *
     * @param dto the source DTO
     * @return a new entity populated from the DTO
     */
    protected abstract E toEntity(D dto);

    /**
     * Updates an existing entity from a DTO (for update operations).
     * System fields (id, businessId, timestamps) must NOT be overwritten.
     *
     * @param dto    the source DTO with updated values
     * @param entity the target entity to update in place
     */
    protected abstract void updateEntityFromDto(D dto, E entity);

    /**
     * Sets the generated business ID on the entity.
     *
     * @param entity     the entity to update
     * @param businessId the generated business ID string
     */
    protected abstract void setBusinessId(E entity, String businessId);

    /**
     * Links the seafarer profile to the entity.
     *
     * @param entity  the entity to update
     * @param profile the resolved profile
     */
    protected abstract void setEntityProfile(E entity, SeafarerProfile profile);

    /**
     * Extracts the seafarer profile UUID from the DTO.
     *
     * @param dto the source DTO
     * @return the profile UUID
     */
    protected abstract UUID getProfileId(D dto);

    /**
     * Publishes a domain event after successful entity creation.
     *
     * @param entity  the persisted entity
     * @param profile the linked seafarer profile
     */
    protected abstract void publishCreatedEvent(E entity, SeafarerProfile profile);

    /**
     * Publishes a domain event after successful entity update.
     *
     * @param entity the updated entity
     */
    protected abstract void publishUpdatedEvent(E entity);

    /**
     * Returns the repository method reference for finding entities by profile ID.
     * Default implementation uses the specification executor. Override if the
     * repository provides a dedicated finder method.
     *
     * @param profileId the seafarer profile UUID
     * @return list of entities for the given profile, sorted by createdDate DESC
     */
    protected abstract List<E> findEntitiesByProfileId(UUID profileId);

    // =======================================================================
    // Query Operations
    // =======================================================================

    /**
     * Returns paginated records, optionally filtered by a search keyword.
     *
     * When a search term is provided, records are matched against the linked
     * seafarer profile's lastName, firstName, or the entity's business ID
     * using case-insensitive LIKE.
     *
     * @param search   optional keyword (null or blank returns all)
     * @param pageable pagination and sorting parameters
     * @return paged response of DTOs
     */
    @Transactional(readOnly = true)
    public PagedResponse<D> findAll(String search, Pageable pageable) {
        Specification<E> spec = buildSearchSpec(search);
        Page<E> page = getRepository().findAll(spec, pageable);
        List<D> content = page.getContent().stream()
                .map(this::toDto)
                .toList();
        return PagedResponse.of(content, page);
    }

    /**
     * Finds a record by UUID or throws {@link NotFoundException}.
     *
     * @param id the entity's primary key
     * @return the matching DTO
     * @throws NotFoundException if no record exists with the given ID
     */
    @Transactional(readOnly = true)
    public D findById(UUID id) {
        E entity = getRepository().findById(id)
                .orElseThrow(() -> {
                    log.warn("{} not found — id: {}", getEntityName(), id);
                    return new NotFoundException(getEntityName(), id);
                });
        return toDto(entity);
    }

    /**
     * Returns all records linked to a specific seafarer profile,
     * sorted by creation date descending (most recent first).
     *
     * @param profileId the seafarer profile UUID
     * @return list of DTOs for the given profile
     */
    @Transactional(readOnly = true)
    public List<D> findByProfileId(UUID profileId) {
        List<E> records = findEntitiesByProfileId(profileId);
        return records.stream().map(this::toDto).toList();
    }

    // =======================================================================
    // Mutation Operations
    // =======================================================================

    /**
     * Creates a new record. Client-supplied system fields (id, businessId,
     * createdDate, updatedDate) are cleared. A business ID is generated
     * server-side and the seafarer profile is resolved from the DTO.
     *
     * @param dto the data to persist
     * @return the created record with server-generated fields populated
     * @throws NotFoundException if the referenced seafarer profile does not exist
     */
    @Transactional
    public D create(D dto) {
        SeafarerProfile profile = resolveProfile(getProfileId(dto));

        E entity = toEntity(dto);
        clearSystemFields(entity);
        setEntityProfile(entity, profile);

        String businessId = businessIdGenerator.generateId(getBusinessIdPrefix());
        setBusinessId(entity, businessId);
        log.debug("Business ID generated — {}: {}", getBusinessIdField(), businessId);

        E saved = getRepository().save(entity);
        setEntityProfile(saved, profile);

        publishCreatedEvent(saved, profile);

        log.info("{} created — {}: {}, id: {}, profileId: {}",
                getEntityName(), getBusinessIdField(), businessId,
                saved.getId(), profile.getId());
        return toDto(saved);
    }

    /**
     * Updates an existing record. Mutable data fields are updated from the DTO;
     * system fields (id, businessId, createdDate) are preserved. If a different
     * seafarerProfileId is provided, the profile link is updated.
     *
     * @param id  the entity's primary key
     * @param dto the updated data
     * @return the updated DTO
     * @throws NotFoundException if no record exists with the given ID or profile not found
     */
    @Transactional
    public D update(UUID id, D dto) {
        E existing = getRepository().findById(id)
                .orElseThrow(() -> {
                    log.warn("{} not found for update — id: {}", getEntityName(), id);
                    return new NotFoundException(getEntityName(), id);
                });

        SeafarerProfile profile = resolveProfile(getProfileId(dto));
        setEntityProfile(existing, profile);

        updateEntityFromDto(dto, existing);

        E saved = getRepository().save(existing);
        setEntityProfile(saved, profile);

        publishUpdatedEvent(saved);

        log.info("{} updated — id: {}", getEntityName(), id);
        return toDto(saved);
    }

    // =======================================================================
    // Shared Helpers
    // =======================================================================

    /**
     * Resolves a {@link SeafarerProfile} by UUID or throws {@link NotFoundException}.
     *
     * @param profileId the profile UUID
     * @return the resolved profile entity
     */
    protected SeafarerProfile resolveProfile(UUID profileId) {
        return profileRepository.findById(profileId)
                .orElseThrow(() -> {
                    log.warn("Seafarer profile not found — id: {}", profileId);
                    return new NotFoundException("SeafarerProfile", profileId);
                });
    }

    /**
     * Clears server-managed system fields to prevent client-supplied values
     * from being persisted on create.
     *
     * @param entity the entity to sanitize
     */
    protected void clearSystemFields(E entity) {
        entity.setId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
    }

    /**
     * Builds a JPA Specification for keyword search across linked profile
     * fields (lastName, firstName) and the entity's business ID field.
     *
     * Returns an unrestricted spec when the search term is null or blank.
     *
     * @param search the keyword to match (case-insensitive)
     * @return a Specification for filtering
     */
    protected Specification<E> buildSearchSpec(String search) {
        if (search == null || search.isBlank()) {
            return Specification.where(null);
        }
        String pattern = "%" + search.trim().toLowerCase() + "%";
        return (root, query, cb) -> {
            Join<E, SeafarerProfile> profile = root.join("seafarerProfile");
            return cb.or(
                    cb.like(cb.lower(profile.get("lastName")), pattern),
                    cb.like(cb.lower(profile.get("firstName")), pattern),
                    cb.like(cb.lower(root.get(getBusinessIdField())), pattern)
            );
        };
    }
}
