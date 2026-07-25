package com.centerport.mlc;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between MlcRecord entity and MlcRecordDto.
 * The updateEntity method ignores system-managed fields so that id, mlcId, createdDate,
 * and updatedDate are preserved from the existing entity during PUT updates.
 */
@Mapper(componentModel = "spring")
public interface MlcRecordMapper {

    MlcRecordDto toDto(MlcRecord entity);

    MlcRecord toEntity(MlcRecordDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "mlcId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(MlcRecordDto dto, @MappingTarget MlcRecord entity);
}
