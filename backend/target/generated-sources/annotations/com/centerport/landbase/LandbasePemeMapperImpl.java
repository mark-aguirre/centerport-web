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
    date = "2026-07-30T20:29:08+0800",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Amazon.com Inc.)"
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
        landbasePemeDto.setDohAccreditationNo( entity.getDohAccreditationNo() );
        landbasePemeDto.setRefNo( entity.getRefNo() );
        landbasePemeDto.setPeWeight( entity.getPeWeight() );
        landbasePemeDto.setPeHeight( entity.getPeHeight() );
        landbasePemeDto.setPeBmi( entity.getPeBmi() );
        landbasePemeDto.setPePulseRate( entity.getPePulseRate() );
        landbasePemeDto.setPeBloodPressure( entity.getPeBloodPressure() );
        landbasePemeDto.setPeRespiration( entity.getPeRespiration() );
        landbasePemeDto.setPeBodyTemperature( entity.getPeBodyTemperature() );
        landbasePemeDto.setVisionFarOdUncorrected( entity.getVisionFarOdUncorrected() );
        landbasePemeDto.setVisionFarOsUncorrected( entity.getVisionFarOsUncorrected() );
        landbasePemeDto.setVisionFarOdCorrected( entity.getVisionFarOdCorrected() );
        landbasePemeDto.setVisionFarOsCorrected( entity.getVisionFarOsCorrected() );
        landbasePemeDto.setVisionNearOdUncorrected( entity.getVisionNearOdUncorrected() );
        landbasePemeDto.setVisionNearOsUncorrected( entity.getVisionNearOsUncorrected() );
        landbasePemeDto.setVisionNearOdCorrected( entity.getVisionNearOdCorrected() );
        landbasePemeDto.setVisionNearOsCorrected( entity.getVisionNearOsCorrected() );
        landbasePemeDto.setVisionColorAdequate( entity.getVisionColorAdequate() );
        landbasePemeDto.setHearingAd( entity.getHearingAd() );
        landbasePemeDto.setHearingAs( entity.getHearingAs() );
        landbasePemeDto.setPeSkin( entity.getPeSkin() );
        landbasePemeDto.setPeSkinFindings( entity.getPeSkinFindings() );
        landbasePemeDto.setPeHeadScalp( entity.getPeHeadScalp() );
        landbasePemeDto.setPeHeadScalpFindings( entity.getPeHeadScalpFindings() );
        landbasePemeDto.setPeEyesExternal( entity.getPeEyesExternal() );
        landbasePemeDto.setPeEyesExternalFindings( entity.getPeEyesExternalFindings() );
        landbasePemeDto.setPePupils( entity.getPePupils() );
        landbasePemeDto.setPePupilsFindings( entity.getPePupilsFindings() );
        landbasePemeDto.setPeEars( entity.getPeEars() );
        landbasePemeDto.setPeEarsFindings( entity.getPeEarsFindings() );
        landbasePemeDto.setPeNoseSinuses( entity.getPeNoseSinuses() );
        landbasePemeDto.setPeNoseSinusesFindings( entity.getPeNoseSinusesFindings() );
        landbasePemeDto.setPeMouthThroat( entity.getPeMouthThroat() );
        landbasePemeDto.setPeMouthThroatFindings( entity.getPeMouthThroatFindings() );
        landbasePemeDto.setPeNeckLymphNodes( entity.getPeNeckLymphNodes() );
        landbasePemeDto.setPeNeckLymphNodesFindings( entity.getPeNeckLymphNodesFindings() );
        landbasePemeDto.setPeBreastAxilla( entity.getPeBreastAxilla() );
        landbasePemeDto.setPeBreastAxillaFindings( entity.getPeBreastAxillaFindings() );
        landbasePemeDto.setPeChestLungs( entity.getPeChestLungs() );
        landbasePemeDto.setPeChestLungsFindings( entity.getPeChestLungsFindings() );
        landbasePemeDto.setPeHeart( entity.getPeHeart() );
        landbasePemeDto.setPeHeartFindings( entity.getPeHeartFindings() );
        landbasePemeDto.setPeAbdomen( entity.getPeAbdomen() );
        landbasePemeDto.setPeAbdomenFindings( entity.getPeAbdomenFindings() );
        landbasePemeDto.setPeBack( entity.getPeBack() );
        landbasePemeDto.setPeBackFindings( entity.getPeBackFindings() );
        landbasePemeDto.setPeAnusRectum( entity.getPeAnusRectum() );
        landbasePemeDto.setPeAnusRectumFindings( entity.getPeAnusRectumFindings() );
        landbasePemeDto.setPeGenitoUrinary( entity.getPeGenitoUrinary() );
        landbasePemeDto.setPeGenitoUrinaryFindings( entity.getPeGenitoUrinaryFindings() );
        landbasePemeDto.setPeInguinalsGenitals( entity.getPeInguinalsGenitals() );
        landbasePemeDto.setPeInguinalsGenitalsFindings( entity.getPeInguinalsGenitalsFindings() );
        landbasePemeDto.setPeExtremities( entity.getPeExtremities() );
        landbasePemeDto.setPeExtremitiesFindings( entity.getPeExtremitiesFindings() );
        landbasePemeDto.setPeReflexes( entity.getPeReflexes() );
        landbasePemeDto.setPeReflexesFindings( entity.getPeReflexesFindings() );
        landbasePemeDto.setPeDental( entity.getPeDental() );
        landbasePemeDto.setPeDentalFindings( entity.getPeDentalFindings() );
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
        landbasePeme.setDohAccreditationNo( dto.getDohAccreditationNo() );
        landbasePeme.setRefNo( dto.getRefNo() );
        landbasePeme.setPeWeight( dto.getPeWeight() );
        landbasePeme.setPeHeight( dto.getPeHeight() );
        landbasePeme.setPeBmi( dto.getPeBmi() );
        landbasePeme.setPePulseRate( dto.getPePulseRate() );
        landbasePeme.setPeBloodPressure( dto.getPeBloodPressure() );
        landbasePeme.setPeRespiration( dto.getPeRespiration() );
        landbasePeme.setPeBodyTemperature( dto.getPeBodyTemperature() );
        landbasePeme.setVisionFarOdUncorrected( dto.getVisionFarOdUncorrected() );
        landbasePeme.setVisionFarOsUncorrected( dto.getVisionFarOsUncorrected() );
        landbasePeme.setVisionFarOdCorrected( dto.getVisionFarOdCorrected() );
        landbasePeme.setVisionFarOsCorrected( dto.getVisionFarOsCorrected() );
        landbasePeme.setVisionNearOdUncorrected( dto.getVisionNearOdUncorrected() );
        landbasePeme.setVisionNearOsUncorrected( dto.getVisionNearOsUncorrected() );
        landbasePeme.setVisionNearOdCorrected( dto.getVisionNearOdCorrected() );
        landbasePeme.setVisionNearOsCorrected( dto.getVisionNearOsCorrected() );
        landbasePeme.setVisionColorAdequate( dto.getVisionColorAdequate() );
        landbasePeme.setHearingAd( dto.getHearingAd() );
        landbasePeme.setHearingAs( dto.getHearingAs() );
        landbasePeme.setPeSkin( dto.getPeSkin() );
        landbasePeme.setPeSkinFindings( dto.getPeSkinFindings() );
        landbasePeme.setPeHeadScalp( dto.getPeHeadScalp() );
        landbasePeme.setPeHeadScalpFindings( dto.getPeHeadScalpFindings() );
        landbasePeme.setPeEyesExternal( dto.getPeEyesExternal() );
        landbasePeme.setPeEyesExternalFindings( dto.getPeEyesExternalFindings() );
        landbasePeme.setPePupils( dto.getPePupils() );
        landbasePeme.setPePupilsFindings( dto.getPePupilsFindings() );
        landbasePeme.setPeEars( dto.getPeEars() );
        landbasePeme.setPeEarsFindings( dto.getPeEarsFindings() );
        landbasePeme.setPeNoseSinuses( dto.getPeNoseSinuses() );
        landbasePeme.setPeNoseSinusesFindings( dto.getPeNoseSinusesFindings() );
        landbasePeme.setPeMouthThroat( dto.getPeMouthThroat() );
        landbasePeme.setPeMouthThroatFindings( dto.getPeMouthThroatFindings() );
        landbasePeme.setPeNeckLymphNodes( dto.getPeNeckLymphNodes() );
        landbasePeme.setPeNeckLymphNodesFindings( dto.getPeNeckLymphNodesFindings() );
        landbasePeme.setPeBreastAxilla( dto.getPeBreastAxilla() );
        landbasePeme.setPeBreastAxillaFindings( dto.getPeBreastAxillaFindings() );
        landbasePeme.setPeChestLungs( dto.getPeChestLungs() );
        landbasePeme.setPeChestLungsFindings( dto.getPeChestLungsFindings() );
        landbasePeme.setPeHeart( dto.getPeHeart() );
        landbasePeme.setPeHeartFindings( dto.getPeHeartFindings() );
        landbasePeme.setPeAbdomen( dto.getPeAbdomen() );
        landbasePeme.setPeAbdomenFindings( dto.getPeAbdomenFindings() );
        landbasePeme.setPeBack( dto.getPeBack() );
        landbasePeme.setPeBackFindings( dto.getPeBackFindings() );
        landbasePeme.setPeAnusRectum( dto.getPeAnusRectum() );
        landbasePeme.setPeAnusRectumFindings( dto.getPeAnusRectumFindings() );
        landbasePeme.setPeGenitoUrinary( dto.getPeGenitoUrinary() );
        landbasePeme.setPeGenitoUrinaryFindings( dto.getPeGenitoUrinaryFindings() );
        landbasePeme.setPeInguinalsGenitals( dto.getPeInguinalsGenitals() );
        landbasePeme.setPeInguinalsGenitalsFindings( dto.getPeInguinalsGenitalsFindings() );
        landbasePeme.setPeExtremities( dto.getPeExtremities() );
        landbasePeme.setPeExtremitiesFindings( dto.getPeExtremitiesFindings() );
        landbasePeme.setPeReflexes( dto.getPeReflexes() );
        landbasePeme.setPeReflexesFindings( dto.getPeReflexesFindings() );
        landbasePeme.setPeDental( dto.getPeDental() );
        landbasePeme.setPeDentalFindings( dto.getPeDentalFindings() );
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
        entity.setDohAccreditationNo( dto.getDohAccreditationNo() );
        entity.setRefNo( dto.getRefNo() );
        entity.setPeWeight( dto.getPeWeight() );
        entity.setPeHeight( dto.getPeHeight() );
        entity.setPeBmi( dto.getPeBmi() );
        entity.setPePulseRate( dto.getPePulseRate() );
        entity.setPeBloodPressure( dto.getPeBloodPressure() );
        entity.setPeRespiration( dto.getPeRespiration() );
        entity.setPeBodyTemperature( dto.getPeBodyTemperature() );
        entity.setVisionFarOdUncorrected( dto.getVisionFarOdUncorrected() );
        entity.setVisionFarOsUncorrected( dto.getVisionFarOsUncorrected() );
        entity.setVisionFarOdCorrected( dto.getVisionFarOdCorrected() );
        entity.setVisionFarOsCorrected( dto.getVisionFarOsCorrected() );
        entity.setVisionNearOdUncorrected( dto.getVisionNearOdUncorrected() );
        entity.setVisionNearOsUncorrected( dto.getVisionNearOsUncorrected() );
        entity.setVisionNearOdCorrected( dto.getVisionNearOdCorrected() );
        entity.setVisionNearOsCorrected( dto.getVisionNearOsCorrected() );
        entity.setVisionColorAdequate( dto.getVisionColorAdequate() );
        entity.setHearingAd( dto.getHearingAd() );
        entity.setHearingAs( dto.getHearingAs() );
        entity.setPeSkin( dto.getPeSkin() );
        entity.setPeSkinFindings( dto.getPeSkinFindings() );
        entity.setPeHeadScalp( dto.getPeHeadScalp() );
        entity.setPeHeadScalpFindings( dto.getPeHeadScalpFindings() );
        entity.setPeEyesExternal( dto.getPeEyesExternal() );
        entity.setPeEyesExternalFindings( dto.getPeEyesExternalFindings() );
        entity.setPePupils( dto.getPePupils() );
        entity.setPePupilsFindings( dto.getPePupilsFindings() );
        entity.setPeEars( dto.getPeEars() );
        entity.setPeEarsFindings( dto.getPeEarsFindings() );
        entity.setPeNoseSinuses( dto.getPeNoseSinuses() );
        entity.setPeNoseSinusesFindings( dto.getPeNoseSinusesFindings() );
        entity.setPeMouthThroat( dto.getPeMouthThroat() );
        entity.setPeMouthThroatFindings( dto.getPeMouthThroatFindings() );
        entity.setPeNeckLymphNodes( dto.getPeNeckLymphNodes() );
        entity.setPeNeckLymphNodesFindings( dto.getPeNeckLymphNodesFindings() );
        entity.setPeBreastAxilla( dto.getPeBreastAxilla() );
        entity.setPeBreastAxillaFindings( dto.getPeBreastAxillaFindings() );
        entity.setPeChestLungs( dto.getPeChestLungs() );
        entity.setPeChestLungsFindings( dto.getPeChestLungsFindings() );
        entity.setPeHeart( dto.getPeHeart() );
        entity.setPeHeartFindings( dto.getPeHeartFindings() );
        entity.setPeAbdomen( dto.getPeAbdomen() );
        entity.setPeAbdomenFindings( dto.getPeAbdomenFindings() );
        entity.setPeBack( dto.getPeBack() );
        entity.setPeBackFindings( dto.getPeBackFindings() );
        entity.setPeAnusRectum( dto.getPeAnusRectum() );
        entity.setPeAnusRectumFindings( dto.getPeAnusRectumFindings() );
        entity.setPeGenitoUrinary( dto.getPeGenitoUrinary() );
        entity.setPeGenitoUrinaryFindings( dto.getPeGenitoUrinaryFindings() );
        entity.setPeInguinalsGenitals( dto.getPeInguinalsGenitals() );
        entity.setPeInguinalsGenitalsFindings( dto.getPeInguinalsGenitalsFindings() );
        entity.setPeExtremities( dto.getPeExtremities() );
        entity.setPeExtremitiesFindings( dto.getPeExtremitiesFindings() );
        entity.setPeReflexes( dto.getPeReflexes() );
        entity.setPeReflexesFindings( dto.getPeReflexesFindings() );
        entity.setPeDental( dto.getPeDental() );
        entity.setPeDentalFindings( dto.getPeDentalFindings() );
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
