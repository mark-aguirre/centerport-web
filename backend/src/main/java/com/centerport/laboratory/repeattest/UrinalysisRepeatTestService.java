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
 * Service layer for {@link UrinalysisRepeatTest} CRUD operations.
 *
 * Extends {@link AbstractRepeatTestService} to inherit the standard
 * repeat-test CRUD lifecycle. Supplies urinalysis-specific entity mapping
 * and the {@code URIN} business ID prefix.
 *
 * Business ID:
 * Each new urinalysis repeat test receives a unique sequential ID in the
 * format {@code URIN00000001} generated from the {@code urin_seq}
 * PostgreSQL sequence.
 *
 * @see AbstractRepeatTestService
 * @see UrinalysisRepeatTestRepository
 * @see UrinalysisRepeatTestMapper
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class UrinalysisRepeatTestService
        extends AbstractRepeatTestService<UrinalysisRepeatTest, UrinalysisRepeatTestDto> {

    private static final String BUSINESS_ID_PREFIX = "URIN";
    private static final String ENTITY_NAME = "UrinalysisRepeatTest";

    private final UrinalysisRepeatTestRepository repository;
    private final UrinalysisRepeatTestMapper mapper;

    public UrinalysisRepeatTestService(UrinalysisRepeatTestRepository repository,
                                       UrinalysisRepeatTestMapper mapper,
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
    protected JpaRepository<UrinalysisRepeatTest, UUID> getRepository() {
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
    protected List<UrinalysisRepeatTest> findEntitiesByReportId(UUID reportId, Sort sort) {
        return repository.findByLaboratoryReportId(reportId, sort);
    }

    @Override
    protected UrinalysisRepeatTestDto toDto(UrinalysisRepeatTest entity) {
        return mapper.toDto(entity);
    }

    @Override
    protected UrinalysisRepeatTest toEntity(UrinalysisRepeatTestDto dto) {
        return mapper.toEntity(dto);
    }

    @Override
    protected void updateEntityFromDto(UrinalysisRepeatTestDto dto, UrinalysisRepeatTest entity) {
        mapper.updateEntity(dto, entity);
    }

    @Override
    protected void setBusinessId(UrinalysisRepeatTest entity, String businessId) {
        entity.setResultId(businessId);
    }

    @Override
    protected void setLaboratoryReport(UrinalysisRepeatTest entity, LaboratoryReport report) {
        entity.setLaboratoryReport(report);
    }
}
