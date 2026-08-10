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
 * Service layer for {@link FecalysisRepeatTest} CRUD operations.
 *
 * Extends {@link AbstractRepeatTestService} to inherit the standard
 * repeat-test CRUD lifecycle. Supplies fecalysis-specific entity mapping
 * and the {@code FECL} business ID prefix.
 *
 * Business ID:
 * Each new fecalysis repeat test receives a unique sequential ID in the
 * format {@code FECL00000001} generated from the {@code fecl_seq}
 * PostgreSQL sequence.
 *
 * @see AbstractRepeatTestService
 * @see FecalysisRepeatTestRepository
 * @see FecalysisRepeatTestMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class FecalysisRepeatTestService
        extends AbstractRepeatTestService<FecalysisRepeatTest, FecalysisRepeatTestDto> {

    private static final String BUSINESS_ID_PREFIX = "FECL";
    private static final String ENTITY_NAME = "FecalysisRepeatTest";

    private final FecalysisRepeatTestRepository repository;
    private final FecalysisRepeatTestMapper mapper;

    public FecalysisRepeatTestService(FecalysisRepeatTestRepository repository,
                                      FecalysisRepeatTestMapper mapper,
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
    protected JpaRepository<FecalysisRepeatTest, UUID> getRepository() {
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
    protected List<FecalysisRepeatTest> findEntitiesByReportId(UUID reportId, Sort sort) {
        return repository.findByLaboratoryReportId(reportId, sort);
    }

    @Override
    protected FecalysisRepeatTestDto toDto(FecalysisRepeatTest entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected FecalysisRepeatTest toEntity(FecalysisRepeatTestDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void updateEntityFromDto(FecalysisRepeatTestDto dto, FecalysisRepeatTest entity) {
        mapper.updateEntity(dto, entity);
    }

    @Override
    protected void setBusinessId(FecalysisRepeatTest entity, String businessId) {
        entity.setResultId(businessId);
    }

    @Override
    protected void setLaboratoryReport(FecalysisRepeatTest entity, LaboratoryReport report) {
        entity.setLaboratoryReport(report);
    }
}
