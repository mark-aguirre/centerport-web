package com.centerport.personnel.assignment;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper for the personnel-assignment DTOs.
 *
 * <p>The assignment → DTO mapping flattens the associated
 * {@link com.centerport.personnel.MedicalPersonnel} into the snapshot fields so
 * the client always sees the person's current name/license/signature.
 */
@Mapper(componentModel = "spring")
public interface PersonnelAssignmentMapper {

    @Mapping(target = "personnelId", source = "personnel.id")
    @Mapping(target = "personnelBusinessId", source = "personnel.personnelId")
    @Mapping(target = "personnelName", source = "personnel.name")
    @Mapping(target = "personnelLicenseNo", source = "personnel.licenseNo")
    @Mapping(target = "personnelTitle", source = "personnel.title")
    @Mapping(target = "signatureUrl", source = "personnel.signatureUrl")
    @Mapping(target = "personnelActive", source = "personnel.active")
    PersonnelAssignmentDto toDto(PersonnelAssignment entity);

    PersonnelAssignmentAuditDto toAuditDto(PersonnelAssignmentAudit entity);
}
