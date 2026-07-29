package com.centerport.visit;

import com.centerport.common.dto.PagedResponse;
import com.centerport.common.exception.NotFoundException;
import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Service layer for PatientVisit CRUD operations.
 *
 * Handles visit creation with business-ID generation (prefix VST),
 * and enriches visit DTOs with joined profile data for list display.
 *
 * @see PatientVisitRepository
 * @see BusinessIdGenerator
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PatientVisitService {

    private static final String BUSINESS_ID_PREFIX = "VST";

    private final PatientVisitRepository repository;
    private final PatientVisitMapper mapper;
    private final BusinessIdGenerator businessIdGenerator;
    private final SeafarerProfileRepository profileRepository;

    /**
     * List visits for a given date with joined profile display data.
     *
     * @param date     the visit date to filter on
     * @param pageable pagination/sorting params
     * @return paged response of visit DTOs enriched with profile info
     */
    public PagedResponse<PatientVisitDto> findByDate(LocalDate date, Pageable pageable) {
        Page<PatientVisit> page = repository.findByVisitDate(date, pageable);
        List<PatientVisitDto> content = enrichWithProfiles(page.getContent());
        return PagedResponse.of(content, page);
    }

    /**
     * Find a single visit by UUID, enriched with profile data.
     *
     * @param id the visit UUID
     * @return the visit DTO
     * @throws NotFoundException if not found
     */
    public PatientVisitDto findById(UUID id) {
        PatientVisit visit = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("PatientVisit", id));

        SeafarerProfile profile = profileRepository.findById(visit.getSeafarerProfileId())
                .orElse(null);

        return mapper.toDto(visit, profile);
    }

    /**
     * Create a new patient visit record.
     *
     * Validates that the referenced seafarer profile exists, generates a
     * business ID (VST prefix), and sets today as the visit date if not provided.
     *
     * @param dto the visit data
     * @return the persisted visit DTO with generated fields
     * @throws NotFoundException if the referenced profile does not exist
     */
    @Transactional
    public PatientVisitDto create(PatientVisitDto dto) {
        // Validate profile exists
        SeafarerProfile profile = profileRepository.findById(dto.getSeafarerProfileId())
                .orElseThrow(() -> new NotFoundException("SeafarerProfile", dto.getSeafarerProfileId()));

        PatientVisit entity = mapper.toEntity(dto);
        entity.setVisitId(businessIdGenerator.generateId(BUSINESS_ID_PREFIX));
        entity.setVisitDate(dto.getVisitDate() != null ? dto.getVisitDate() : LocalDate.now());

        PatientVisit saved = repository.save(entity);

        log.info("Visit created — visitId: {}, profileId: {}, date: {}",
                saved.getVisitId(), profile.getProfileId(), saved.getVisitDate());

        return mapper.toDto(saved, profile);
    }

    /**
     * Delete a visit record.
     *
     * @param id the visit UUID
     * @throws NotFoundException if not found
     */
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("PatientVisit", id);
        }
        repository.deleteById(id);
        log.info("Visit deleted — id: {}", id);
    }

    // === Helpers ===

    /**
     * Batch-loads profiles for a list of visits and maps to DTOs.
     */
    private List<PatientVisitDto> enrichWithProfiles(List<PatientVisit> visits) {
        if (visits.isEmpty()) return List.of();

        List<UUID> profileIds = visits.stream()
                .map(PatientVisit::getSeafarerProfileId)
                .distinct()
                .toList();

        Map<UUID, SeafarerProfile> profileMap = profileRepository.findAllById(profileIds)
                .stream()
                .collect(Collectors.toMap(SeafarerProfile::getId, Function.identity()));

        return visits.stream()
                .map(visit -> mapper.toDto(visit, profileMap.get(visit.getSeafarerProfileId())))
                .toList();
    }
}
