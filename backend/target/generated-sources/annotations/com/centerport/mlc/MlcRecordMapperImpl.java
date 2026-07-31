package com.centerport.mlc;

import com.centerport.common.enums.VisualAid;
import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileDto;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-30T20:29:08+0800",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Amazon.com Inc.)"
)
@Component
public class MlcRecordMapperImpl implements MlcRecordMapper {

    @Override
    public MlcRecordDto toDto(MlcRecord entity) {
        if ( entity == null ) {
            return null;
        }

        MlcRecordDto mlcRecordDto = new MlcRecordDto();

        mlcRecordDto.setSeafarerProfileId( entitySeafarerProfileId( entity ) );
        mlcRecordDto.setSeafarerProfile( profileToDto( entity.getSeafarerProfile() ) );
        mlcRecordDto.setId( entity.getId() );
        mlcRecordDto.setMlcId( entity.getMlcId() );
        mlcRecordDto.setCreatedDate( entity.getCreatedDate() );
        mlcRecordDto.setUpdatedDate( entity.getUpdatedDate() );
        mlcRecordDto.setDateOfBirth( entity.getDateOfBirth() );
        mlcRecordDto.setAge( entity.getAge() );
        mlcRecordDto.setSirbNo( entity.getSirbNo() );
        mlcRecordDto.setRank( entity.getRank() );
        mlcRecordDto.setVesselName( entity.getVesselName() );
        mlcRecordDto.setVesselType( entity.getVesselType() );
        mlcRecordDto.setShippingCompany( entity.getShippingCompany() );
        mlcRecordDto.setManningAgency( entity.getManningAgency() );
        mlcRecordDto.setCertificateType( entity.getCertificateType() );
        mlcRecordDto.setFitnessDetermination( entity.getFitnessDetermination() );
        mlcRecordDto.setDateOfExamination( entity.getDateOfExamination() );
        mlcRecordDto.setDateIssued( entity.getDateIssued() );
        mlcRecordDto.setValidUntil( entity.getValidUntil() );
        mlcRecordDto.setIssuingAuthority( entity.getIssuingAuthority() );
        mlcRecordDto.setExaminingPhysician( entity.getExaminingPhysician() );
        mlcRecordDto.setMedicalDirector( entity.getMedicalDirector() );
        mlcRecordDto.setLimitationsRemarks( entity.getLimitationsRemarks() );
        mlcRecordDto.setIdDocumentsChecked( entity.getIdDocumentsChecked() );
        mlcRecordDto.setHearingMeetsStandards( entity.getHearingMeetsStandards() );
        mlcRecordDto.setUnaidedHearingSatisfactory( entity.getUnaidedHearingSatisfactory() );
        mlcRecordDto.setVisualAcuityMeetsStandards( entity.getVisualAcuityMeetsStandards() );
        mlcRecordDto.setColourVisionMeetsStandards( entity.getColourVisionMeetsStandards() );
        List<VisualAid> list = entity.getVisualAids();
        if ( list != null ) {
            mlcRecordDto.setVisualAids( new ArrayList<VisualAid>( list ) );
        }
        mlcRecordDto.setDateColourVisionTest( entity.getDateColourVisionTest() );
        mlcRecordDto.setFitForLookout( entity.getFitForLookout() );
        mlcRecordDto.setNoLimitations( entity.getNoLimitations() );
        mlcRecordDto.setLimitationsDetails( entity.getLimitationsDetails() );
        mlcRecordDto.setApplicantConditionRisk( entity.getApplicantConditionRisk() );
        mlcRecordDto.setDateInitialPeme( entity.getDateInitialPeme() );
        mlcRecordDto.setDateOfFitness( entity.getDateOfFitness() );
        mlcRecordDto.setValidUntilDate( entity.getValidUntilDate() );
        mlcRecordDto.setMedicalCertificationNo( entity.getMedicalCertificationNo() );

        return mlcRecordDto;
    }

