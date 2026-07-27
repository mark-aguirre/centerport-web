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
    date = "2026-07-27T09:38:59+0800",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
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
        mlcRecordDto.setAge( entity.getAge() );
        mlcRecordDto.setApplicantConditionRisk( entity.getApplicantConditionRisk() );
        mlcRecordDto.setCertificateType( entity.getCertificateType() );
        mlcRecordDto.setColourVisionMeetsStandards( entity.getColourVisionMeetsStandards() );
        mlcRecordDto.setCreatedDate( entity.getCreatedDate() );
        mlcRecordDto.setDateColourVisionTest( entity.getDateColourVisionTest() );
        mlcRecordDto.setDateInitialPeme( entity.getDateInitialPeme() );
        mlcRecordDto.setDateIssued( entity.getDateIssued() );
        mlcRecordDto.setDateOfBirth( entity.getDateOfBirth() );
        mlcRecordDto.setDateOfExamination( entity.getDateOfExamination() );
        mlcRecordDto.setDateOfFitness( entity.getDateOfFitness() );
        mlcRecordDto.setExaminingPhysician( entity.getExaminingPhysician() );
        mlcRecordDto.setFitForLookout( entity.getFitForLookout() );
        mlcRecordDto.setFitnessDetermination( entity.getFitnessDetermination() );
        mlcRecordDto.setHearingMeetsStandards( entity.getHearingMeetsStandards() );
        mlcRecordDto.setId( entity.getId() );
        mlcRecordDto.setIdDocumentsChecked( entity.getIdDocumentsChecked() );
        mlcRecordDto.setIssuingAuthority( entity.getIssuingAuthority() );
        mlcRecordDto.setLimitationsDetails( entity.getLimitationsDetails() );
        mlcRecordDto.setLimitationsRemarks( entity.getLimitationsRemarks() );
        mlcRecordDto.setManningAgency( entity.getManningAgency() );
        mlcRecordDto.setMedicalCertificationNo( entity.getMedicalCertificationNo() );
        mlcRecordDto.setMedicalDirector( entity.getMedicalDirector() );
        mlcRecordDto.setMlcId( entity.getMlcId() );
        mlcRecordDto.setNoLimitations( entity.getNoLimitations() );
        mlcRecordDto.setRank( entity.getRank() );
        mlcRecordDto.setShippingCompany( entity.getShippingCompany() );
        mlcRecordDto.setSirbNo( entity.getSirbNo() );
        mlcRecordDto.setUnaidedHearingSatisfactory( entity.getUnaidedHearingSatisfactory() );
        mlcRecordDto.setUpdatedDate( entity.getUpdatedDate() );
        mlcRecordDto.setValidUntil( entity.getValidUntil() );
        mlcRecordDto.setValidUntilDate( entity.getValidUntilDate() );
        mlcRecordDto.setVesselName( entity.getVesselName() );
        mlcRecordDto.setVesselType( entity.getVesselType() );
        mlcRecordDto.setVisualAcuityMeetsStandards( entity.getVisualAcuityMeetsStandards() );
        List<VisualAid> list = entity.getVisualAids();
        if ( list != null ) {
            mlcRecordDto.setVisualAids( new ArrayList<VisualAid>( list ) );
        }

        return mlcRecordDto;
    }

    @Override
    public SeafarerProfileDto profileToDto(SeafarerProfile profile) {
        if ( profile == null ) {
            return null;
        }

        SeafarerProfileDto seafarerProfileDto = new SeafarerProfileDto();

        seafarerProfileDto.setAddress( profile.getAddress() );
        seafarerProfileDto.setAge( profile.getAge() );
        seafarerProfileDto.setBirthOrder( profile.getBirthOrder() );
        seafarerProfileDto.setBirthdate( profile.getBirthdate() );
        seafarerProfileDto.setCity( profile.getCity() );
        seafarerProfileDto.setCollegeUniversity( profile.getCollegeUniversity() );
        seafarerProfileDto.setContactNo( profile.getContactNo() );
        seafarerProfileDto.setCountry( profile.getCountry() );
        seafarerProfileDto.setCountryOfDestination( profile.getCountryOfDestination() );
        seafarerProfileDto.setCourse( profile.getCourse() );
        seafarerProfileDto.setCreatedBy( profile.getCreatedBy() );
        seafarerProfileDto.setCreatedDate( profile.getCreatedDate() );
        seafarerProfileDto.setDesignation( profile.getDesignation() );
        seafarerProfileDto.setElementary( profile.getElementary() );
        seafarerProfileDto.setEmployer( profile.getEmployer() );
        seafarerProfileDto.setFatherName( profile.getFatherName() );
        seafarerProfileDto.setFatherOccupation( profile.getFatherOccupation() );
        seafarerProfileDto.setFirstName( profile.getFirstName() );
        seafarerProfileDto.setGender( profile.getGender() );
        seafarerProfileDto.setHighSchool( profile.getHighSchool() );
        seafarerProfileDto.setHighestLevelAttended( profile.getHighestLevelAttended() );
        seafarerProfileDto.setId( profile.getId() );
        seafarerProfileDto.setLastName( profile.getLastName() );
        seafarerProfileDto.setMaritalStatus( profile.getMaritalStatus() );
        seafarerProfileDto.setMiddleName( profile.getMiddleName() );
        seafarerProfileDto.setMotherName( profile.getMotherName() );
        seafarerProfileDto.setMotherOccupation( profile.getMotherOccupation() );
        seafarerProfileDto.setNationality( profile.getNationality() );
        seafarerProfileDto.setNoOfBrothers( profile.getNoOfBrothers() );
        seafarerProfileDto.setNoOfChildren( profile.getNoOfChildren() );
        seafarerProfileDto.setNoOfSisters( profile.getNoOfSisters() );
        seafarerProfileDto.setPassportNo( profile.getPassportNo() );
        seafarerProfileDto.setPhotoUrl( profile.getPhotoUrl() );
        seafarerProfileDto.setPlaceOfBirth( profile.getPlaceOfBirth() );
        seafarerProfileDto.setPosition( profile.getPosition() );
        seafarerProfileDto.setPrevCompany( profile.getPrevCompany() );
        seafarerProfileDto.setPrevDateEnd( profile.getPrevDateEnd() );
        seafarerProfileDto.setPrevDateStarted( profile.getPrevDateStarted() );
        seafarerProfileDto.setPrevLengthOfStay( profile.getPrevLengthOfStay() );
        seafarerProfileDto.setPrevPosition( profile.getPrevPosition() );
        seafarerProfileDto.setPrevReasonOfLeaving( profile.getPrevReasonOfLeaving() );
        seafarerProfileDto.setProfileId( profile.getProfileId() );
        seafarerProfileDto.setReligion( profile.getReligion() );
        seafarerProfileDto.setRemark( profile.getRemark() );
        seafarerProfileDto.setSeamansBookNo( profile.getSeamansBookNo() );
        seafarerProfileDto.setSpouseName( profile.getSpouseName() );
        seafarerProfileDto.setSpouseOccupation( profile.getSpouseOccupation() );
        seafarerProfileDto.setUpdatedDate( profile.getUpdatedDate() );

        return seafarerProfileDto;
    }

    @Override
    public MlcRecord toEntity(MlcRecordDto dto) {
        if ( dto == null ) {
            return null;
        }

        MlcRecord mlcRecord = new MlcRecord();

        mlcRecord.setAge( dto.getAge() );
        mlcRecord.setApplicantConditionRisk( dto.getApplicantConditionRisk() );
        mlcRecord.setCertificateType( dto.getCertificateType() );
        mlcRecord.setColourVisionMeetsStandards( dto.getColourVisionMeetsStandards() );
        mlcRecord.setDateColourVisionTest( dto.getDateColourVisionTest() );
        mlcRecord.setDateInitialPeme( dto.getDateInitialPeme() );
        mlcRecord.setDateIssued( dto.getDateIssued() );
        mlcRecord.setDateOfBirth( dto.getDateOfBirth() );
        mlcRecord.setDateOfExamination( dto.getDateOfExamination() );
        mlcRecord.setDateOfFitness( dto.getDateOfFitness() );
        mlcRecord.setExaminingPhysician( dto.getExaminingPhysician() );
        mlcRecord.setFitForLookout( dto.getFitForLookout() );
        mlcRecord.setFitnessDetermination( dto.getFitnessDetermination() );
        mlcRecord.setHearingMeetsStandards( dto.getHearingMeetsStandards() );
        mlcRecord.setIdDocumentsChecked( dto.getIdDocumentsChecked() );
        mlcRecord.setIssuingAuthority( dto.getIssuingAuthority() );
        mlcRecord.setLimitationsDetails( dto.getLimitationsDetails() );
        mlcRecord.setLimitationsRemarks( dto.getLimitationsRemarks() );
        mlcRecord.setManningAgency( dto.getManningAgency() );
        mlcRecord.setMedicalCertificationNo( dto.getMedicalCertificationNo() );
        mlcRecord.setMedicalDirector( dto.getMedicalDirector() );
        mlcRecord.setNoLimitations( dto.getNoLimitations() );
        mlcRecord.setRank( dto.getRank() );
        mlcRecord.setShippingCompany( dto.getShippingCompany() );
        mlcRecord.setSirbNo( dto.getSirbNo() );
        mlcRecord.setUnaidedHearingSatisfactory( dto.getUnaidedHearingSatisfactory() );
        mlcRecord.setValidUntil( dto.getValidUntil() );
        mlcRecord.setValidUntilDate( dto.getValidUntilDate() );
        mlcRecord.setVesselName( dto.getVesselName() );
        mlcRecord.setVesselType( dto.getVesselType() );
        mlcRecord.setVisualAcuityMeetsStandards( dto.getVisualAcuityMeetsStandards() );
        List<VisualAid> list = dto.getVisualAids();
        if ( list != null ) {
            mlcRecord.setVisualAids( new ArrayList<VisualAid>( list ) );
        }

        return mlcRecord;
    }

    @Override
    public void updateEntity(MlcRecordDto dto, MlcRecord entity) {
        if ( dto == null ) {
            return;
        }

        entity.setAge( dto.getAge() );
        entity.setApplicantConditionRisk( dto.getApplicantConditionRisk() );
        entity.setCertificateType( dto.getCertificateType() );
        entity.setColourVisionMeetsStandards( dto.getColourVisionMeetsStandards() );
        entity.setDateColourVisionTest( dto.getDateColourVisionTest() );
        entity.setDateInitialPeme( dto.getDateInitialPeme() );
        entity.setDateIssued( dto.getDateIssued() );
        entity.setDateOfBirth( dto.getDateOfBirth() );
        entity.setDateOfExamination( dto.getDateOfExamination() );
        entity.setDateOfFitness( dto.getDateOfFitness() );
        entity.setExaminingPhysician( dto.getExaminingPhysician() );
        entity.setFitForLookout( dto.getFitForLookout() );
        entity.setFitnessDetermination( dto.getFitnessDetermination() );
        entity.setHearingMeetsStandards( dto.getHearingMeetsStandards() );
        entity.setIdDocumentsChecked( dto.getIdDocumentsChecked() );
        entity.setIssuingAuthority( dto.getIssuingAuthority() );
        entity.setLimitationsDetails( dto.getLimitationsDetails() );
        entity.setLimitationsRemarks( dto.getLimitationsRemarks() );
        entity.setManningAgency( dto.getManningAgency() );
        entity.setMedicalCertificationNo( dto.getMedicalCertificationNo() );
        entity.setMedicalDirector( dto.getMedicalDirector() );
        entity.setNoLimitations( dto.getNoLimitations() );
        entity.setRank( dto.getRank() );
        entity.setShippingCompany( dto.getShippingCompany() );
        entity.setSirbNo( dto.getSirbNo() );
        entity.setUnaidedHearingSatisfactory( dto.getUnaidedHearingSatisfactory() );
        entity.setValidUntil( dto.getValidUntil() );
        entity.setValidUntilDate( dto.getValidUntilDate() );
        entity.setVesselName( dto.getVesselName() );
        entity.setVesselType( dto.getVesselType() );
        entity.setVisualAcuityMeetsStandards( dto.getVisualAcuityMeetsStandards() );
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
    }

    private UUID entitySeafarerProfileId(MlcRecord mlcRecord) {
        SeafarerProfile seafarerProfile = mlcRecord.getSeafarerProfile();
        if ( seafarerProfile == null ) {
            return null;
        }
        return seafarerProfile.getId();
    }
}
