package com.centerport.profile;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-25T22:42:36+0800",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Amazon.com Inc.)"
)
@Component
public class SeafarerProfileMapperImpl implements SeafarerProfileMapper {

    @Override
    public SeafarerProfileDto toDto(SeafarerProfile entity) {
        if ( entity == null ) {
            return null;
        }

        SeafarerProfileDto seafarerProfileDto = new SeafarerProfileDto();

        seafarerProfileDto.setId( entity.getId() );
        seafarerProfileDto.setProfileId( entity.getProfileId() );
        seafarerProfileDto.setCreatedDate( entity.getCreatedDate() );
        seafarerProfileDto.setUpdatedDate( entity.getUpdatedDate() );
        seafarerProfileDto.setCreatedBy( entity.getCreatedBy() );
        seafarerProfileDto.setPhotoUrl( entity.getPhotoUrl() );
        seafarerProfileDto.setLastName( entity.getLastName() );
        seafarerProfileDto.setFirstName( entity.getFirstName() );
        seafarerProfileDto.setMiddleName( entity.getMiddleName() );
        seafarerProfileDto.setAddress( entity.getAddress() );
        seafarerProfileDto.setCity( entity.getCity() );
        seafarerProfileDto.setContactNo( entity.getContactNo() );
        seafarerProfileDto.setBirthdate( entity.getBirthdate() );
        seafarerProfileDto.setAge( entity.getAge() );
        seafarerProfileDto.setGender( entity.getGender() );
        seafarerProfileDto.setMaritalStatus( entity.getMaritalStatus() );
        seafarerProfileDto.setPlaceOfBirth( entity.getPlaceOfBirth() );
        seafarerProfileDto.setReligion( entity.getReligion() );
        seafarerProfileDto.setNationality( entity.getNationality() );
        seafarerProfileDto.setCountry( entity.getCountry() );
        seafarerProfileDto.setEmployer( entity.getEmployer() );
        seafarerProfileDto.setDesignation( entity.getDesignation() );
        seafarerProfileDto.setPassportNo( entity.getPassportNo() );
        seafarerProfileDto.setSeamansBookNo( entity.getSeamansBookNo() );
        seafarerProfileDto.setPosition( entity.getPosition() );
        seafarerProfileDto.setCountryOfDestination( entity.getCountryOfDestination() );
        seafarerProfileDto.setFatherName( entity.getFatherName() );
        seafarerProfileDto.setFatherOccupation( entity.getFatherOccupation() );
        seafarerProfileDto.setMotherName( entity.getMotherName() );
        seafarerProfileDto.setMotherOccupation( entity.getMotherOccupation() );
        seafarerProfileDto.setNoOfBrothers( entity.getNoOfBrothers() );
        seafarerProfileDto.setNoOfSisters( entity.getNoOfSisters() );
        seafarerProfileDto.setBirthOrder( entity.getBirthOrder() );
        seafarerProfileDto.setSpouseName( entity.getSpouseName() );
        seafarerProfileDto.setSpouseOccupation( entity.getSpouseOccupation() );
        seafarerProfileDto.setNoOfChildren( entity.getNoOfChildren() );
        seafarerProfileDto.setElementary( entity.getElementary() );
        seafarerProfileDto.setHighSchool( entity.getHighSchool() );
        seafarerProfileDto.setCollegeUniversity( entity.getCollegeUniversity() );
        seafarerProfileDto.setCourse( entity.getCourse() );
        seafarerProfileDto.setHighestLevelAttended( entity.getHighestLevelAttended() );
        seafarerProfileDto.setPrevDateStarted( entity.getPrevDateStarted() );
        seafarerProfileDto.setPrevDateEnd( entity.getPrevDateEnd() );
        seafarerProfileDto.setPrevLengthOfStay( entity.getPrevLengthOfStay() );
        seafarerProfileDto.setPrevCompany( entity.getPrevCompany() );
        seafarerProfileDto.setPrevPosition( entity.getPrevPosition() );
        seafarerProfileDto.setPrevReasonOfLeaving( entity.getPrevReasonOfLeaving() );
        seafarerProfileDto.setRemark( entity.getRemark() );

        return seafarerProfileDto;
    }

