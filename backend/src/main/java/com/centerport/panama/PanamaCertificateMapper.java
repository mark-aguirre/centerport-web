package com.centerport.panama;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link PanamaCertificate} entity
 * and {@link PanamaCertificateDto}.
 *
 * System Field Protection:
 * The {@code updateEntity} method ignores server-managed fields (id, panamaId,
 * createdDate, updatedDate) so they are preserved from the existing entity
 * during PUT updates. Only mutable data fields are overwritten from the DTO.
 *
 * @see PanamaCertificate
 * @see PanamaCertificateDto
 * @see PanamaCertificateService
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
