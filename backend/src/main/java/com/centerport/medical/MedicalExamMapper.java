package com.centerport.medical;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between MedicalExam entity and MedicalExamDto.
 * The updateEntity method ignores system-managed fields so that id, examId, createdDate,
 * and updatedDate are preserved from the existing entity during PUT updates.
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
