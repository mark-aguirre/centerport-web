package com.centerport.landbase;

import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between LandbasePeme entity and LandbasePemeDto.
 *
 * The toDto method maps the nested seafarerProfile entity to its DTO representation
 * and extracts the profile UUID into seafarerProfileId. The updateEntity method
 * ignores system-managed fields and the relationship (handled by service layer).
 */
@Mapper(componentModel = "spring")
public interface LandbasePemeMapper {

    @Mapping(source = "seafarerProfile.id", target = "seafarerProfileId")
    @Mapping(source = "seafarerProfile", target = "seafarerProfile")
    LandbasePemeDto toDto(LandbasePeme entity);

    SeafarerProfileDto profileToDto(SeafarerProfile profile);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pemeId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "seafarerProfile", ignore = true)
    LandbasePeme toEntity(LandbasePemeDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pemeId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "seafarerProfile", ignore = true)
    void updateEntity(LandbasePemeDto dto, @MappingTarget LandbasePeme entity);
}
