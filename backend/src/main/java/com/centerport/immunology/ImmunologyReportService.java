package com.centerport.immunology;

import com.centerport.common.service.AbstractProfileLinkedService;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.immunology.event.ImmunologyReportCreatedEvent;
import com.centerport.immunology.event.ImmunologyReportUpdatedEvent;
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
 * Service layer for {@link ImmunologyReport} CRUD operations.
 *
 * Extends {@link AbstractProfileLinkedService} to inherit the standard
 * profile-linked CRUD lifecycle: paginated search with keyword filtering,
 * find-by-id, find-by-profile, create with business-ID generation, and
 * update with profile re-linking.
 *
 * Business ID:
 * Each new immunology report receives a unique sequential ID in the format
 * {@code IMM00000001} generated from the PostgreSQL sequence
 * {@code imm_seq}.
 *
 * Domain Events:
 * - {@link ImmunologyReportCreatedEvent} — published after successful create
 * - {@link ImmunologyReportUpdatedEvent} — published after successful update
 *
 * @see AbstractProfileLinkedService
 * @see ImmunologyReportRepository
 * @see ImmunologyReportMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class ImmunologyReportService extends AbstractProfileLinkedService<ImmunologyReport, ImmunologyReportDto> {

    private static final String BUSINESS_ID_PREFIX = "IMM";
    private static final String ENTITY_NAME = "ImmunologyReport";
    private static final String BUSINESS_ID_FIELD = "reportId";

    private final ImmunologyReportRepository repository;
    private final ImmunologyReportMapper mapper;

    public ImmunologyReportService(ImmunologyReportRepository repository,
                                   ImmunologyReportMapper mapper,
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
    protected ImmunologyReportRepository getRepository() {
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
    public String getCacheName() {
        return com.centerport.config.RedisCacheConfig.IMMUNOLOGY_REPORT_CACHE;
    }

    @Override
    protected ImmunologyReportDto toDto(ImmunologyReport entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected ImmunologyReport toEntity(ImmunologyReportDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void updateEntityFromDto(ImmunologyReportDto dto, ImmunologyReport entity) {
        mapper.updateEntity(dto, entity);
    }

    @Override
    protected void setBusinessId(ImmunologyReport entity, String businessId) {
        entity.setReportId(businessId);
    }

    @Override
    protected void setEntityProfile(ImmunologyReport entity, SeafarerProfile profile) {
        entity.setSeafarerProfile(profile);
    }

    @Override
    protected UUID getProfileId(ImmunologyReportDto dto) {
        return dto.getSeafarerProfileId();
    }

    @Override
    protected List<ImmunologyReport> findEntitiesByProfileId(UUID profileId) {
        return repository.findBySeafarerProfileId(profileId,
                Sort.by(Sort.Direction.DESC, "createdDate"));
    }

    @Override
    protected void publishCreatedEvent(ImmunologyReport entity, SeafarerProfile profile) {
        eventPublisher.publishEvent(new ImmunologyReportCreatedEvent(
                entity.getId(), entity.getReportId(),
                profile.getLastName(), profile.getFirstName()));
    }

    @Override
    protected void publishUpdatedEvent(ImmunologyReport entity) {
        eventPublisher.publishEvent(new ImmunologyReportUpdatedEvent(
                entity.getId(), entity.getReportId()));
    }

    @Override
    protected void clearSystemFields(ImmunologyReport entity) {
        super.clearSystemFields(entity);
        entity.setReportId(null);
    }
}
