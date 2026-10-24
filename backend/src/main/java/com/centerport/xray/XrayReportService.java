package com.centerport.xray;

import com.centerport.common.service.AbstractProfileLinkedService;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileRepository;
import com.centerport.xray.event.XrayReportCreatedEvent;
import com.centerport.xray.event.XrayReportUpdatedEvent;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service layer for {@link XrayReport} CRUD operations.
 *
 * Extends {@link AbstractProfileLinkedService} to inherit the standard
 * profile-linked CRUD lifecycle: paginated search with keyword filtering,
 * find-by-id, find-by-profile, create with business-ID generation, and
 * update with profile re-linking.
 *
 * Business ID:
 * Each new x-ray report receives a unique sequential ID in the format
 * {@code XRAY00000001} generated from the PostgreSQL sequence {@code xray_seq}.
 *
 * Domain Events:
 * - {@link XrayReportCreatedEvent} — published after successful create
 * - {@link XrayReportUpdatedEvent} — published after successful update
 *
 * @see AbstractProfileLinkedService
 * @see XrayReportRepository
 * @see XrayReportMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class XrayReportService extends AbstractProfileLinkedService<XrayReport, XrayReportDto> {

    private static final String BUSINESS_ID_PREFIX = "XRAY";
    private static final String ENTITY_NAME = "XrayReport";
    private static final String BUSINESS_ID_FIELD = "reportId";

    private final XrayReportRepository repository;
    private final XrayReportMapper mapper;

    public XrayReportService(XrayReportRepository repository,
                             XrayReportMapper mapper,
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
    protected XrayReportRepository getRepository() {
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
        return com.centerport.config.RedisCacheConfig.XRAY_REPORT_CACHE;
    }

    @Override
    protected XrayReportDto toDto(XrayReport entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected XrayReport toEntity(XrayReportDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void updateEntityFromDto(XrayReportDto dto, XrayReport entity) {
        mapper.updateEntity(dto, entity);
    }

    @Override
    protected void setBusinessId(XrayReport entity, String businessId) {
        entity.setReportId(businessId);
    }

    @Override
    protected void setEntityProfile(XrayReport entity, SeafarerProfile profile) {
        entity.setSeafarerProfile(profile);
    }

    @Override
    protected UUID getProfileId(XrayReportDto dto) {
        return dto.getSeafarerProfileId();
    }

    @Override
    protected List<XrayReport> findEntitiesByProfileId(UUID profileId) {
        return repository.findBySeafarerProfileId(profileId,
                Sort.by(Sort.Direction.DESC, "createdDate"));
    }

    @Override
    protected void publishCreatedEvent(XrayReport entity, SeafarerProfile profile) {
        eventPublisher.publishEvent(new XrayReportCreatedEvent(
                entity.getId(), entity.getReportId(),
                profile.getLastName(), profile.getFirstName()));
    }

    @Override
    protected void publishUpdatedEvent(XrayReport entity) {
        eventPublisher.publishEvent(new XrayReportUpdatedEvent(
                entity.getId(), entity.getReportId()));
    }

    @Override
    protected void clearSystemFields(XrayReport entity) {
        super.clearSystemFields(entity);
        entity.setReportId(null);
    }
}
