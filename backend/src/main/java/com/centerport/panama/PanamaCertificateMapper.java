package com.centerport.panama;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between PanamaCertificate entity and PanamaCertificateDto.
 * The updateEntity method ignores system-managed fields so that id, panamaId, createdDate,
 * and updatedDate are preserved from the existing entity during PUT updates.
 */
@Mapper(componentModel = "spring")
public interface PanamaCertificateMapper {

    PanamaCertificateDto toDto(PanamaCertificate entity);

    PanamaCertificate toEntity(PanamaCertificateDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "panamaId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(PanamaCertificateDto dto, @MappingTarget PanamaCertificate entity);
}
