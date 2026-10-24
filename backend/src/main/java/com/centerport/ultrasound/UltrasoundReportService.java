package com.centerport.ultrasound;

import com.centerport.common.service.AbstractProfileLinkedService;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileRepository;
import com.centerport.ultrasound.event.UltrasoundReportCreatedEvent;
import com.centerport.ultrasound.event.UltrasoundReportUpdatedEvent;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service layer for {@link UltrasoundReport} CRUD operations.
 *
 * Extends {@link AbstractProfileLinkedService} to inherit the standard
 * profile-linked CRUD lifecycle: paginated search with keyword filtering,
 * find-by-id, find-by-profile, create with business-ID generation, and
 * update with profile re-linking.
 *
 * Business ID:
 * Each new ultrasound report receives a unique sequential ID in the format
 * {@code UTZ00000001} generated from the PostgreSQL sequence {@code utz_seq}.
 *
 * Domain Events:
 * - {@link UltrasoundReportCreatedEvent} — published after successful create
 * - {@link UltrasoundReportUpdatedEvent} — published after successful update
 *
 * @see AbstractProfileLinkedService
 * @see UltrasoundReportRepository
 * @see UltrasoundReportMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class UltrasoundReportService
        extends AbstractProfileLinkedService<UltrasoundReport, UltrasoundReportDto> {

    private static final String BUSINESS_ID_PREFIX = "UTZ";
    private static final String ENTITY_NAME = "UltrasoundReport";
    private static final String BUSINESS_ID_FIELD = "reportId";

    private final UltrasoundReportRepository repository;
    private final UltrasoundReportMapper mapper;

    public UltrasoundReportService(UltrasoundReportRepository repository,
                                   UltrasoundReportMapper mapper,
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
    protected UltrasoundReportRepository getRepository() {
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
        return com.centerport.config.RedisCacheConfig.ULTRASOUND_REPORT_CACHE;
    }

    @Override
    protected UltrasoundReportDto toDto(UltrasoundReport entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected UltrasoundReport toEntity(UltrasoundReportDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void updateEntityFromDto(UltrasoundReportDto dto, UltrasoundReport entity) {
        mapper.updateEntity(dto, entity);
    }

    @Override
    protected void setBusinessId(UltrasoundReport entity, String businessId) {
        entity.setReportId(businessId);
    }

    @Override
    protected void setEntityProfile(UltrasoundReport entity, SeafarerProfile profile) {
        entity.setSeafarerProfile(profile);
    }

    @Override
    protected UUID getProfileId(UltrasoundReportDto dto) {
        return dto.getSeafarerProfileId();
    }

    @Override
    protected List<UltrasoundReport> findEntitiesByProfileId(UUID profileId) {
        return repository.findBySeafarerProfileId(profileId,
                Sort.by(Sort.Direction.DESC, "createdDate"));
    }

    @Override
    protected void publishCreatedEvent(UltrasoundReport entity, SeafarerProfile profile) {
        eventPublisher.publishEvent(new UltrasoundReportCreatedEvent(
                entity.getId(), entity.getReportId(),
                profile.getLastName(), profile.getFirstName()));
    }

    @Override
    protected void publishUpdatedEvent(UltrasoundReport entity) {
        eventPublisher.publishEvent(new UltrasoundReportUpdatedEvent(
                entity.getId(), entity.getReportId()));
    }

    @Override
    protected void clearSystemFields(UltrasoundReport entity) {
        super.clearSystemFields(entity);
        entity.setReportId(null);
    }
}
