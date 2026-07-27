package com.centerport.landbase;

import com.centerport.common.service.AbstractProfileLinkedService;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.landbase.event.LandbasePemeCreatedEvent;
import com.centerport.landbase.event.LandbasePemeUpdatedEvent;
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
 * Service layer for LandbasePeme CRUD operations.
 *
 * Extends {@link AbstractProfileLinkedService} to inherit the standard
 * profile-linked CRUD lifecycle (paginated search, find-by-id, find-by-profile,
 * create with business-ID generation, and update with profile re-linking).
 *
 * Business ID:
 * Each new PEME record receives a unique sequential ID in the format
 * {@code PEME00000001} generated from the PostgreSQL sequence {@code peme_seq}.
 *
 * @see AbstractProfileLinkedService
 * @see LandbasePemeRepository
 * @see LandbasePemeMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class LandbasePemeService extends AbstractProfileLinkedService<LandbasePeme, LandbasePemeDto> {

    private static final String BUSINESS_ID_PREFIX = "PEME";
    private static final String ENTITY_NAME = "LandbasePeme";
    private static final String BUSINESS_ID_FIELD = "pemeId";

    private final LandbasePemeRepository repository;
    private final LandbasePemeMapper mapper;

    public LandbasePemeService(LandbasePemeRepository repository,
                               LandbasePemeMapper mapper,
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
    protected LandbasePemeRepository getRepository() {
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
    protected LandbasePemeDto toDto(LandbasePeme entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected LandbasePeme toEntity(LandbasePemeDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void updateEntityFromDto(LandbasePemeDto dto, LandbasePeme entity) {
        mapper.updateEntity(dto, entity);
    }

    @Override
    protected void setBusinessId(LandbasePeme entity, String businessId) {
        entity.setPemeId(businessId);
    }

    @Override
    protected void setEntityProfile(LandbasePeme entity, SeafarerProfile profile) {
        entity.setSeafarerProfile(profile);
    }

    @Override
    protected UUID getProfileId(LandbasePemeDto dto) {
        return dto.getSeafarerProfileId();
    }

    @Override
    protected List<LandbasePeme> findEntitiesByProfileId(UUID profileId) {
        return repository.findBySeafarerProfileId(profileId,
                Sort.by(Sort.Direction.DESC, "createdDate"));
    }

    @Override
    protected void publishCreatedEvent(LandbasePeme entity, SeafarerProfile profile) {
        eventPublisher.publishEvent(new LandbasePemeCreatedEvent(
                entity.getId(), entity.getPemeId(),
                profile.getLastName(), profile.getFirstName()));
    }

    @Override
    protected void publishUpdatedEvent(LandbasePeme entity) {
        eventPublisher.publishEvent(new LandbasePemeUpdatedEvent(
                entity.getId(), entity.getPemeId()));
    }

    @Override
    protected void clearSystemFields(LandbasePeme entity) {
        super.clearSystemFields(entity);
        entity.setPemeId(null);
    }
}