    @Override
    public SeafarerProfileDto profileToDto(SeafarerProfile profile) {
        if ( profile == null ) {
            return null;
        }

        SeafarerProfileDto seafarerProfileDto = new SeafarerProfileDto();

        seafarerProfileDto.setId( profile.getId() );
        seafarerProfileDto.setProfileId( profile.getProfileId() );
        seafarerProfileDto.setCreatedDate( profile.getCreatedDate() );
        seafarerProfileDto.setUpdatedDate( profile.getUpdatedDate() );
        seafarerProfileDto.setCreatedBy( profile.getCreatedBy() );
        seafarerProfileDto.setPhotoUrl( profile.getPhotoUrl() );
        seafarerProfileDto.setLastName( profile.getLastName() );
        seafarerProfileDto.setFirstName( profile.getFirstName() );
        seafarerProfileDto.setMiddleName( profile.getMiddleName() );
        seafarerProfileDto.setAddress( profile.getAddress() );
        seafarerProfileDto.setCity( profile.getCity() );
        seafarerProfileDto.setContactNo( profile.getContactNo() );
        seafarerProfileDto.setBirthdate( profile.getBirthdate() );
        seafarerProfileDto.setAge( profile.getAge() );
        seafarerProfileDto.setGender( profile.getGender() );
        seafarerProfileDto.setMaritalStatus( profile.getMaritalStatus() );
        seafarerProfileDto.setPlaceOfBirth( profile.getPlaceOfBirth() );
        seafarerProfileDto.setReligion( profile.getReligion() );
        seafarerProfileDto.setNationality( profile.getNationality() );
        seafarerProfileDto.setCountry( profile.getCountry() );
        seafarerProfileDto.setEmployer( profile.getEmployer() );
        seafarerProfileDto.setDesignation( profile.getDesignation() );
        seafarerProfileDto.setPassportNo( profile.getPassportNo() );
        seafarerProfileDto.setSeamansBookNo( profile.getSeamansBookNo() );
        seafarerProfileDto.setPosition( profile.getPosition() );
        seafarerProfileDto.setCountryOfDestination( profile.getCountryOfDestination() );
        seafarerProfileDto.setFatherName( profile.getFatherName() );
        seafarerProfileDto.setFatherOccupation( profile.getFatherOccupation() );
        seafarerProfileDto.setMotherName( profile.getMotherName() );
        seafarerProfileDto.setMotherOccupation( profile.getMotherOccupation() );
        seafarerProfileDto.setNoOfBrothers( profile.getNoOfBrothers() );
        seafarerProfileDto.setNoOfSisters( profile.getNoOfSisters() );
        seafarerProfileDto.setBirthOrder( profile.getBirthOrder() );
        seafarerProfileDto.setSpouseName( profile.getSpouseName() );
        seafarerProfileDto.setSpouseOccupation( profile.getSpouseOccupation() );
        seafarerProfileDto.setNoOfChildren( profile.getNoOfChildren() );
        seafarerProfileDto.setElementary( profile.getElementary() );
        seafarerProfileDto.setHighSchool( profile.getHighSchool() );
        seafarerProfileDto.setCollegeUniversity( profile.getCollegeUniversity() );
        seafarerProfileDto.setCourse( profile.getCourse() );
        seafarerProfileDto.setHighestLevelAttended( profile.getHighestLevelAttended() );
        seafarerProfileDto.setPrevDateStarted( profile.getPrevDateStarted() );
        seafarerProfileDto.setPrevDateEnd( profile.getPrevDateEnd() );
        seafarerProfileDto.setPrevLengthOfStay( profile.getPrevLengthOfStay() );
        seafarerProfileDto.setPrevCompany( profile.getPrevCompany() );
        seafarerProfileDto.setPrevPosition( profile.getPrevPosition() );
        seafarerProfileDto.setPrevReasonOfLeaving( profile.getPrevReasonOfLeaving() );
        seafarerProfileDto.setRemark( profile.getRemark() );

        return seafarerProfileDto;
    }

