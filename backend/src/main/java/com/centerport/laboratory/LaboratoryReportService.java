package com.centerport.laboratory;

import com.centerport.common.service.AbstractProfileLinkedService;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.laboratory.event.LaboratoryReportCreatedEvent;
import com.centerport.laboratory.event.LaboratoryReportUpdatedEvent;
import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service layer for {@link LaboratoryReport} CRUD operations.
 *
 * Extends {@link AbstractProfileLinkedService} to inherit the standard
 * profile-linked CRUD lifecycle: paginated search with keyword filtering,
 * find-by-id, find-by-profile, create with business-ID generation, and
 * update with profile re-linking.
 *
 * Business ID:
 * Each new laboratory report receives a unique sequential ID in the format
 * {@code LAB00000001} generated from the PostgreSQL sequence
 * {@code lab_seq}.
 *
 * Domain Events:
 * - {@link LaboratoryReportCreatedEvent} — published after successful create
 * - {@link LaboratoryReportUpdatedEvent} — published after successful update
 *
 * @see AbstractProfileLinkedService
 * @see LaboratoryReportRepository
 * @see LaboratoryReportMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class LaboratoryReportService extends AbstractProfileLinkedService<LaboratoryReport, LaboratoryReportDto> {

    private static final String BUSINESS_ID_PREFIX = "LAB";
    private static final String ENTITY_NAME = "LaboratoryReport";
    private static final String BUSINESS_ID_FIELD = "reportId";

    private final LaboratoryReportRepository repository;
    private final LaboratoryReportMapper mapper;

    public LaboratoryReportService(LaboratoryReportRepository repository,
                                   LaboratoryReportMapper mapper,
                                   BusinessIdGenerator businessIdGenerator,
                                   ApplicationEventPublisher eventPublisher,
                                   SeafarerProfileRepository profileRepository) {
        super(businessIdGenerator, eventPublisher, profileRepository);
        this.repository = repository;
        this.mapper = mapper;
    }

    // =======================================================================
    // Template Method Implementations
    // =======================================================================

    @Override
    @SuppressWarnings("unchecked")
    protected LaboratoryReportRepository getRepository() {
        return repository;
    }

    @Override
    protected String getBusinessIdPrefix() {
        return BUSINESS_ID_PREFIX;
    }

    @Override
    protected String getEntityName() {
        return ENTITY_NAME;
    }

    @Override
    protected String getBusinessIdField() {
        return BUSINESS_ID_FIELD;
    }

    @Override
    protected LaboratoryReportDto toDto(LaboratoryReport entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected LaboratoryReport toEntity(LaboratoryReportDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void updateEntityFromDto(LaboratoryReportDto dto, LaboratoryReport entity) {
        mapper.updateEntity(dto, entity);
    }

    @Override
    protected void setBusinessId(LaboratoryReport entity, String businessId) {
        entity.setReportId(businessId);
    }

    @Override
    protected void setEntityProfile(LaboratoryReport entity, SeafarerProfile profile) {
        entity.setSeafarerProfile(profile);
    }

    @Override
    protected UUID getProfileId(LaboratoryReportDto dto) {
        return dto.getSeafarerProfileId();
    }

    @Override
    protected List<LaboratoryReport> findEntitiesByProfileId(UUID profileId) {
        return repository.findBySeafarerProfileId(profileId,
                Sort.by(Sort.Direction.DESC, "createdDate"));
    }

    @Override
    protected void publishCreatedEvent(LaboratoryReport entity, SeafarerProfile profile) {
        eventPublisher.publishEvent(new LaboratoryReportCreatedEvent(
                entity.getId(), entity.getReportId(),
                profile.getLastName(), profile.getFirstName()));
    }

    @Override
    protected void publishUpdatedEvent(LaboratoryReport entity) {
        eventPublisher.publishEvent(new LaboratoryReportUpdatedEvent(
                entity.getId(), entity.getReportId()));
    }

    @Override
    protected void clearSystemFields(LaboratoryReport entity) {
        super.clearSystemFields(entity);
        entity.setReportId(null);
    }
}
