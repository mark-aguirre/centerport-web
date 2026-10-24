package com.centerport.xray;

import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link XrayReport} entity
 * and {@link XrayReportDto}.
 *
 * Mapping Strategy:
 * - {@code toDto} — maps entity to DTO, flattening the profile association
 *   into both a {@code seafarerProfileId} UUID and a nested
 *   {@link SeafarerProfileDto} for response enrichment
 * - {@code toEntity} — maps DTO to a new entity, ignoring system-managed
 *   fields (id, reportId, timestamps) and the profile relationship (set
 *   separately by the service layer)
 * - {@code updateEntity} — applies mutable DTO fields onto an existing
 *   entity without overwriting system fields or the profile link
 *
 * @see XrayReportService
 * @see XrayReportDto
 */
@Mapper(componentModel = "spring")
public interface XrayReportMapper {

    /**
     * Converts an {@link XrayReport} entity to its DTO representation.
     * Flattens the profile association into a UUID and a nested profile DTO.
     *
     * @param entity the source entity
     * @return populated DTO with profile information
     */
    @Mapping(source = "seafarerProfile.id", target = "seafarerProfileId")
    @Mapping(source = "seafarerProfile", target = "seafarerProfile")
    XrayReportDto toDto(XrayReport entity);

    /**
     * Converts a {@link SeafarerProfile} to its DTO for nested embedding.
     *
     * @param profile the source profile entity
     * @return the profile DTO
     */
    SeafarerProfileDto profileToDto(SeafarerProfile profile);

    /**
     * Creates a new {@link XrayReport} entity from a DTO.
     * System-managed fields and the profile relationship are ignored.
     *
     * @param dto the source DTO
     * @return a new entity populated with DTO field values
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reportId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "seafarerProfile", ignore = true)
    XrayReport toEntity(XrayReportDto dto);

    /**
     * Updates an existing entity in place from DTO values.
     * System-managed fields and the profile relationship are preserved.
     *
     * @param dto    the source DTO with updated values
     * @param entity the target entity to update
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reportId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "seafarerProfile", ignore = true)
    void updateEntity(XrayReportDto dto, @MappingTarget XrayReport entity);
}