    @Override
    public MlcRecord toEntity(MlcRecordDto dto) {
        if ( dto == null ) {
            return null;
        }

        MlcRecord mlcRecord = new MlcRecord();

        mlcRecord.setDateOfBirth( dto.getDateOfBirth() );
        mlcRecord.setAge( dto.getAge() );
        mlcRecord.setSirbNo( dto.getSirbNo() );
        mlcRecord.setRank( dto.getRank() );
        mlcRecord.setVesselName( dto.getVesselName() );
        mlcRecord.setVesselType( dto.getVesselType() );
        mlcRecord.setShippingCompany( dto.getShippingCompany() );
        mlcRecord.setManningAgency( dto.getManningAgency() );
        mlcRecord.setCertificateType( dto.getCertificateType() );
        mlcRecord.setFitnessDetermination( dto.getFitnessDetermination() );
        mlcRecord.setDateOfExamination( dto.getDateOfExamination() );
        mlcRecord.setDateIssued( dto.getDateIssued() );
        mlcRecord.setValidUntil( dto.getValidUntil() );
        mlcRecord.setIssuingAuthority( dto.getIssuingAuthority() );
        mlcRecord.setExaminingPhysician( dto.getExaminingPhysician() );
        mlcRecord.setMedicalDirector( dto.getMedicalDirector() );
        mlcRecord.setLimitationsRemarks( dto.getLimitationsRemarks() );
        mlcRecord.setIdDocumentsChecked( dto.getIdDocumentsChecked() );
        mlcRecord.setHearingMeetsStandards( dto.getHearingMeetsStandards() );
        mlcRecord.setUnaidedHearingSatisfactory( dto.getUnaidedHearingSatisfactory() );
        mlcRecord.setVisualAcuityMeetsStandards( dto.getVisualAcuityMeetsStandards() );
        mlcRecord.setColourVisionMeetsStandards( dto.getColourVisionMeetsStandards() );
        List<VisualAid> list = dto.getVisualAids();
        if ( list != null ) {
            mlcRecord.setVisualAids( new ArrayList<VisualAid>( list ) );
        }
        mlcRecord.setDateColourVisionTest( dto.getDateColourVisionTest() );
        mlcRecord.setFitForLookout( dto.getFitForLookout() );
        mlcRecord.setNoLimitations( dto.getNoLimitations() );
        mlcRecord.setLimitationsDetails( dto.getLimitationsDetails() );
        mlcRecord.setApplicantConditionRisk( dto.getApplicantConditionRisk() );
        mlcRecord.setDateInitialPeme( dto.getDateInitialPeme() );
        mlcRecord.setDateOfFitness( dto.getDateOfFitness() );
        mlcRecord.setValidUntilDate( dto.getValidUntilDate() );
        mlcRecord.setMedicalCertificationNo( dto.getMedicalCertificationNo() );

        return mlcRecord;
    }

    @Override
    public void updateEntity(MlcRecordDto dto, MlcRecord entity) {
        if ( dto == null ) {
            return;
        }

        entity.setDateOfBirth( dto.getDateOfBirth() );
        entity.setAge( dto.getAge() );
        entity.setSirbNo( dto.getSirbNo() );
        entity.setRank( dto.getRank() );
        entity.setVesselName( dto.getVesselName() );
        entity.setVesselType( dto.getVesselType() );
        entity.setShippingCompany( dto.getShippingCompany() );
        entity.setManningAgency( dto.getManningAgency() );
        entity.setCertificateType( dto.getCertificateType() );
        entity.setFitnessDetermination( dto.getFitnessDetermination() );
        entity.setDateOfExamination( dto.getDateOfExamination() );
        entity.setDateIssued( dto.getDateIssued() );
        entity.setValidUntil( dto.getValidUntil() );
        entity.setIssuingAuthority( dto.getIssuingAuthority() );
        entity.setExaminingPhysician( dto.getExaminingPhysician() );
        entity.setMedicalDirector( dto.getMedicalDirector() );
        entity.setLimitationsRemarks( dto.getLimitationsRemarks() );
        entity.setIdDocumentsChecked( dto.getIdDocumentsChecked() );
        entity.setHearingMeetsStandards( dto.getHearingMeetsStandards() );
        entity.setUnaidedHearingSatisfactory( dto.getUnaidedHearingSatisfactory() );
        entity.setVisualAcuityMeetsStandards( dto.getVisualAcuityMeetsStandards() );
        entity.setColourVisionMeetsStandards( dto.getColourVisionMeetsStandards() );
        if ( entity.getVisualAids() != null ) {
            List<VisualAid> list = dto.getVisualAids();
            if ( list != null ) {
                entity.getVisualAids().clear();
                entity.getVisualAids().addAll( list );
            }
            else {
                entity.setVisualAids( null );
            }
        }
        else {
            List<VisualAid> list = dto.getVisualAids();
            if ( list != null ) {
                entity.setVisualAids( new ArrayList<VisualAid>( list ) );
            }
        }
        entity.setDateColourVisionTest( dto.getDateColourVisionTest() );
        entity.setFitForLookout( dto.getFitForLookout() );
        entity.setNoLimitations( dto.getNoLimitations() );
        entity.setLimitationsDetails( dto.getLimitationsDetails() );
        entity.setApplicantConditionRisk( dto.getApplicantConditionRisk() );
        entity.setDateInitialPeme( dto.getDateInitialPeme() );
        entity.setDateOfFitness( dto.getDateOfFitness() );
        entity.setValidUntilDate( dto.getValidUntilDate() );
        entity.setMedicalCertificationNo( dto.getMedicalCertificationNo() );
    }

    private UUID entitySeafarerProfileId(MlcRecord mlcRecord) {
        SeafarerProfile seafarerProfile = mlcRecord.getSeafarerProfile();
        if ( seafarerProfile == null ) {
            return null;
        }
        return seafarerProfile.getId();
    }
}
