package com.centerport.panama;

import com.centerport.common.service.AbstractProfileLinkedService;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.panama.event.PanamaCertificateCreatedEvent;
import com.centerport.panama.event.PanamaCertificateUpdatedEvent;
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
 * Service layer for Panama certificate CRUD operations.
 *
 * Extends {@link AbstractProfileLinkedService} to inherit the standard
 * profile-linked CRUD lifecycle (paginated search, find-by-id, find-by-profile,
 * create with business-ID generation, and update with profile re-linking).
 *
 * Business ID:
 * Each new certificate receives a unique sequential ID in the format
 * {@code PAN00000001} generated from the PostgreSQL sequence {@code pan_seq}.
 *
 * @see AbstractProfileLinkedService
 * @see PanamaCertificateRepository
 * @see PanamaCertificateMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class PanamaCertificateService extends AbstractProfileLinkedService<PanamaCertificate, PanamaCertificateDto> {

    private static final String BUSINESS_ID_PREFIX = "PAN";
    private static final String ENTITY_NAME = "PanamaCertificate";
    private static final String BUSINESS_ID_FIELD = "panamaId";

    private final PanamaCertificateRepository repository;
    private final PanamaCertificateMapper mapper;

    public PanamaCertificateService(PanamaCertificateRepository repository,
                                    PanamaCertificateMapper mapper,
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
    protected PanamaCertificateRepository getRepository() {
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
    protected PanamaCertificateDto toDto(PanamaCertificate entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected PanamaCertificate toEntity(PanamaCertificateDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void updateEntityFromDto(PanamaCertificateDto dto, PanamaCertificate entity) {
        mapper.updateEntity(dto, entity);
    }

    @Override
    protected void setBusinessId(PanamaCertificate entity, String businessId) {
        entity.setPanamaId(businessId);
    }

    @Override
    protected void setEntityProfile(PanamaCertificate entity, SeafarerProfile profile) {
        entity.setSeafarerProfile(profile);
    }

    @Override
    protected UUID getProfileId(PanamaCertificateDto dto) {
        return dto.getSeafarerProfileId();
    }

    @Override
    protected List<PanamaCertificate> findEntitiesByProfileId(UUID profileId) {
        return repository.findBySeafarerProfileId(profileId,
                Sort.by(Sort.Direction.DESC, "createdDate"));
    }

    @Override
    protected void publishCreatedEvent(PanamaCertificate entity, SeafarerProfile profile) {
        eventPublisher.publishEvent(new PanamaCertificateCreatedEvent(
                entity.getId(), entity.getPanamaId(),
                profile.getLastName() + " " + profile.getFirstName()));
    }

    @Override
    protected void publishUpdatedEvent(PanamaCertificate entity) {
        eventPublisher.publishEvent(new PanamaCertificateUpdatedEvent(
                entity.getId(), entity.getPanamaId()));
    }

    @Override
    protected void clearSystemFields(PanamaCertificate entity) {
        super.clearSystemFields(entity);
        entity.setPanamaId(null);
    }
}
