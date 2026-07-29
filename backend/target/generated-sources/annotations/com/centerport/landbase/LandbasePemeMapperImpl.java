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
    date = "2026-07-29T17:58:05+0800",
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
        landbasePemeDto.setAdditionalLabResult( entity.getAdditionalLabResult() );
        landbasePemeDto.setAdditionalTests( entity.getAdditionalTests() );
        landbasePemeDto.setApb( entity.getApb() );
        landbasePemeDto.setAuthorizedPhysician( entity.getAuthorizedPhysician() );
        landbasePemeDto.setBasicPemeResult( entity.getBasicPemeResult() );
        landbasePemeDto.setBloodType( entity.getBloodType() );
        landbasePemeDto.setCbc( entity.getCbc() );
        landbasePemeDto.setCec( entity.getCec() );
        landbasePemeDto.setChestXray( entity.getChestXray() );
        landbasePemeDto.setConsultedDoctor( entity.getConsultedDoctor() );
        landbasePemeDto.setCreatedDate( entity.getCreatedDate() );
        landbasePemeDto.setDateInitialPeme( entity.getDateInitialPeme() );
        landbasePemeDto.setDateOfFitness( entity.getDateOfFitness() );
        landbasePemeDto.setDrugTest( entity.getDrugTest() );
        landbasePemeDto.setFlagMedicalLabResult( entity.getFlagMedicalLabResult() );
        landbasePemeDto.setHbsag( entity.getHbsag() );
        landbasePemeDto.setHivAidsTest( entity.getHivAidsTest() );
        landbasePemeDto.setId( entity.getId() );
        landbasePemeDto.setMaintenanceMedications( entity.getMaintenanceMedications() );
        landbasePemeDto.setMedicalCertificationNo( entity.getMedicalCertificationNo() );
        landbasePemeDto.setMedicalDirector( entity.getMedicalDirector() );
        Map<String, String> map = entity.getMedicalHistory();
        if ( map != null ) {
            landbasePemeDto.setMedicalHistory( new LinkedHashMap<String, String>( map ) );
        }
        landbasePemeDto.setMedicalHistoryOthers( entity.getMedicalHistoryOthers() );
        landbasePemeDto.setPemeId( entity.getPemeId() );
        landbasePemeDto.setPregnancyTest( entity.getPregnancyTest() );
        landbasePemeDto.setPsychologicalTest( entity.getPsychologicalTest() );
        landbasePemeDto.setQuestionnaire1( entity.getQuestionnaire1() );
        landbasePemeDto.setQuestionnaire2( entity.getQuestionnaire2() );
        landbasePemeDto.setQuestionnaire3( entity.getQuestionnaire3() );
        landbasePemeDto.setQuestionnaire4( entity.getQuestionnaire4() );
        landbasePemeDto.setQuestionnaire5( entity.getQuestionnaire5() );
        landbasePemeDto.setQuestionnaire6( entity.getQuestionnaire6() );
        landbasePemeDto.setQuestionnaire7( entity.getQuestionnaire7() );
        landbasePemeDto.setQuestionnaire8( entity.getQuestionnaire8() );
        landbasePemeDto.setQuestionnaire8Details( entity.getQuestionnaire8Details() );
        landbasePemeDto.setQuestionnaireComments( entity.getQuestionnaireComments() );
        landbasePemeDto.setRecommendation( entity.getRecommendation() );
        landbasePemeDto.setRemarks( entity.getRemarks() );
        landbasePemeDto.setStoolExam( entity.getStoolExam() );
        landbasePemeDto.setUpdatedDate( entity.getUpdatedDate() );
        landbasePemeDto.setUrinalysis( entity.getUrinalysis() );
        landbasePemeDto.setValidUntil( entity.getValidUntil() );
        landbasePemeDto.setXrayNo( entity.getXrayNo() );

        return landbasePemeDto;
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
    public LandbasePeme toEntity(LandbasePemeDto dto) {
        if ( dto == null ) {
            return null;
        }

        LandbasePeme landbasePeme = new LandbasePeme();

        landbasePeme.setAdditionalLabResult( dto.getAdditionalLabResult() );
        landbasePeme.setAdditionalTests( dto.getAdditionalTests() );
        landbasePeme.setApb( dto.getApb() );
        landbasePeme.setAuthorizedPhysician( dto.getAuthorizedPhysician() );
        landbasePeme.setBasicPemeResult( dto.getBasicPemeResult() );
        landbasePeme.setBloodType( dto.getBloodType() );
        landbasePeme.setCbc( dto.getCbc() );
        landbasePeme.setCec( dto.getCec() );
        landbasePeme.setChestXray( dto.getChestXray() );
        landbasePeme.setConsultedDoctor( dto.getConsultedDoctor() );
        landbasePeme.setDateInitialPeme( dto.getDateInitialPeme() );
        landbasePeme.setDateOfFitness( dto.getDateOfFitness() );
        landbasePeme.setDrugTest( dto.getDrugTest() );
        landbasePeme.setFlagMedicalLabResult( dto.getFlagMedicalLabResult() );
        landbasePeme.setHbsag( dto.getHbsag() );
        landbasePeme.setHivAidsTest( dto.getHivAidsTest() );
        landbasePeme.setMaintenanceMedications( dto.getMaintenanceMedications() );
        landbasePeme.setMedicalCertificationNo( dto.getMedicalCertificationNo() );
        landbasePeme.setMedicalDirector( dto.getMedicalDirector() );
        Map<String, String> map = dto.getMedicalHistory();
        if ( map != null ) {
            landbasePeme.setMedicalHistory( new LinkedHashMap<String, String>( map ) );
        }
        landbasePeme.setMedicalHistoryOthers( dto.getMedicalHistoryOthers() );
        landbasePeme.setPregnancyTest( dto.getPregnancyTest() );
        landbasePeme.setPsychologicalTest( dto.getPsychologicalTest() );
        landbasePeme.setQuestionnaire1( dto.getQuestionnaire1() );
        landbasePeme.setQuestionnaire2( dto.getQuestionnaire2() );
        landbasePeme.setQuestionnaire3( dto.getQuestionnaire3() );
        landbasePeme.setQuestionnaire4( dto.getQuestionnaire4() );
        landbasePeme.setQuestionnaire5( dto.getQuestionnaire5() );
        landbasePeme.setQuestionnaire6( dto.getQuestionnaire6() );
        landbasePeme.setQuestionnaire7( dto.getQuestionnaire7() );
        landbasePeme.setQuestionnaire8( dto.getQuestionnaire8() );
        landbasePeme.setQuestionnaire8Details( dto.getQuestionnaire8Details() );
        landbasePeme.setQuestionnaireComments( dto.getQuestionnaireComments() );
        landbasePeme.setRecommendation( dto.getRecommendation() );
        landbasePeme.setRemarks( dto.getRemarks() );
        landbasePeme.setStoolExam( dto.getStoolExam() );
        landbasePeme.setUrinalysis( dto.getUrinalysis() );
        landbasePeme.setValidUntil( dto.getValidUntil() );
        landbasePeme.setXrayNo( dto.getXrayNo() );

        return landbasePeme;
    }

    @Override
    public void updateEntity(LandbasePemeDto dto, LandbasePeme entity) {
        if ( dto == null ) {
            return;
        }

        entity.setAdditionalLabResult( dto.getAdditionalLabResult() );
        entity.setAdditionalTests( dto.getAdditionalTests() );
        entity.setApb( dto.getApb() );
        entity.setAuthorizedPhysician( dto.getAuthorizedPhysician() );
        entity.setBasicPemeResult( dto.getBasicPemeResult() );
        entity.setBloodType( dto.getBloodType() );
        entity.setCbc( dto.getCbc() );
        entity.setCec( dto.getCec() );
        entity.setChestXray( dto.getChestXray() );
        entity.setConsultedDoctor( dto.getConsultedDoctor() );
        entity.setDateInitialPeme( dto.getDateInitialPeme() );
        entity.setDateOfFitness( dto.getDateOfFitness() );
        entity.setDrugTest( dto.getDrugTest() );
        entity.setFlagMedicalLabResult( dto.getFlagMedicalLabResult() );
        entity.setHbsag( dto.getHbsag() );
        entity.setHivAidsTest( dto.getHivAidsTest() );
        entity.setMaintenanceMedications( dto.getMaintenanceMedications() );
        entity.setMedicalCertificationNo( dto.getMedicalCertificationNo() );
        entity.setMedicalDirector( dto.getMedicalDirector() );
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
        entity.setPregnancyTest( dto.getPregnancyTest() );
        entity.setPsychologicalTest( dto.getPsychologicalTest() );
        entity.setQuestionnaire1( dto.getQuestionnaire1() );
        entity.setQuestionnaire2( dto.getQuestionnaire2() );
        entity.setQuestionnaire3( dto.getQuestionnaire3() );
        entity.setQuestionnaire4( dto.getQuestionnaire4() );
        entity.setQuestionnaire5( dto.getQuestionnaire5() );
        entity.setQuestionnaire6( dto.getQuestionnaire6() );
        entity.setQuestionnaire7( dto.getQuestionnaire7() );
        entity.setQuestionnaire8( dto.getQuestionnaire8() );
        entity.setQuestionnaire8Details( dto.getQuestionnaire8Details() );
        entity.setQuestionnaireComments( dto.getQuestionnaireComments() );
        entity.setRecommendation( dto.getRecommendation() );
        entity.setRemarks( dto.getRemarks() );
        entity.setStoolExam( dto.getStoolExam() );
        entity.setUrinalysis( dto.getUrinalysis() );
        entity.setValidUntil( dto.getValidUntil() );
        entity.setXrayNo( dto.getXrayNo() );
    }

    private UUID entitySeafarerProfileId(LandbasePeme landbasePeme) {
        SeafarerProfile seafarerProfile = landbasePeme.getSeafarerProfile();
        if ( seafarerProfile == null ) {
            return null;
        }
        return seafarerProfile.getId();
    }
}
