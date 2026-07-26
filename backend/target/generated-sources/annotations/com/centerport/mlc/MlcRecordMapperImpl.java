package com.centerport.mlc;

import com.centerport.common.enums.VisualAid;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-26T09:35:27+0800",
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

        mlcRecordDto.setId( entity.getId() );
        mlcRecordDto.setMlcId( entity.getMlcId() );
        mlcRecordDto.setCreatedDate( entity.getCreatedDate() );
        mlcRecordDto.setUpdatedDate( entity.getUpdatedDate() );
        mlcRecordDto.setLastName( entity.getLastName() );
        mlcRecordDto.setFirstName( entity.getFirstName() );
        mlcRecordDto.setMiddleName( entity.getMiddleName() );
        mlcRecordDto.setPlaceOfBirth( entity.getPlaceOfBirth() );
        mlcRecordDto.setPassportNo( entity.getPassportNo() );
        mlcRecordDto.setReligion( entity.getReligion() );
        mlcRecordDto.setNationality( entity.getNationality() );
        mlcRecordDto.setGender( entity.getGender() );
        mlcRecordDto.setCivilStatus( entity.getCivilStatus() );
        mlcRecordDto.setAddress( entity.getAddress() );
        mlcRecordDto.setContactNo( entity.getContactNo() );
        mlcRecordDto.setEmployer( entity.getEmployer() );
        mlcRecordDto.setPosition( entity.getPosition() );
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
    public MlcRecord toEntity(MlcRecordDto dto) {
        if ( dto == null ) {
            return null;
        }

        MlcRecord mlcRecord = new MlcRecord();

        mlcRecord.setId( dto.getId() );
        mlcRecord.setCreatedDate( dto.getCreatedDate() );
        mlcRecord.setUpdatedDate( dto.getUpdatedDate() );
        mlcRecord.setMlcId( dto.getMlcId() );
        mlcRecord.setLastName( dto.getLastName() );
        mlcRecord.setFirstName( dto.getFirstName() );
        mlcRecord.setMiddleName( dto.getMiddleName() );
        mlcRecord.setPlaceOfBirth( dto.getPlaceOfBirth() );
        mlcRecord.setPassportNo( dto.getPassportNo() );
        mlcRecord.setReligion( dto.getReligion() );
        mlcRecord.setNationality( dto.getNationality() );
        mlcRecord.setGender( dto.getGender() );
        mlcRecord.setCivilStatus( dto.getCivilStatus() );
        mlcRecord.setAddress( dto.getAddress() );
        mlcRecord.setContactNo( dto.getContactNo() );
        mlcRecord.setEmployer( dto.getEmployer() );
        mlcRecord.setPosition( dto.getPosition() );
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

        entity.setLastName( dto.getLastName() );
        entity.setFirstName( dto.getFirstName() );
        entity.setMiddleName( dto.getMiddleName() );
        entity.setPlaceOfBirth( dto.getPlaceOfBirth() );
        entity.setPassportNo( dto.getPassportNo() );
        entity.setReligion( dto.getReligion() );
        entity.setNationality( dto.getNationality() );
        entity.setGender( dto.getGender() );
        entity.setCivilStatus( dto.getCivilStatus() );
        entity.setAddress( dto.getAddress() );
        entity.setContactNo( dto.getContactNo() );
        entity.setEmployer( dto.getEmployer() );
        entity.setPosition( dto.getPosition() );
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
}
