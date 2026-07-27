package com.centerport.mlc;

import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link MlcRecord} entity and
 * {@link MlcRecordDto}.
 *
 * The toDto method maps the nested seafarerProfile entity to its DTO representation
 * and extracts the profile UUID into seafarerProfileId. The updateEntity method
 * ignores system-managed fields and the relationship (handled by service layer).
 */
@Mapper(componentModel = "spring")
public interface MlcRecordMapper {

    @Mapping(source = "seafarerProfile.id", target = "seafarerProfileId")
    @Mapping(source = "seafarerProfile", target = "seafarerProfile")
    MlcRecordDto toDto(MlcRecord entity);

    SeafarerProfileDto profileToDto(SeafarerProfile profile);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "mlcId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "seafarerProfile", ignore = true)
    MlcRecord toEntity(MlcRecordDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "mlcId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "seafarerProfile", ignore = true)
    void updateEntity(MlcRecordDto dto, @MappingTarget MlcRecord entity);
}
