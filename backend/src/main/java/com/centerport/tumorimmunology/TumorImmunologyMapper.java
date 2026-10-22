package com.centerport.tumorimmunology;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link TumorImmunology} entity and
 * {@link TumorImmunologyDto}.
 *
 * The {@code updateEntity} method ignores system-managed fields so that
 * {@code id}, {@code createdDate}, and {@code updatedDate} are preserved from
 * the existing entity during PUT updates.
 *
 * @see TumorImmunologyService consumer of this mapper
 */
@Mapper(componentModel = "spring")
public interface TumorImmunologyMapper {

    /** Converts an entity to its DTO representation. */
    TumorImmunologyDto toDto(TumorImmunology entity);

    /** Converts a DTO to a new entity instance. */
    TumorImmunology toEntity(TumorImmunologyDto dto);

    /**
     * Updates an existing entity from a DTO, preserving system-managed fields.
     *
     * @param dto    the source DTO with updated field values
     * @param entity the target entity to update in place
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(TumorImmunologyDto dto, @MappingTarget TumorImmunology entity);
}
