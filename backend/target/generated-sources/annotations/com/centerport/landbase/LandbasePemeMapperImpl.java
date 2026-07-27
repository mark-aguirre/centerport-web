package com.centerport.landbase;

import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileDto;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-27T09:39:07+0800",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class LandbasePemeMapperImpl implements LandbasePemeMapper {

    @Override
    public LandbasePemeDto toDto(LandbasePeme entity) {
        if ( entity == null ) {
            return null;
        }

        LandbasePemeDto landbasePemeDto = new LandbasePemeDto();

        landbasePemeDto.setSeafarerProfileId( entitySeafarerProfileId( entity ) );
        landbasePemeDto.setSeafarerProfile( profileToDto( entity.getSeafarerProfile() ) );
        landbasePemeDto.setId( entity.getId() );
        landbasePemeDto.setPemeId( entity.getPemeId() );
        landbasePemeDto.setCreatedDate( entity.getCreatedDate() );
        landbasePemeDto.setUpdatedDate( entity.getUpdatedDate() );
        Map<String, String> map = entity.getMedicalHistory();
        if ( map != null ) {
            landbasePemeDto.setMedicalHistory( new LinkedHashMap<String, String>( map ) );
        }
        landbasePemeDto.setMedicalHistoryOthers( entity.getMedicalHistoryOthers() );
        landbasePemeDto.setConsultedDoctor( entity.getConsultedDoctor() );
        landbasePemeDto.setMaintenanceMedications( entity.getMaintenanceMedications() );
        landbasePemeDto.setQuestionnaire1( entity.getQuestionnaire1() );
        landbasePemeDto.setQuestionnaire2( entity.getQuestionnaire2() );
        landbasePemeDto.setQuestionnaire3( entity.getQuestionnaire3() );
        landbasePemeDto.setQuestionnaire4( entity.getQuestionnaire4() );
        landbasePemeDto.setQuestionnaire5( entity.getQuestionnaire5() );
        landbasePemeDto.setQuestionnaire6( entity.getQuestionnaire6() );
        landbasePemeDto.setQuestionnaire7( entity.getQuestionnaire7() );
        landbasePemeDto.setQuestionnaireComments( entity.getQuestionnaireComments() );
        landbasePemeDto.setQuestionnaire8( entity.getQuestionnaire8() );
        landbasePemeDto.setQuestionnaire8Details( entity.getQuestionnaire8Details() );
        landbasePemeDto.setXrayNo( entity.getXrayNo() );
        landbasePemeDto.setChestXray( entity.getChestXray() );
        landbasePemeDto.setCbc( entity.getCbc() );
        landbasePemeDto.setCec( entity.getCec() );
        landbasePemeDto.setPregnancyTest( entity.getPregnancyTest() );
        landbasePemeDto.setUrinalysis( entity.getUrinalysis() );
        landbasePemeDto.setStoolExam( entity.getStoolExam() );
        landbasePemeDto.setHbsag( entity.getHbsag() );
        landbasePemeDto.setHivAidsTest( entity.getHivAidsTest() );
        landbasePemeDto.setApb( entity.getApb() );
        landbasePemeDto.setBloodType( entity.getBloodType() );
        landbasePemeDto.setDrugTest( entity.getDrugTest() );
        landbasePemeDto.setPsychologicalTest( entity.getPsychologicalTest() );
        landbasePemeDto.setAdditionalTests( entity.getAdditionalTests() );
        landbasePemeDto.setRemarks( entity.getRemarks() );
        landbasePemeDto.setBasicPemeResult( entity.getBasicPemeResult() );
        landbasePemeDto.setAdditionalLabResult( entity.getAdditionalLabResult() );
        landbasePemeDto.setFlagMedicalLabResult( entity.getFlagMedicalLabResult() );
        landbasePemeDto.setRecommendation( entity.getRecommendation() );
        landbasePemeDto.setDateInitialPeme( entity.getDateInitialPeme() );
        landbasePemeDto.setDateOfFitness( entity.getDateOfFitness() );
        landbasePemeDto.setValidUntil( entity.getValidUntil() );
        landbasePemeDto.setAuthorizedPhysician( entity.getAuthorizedPhysician() );
        landbasePemeDto.setMedicalCertificationNo( entity.getMedicalCertificationNo() );
        landbasePemeDto.setMedicalDirector( entity.getMedicalDirector() );

        return landbasePemeDto;
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
    public LandbasePeme toEntity(LandbasePemeDto dto) {
        if ( dto == null ) {
            return null;
        }

        LandbasePeme landbasePeme = new LandbasePeme();

        Map<String, String> map = dto.getMedicalHistory();
        if ( map != null ) {
            landbasePeme.setMedicalHistory( new LinkedHashMap<String, String>( map ) );
        }
        landbasePeme.setMedicalHistoryOthers( dto.getMedicalHistoryOthers() );
        landbasePeme.setConsultedDoctor( dto.getConsultedDoctor() );
        landbasePeme.setMaintenanceMedications( dto.getMaintenanceMedications() );
        landbasePeme.setQuestionnaire1( dto.getQuestionnaire1() );
        landbasePeme.setQuestionnaire2( dto.getQuestionnaire2() );
        landbasePeme.setQuestionnaire3( dto.getQuestionnaire3() );
        landbasePeme.setQuestionnaire4( dto.getQuestionnaire4() );
        landbasePeme.setQuestionnaire5( dto.getQuestionnaire5() );
        landbasePeme.setQuestionnaire6( dto.getQuestionnaire6() );
        landbasePeme.setQuestionnaire7( dto.getQuestionnaire7() );
        landbasePeme.setQuestionnaireComments( dto.getQuestionnaireComments() );
        landbasePeme.setQuestionnaire8( dto.getQuestionnaire8() );
        landbasePeme.setQuestionnaire8Details( dto.getQuestionnaire8Details() );
        landbasePeme.setXrayNo( dto.getXrayNo() );
        landbasePeme.setChestXray( dto.getChestXray() );
        landbasePeme.setCbc( dto.getCbc() );
        landbasePeme.setCec( dto.getCec() );
        landbasePeme.setPregnancyTest( dto.getPregnancyTest() );
        landbasePeme.setUrinalysis( dto.getUrinalysis() );
        landbasePeme.setStoolExam( dto.getStoolExam() );
        landbasePeme.setHbsag( dto.getHbsag() );
        landbasePeme.setHivAidsTest( dto.getHivAidsTest() );
        landbasePeme.setApb( dto.getApb() );
        landbasePeme.setBloodType( dto.getBloodType() );
        landbasePeme.setDrugTest( dto.getDrugTest() );
        landbasePeme.setPsychologicalTest( dto.getPsychologicalTest() );
        landbasePeme.setAdditionalTests( dto.getAdditionalTests() );
        landbasePeme.setRemarks( dto.getRemarks() );
        landbasePeme.setBasicPemeResult( dto.getBasicPemeResult() );
        landbasePeme.setAdditionalLabResult( dto.getAdditionalLabResult() );
        landbasePeme.setFlagMedicalLabResult( dto.getFlagMedicalLabResult() );
        landbasePeme.setRecommendation( dto.getRecommendation() );
        landbasePeme.setDateInitialPeme( dto.getDateInitialPeme() );
        landbasePeme.setDateOfFitness( dto.getDateOfFitness() );
        landbasePeme.setValidUntil( dto.getValidUntil() );
        landbasePeme.setAuthorizedPhysician( dto.getAuthorizedPhysician() );
        landbasePeme.setMedicalCertificationNo( dto.getMedicalCertificationNo() );
        landbasePeme.setMedicalDirector( dto.getMedicalDirector() );

        return landbasePeme;
    }

    @Override
    public void updateEntity(LandbasePemeDto dto, LandbasePeme entity) {
        if ( dto == null ) {
            return;
        }

        if ( entity.getMedicalHistory() != null ) {
            Map<String, String> map = dto.getMedicalHistory();
            if ( map != null ) {
                entity.getMedicalHistory().clear();
                entity.getMedicalHistory().putAll( map );
            }
            else {
                entity.setMedicalHistory( null );
            }
        }
        else {
            Map<String, String> map = dto.getMedicalHistory();
            if ( map != null ) {
                entity.setMedicalHistory( new LinkedHashMap<String, String>( map ) );
            }
        }
        entity.setMedicalHistoryOthers( dto.getMedicalHistoryOthers() );
        entity.setConsultedDoctor( dto.getConsultedDoctor() );
        entity.setMaintenanceMedications( dto.getMaintenanceMedications() );
        entity.setQuestionnaire1( dto.getQuestionnaire1() );
        entity.setQuestionnaire2( dto.getQuestionnaire2() );
        entity.setQuestionnaire3( dto.getQuestionnaire3() );
        entity.setQuestionnaire4( dto.getQuestionnaire4() );
        entity.setQuestionnaire5( dto.getQuestionnaire5() );
        entity.setQuestionnaire6( dto.getQuestionnaire6() );
        entity.setQuestionnaire7( dto.getQuestionnaire7() );
        entity.setQuestionnaireComments( dto.getQuestionnaireComments() );
        entity.setQuestionnaire8( dto.getQuestionnaire8() );
        entity.setQuestionnaire8Details( dto.getQuestionnaire8Details() );
        entity.setXrayNo( dto.getXrayNo() );
        entity.setChestXray( dto.getChestXray() );
        entity.setCbc( dto.getCbc() );
        entity.setCec( dto.getCec() );
        entity.setPregnancyTest( dto.getPregnancyTest() );
        entity.setUrinalysis( dto.getUrinalysis() );
        entity.setStoolExam( dto.getStoolExam() );
        entity.setHbsag( dto.getHbsag() );
        entity.setHivAidsTest( dto.getHivAidsTest() );
        entity.setApb( dto.getApb() );
        entity.setBloodType( dto.getBloodType() );
        entity.setDrugTest( dto.getDrugTest() );
        entity.setPsychologicalTest( dto.getPsychologicalTest() );
        entity.setAdditionalTests( dto.getAdditionalTests() );
        entity.setRemarks( dto.getRemarks() );
        entity.setBasicPemeResult( dto.getBasicPemeResult() );
        entity.setAdditionalLabResult( dto.getAdditionalLabResult() );
        entity.setFlagMedicalLabResult( dto.getFlagMedicalLabResult() );
        entity.setRecommendation( dto.getRecommendation() );
        entity.setDateInitialPeme( dto.getDateInitialPeme() );
        entity.setDateOfFitness( dto.getDateOfFitness() );
        entity.setValidUntil( dto.getValidUntil() );
        entity.setAuthorizedPhysician( dto.getAuthorizedPhysician() );
        entity.setMedicalCertificationNo( dto.getMedicalCertificationNo() );
        entity.setMedicalDirector( dto.getMedicalDirector() );
    }

    private UUID entitySeafarerProfileId(LandbasePeme landbasePeme) {
        SeafarerProfile seafarerProfile = landbasePeme.getSeafarerProfile();
        if ( seafarerProfile == null ) {
            return null;
        }
        return seafarerProfile.getId();
    }
}
