package com.centerport.psychology;

import com.centerport.common.service.AbstractProfileLinkedService;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.psychology.event.PsychologyEvaluationCreatedEvent;
import com.centerport.psychology.event.PsychologyEvaluationUpdatedEvent;
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
 * Service layer for PsychologyEvaluation CRUD operations.
 *
 * Extends {@link AbstractProfileLinkedService} to inherit the standard
 * profile-linked CRUD lifecycle (paginated search, find-by-id, find-by-profile,
 * create with business-ID generation, and update with profile re-linking).
 *
 * Business ID:
 * Each new evaluation receives a unique sequential ID in the format
 * {@code PSYCH00000001} generated from the PostgreSQL sequence {@code psych_seq}.
 *
 * @see AbstractProfileLinkedService
 * @see PsychologyEvaluationRepository
 * @see PsychologyEvaluationMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class PsychologyEvaluationService extends AbstractProfileLinkedService<PsychologyEvaluation, PsychologyEvaluationDto> {

    private static final String BUSINESS_ID_PREFIX = "PSYCH";
    private static final String ENTITY_NAME = "PsychologyEvaluation";
    private static final String BUSINESS_ID_FIELD = "evalId";

    private final PsychologyEvaluationRepository repository;
    private final PsychologyEvaluationMapper mapper;

    public PsychologyEvaluationService(PsychologyEvaluationRepository repository,
                                       PsychologyEvaluationMapper mapper,
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
    protected PsychologyEvaluationRepository getRepository() {
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
    protected PsychologyEvaluationDto toDto(PsychologyEvaluation entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected PsychologyEvaluation toEntity(PsychologyEvaluationDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void updateEntityFromDto(PsychologyEvaluationDto dto, PsychologyEvaluation entity) {
        mapper.updateEntity(dto, entity);
    }

    @Override
    protected void setBusinessId(PsychologyEvaluation entity, String businessId) {
        entity.setEvalId(businessId);
    }

    @Override
    protected void setEntityProfile(PsychologyEvaluation entity, SeafarerProfile profile) {
        entity.setSeafarerProfile(profile);
    }

    @Override
    protected UUID getProfileId(PsychologyEvaluationDto dto) {
        return dto.getSeafarerProfileId();
    }

    @Override
    protected List<PsychologyEvaluation> findEntitiesByProfileId(UUID profileId) {
        return repository.findBySeafarerProfileId(profileId,
                Sort.by(Sort.Direction.DESC, "createdDate"));
    }

    @Override
    protected void publishCreatedEvent(PsychologyEvaluation entity, SeafarerProfile profile) {
        eventPublisher.publishEvent(new PsychologyEvaluationCreatedEvent(
                entity.getId(), entity.getEvalId(),
                profile.getLastName(), profile.getFirstName()));
    }

    @Override
    protected void publishUpdatedEvent(PsychologyEvaluation entity) {
        eventPublisher.publishEvent(new PsychologyEvaluationUpdatedEvent(
                entity.getId(), entity.getEvalId()));
    }

    @Override
    protected void clearSystemFields(PsychologyEvaluation entity) {
        super.clearSystemFields(entity);
        entity.setEvalId(null);
    }
}
