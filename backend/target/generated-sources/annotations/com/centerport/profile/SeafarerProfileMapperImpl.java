package com.centerport.profile;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-27T09:38:59+0800",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class SeafarerProfileMapperImpl implements SeafarerProfileMapper {

    @Override
    public SeafarerProfileDto toDto(SeafarerProfile entity) {
        if ( entity == null ) {
            return null;
        }

        SeafarerProfileDto seafarerProfileDto = new SeafarerProfileDto();

        seafarerProfileDto.setAddress( entity.getAddress() );
        seafarerProfileDto.setAge( entity.getAge() );
        seafarerProfileDto.setBirthOrder( entity.getBirthOrder() );
        seafarerProfileDto.setBirthdate( entity.getBirthdate() );
        seafarerProfileDto.setCity( entity.getCity() );
        seafarerProfileDto.setCollegeUniversity( entity.getCollegeUniversity() );
        seafarerProfileDto.setContactNo( entity.getContactNo() );
        seafarerProfileDto.setCountry( entity.getCountry() );
        seafarerProfileDto.setCountryOfDestination( entity.getCountryOfDestination() );
        seafarerProfileDto.setCourse( entity.getCourse() );
        seafarerProfileDto.setCreatedBy( entity.getCreatedBy() );
        seafarerProfileDto.setCreatedDate( entity.getCreatedDate() );
        seafarerProfileDto.setDesignation( entity.getDesignation() );
        seafarerProfileDto.setElementary( entity.getElementary() );
        seafarerProfileDto.setEmployer( entity.getEmployer() );
        seafarerProfileDto.setFatherName( entity.getFatherName() );
        seafarerProfileDto.setFatherOccupation( entity.getFatherOccupation() );
        seafarerProfileDto.setFirstName( entity.getFirstName() );
        seafarerProfileDto.setGender( entity.getGender() );
        seafarerProfileDto.setHighSchool( entity.getHighSchool() );
        seafarerProfileDto.setHighestLevelAttended( entity.getHighestLevelAttended() );
        seafarerProfileDto.setId( entity.getId() );
        seafarerProfileDto.setLastName( entity.getLastName() );
        seafarerProfileDto.setMaritalStatus( entity.getMaritalStatus() );
        seafarerProfileDto.setMiddleName( entity.getMiddleName() );
        seafarerProfileDto.setMotherName( entity.getMotherName() );
        seafarerProfileDto.setMotherOccupation( entity.getMotherOccupation() );
        seafarerProfileDto.setNationality( entity.getNationality() );
        seafarerProfileDto.setNoOfBrothers( entity.getNoOfBrothers() );
        seafarerProfileDto.setNoOfChildren( entity.getNoOfChildren() );
        seafarerProfileDto.setNoOfSisters( entity.getNoOfSisters() );
        seafarerProfileDto.setPassportNo( entity.getPassportNo() );
        seafarerProfileDto.setPhotoUrl( entity.getPhotoUrl() );
        seafarerProfileDto.setPlaceOfBirth( entity.getPlaceOfBirth() );
        seafarerProfileDto.setPosition( entity.getPosition() );
        seafarerProfileDto.setPrevCompany( entity.getPrevCompany() );
        seafarerProfileDto.setPrevDateEnd( entity.getPrevDateEnd() );
        seafarerProfileDto.setPrevDateStarted( entity.getPrevDateStarted() );
        seafarerProfileDto.setPrevLengthOfStay( entity.getPrevLengthOfStay() );
        seafarerProfileDto.setPrevPosition( entity.getPrevPosition() );
        seafarerProfileDto.setPrevReasonOfLeaving( entity.getPrevReasonOfLeaving() );
        seafarerProfileDto.setProfileId( entity.getProfileId() );
        seafarerProfileDto.setReligion( entity.getReligion() );
        seafarerProfileDto.setRemark( entity.getRemark() );
        seafarerProfileDto.setSeamansBookNo( entity.getSeamansBookNo() );
        seafarerProfileDto.setSpouseName( entity.getSpouseName() );
        seafarerProfileDto.setSpouseOccupation( entity.getSpouseOccupation() );
        seafarerProfileDto.setUpdatedDate( entity.getUpdatedDate() );

        return seafarerProfileDto;
    }

    @Override
    public SeafarerProfile toEntity(SeafarerProfileDto dto) {
        if ( dto == null ) {
            return null;
        }

        SeafarerProfile seafarerProfile = new SeafarerProfile();

        seafarerProfile.setCreatedDate( dto.getCreatedDate() );
        seafarerProfile.setId( dto.getId() );
        seafarerProfile.setUpdatedDate( dto.getUpdatedDate() );
        seafarerProfile.setAddress( dto.getAddress() );
        seafarerProfile.setAge( dto.getAge() );
        seafarerProfile.setBirthOrder( dto.getBirthOrder() );
        seafarerProfile.setBirthdate( dto.getBirthdate() );
        seafarerProfile.setCity( dto.getCity() );
        seafarerProfile.setCollegeUniversity( dto.getCollegeUniversity() );
        seafarerProfile.setContactNo( dto.getContactNo() );
        seafarerProfile.setCountry( dto.getCountry() );
        seafarerProfile.setCountryOfDestination( dto.getCountryOfDestination() );
        seafarerProfile.setCourse( dto.getCourse() );
        seafarerProfile.setCreatedBy( dto.getCreatedBy() );
        seafarerProfile.setDesignation( dto.getDesignation() );
        seafarerProfile.setElementary( dto.getElementary() );
        seafarerProfile.setEmployer( dto.getEmployer() );
        seafarerProfile.setFatherName( dto.getFatherName() );
        seafarerProfile.setFatherOccupation( dto.getFatherOccupation() );
        seafarerProfile.setFirstName( dto.getFirstName() );
        seafarerProfile.setGender( dto.getGender() );
        seafarerProfile.setHighSchool( dto.getHighSchool() );
        seafarerProfile.setHighestLevelAttended( dto.getHighestLevelAttended() );
        seafarerProfile.setLastName( dto.getLastName() );
        seafarerProfile.setMaritalStatus( dto.getMaritalStatus() );
        seafarerProfile.setMiddleName( dto.getMiddleName() );
        seafarerProfile.setMotherName( dto.getMotherName() );
        seafarerProfile.setMotherOccupation( dto.getMotherOccupation() );
        seafarerProfile.setNationality( dto.getNationality() );
        seafarerProfile.setNoOfBrothers( dto.getNoOfBrothers() );
        seafarerProfile.setNoOfChildren( dto.getNoOfChildren() );
        seafarerProfile.setNoOfSisters( dto.getNoOfSisters() );
        seafarerProfile.setPassportNo( dto.getPassportNo() );
        seafarerProfile.setPhotoUrl( dto.getPhotoUrl() );
        seafarerProfile.setPlaceOfBirth( dto.getPlaceOfBirth() );
        seafarerProfile.setPosition( dto.getPosition() );
        seafarerProfile.setPrevCompany( dto.getPrevCompany() );
        seafarerProfile.setPrevDateEnd( dto.getPrevDateEnd() );
        seafarerProfile.setPrevDateStarted( dto.getPrevDateStarted() );
        seafarerProfile.setPrevLengthOfStay( dto.getPrevLengthOfStay() );
        seafarerProfile.setPrevPosition( dto.getPrevPosition() );
        seafarerProfile.setPrevReasonOfLeaving( dto.getPrevReasonOfLeaving() );
        seafarerProfile.setProfileId( dto.getProfileId() );
        seafarerProfile.setReligion( dto.getReligion() );
        seafarerProfile.setRemark( dto.getRemark() );
        seafarerProfile.setSeamansBookNo( dto.getSeamansBookNo() );
        seafarerProfile.setSpouseName( dto.getSpouseName() );
        seafarerProfile.setSpouseOccupation( dto.getSpouseOccupation() );

        return seafarerProfile;
    }

    @Override
    public void updateEntity(SeafarerProfileDto dto, SeafarerProfile entity) {
        if ( dto == null ) {
            return;
        }

        entity.setAddress( dto.getAddress() );
        entity.setAge( dto.getAge() );
        entity.setBirthOrder( dto.getBirthOrder() );
        entity.setBirthdate( dto.getBirthdate() );
        entity.setCity( dto.getCity() );
        entity.setCollegeUniversity( dto.getCollegeUniversity() );
        entity.setContactNo( dto.getContactNo() );
        entity.setCountry( dto.getCountry() );
        entity.setCountryOfDestination( dto.getCountryOfDestination() );
        entity.setCourse( dto.getCourse() );
        entity.setCreatedBy( dto.getCreatedBy() );
        entity.setDesignation( dto.getDesignation() );
        entity.setElementary( dto.getElementary() );
        entity.setEmployer( dto.getEmployer() );
        entity.setFatherName( dto.getFatherName() );
        entity.setFatherOccupation( dto.getFatherOccupation() );
        entity.setFirstName( dto.getFirstName() );
        entity.setGender( dto.getGender() );
        entity.setHighSchool( dto.getHighSchool() );
        entity.setHighestLevelAttended( dto.getHighestLevelAttended() );
        entity.setLastName( dto.getLastName() );
        entity.setMaritalStatus( dto.getMaritalStatus() );
        entity.setMiddleName( dto.getMiddleName() );
        entity.setMotherName( dto.getMotherName() );
        entity.setMotherOccupation( dto.getMotherOccupation() );
        entity.setNationality( dto.getNationality() );
        entity.setNoOfBrothers( dto.getNoOfBrothers() );
        entity.setNoOfChildren( dto.getNoOfChildren() );
        entity.setNoOfSisters( dto.getNoOfSisters() );
        entity.setPassportNo( dto.getPassportNo() );
        entity.setPhotoUrl( dto.getPhotoUrl() );
        entity.setPlaceOfBirth( dto.getPlaceOfBirth() );
        entity.setPosition( dto.getPosition() );
        entity.setPrevCompany( dto.getPrevCompany() );
        entity.setPrevDateEnd( dto.getPrevDateEnd() );
        entity.setPrevDateStarted( dto.getPrevDateStarted() );
        entity.setPrevLengthOfStay( dto.getPrevLengthOfStay() );
        entity.setPrevPosition( dto.getPrevPosition() );
        entity.setPrevReasonOfLeaving( dto.getPrevReasonOfLeaving() );
        entity.setReligion( dto.getReligion() );
        entity.setRemark( dto.getRemark() );
        entity.setSeamansBookNo( dto.getSeamansBookNo() );
        entity.setSpouseName( dto.getSpouseName() );
        entity.setSpouseOccupation( dto.getSpouseOccupation() );
    }
}
