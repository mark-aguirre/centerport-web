package com.centerport.medical;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link MedicalExam} entity and
 * {@link MedicalExamDto}.
 *
 * Mapping Behavior:
 * - {@code toDto} — full entity-to-DTO conversion including system fields
 * - {@code toEntity} — full DTO-to-entity conversion (used on create)
 * - {@code updateEntity} — partial update that ignores system-managed fields
 *   ({@code id}, {@code examId}, {@code createdDate}, {@code updatedDate})
 *   so that existing values are preserved during PUT updates
 *
 * @see MedicalExam
 * @see MedicalExamDto
 * @see MedicalExamService
 */
@Mapper(componentModel = "spring")
public interface MedicalExamMapper {

    MedicalExamDto toDto(MedicalExam entity);

    MedicalExam toEntity(MedicalExamDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "examId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(MedicalExamDto dto, @MappingTarget MedicalExam entity);
}
