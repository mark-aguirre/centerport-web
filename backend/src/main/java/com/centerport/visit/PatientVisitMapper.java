package com.centerport.visit;

import com.centerport.profile.SeafarerProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper for PatientVisit entity ↔ DTO conversion.
 *
 * The {@code toDto} method also accepts the linked SeafarerProfile
 * to populate the joined display fields (name, employer, etc.).
 */
@Mapper(componentModel = "spring")
public interface PatientVisitMapper {

    /**
     * Converts a visit entity + its linked profile into a DTO with display fields.
     */
    @Mapping(source = "visit.id", target = "id")
    @Mapping(source = "visit.visitId", target = "visitId")
    @Mapping(source = "visit.createdDate", target = "createdDate")
    @Mapping(source = "visit.updatedDate", target = "updatedDate")
    @Mapping(source = "visit.seafarerProfileId", target = "seafarerProfileId")
    @Mapping(source = "visit.purposeOfVisit", target = "purposeOfVisit")
    @Mapping(source = "visit.sirb", target = "sirb")
    @Mapping(source = "visit.visitDate", target = "visitDate")
    @Mapping(source = "profile.profileId", target = "profileId")
    @Mapping(source = "profile.photoUrl", target = "photoUrl")
    @Mapping(source = "profile.lastName", target = "lastName")
    @Mapping(source = "profile.firstName", target = "firstName")
    @Mapping(source = "profile.middleName", target = "middleName")
    @Mapping(source = "profile.gender", target = "gender")
    @Mapping(source = "profile.employer", target = "employer")
    @Mapping(source = "profile.position", target = "position")
    PatientVisitDto toDto(PatientVisit visit, SeafarerProfile profile);

    /**
     * Converts a DTO to entity (for create). Ignores joined profile fields.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "visitId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    PatientVisit toEntity(PatientVisitDto dto);
}
