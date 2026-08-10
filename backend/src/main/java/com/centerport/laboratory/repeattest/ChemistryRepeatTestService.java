package com.centerport.laboratory.repeattest;

import com.centerport.common.util.BusinessIdGenerator;
import com.centerport.laboratory.LaboratoryReport;
import com.centerport.laboratory.LaboratoryReportRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service layer for {@link ChemistryRepeatTest} CRUD operations.
 *
 * Extends {@link AbstractRepeatTestService} to inherit the standard
 * repeat-test CRUD lifecycle. Supplies chemistry-specific entity mapping
 * and the {@code CHEM} business ID prefix.
 *
 * Business ID:
 * Each new chemistry repeat test receives a unique sequential ID in the
 * format {@code CHEM00000001} generated from the {@code chem_repeat_seq}
 * PostgreSQL sequence.
 *
 * @see AbstractRepeatTestService
 * @see ChemistryRepeatTestRepository
 * @see ChemistryRepeatTestMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class ChemistryRepeatTestService
        extends AbstractRepeatTestService<ChemistryRepeatTest, ChemistryRepeatTestDto> {

    private static final String BUSINESS_ID_PREFIX = "CHEM";
    private static final String ENTITY_NAME = "ChemistryRepeatTest";

    private final ChemistryRepeatTestRepository repository;
    private final ChemistryRepeatTestMapper mapper;

    public ChemistryRepeatTestService(ChemistryRepeatTestRepository repository,
                                      ChemistryRepeatTestMapper mapper,
                                      LaboratoryReportRepository laboratoryReportRepository,
                                      BusinessIdGenerator businessIdGenerator) {
        super(laboratoryReportRepository, businessIdGenerator);
        this.repository = repository;
        this.mapper = mapper;
    }

    // =======================================================================
    // Template Method Implementations
    // =======================================================================

    @Override
    protected JpaRepository<ChemistryRepeatTest, UUID> getRepository() {
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
    protected List<ChemistryRepeatTest> findEntitiesByReportId(UUID reportId, Sort sort) {
        return repository.findByLaboratoryReportId(reportId, sort);
    }

    @Override
    protected ChemistryRepeatTestDto toDto(ChemistryRepeatTest entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected ChemistryRepeatTest toEntity(ChemistryRepeatTestDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void updateEntityFromDto(ChemistryRepeatTestDto dto, ChemistryRepeatTest entity) {
        mapper.updateEntity(dto, entity);
    }

    @Override
    protected void setBusinessId(ChemistryRepeatTest entity, String businessId) {
        entity.setResultId(businessId);
    }

    @Override
    protected void setLaboratoryReport(ChemistryRepeatTest entity, LaboratoryReport report) {
        entity.setLaboratoryReport(report);
    }
}
