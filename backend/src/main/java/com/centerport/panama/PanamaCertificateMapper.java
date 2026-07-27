package com.centerport.panama;

import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link PanamaCertificate} entity
 * and {@link PanamaCertificateDto}.
 *
 * The toDto method maps the nested seafarerProfile entity to its DTO representation
 * and extracts the profile UUID into seafarerProfileId. The updateEntity method
 * ignores system-managed fields and the relationship (handled by service layer).
 */
@Mapper(componentModel = "spring")
public interface PanamaCertificateMapper {

    @Mapping(source = "seafarerProfile.id", target = "seafarerProfileId")
    @Mapping(source = "seafarerProfile", target = "seafarerProfile")
    PanamaCertificateDto toDto(PanamaCertificate entity);

    SeafarerProfileDto profileToDto(SeafarerProfile profile);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "panamaId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "seafarerProfile", ignore = true)
    PanamaCertificate toEntity(PanamaCertificateDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "panamaId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "seafarerProfile", ignore = true)
    void updateEntity(PanamaCertificateDto dto, @MappingTarget PanamaCertificate entity);
}
