package com.centerport.personnel;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link MedicalPersonnel} entity and
 * {@link MedicalPersonnelDto}.
 *
 * Update Behavior:
 * The {@code updateEntity} method ignores system-managed fields so that
 * {@code id}, {@code personnelId}, {@code createdDate}, and {@code updatedDate}
 * are preserved from the existing entity during PUT updates.
 *
 * @see MedicalPersonnelService consumer of this mapper
 */
@Mapper(componentModel = "spring")
public interface MedicalPersonnelMapper {

    /**
     * Converts an entity to its DTO representation.
     *
     * @param entity the medical personnel entity
     * @return the corresponding DTO
     */
    MedicalPersonnelDto toDto(MedicalPersonnel entity);

    /**
     * Converts a DTO to a new entity instance.
     *
     * @param dto the medical personnel DTO
     * @return a new entity populated from the DTO
     */
    MedicalPersonnel toEntity(MedicalPersonnelDto dto);

    /**
     * Updates an existing entity from a DTO, preserving system-managed fields.
     *
     * @param dto    the source DTO with updated field values
     * @param entity the target entity to update in place
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "personnelId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(MedicalPersonnelDto dto, @MappingTarget MedicalPersonnel entity);
}
