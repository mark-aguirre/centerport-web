package com.centerport.employer;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link Employer} entity and
 * {@link EmployerDto}.
 *
 * Update Behavior:
 * The {@code updateEntity} method ignores system-managed fields so that
 * {@code id}, {@code employerId}, {@code createdDate}, and {@code updatedDate}
 * are preserved from the existing entity during PUT updates.
 *
 * @see EmployerService consumer of this mapper
 */
@Mapper(componentModel = "spring")
public interface EmployerMapper {

    /**
     * Converts an entity to its DTO representation.
     *
     * @param entity the employer entity
     * @return the corresponding DTO
     */
    EmployerDto toDto(Employer entity);

    /**
     * Converts a DTO to a new entity instance.
     *
     * @param dto the employer DTO
     * @return a new entity populated from the DTO
     */
    Employer toEntity(EmployerDto dto);

    /**
     * Updates an existing entity from a DTO, preserving system-managed fields.
     *
     * @param dto    the source DTO with updated field values
     * @param entity the target entity to update in place
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "employerId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(EmployerDto dto, @MappingTarget Employer entity);
}
