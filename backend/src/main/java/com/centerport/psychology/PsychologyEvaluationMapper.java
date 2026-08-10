package com.centerport.psychology;

import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link PsychologyEvaluation} entity
 * and {@link PsychologyEvaluationDto}.
 *
 * The toDto method maps the nested seafarerProfile entity to its DTO representation
 * and extracts the profile UUID into seafarerProfileId. The updateEntity method
 * ignores system-managed fields and the relationship (handled by service layer).
 *
 * @see PsychologyEvaluation
 * @see PsychologyEvaluationDto
 */
@Mapper(componentModel = "spring")
public interface PsychologyEvaluationMapper {

    @Mapping(source = "seafarerProfile.id", target = "seafarerProfileId")
    @Mapping(source = "seafarerProfile", target = "seafarerProfile")
    PsychologyEvaluationDto toDto(PsychologyEvaluation entity);

    SeafarerProfileDto profileToDto(SeafarerProfile profile);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "evalId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "seafarerProfile", ignore = true)
    PsychologyEvaluation toEntity(PsychologyEvaluationDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "evalId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "seafarerProfile", ignore = true)
    void updateEntity(PsychologyEvaluationDto dto, @MappingTarget PsychologyEvaluation entity);
}
