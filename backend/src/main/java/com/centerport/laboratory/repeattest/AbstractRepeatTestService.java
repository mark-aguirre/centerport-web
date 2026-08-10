package com.centerport.laboratory.repeattest;

import com.centerport.common.entity.BaseEntity;
import com.centerport.common.exception.NotFoundException;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.laboratory.LaboratoryReport;
import com.centerport.laboratory.LaboratoryReportRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Abstract base class for repeat test service implementations.
 *
 * Encapsulates the shared CRUD lifecycle for all repeat test types
 * (Hematology, Chemistry, Urinalysis, Fecalysis). Each repeat test is a
 * child record of a {@link LaboratoryReport}, receives a sequenced
 * business ID at creation, and supports find-by-report, find-by-id,
 * create, update, and delete operations.
 *
 * Subclasses provide:
 * - The concrete repository, mapper, and entity/DTO types via template methods
 * - The business ID prefix for sequence generation
 * - The entity name for log messages and error responses
 *
 * Template Method Pattern:
 * The CRUD lifecycle is defined here; subclasses supply domain-specific
 * hooks for entity-to-DTO conversion, entity construction, and field-level
 * update application.
 *
 * @param <E> the entity type extending {@link BaseEntity}
 * @param <D> the DTO type
 *
 * @see HematologyRepeatTestService
 * @see ChemistryRepeatTestService
 * @see UrinalysisRepeatTestService
 * @see FecalysisRepeatTestService
 */
@Slf4j
@Transactional(readOnly = true)
public abstract class AbstractRepeatTestService<E extends BaseEntity, D> {

    protected final LaboratoryReportRepository laboratoryReportRepository;
    protected final BusinessIdGenerator businessIdGenerator;

    protected AbstractRepeatTestService(LaboratoryReportRepository laboratoryReportRepository,
                                        BusinessIdGenerator businessIdGenerator) {
        this.laboratoryReportRepository = laboratoryReportRepository;
        this.businessIdGenerator = businessIdGenerator;
    }

    // =======================================================================
    // Template Methods — implemented by subclasses
    // =======================================================================

    /**
     * Returns the JPA repository for the concrete entity type.
     *
     * @return the entity repository
     */
    protected abstract JpaRepository<E, UUID> getRepository();

    /**
     * Returns the business ID prefix for sequence generation
     * (e.g., {@code "HEMA"}, {@code "CHEM"}).
     *
     * @return the prefix string
     */
    protected abstract String getBusinessIdPrefix();

    /**
     * Returns the entity name used in log messages and exception descriptions.
     *
     * @return human-readable entity name
     */
    protected abstract String getEntityName();

    /**
     * Finds all entities belonging to a specific laboratory report.
     *
     * @param reportId the parent report UUID
     * @param sort     sorting criteria
     * @return list of matching entities
     */
    protected abstract List<E> findEntitiesByReportId(UUID reportId, Sort sort);

    /**
     * Converts an entity to its DTO representation.
     *
     * @param entity the source entity
     * @return the mapped DTO
     */
    protected abstract D toDto(E entity);

    /**
     * Creates a new entity from a DTO. System-managed fields are expected
     * to be cleared by the caller after this method returns.
     *
     * @param dto the source DTO
     * @return a new entity populated with DTO field values
     */
    protected abstract E toEntity(D dto);

    /**
     * Updates an existing entity in place from DTO values.
     *
     * @param dto    the source DTO with updated values
     * @param entity the target entity to update
     */
    protected abstract void updateEntityFromDto(D dto, E entity);

    /**
     * Sets the generated business ID on the entity.
     *
     * @param entity     the target entity
     * @param businessId the generated ID string
     */
    protected abstract void setBusinessId(E entity, String businessId);

    /**
     * Links the entity to its parent laboratory report.
     *
     * @param entity the target entity
     * @param report the parent report
     */
    protected abstract void setLaboratoryReport(E entity, LaboratoryReport report);

    // =======================================================================
    // Public CRUD Operations
    // =======================================================================

    /**
     * Returns all repeat tests for a given laboratory report, sorted by
     * creation date descending (most recent first).
     *
     * @param reportId the parent laboratory report UUID
     * @return list of repeat test DTOs
     */
    public List<D> findByReportId(UUID reportId) {
        List<E> entities = findEntitiesByReportId(reportId,
                Sort.by(Sort.Direction.DESC, "createdDate"));
        return entities.stream().map(this::toDto).toList();
    }

    /**
     * Finds a single repeat test by its UUID.
     *
     * @param id the repeat test UUID
     * @return the matching DTO
     * @throws NotFoundException if no record exists with the given ID
     */
    public D findById(UUID id) {
        E entity = getRepository().findById(id)
                .orElseThrow(() -> {
                    log.warn("{} not found — id: {}", getEntityName(), id);
                    return new NotFoundException(getEntityName(), id);
                });
        return toDto(entity);
    }

    /**
     * Creates a new repeat test linked to the specified laboratory report.
     * Generates a business ID and clears client-supplied system fields.
     *
     * @param reportId the parent laboratory report UUID
     * @param dto      the repeat test data
     * @return the created DTO with server-generated fields populated
     * @throws NotFoundException if the parent report does not exist
     */
    @Transactional
    public D create(UUID reportId, D dto) {
        LaboratoryReport report = laboratoryReportRepository.findById(reportId)
                .orElseThrow(() -> {
                    log.warn("LaboratoryReport not found for {} — reportId: {}",
                            getEntityName(), reportId);
                    return new NotFoundException("LaboratoryReport", reportId);
                });

        E entity = toEntity(dto);
        entity.setId(null);
        entity.setCreatedDate(null);
        entity.setUpdatedDate(null);
        setLaboratoryReport(entity, report);

        String resultId = businessIdGenerator.generateId(getBusinessIdPrefix());
        setBusinessId(entity, resultId);

        E saved = getRepository().save(entity);
        log.info("{} created — resultId: {}, reportId: {}",
                getEntityName(), resultId, reportId);
        return toDto(saved);
    }

    /**
     * Updates an existing repeat test with new field values.
     *
     * @param id  the repeat test UUID
     * @param dto the updated data
     * @return the updated DTO
     * @throws NotFoundException if no record exists with the given ID
     */
    @Transactional
    public D update(UUID id, D dto) {
        E existing = getRepository().findById(id)
                .orElseThrow(() -> {
                    log.warn("{} not found for update — id: {}", getEntityName(), id);
                    return new NotFoundException(getEntityName(), id);
                });

        updateEntityFromDto(dto, existing);
        E saved = getRepository().save(existing);
        log.info("{} updated — id: {}", getEntityName(), id);
        return toDto(saved);
    }

    /**
     * Deletes a repeat test by UUID.
     *
     * @param id the repeat test UUID
     * @throws NotFoundException if no record exists with the given ID
     */
    @Transactional
    public void delete(UUID id) {
        if (!getRepository().existsById(id)) {
            throw new NotFoundException(getEntityName(), id);
        }
        getRepository().deleteById(id);
        log.info("{} deleted — id: {}", getEntityName(), id);
    }
}
