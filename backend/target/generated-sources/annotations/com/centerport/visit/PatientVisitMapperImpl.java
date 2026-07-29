package com.centerport.visit;

import com.centerport.profile.SeafarerProfile;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-29T18:03:24+0800",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class PatientVisitMapperImpl implements PatientVisitMapper {

    @Override
    public PatientVisitDto toDto(PatientVisit visit, SeafarerProfile profile) {
        if ( visit == null && profile == null ) {
            return null;
        }

        PatientVisitDto patientVisitDto = new PatientVisitDto();

        if ( visit != null ) {
            patientVisitDto.setId( visit.getId() );
            patientVisitDto.setVisitId( visit.getVisitId() );
            patientVisitDto.setCreatedDate( visit.getCreatedDate() );
            patientVisitDto.setUpdatedDate( visit.getUpdatedDate() );
            patientVisitDto.setSeafarerProfileId( visit.getSeafarerProfileId() );
            patientVisitDto.setPurposeOfVisit( visit.getPurposeOfVisit() );
            patientVisitDto.setSirb( visit.getSirb() );
            patientVisitDto.setVisitDate( visit.getVisitDate() );
        }
        if ( profile != null ) {
            patientVisitDto.setProfileId( profile.getProfileId() );
            patientVisitDto.setPhotoUrl( profile.getPhotoUrl() );
            patientVisitDto.setLastName( profile.getLastName() );
            patientVisitDto.setFirstName( profile.getFirstName() );
            patientVisitDto.setMiddleName( profile.getMiddleName() );
            patientVisitDto.setGender( profile.getGender() );
            patientVisitDto.setEmployer( profile.getEmployer() );
            patientVisitDto.setPosition( profile.getPosition() );
        }

        return patientVisitDto;
    }

    @Override
    public PatientVisit toEntity(PatientVisitDto dto) {
        if ( dto == null ) {
            return null;
        }

        PatientVisit patientVisit = new PatientVisit();

        patientVisit.setSeafarerProfileId( dto.getSeafarerProfileId() );
        patientVisit.setPurposeOfVisit( dto.getPurposeOfVisit() );
        patientVisit.setSirb( dto.getSirb() );
        patientVisit.setVisitDate( dto.getVisitDate() );

        return patientVisit;
    }
}
