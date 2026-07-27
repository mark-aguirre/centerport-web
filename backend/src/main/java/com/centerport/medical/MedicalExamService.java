package com.centerport.medical;

import com.centerport.common.service.AbstractProfileLinkedService;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.medical.event.MedicalExamCreatedEvent;
import com.centerport.medical.event.MedicalExamUpdatedEvent;
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
 * Service layer for MedicalExam CRUD operations.
 *
 * Extends {@link AbstractProfileLinkedService} to inherit the standard
 * profile-linked CRUD lifecycle (paginated search, find-by-id, find-by-profile,
 * create with business-ID generation, and update with profile re-linking).
 *
 * Business ID:
 * Each new exam receives a unique sequential ID in the format
 * {@code MED00000001} generated from the PostgreSQL sequence {@code med_seq}.
 *
 * @see AbstractProfileLinkedService
 * @see MedicalExamRepository
 * @see MedicalExamMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class MedicalExamService extends AbstractProfileLinkedService<MedicalExam, MedicalExamDto> {

    private static final String BUSINESS_ID_PREFIX = "MED";
    private static final String ENTITY_NAME = "MedicalExam";
    private static final String BUSINESS_ID_FIELD = "examId";

    private final MedicalExamRepository repository;
    private final MedicalExamMapper mapper;

    public MedicalExamService(MedicalExamRepository repository,
                              MedicalExamMapper mapper,
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
    protected MedicalExamRepository getRepository() {
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
    protected MedicalExamDto toDto(MedicalExam entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected MedicalExam toEntity(MedicalExamDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void updateEntityFromDto(MedicalExamDto dto, MedicalExam entity) {
        mapper.updateEntity(dto, entity);
    }

    @Override
    protected void setBusinessId(MedicalExam entity, String businessId) {
        entity.setExamId(businessId);
    }

    @Override
    protected void setEntityProfile(MedicalExam entity, SeafarerProfile profile) {
        entity.setSeafarerProfile(profile);
    }

    @Override
    protected UUID getProfileId(MedicalExamDto dto) {
        return dto.getSeafarerProfileId();
    }

    @Override
    protected List<MedicalExam> findEntitiesByProfileId(UUID profileId) {
        return repository.findBySeafarerProfileId(profileId,
                Sort.by(Sort.Direction.DESC, "createdDate"));
    }

    @Override
    protected void publishCreatedEvent(MedicalExam entity, SeafarerProfile profile) {
        eventPublisher.publishEvent(new MedicalExamCreatedEvent(
                entity.getId(), entity.getExamId(),
                profile.getLastName(), profile.getFirstName()));
    }

    @Override
    protected void publishUpdatedEvent(MedicalExam entity) {
        eventPublisher.publishEvent(new MedicalExamUpdatedEvent(
                entity.getId(), entity.getExamId()));
    }

    @Override
    protected void clearSystemFields(MedicalExam entity) {
        super.clearSystemFields(entity);
        entity.setExamId(null);
    }
}
