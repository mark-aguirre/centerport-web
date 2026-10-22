package com.centerport.clinicalchemistry;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link ClinicalChemistry} entity and
 * {@link ClinicalChemistryDto}.
 *
 * The {@code updateEntity} method ignores system-managed fields so that
 * {@code id}, {@code createdDate}, and {@code updatedDate} are preserved from
 * the existing entity during PUT updates.
 *
 * @see ClinicalChemistryService consumer of this mapper
 */
@Mapper(componentModel = "spring")
public interface ClinicalChemistryMapper {

    /** Converts an entity to its DTO representation. */
    ClinicalChemistryDto toDto(ClinicalChemistry entity);

    /** Converts a DTO to a new entity instance. */
    ClinicalChemistry toEntity(ClinicalChemistryDto dto);

    /**
     * Updates an existing entity from a DTO, preserving system-managed fields.
     *
     * @param dto    the source DTO with updated field values
     * @param entity the target entity to update in place
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(ClinicalChemistryDto dto, @MappingTarget ClinicalChemistry entity);
}