    @Override
    public SeafarerProfile toEntity(SeafarerProfileDto dto) {
        if ( dto == null ) {
            return null;
        }

        SeafarerProfile seafarerProfile = new SeafarerProfile();

        seafarerProfile.setId( dto.getId() );
        seafarerProfile.setCreatedDate( dto.getCreatedDate() );
        seafarerProfile.setUpdatedDate( dto.getUpdatedDate() );
        seafarerProfile.setProfileId( dto.getProfileId() );
        seafarerProfile.setCreatedBy( dto.getCreatedBy() );
        seafarerProfile.setPhotoUrl( dto.getPhotoUrl() );
        seafarerProfile.setLastName( dto.getLastName() );
        seafarerProfile.setFirstName( dto.getFirstName() );
        seafarerProfile.setMiddleName( dto.getMiddleName() );
        seafarerProfile.setAddress( dto.getAddress() );
        seafarerProfile.setCity( dto.getCity() );
        seafarerProfile.setContactNo( dto.getContactNo() );
        seafarerProfile.setBirthdate( dto.getBirthdate() );
        seafarerProfile.setAge( dto.getAge() );
        seafarerProfile.setGender( dto.getGender() );
        seafarerProfile.setMaritalStatus( dto.getMaritalStatus() );
        seafarerProfile.setPlaceOfBirth( dto.getPlaceOfBirth() );
        seafarerProfile.setReligion( dto.getReligion() );
        seafarerProfile.setNationality( dto.getNationality() );
        seafarerProfile.setCountry( dto.getCountry() );
        seafarerProfile.setEmployer( dto.getEmployer() );
        seafarerProfile.setDesignation( dto.getDesignation() );
        seafarerProfile.setPassportNo( dto.getPassportNo() );
        seafarerProfile.setSeamansBookNo( dto.getSeamansBookNo() );
        seafarerProfile.setPosition( dto.getPosition() );
        seafarerProfile.setCountryOfDestination( dto.getCountryOfDestination() );
        seafarerProfile.setFatherName( dto.getFatherName() );
        seafarerProfile.setFatherOccupation( dto.getFatherOccupation() );
        seafarerProfile.setMotherName( dto.getMotherName() );
        seafarerProfile.setMotherOccupation( dto.getMotherOccupation() );
        seafarerProfile.setNoOfBrothers( dto.getNoOfBrothers() );
        seafarerProfile.setNoOfSisters( dto.getNoOfSisters() );
        seafarerProfile.setBirthOrder( dto.getBirthOrder() );
        seafarerProfile.setSpouseName( dto.getSpouseName() );
        seafarerProfile.setSpouseOccupation( dto.getSpouseOccupation() );
        seafarerProfile.setNoOfChildren( dto.getNoOfChildren() );
        seafarerProfile.setElementary( dto.getElementary() );
        seafarerProfile.setHighSchool( dto.getHighSchool() );
        seafarerProfile.setCollegeUniversity( dto.getCollegeUniversity() );
        seafarerProfile.setCourse( dto.getCourse() );
        seafarerProfile.setHighestLevelAttended( dto.getHighestLevelAttended() );
        seafarerProfile.setPrevDateStarted( dto.getPrevDateStarted() );
        seafarerProfile.setPrevDateEnd( dto.getPrevDateEnd() );
        seafarerProfile.setPrevLengthOfStay( dto.getPrevLengthOfStay() );
        seafarerProfile.setPrevCompany( dto.getPrevCompany() );
        seafarerProfile.setPrevPosition( dto.getPrevPosition() );
        seafarerProfile.setPrevReasonOfLeaving( dto.getPrevReasonOfLeaving() );
        seafarerProfile.setRemark( dto.getRemark() );

        return seafarerProfile;
    }

    @Override
    public void updateEntity(SeafarerProfileDto dto, SeafarerProfile entity) {
        if ( dto == null ) {
            return;
        }

        entity.setCreatedBy( dto.getCreatedBy() );
        entity.setPhotoUrl( dto.getPhotoUrl() );
        entity.setLastName( dto.getLastName() );
        entity.setFirstName( dto.getFirstName() );
        entity.setMiddleName( dto.getMiddleName() );
        entity.setAddress( dto.getAddress() );
        entity.setCity( dto.getCity() );
        entity.setContactNo( dto.getContactNo() );
        entity.setBirthdate( dto.getBirthdate() );
        entity.setAge( dto.getAge() );
        entity.setGender( dto.getGender() );
        entity.setMaritalStatus( dto.getMaritalStatus() );
        entity.setPlaceOfBirth( dto.getPlaceOfBirth() );
        entity.setReligion( dto.getReligion() );
        entity.setNationality( dto.getNationality() );
        entity.setCountry( dto.getCountry() );
        entity.setEmployer( dto.getEmployer() );
        entity.setDesignation( dto.getDesignation() );
        entity.setPassportNo( dto.getPassportNo() );
        entity.setSeamansBookNo( dto.getSeamansBookNo() );
        entity.setPosition( dto.getPosition() );
        entity.setCountryOfDestination( dto.getCountryOfDestination() );
        entity.setFatherName( dto.getFatherName() );
        entity.setFatherOccupation( dto.getFatherOccupation() );
        entity.setMotherName( dto.getMotherName() );
        entity.setMotherOccupation( dto.getMotherOccupation() );
        entity.setNoOfBrothers( dto.getNoOfBrothers() );
        entity.setNoOfSisters( dto.getNoOfSisters() );
        entity.setBirthOrder( dto.getBirthOrder() );
        entity.setSpouseName( dto.getSpouseName() );
        entity.setSpouseOccupation( dto.getSpouseOccupation() );
        entity.setNoOfChildren( dto.getNoOfChildren() );
        entity.setElementary( dto.getElementary() );
        entity.setHighSchool( dto.getHighSchool() );
        entity.setCollegeUniversity( dto.getCollegeUniversity() );
        entity.setCourse( dto.getCourse() );
        entity.setHighestLevelAttended( dto.getHighestLevelAttended() );
        entity.setPrevDateStarted( dto.getPrevDateStarted() );
        entity.setPrevDateEnd( dto.getPrevDateEnd() );
        entity.setPrevLengthOfStay( dto.getPrevLengthOfStay() );
        entity.setPrevCompany( dto.getPrevCompany() );
        entity.setPrevPosition( dto.getPrevPosition() );
        entity.setPrevReasonOfLeaving( dto.getPrevReasonOfLeaving() );
        entity.setRemark( dto.getRemark() );
    }
}
