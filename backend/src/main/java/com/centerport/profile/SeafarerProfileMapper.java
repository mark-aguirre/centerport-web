package com.centerport.profile;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link SeafarerProfile} entity and
 * {@link SeafarerProfileDto}.
 *
 * Update Behavior:
 * The {@code updateEntity} method ignores system-managed fields so that
 * {@code id}, {@code profileId}, {@code createdDate}, and {@code updatedDate}
 * are preserved from the existing entity during PUT updates.
 *
 * @see SeafarerProfileService consumer of this mapper
 */
@Mapper(componentModel = "spring")
public interface SeafarerProfileMapper {

    /**
     * Converts an entity to its DTO representation.
     *
     * @param entity the profile entity
     * @return the corresponding DTO
     */
    SeafarerProfileDto toDto(SeafarerProfile entity);

    /**
     * Converts a DTO to a new entity instance.
     *
     * @param dto the profile DTO
     * @return a new entity populated from the DTO
     */
    SeafarerProfile toEntity(SeafarerProfileDto dto);

    /**
     * Updates an existing entity from a DTO, preserving system-managed fields.
     *
     * @param dto    the source DTO with updated field values
     * @param entity the target entity to update in place
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "profileId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(SeafarerProfileDto dto, @MappingTarget SeafarerProfile entity);
}
