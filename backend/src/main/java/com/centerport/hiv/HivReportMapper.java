package com.centerport.hiv;

import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link HivReport} entity
 * and {@link HivReportDto}.
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
 * @see HivReportService
 * @see HivReportDto
 */
@Mapper(componentModel = "spring")
public interface HivReportMapper {

    /**
     * Converts a {@link HivReport} entity to its DTO representation.
     * Flattens the profile association into a UUID and a nested profile DTO.
     *
     * @param entity the source entity
     * @return populated DTO with profile information
     */
    @Mapping(source = "seafarerProfile.id", target = "seafarerProfileId")
    @Mapping(source = "seafarerProfile", target = "seafarerProfile")
    HivReportDto toDto(HivReport entity);

    /**
     * Converts a {@link SeafarerProfile} to its DTO for nested embedding.
     *
     * @param profile the source profile entity
     * @return the profile DTO
     */
    SeafarerProfileDto profileToDto(SeafarerProfile profile);

    /**
     * Creates a new {@link HivReport} entity from a DTO.
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
    HivReport toEntity(HivReportDto dto);

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
    void updateEntity(HivReportDto dto, @MappingTarget HivReport entity);
}
