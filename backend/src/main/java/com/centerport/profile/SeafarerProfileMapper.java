package com.centerport.profile;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between SeafarerProfile entity and SeafarerProfileDto.
 * The updateEntity method ignores system-managed fields so that id, profileId, createdDate,
 * and updatedDate are preserved from the existing entity during PUT updates.
 */
@Mapper(componentModel = "spring")
public interface SeafarerProfileMapper {

    SeafarerProfileDto toDto(SeafarerProfile entity);

    SeafarerProfile toEntity(SeafarerProfileDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "profileId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(SeafarerProfileDto dto, @MappingTarget SeafarerProfile entity);
}
