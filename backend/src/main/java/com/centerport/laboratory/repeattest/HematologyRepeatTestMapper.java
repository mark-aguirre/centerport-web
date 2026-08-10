package com.centerport.laboratory.repeattest;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link HematologyRepeatTest}
 * entity and {@link HematologyRepeatTestDto}.
 *
 * Mapping Strategy:
 * - {@code toDto} — maps entity to DTO, extracting the parent report's
 *   UUID into {@code laboratoryReportId}
 * - {@code toEntity} — maps DTO to a new entity, ignoring system-managed
 *   fields and the parent relationship (set by the service layer)
 * - {@code updateEntity} — applies mutable DTO fields onto an existing
 *   entity without overwriting system fields or the parent link
 *
 * @see HematologyRepeatTestService
 */
@Mapper(componentModel = "spring")
public interface HematologyRepeatTestMapper {

    /**
     * Converts a {@link HematologyRepeatTest} entity to its DTO representation.
     *
     * @param entity the source entity
     * @return populated DTO with parent report ID
     */
    @Mapping(source = "laboratoryReport.id", target = "laboratoryReportId")
    HematologyRepeatTestDto toDto(HematologyRepeatTest entity);

    /**
     * Creates a new {@link HematologyRepeatTest} entity from a DTO.
     * System-managed fields and the parent relationship are ignored.
     *
     * @param dto the source DTO
     * @return a new entity populated with DTO field values
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "resultId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "laboratoryReport", ignore = true)
    HematologyRepeatTest toEntity(HematologyRepeatTestDto dto);

    /**
     * Updates an existing entity in place from DTO values.
     * System-managed fields and the parent relationship are preserved.
     *
     * @param dto    the source DTO with updated values
     * @param entity the target entity to update
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "resultId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "laboratoryReport", ignore = true)
    void updateEntity(HematologyRepeatTestDto dto, @MappingTarget HematologyRepeatTest entity);
}
