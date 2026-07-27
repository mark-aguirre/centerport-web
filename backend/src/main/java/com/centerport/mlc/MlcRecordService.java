package com.centerport.mlc;

import com.centerport.common.service.AbstractProfileLinkedService;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.mlc.event.MlcRecordCreatedEvent;
import com.centerport.mlc.event.MlcRecordUpdatedEvent;
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
 * Service layer for MLC (Maritime Labour Convention) record CRUD operations.
 *
 * Extends {@link AbstractProfileLinkedService} to inherit the standard
 * profile-linked CRUD lifecycle (paginated search, find-by-id, find-by-profile,
 * create with business-ID generation, and update with profile re-linking).
 *
 * Business ID:
 * Each new MLC record receives a unique sequential ID in the format
 * {@code MLC00000001} generated from the PostgreSQL sequence {@code mlc_seq}.
 *
 * @see AbstractProfileLinkedService
 * @see MlcRecordRepository
 * @see MlcRecordMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class MlcRecordService extends AbstractProfileLinkedService<MlcRecord, MlcRecordDto> {

    private static final String BUSINESS_ID_PREFIX = "MLC";
    private static final String ENTITY_NAME = "MlcRecord";
    private static final String BUSINESS_ID_FIELD = "mlcId";

    private final MlcRecordRepository repository;
    private final MlcRecordMapper mapper;

    public MlcRecordService(MlcRecordRepository repository,
                            MlcRecordMapper mapper,
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
    protected MlcRecordRepository getRepository() {
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
    protected MlcRecordDto toDto(MlcRecord entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected MlcRecord toEntity(MlcRecordDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void updateEntityFromDto(MlcRecordDto dto, MlcRecord entity) {
        mapper.updateEntity(dto, entity);
    }

    @Override
    protected void setBusinessId(MlcRecord entity, String businessId) {
        entity.setMlcId(businessId);
    }

    @Override
    protected void setEntityProfile(MlcRecord entity, SeafarerProfile profile) {
        entity.setSeafarerProfile(profile);
    }

    @Override
    protected UUID getProfileId(MlcRecordDto dto) {
        return dto.getSeafarerProfileId();
    }

    @Override
    protected List<MlcRecord> findEntitiesByProfileId(UUID profileId) {
        return repository.findBySeafarerProfileId(profileId,
                Sort.by(Sort.Direction.DESC, "createdDate"));
    }

    @Override
    protected void publishCreatedEvent(MlcRecord entity, SeafarerProfile profile) {
        eventPublisher.publishEvent(new MlcRecordCreatedEvent(
                entity.getId(), entity.getMlcId(),
                profile.getLastName(), profile.getFirstName()));
    }

    @Override
    protected void publishUpdatedEvent(MlcRecord entity) {
        eventPublisher.publishEvent(new MlcRecordUpdatedEvent(
                entity.getId(), entity.getMlcId()));
    }

    @Override
    protected void clearSystemFields(MlcRecord entity) {
        super.clearSystemFields(entity);
        entity.setMlcId(null);
    }
}
