package com.centerport.hiv;

import com.centerport.common.service.AbstractProfileLinkedService;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.hiv.event.HivReportCreatedEvent;
import com.centerport.hiv.event.HivReportUpdatedEvent;
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
 * Service layer for {@link HivReport} CRUD operations.
 *
 * Extends {@link AbstractProfileLinkedService} to inherit the standard
 * profile-linked CRUD lifecycle: paginated search with keyword filtering,
 * find-by-id, find-by-profile, create with business-ID generation, and
 * update with profile re-linking.
 *
 * Business ID:
 * Each new HIV report receives a unique sequential ID in the format
 * {@code HIV00000001} generated from the PostgreSQL sequence {@code hiv_seq}.
 *
 * Domain Events:
 * - {@link HivReportCreatedEvent} — published after successful create
 * - {@link HivReportUpdatedEvent} — published after successful update
 *
 * @see AbstractProfileLinkedService
 * @see HivReportRepository
 * @see HivReportMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class HivReportService extends AbstractProfileLinkedService<HivReport, HivReportDto> {

    private static final String BUSINESS_ID_PREFIX = "HIV";
    private static final String ENTITY_NAME = "HivReport";
    private static final String BUSINESS_ID_FIELD = "reportId";

    private final HivReportRepository repository;
    private final HivReportMapper mapper;

    public HivReportService(HivReportRepository repository,
                            HivReportMapper mapper,
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
    protected HivReportRepository getRepository() {
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
        return com.centerport.config.RedisCacheConfig.HIV_REPORT_CACHE;
    }

    @Override
    protected HivReportDto toDto(HivReport entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected HivReport toEntity(HivReportDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void updateEntityFromDto(HivReportDto dto, HivReport entity) {
        mapper.updateEntity(dto, entity);
    }

    @Override
    protected void setBusinessId(HivReport entity, String businessId) {
        entity.setReportId(businessId);
    }

    @Override
    protected void setEntityProfile(HivReport entity, SeafarerProfile profile) {
        entity.setSeafarerProfile(profile);
    }

    @Override
    protected UUID getProfileId(HivReportDto dto) {
        return dto.getSeafarerProfileId();
    }

    @Override
    protected List<HivReport> findEntitiesByProfileId(UUID profileId) {
        return repository.findBySeafarerProfileId(profileId,
                Sort.by(Sort.Direction.DESC, "createdDate"));
    }

    @Override
    protected void publishCreatedEvent(HivReport entity, SeafarerProfile profile) {
        eventPublisher.publishEvent(new HivReportCreatedEvent(
                entity.getId(), entity.getReportId(),
                profile.getLastName(), profile.getFirstName()));
    }

    @Override
    protected void publishUpdatedEvent(HivReport entity) {
        eventPublisher.publishEvent(new HivReportUpdatedEvent(
                entity.getId(), entity.getReportId()));
    }

    @Override
    protected void clearSystemFields(HivReport entity) {
        super.clearSystemFields(entity);
        entity.setReportId(null);
    }
}
