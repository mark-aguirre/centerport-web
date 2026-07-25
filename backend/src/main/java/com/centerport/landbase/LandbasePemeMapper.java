package com.centerport.landbase;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between LandbasePeme entity and LandbasePemeDto.
 * The updateEntity method ignores system-managed fields so that id, pemeId, createdDate,
 * and updatedDate are preserved from the existing entity during PUT updates.
 */
@Mapper(componentModel = "spring")
public interface LandbasePemeMapper {

    LandbasePemeDto toDto(LandbasePeme entity);

    LandbasePeme toEntity(LandbasePemeDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pemeId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(LandbasePemeDto dto, @MappingTarget LandbasePeme entity);
}
