package com.centerport.medical;

import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileDto;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-27T09:38:59+0800",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class MedicalExamMapperImpl implements MedicalExamMapper {

    @Override
    public MedicalExamDto toDto(MedicalExam entity) {
        if ( entity == null ) {
            return null;
        }

        MedicalExamDto medicalExamDto = new MedicalExamDto();

        medicalExamDto.setSeafarerProfileId( entitySeafarerProfileId( entity ) );
        medicalExamDto.setSeafarerProfile( profileToDto( entity.getSeafarerProfile() ) );
        medicalExamDto.setAbdomen( entity.getAbdomen() );
        medicalExamDto.setAbdomenRemarks( entity.getAbdomenRemarks() );
        medicalExamDto.setAge( entity.getAge() );
        medicalExamDto.setAncillaryAdditionalTests( entity.getAncillaryAdditionalTests() );
        medicalExamDto.setAncillaryBloodType( entity.getAncillaryBloodType() );
        medicalExamDto.setAncillaryCbc( entity.getAncillaryCbc() );
        medicalExamDto.setAncillaryCbcFindings( entity.getAncillaryCbcFindings() );
        medicalExamDto.setAncillaryChestXray( entity.getAncillaryChestXray() );
        medicalExamDto.setAncillaryChestXrayFindings( entity.getAncillaryChestXrayFindings() );
        medicalExamDto.setAncillaryEcg( entity.getAncillaryEcg() );
        medicalExamDto.setAncillaryEcgFindings( entity.getAncillaryEcgFindings() );
        medicalExamDto.setAncillaryHbsag( entity.getAncillaryHbsag() );
        medicalExamDto.setAncillaryHivAids( entity.getAncillaryHivAids() );
        medicalExamDto.setAncillaryPregnancyTest( entity.getAncillaryPregnancyTest() );
        medicalExamDto.setAncillaryPsychologicalTest( entity.getAncillaryPsychologicalTest() );
        medicalExamDto.setAncillaryRpr( entity.getAncillaryRpr() );
        medicalExamDto.setAncillaryRprFindings( entity.getAncillaryRprFindings() );
        medicalExamDto.setAncillaryStoolExam( entity.getAncillaryStoolExam() );
        medicalExamDto.setAncillaryStoolExamFindings( entity.getAncillaryStoolExamFindings() );
        medicalExamDto.setAncillaryUrinalysis( entity.getAncillaryUrinalysis() );
        medicalExamDto.setAncillaryUrinalysisFindings( entity.getAncillaryUrinalysisFindings() );
        medicalExamDto.setAudioAdLeft1( entity.getAudioAdLeft1() );
        medicalExamDto.setAudioAdLeft2( entity.getAudioAdLeft2() );
        medicalExamDto.setAudioAdRight1( entity.getAudioAdRight1() );
        medicalExamDto.setAudioAdRight2( entity.getAudioAdRight2() );
        medicalExamDto.setAudioAsLeft1( entity.getAudioAsLeft1() );
        medicalExamDto.setAudioAsLeft2( entity.getAudioAsLeft2() );
        medicalExamDto.setAudioAsRight1( entity.getAudioAsRight1() );
        medicalExamDto.setAudioAsRight2( entity.getAudioAsRight2() );
        medicalExamDto.setAudioHearingBy( entity.getAudioHearingBy() );
        medicalExamDto.setAudioSatisfactory( entity.getAudioSatisfactory() );
        medicalExamDto.setAuthorizedPhysician( entity.getAuthorizedPhysician() );
        medicalExamDto.setBloodPressure( entity.getBloodPressure() );
        medicalExamDto.setBmi( entity.getBmi() );
        medicalExamDto.setBpClassification( entity.getBpClassification() );
        medicalExamDto.setCardiovascular( entity.getCardiovascular() );
        medicalExamDto.setCardiovascularRemarks( entity.getCardiovascularRemarks() );
        medicalExamDto.setCertAdditionalLabs( entity.getCertAdditionalLabs() );
        medicalExamDto.setCertAdditionalLabsFindings( entity.getCertAdditionalLabsFindings() );
        medicalExamDto.setCertBasicOoh( entity.getCertBasicOoh() );
        medicalExamDto.setCertBasicOohFindings( entity.getCertBasicOohFindings() );
        medicalExamDto.setCertFlagpost( entity.getCertFlagpost() );
        medicalExamDto.setCertFlagpostFindings( entity.getCertFlagpostFindings() );
        medicalExamDto.setChestLungs( entity.getChestLungs() );
        medicalExamDto.setChestLungsRemarks( entity.getChestLungsRemarks() );
        medicalExamDto.setColorVision( entity.getColorVision() );
        medicalExamDto.setConditionAggravatedSea( entity.getConditionAggravatedSea() );
        medicalExamDto.setConsultedDoctorPast( entity.getConsultedDoctorPast() );
        medicalExamDto.setCreatedDate( entity.getCreatedDate() );
        medicalExamDto.setDateInitialPeme( entity.getDateInitialPeme() );
        medicalExamDto.setDateOfBirth( entity.getDateOfBirth() );
        medicalExamDto.setDateOfFitness( entity.getDateOfFitness() );
        medicalExamDto.setExamId( entity.getExamId() );
        medicalExamDto.setExaminingPhysician( entity.getExaminingPhysician() );
        medicalExamDto.setExtremities( entity.getExtremities() );
        medicalExamDto.setExtremitiesRemarks( entity.getExtremitiesRemarks() );
        Map<String, Boolean> map = entity.getFindingsA();
        if ( map != null ) {
            medicalExamDto.setFindingsA( new LinkedHashMap<String, Boolean>( map ) );
        }
        Map<String, Boolean> map1 = entity.getFindingsB();
        if ( map1 != null ) {
            medicalExamDto.setFindingsB( new LinkedHashMap<String, Boolean>( map1 ) );
        }
        Map<String, Boolean> map2 = entity.getFindingsC();
        if ( map2 != null ) {
            medicalExamDto.setFindingsC( new LinkedHashMap<String, Boolean>( map2 ) );
        }
        medicalExamDto.setFitForLookout( entity.getFitForLookout() );
        medicalExamDto.setFitnessCateringServices( entity.getFitnessCateringServices() );
        medicalExamDto.setFitnessDeckServices( entity.getFitnessDeckServices() );
        medicalExamDto.setFitnessEngineServices( entity.getFitnessEngineServices() );
        medicalExamDto.setFitnessOtherServices( entity.getFitnessOtherServices() );
        medicalExamDto.setHeartRate( entity.getHeartRate() );
        medicalExamDto.setHeent( entity.getHeent() );
        medicalExamDto.setHeentRemarks( entity.getHeentRemarks() );
        medicalExamDto.setHeight( entity.getHeight() );
        medicalExamDto.setId( entity.getId() );
        medicalExamDto.setIdentificationDocsChecked( entity.getIdentificationDocsChecked() );
        medicalExamDto.setLicenseNo( entity.getLicenseNo() );
        medicalExamDto.setMaintenanceMedications( entity.getMaintenanceMedications() );
        medicalExamDto.setMedicalCertificationNo( entity.getMedicalCertificationNo() );
        medicalExamDto.setMedicalDirector( entity.getMedicalDirector() );
        Map<String, String> map3 = entity.getMedicalHistory();
        if ( map3 != null ) {
            medicalExamDto.setMedicalHistory( new LinkedHashMap<String, String>( map3 ) );
        }
        medicalExamDto.setMedicalHistoryOthers( entity.getMedicalHistoryOthers() );
        medicalExamDto.setNeck( entity.getNeck() );
        medicalExamDto.setNeckRemarks( entity.getNeckRemarks() );
        medicalExamDto.setNeurological( entity.getNeurological() );
        medicalExamDto.setNeurologicalRemarks( entity.getNeurologicalRemarks() );
        medicalExamDto.setOxygenSaturation( entity.getOxygenSaturation() );
        medicalExamDto.setPeBmi( entity.getPeBmi() );
        medicalExamDto.setPeBodyTemperature( entity.getPeBodyTemperature() );
        medicalExamDto.setPeBpDiastolic( entity.getPeBpDiastolic() );
        medicalExamDto.setPeBpSystolic( entity.getPeBpSystolic() );
        medicalExamDto.setPeHeight( entity.getPeHeight() );
        medicalExamDto.setPeMmYm( entity.getPeMmYm() );
        medicalExamDto.setPePulseRate( entity.getPePulseRate() );
        medicalExamDto.setPeRespiration( entity.getPeRespiration() );
        medicalExamDto.setPeWeight( entity.getPeWeight() );
        Map<String, String> map4 = entity.getQuestionnaire();
        if ( map4 != null ) {
            medicalExamDto.setQuestionnaire( new LinkedHashMap<String, String>( map4 ) );
        }
        medicalExamDto.setQuestionnaireComments( entity.getQuestionnaireComments() );
        medicalExamDto.setQuestionnaireMedicationsDetail( entity.getQuestionnaireMedicationsDetail() );
        medicalExamDto.setRecommendationRemarks( entity.getRecommendationRemarks() );
        medicalExamDto.setRespiratoryRate( entity.getRespiratoryRate() );
        medicalExamDto.setSkin( entity.getSkin() );
        medicalExamDto.setSkinRemarks( entity.getSkinRemarks() );
        medicalExamDto.setSpeechImpairedHearing( entity.getSpeechImpairedHearing() );
        medicalExamDto.setTemperature( entity.getTemperature() );
        medicalExamDto.setUpdatedDate( entity.getUpdatedDate() );
        medicalExamDto.setValidUntil( entity.getValidUntil() );
        medicalExamDto.setVisionColor( entity.getVisionColor() );
        medicalExamDto.setVisionContactLenses( entity.getVisionContactLenses() );
        medicalExamDto.setVisionCorrectedFarOd( entity.getVisionCorrectedFarOd() );
        medicalExamDto.setVisionCorrectedFarOs( entity.getVisionCorrectedFarOs() );
        medicalExamDto.setVisionCorrectedNearOd( entity.getVisionCorrectedNearOd() );
        medicalExamDto.setVisionCorrectedNearOs( entity.getVisionCorrectedNearOs() );
        medicalExamDto.setVisionDateTaken( entity.getVisionDateTaken() );
        medicalExamDto.setVisionFarOd( entity.getVisionFarOd() );
        medicalExamDto.setVisionFarOs( entity.getVisionFarOs() );
        medicalExamDto.setVisionMeetsStcw( entity.getVisionMeetsStcw() );
        medicalExamDto.setVisionNearOd( entity.getVisionNearOd() );
        medicalExamDto.setVisionNearOs( entity.getVisionNearOs() );
        medicalExamDto.setVisionUncorrectedFarOd( entity.getVisionUncorrectedFarOd() );
        medicalExamDto.setVisionUncorrectedFarOs( entity.getVisionUncorrectedFarOs() );
        medicalExamDto.setVisionUncorrectedNearOd( entity.getVisionUncorrectedNearOd() );
        medicalExamDto.setVisionUncorrectedNearOs( entity.getVisionUncorrectedNearOs() );
        medicalExamDto.setVisionVisualAcuity( entity.getVisionVisualAcuity() );
        medicalExamDto.setVisualAcuityCorrected( entity.getVisualAcuityCorrected() );
        medicalExamDto.setVisualAcuityLeft( entity.getVisualAcuityLeft() );
        medicalExamDto.setVisualAcuityRight( entity.getVisualAcuityRight() );
        medicalExamDto.setVisualAidsRequired( entity.getVisualAidsRequired() );
        medicalExamDto.setWeight( entity.getWeight() );
        medicalExamDto.setXrayNo( entity.getXrayNo() );

        return medicalExamDto;
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
    public MedicalExam toEntity(MedicalExamDto dto) {
        if ( dto == null ) {
            return null;
        }

        MedicalExam medicalExam = new MedicalExam();

        medicalExam.setAbdomen( dto.getAbdomen() );
        medicalExam.setAbdomenRemarks( dto.getAbdomenRemarks() );
        medicalExam.setAge( dto.getAge() );
        medicalExam.setAncillaryAdditionalTests( dto.getAncillaryAdditionalTests() );
        medicalExam.setAncillaryBloodType( dto.getAncillaryBloodType() );
        medicalExam.setAncillaryCbc( dto.getAncillaryCbc() );
        medicalExam.setAncillaryCbcFindings( dto.getAncillaryCbcFindings() );
        medicalExam.setAncillaryChestXray( dto.getAncillaryChestXray() );
        medicalExam.setAncillaryChestXrayFindings( dto.getAncillaryChestXrayFindings() );
        medicalExam.setAncillaryEcg( dto.getAncillaryEcg() );
        medicalExam.setAncillaryEcgFindings( dto.getAncillaryEcgFindings() );
        medicalExam.setAncillaryHbsag( dto.getAncillaryHbsag() );
        medicalExam.setAncillaryHivAids( dto.getAncillaryHivAids() );
        medicalExam.setAncillaryPregnancyTest( dto.getAncillaryPregnancyTest() );
        medicalExam.setAncillaryPsychologicalTest( dto.getAncillaryPsychologicalTest() );
        medicalExam.setAncillaryRpr( dto.getAncillaryRpr() );
        medicalExam.setAncillaryRprFindings( dto.getAncillaryRprFindings() );
        medicalExam.setAncillaryStoolExam( dto.getAncillaryStoolExam() );
        medicalExam.setAncillaryStoolExamFindings( dto.getAncillaryStoolExamFindings() );
        medicalExam.setAncillaryUrinalysis( dto.getAncillaryUrinalysis() );
        medicalExam.setAncillaryUrinalysisFindings( dto.getAncillaryUrinalysisFindings() );
        medicalExam.setAudioAdLeft1( dto.getAudioAdLeft1() );
        medicalExam.setAudioAdLeft2( dto.getAudioAdLeft2() );
        medicalExam.setAudioAdRight1( dto.getAudioAdRight1() );
        medicalExam.setAudioAdRight2( dto.getAudioAdRight2() );
        medicalExam.setAudioAsLeft1( dto.getAudioAsLeft1() );
        medicalExam.setAudioAsLeft2( dto.getAudioAsLeft2() );
        medicalExam.setAudioAsRight1( dto.getAudioAsRight1() );
        medicalExam.setAudioAsRight2( dto.getAudioAsRight2() );
        medicalExam.setAudioHearingBy( dto.getAudioHearingBy() );
        medicalExam.setAudioSatisfactory( dto.getAudioSatisfactory() );
        medicalExam.setAuthorizedPhysician( dto.getAuthorizedPhysician() );
        medicalExam.setBloodPressure( dto.getBloodPressure() );
        medicalExam.setBmi( dto.getBmi() );
        medicalExam.setBpClassification( dto.getBpClassification() );
        medicalExam.setCardiovascular( dto.getCardiovascular() );
        medicalExam.setCardiovascularRemarks( dto.getCardiovascularRemarks() );
        medicalExam.setCertAdditionalLabs( dto.getCertAdditionalLabs() );
        medicalExam.setCertAdditionalLabsFindings( dto.getCertAdditionalLabsFindings() );
        medicalExam.setCertBasicOoh( dto.getCertBasicOoh() );
        medicalExam.setCertBasicOohFindings( dto.getCertBasicOohFindings() );
        medicalExam.setCertFlagpost( dto.getCertFlagpost() );
        medicalExam.setCertFlagpostFindings( dto.getCertFlagpostFindings() );
        medicalExam.setChestLungs( dto.getChestLungs() );
        medicalExam.setChestLungsRemarks( dto.getChestLungsRemarks() );
        medicalExam.setColorVision( dto.getColorVision() );
        medicalExam.setConditionAggravatedSea( dto.getConditionAggravatedSea() );
        medicalExam.setConsultedDoctorPast( dto.getConsultedDoctorPast() );
        medicalExam.setDateInitialPeme( dto.getDateInitialPeme() );
        medicalExam.setDateOfBirth( dto.getDateOfBirth() );
        medicalExam.setDateOfFitness( dto.getDateOfFitness() );
        medicalExam.setExaminingPhysician( dto.getExaminingPhysician() );
        medicalExam.setExtremities( dto.getExtremities() );
        medicalExam.setExtremitiesRemarks( dto.getExtremitiesRemarks() );
        Map<String, Boolean> map = dto.getFindingsA();
        if ( map != null ) {
            medicalExam.setFindingsA( new LinkedHashMap<String, Boolean>( map ) );
        }
        Map<String, Boolean> map1 = dto.getFindingsB();
        if ( map1 != null ) {
            medicalExam.setFindingsB( new LinkedHashMap<String, Boolean>( map1 ) );
        }
        Map<String, Boolean> map2 = dto.getFindingsC();
        if ( map2 != null ) {
            medicalExam.setFindingsC( new LinkedHashMap<String, Boolean>( map2 ) );
        }
        medicalExam.setFitForLookout( dto.getFitForLookout() );
        medicalExam.setFitnessCateringServices( dto.getFitnessCateringServices() );
        medicalExam.setFitnessDeckServices( dto.getFitnessDeckServices() );
        medicalExam.setFitnessEngineServices( dto.getFitnessEngineServices() );
        medicalExam.setFitnessOtherServices( dto.getFitnessOtherServices() );
        medicalExam.setHeartRate( dto.getHeartRate() );
        medicalExam.setHeent( dto.getHeent() );
        medicalExam.setHeentRemarks( dto.getHeentRemarks() );
        medicalExam.setHeight( dto.getHeight() );
        medicalExam.setIdentificationDocsChecked( dto.getIdentificationDocsChecked() );
        medicalExam.setLicenseNo( dto.getLicenseNo() );
        medicalExam.setMaintenanceMedications( dto.getMaintenanceMedications() );
        medicalExam.setMedicalCertificationNo( dto.getMedicalCertificationNo() );
        medicalExam.setMedicalDirector( dto.getMedicalDirector() );
        Map<String, String> map3 = dto.getMedicalHistory();
        if ( map3 != null ) {
            medicalExam.setMedicalHistory( new LinkedHashMap<String, String>( map3 ) );
        }
        medicalExam.setMedicalHistoryOthers( dto.getMedicalHistoryOthers() );
        medicalExam.setNeck( dto.getNeck() );
        medicalExam.setNeckRemarks( dto.getNeckRemarks() );
        medicalExam.setNeurological( dto.getNeurological() );
        medicalExam.setNeurologicalRemarks( dto.getNeurologicalRemarks() );
        medicalExam.setOxygenSaturation( dto.getOxygenSaturation() );
        medicalExam.setPeBmi( dto.getPeBmi() );
        medicalExam.setPeBodyTemperature( dto.getPeBodyTemperature() );
        medicalExam.setPeBpDiastolic( dto.getPeBpDiastolic() );
        medicalExam.setPeBpSystolic( dto.getPeBpSystolic() );
        medicalExam.setPeHeight( dto.getPeHeight() );
        medicalExam.setPeMmYm( dto.getPeMmYm() );
        medicalExam.setPePulseRate( dto.getPePulseRate() );
        medicalExam.setPeRespiration( dto.getPeRespiration() );
        medicalExam.setPeWeight( dto.getPeWeight() );
        Map<String, String> map4 = dto.getQuestionnaire();
        if ( map4 != null ) {
            medicalExam.setQuestionnaire( new LinkedHashMap<String, String>( map4 ) );
        }
        medicalExam.setQuestionnaireComments( dto.getQuestionnaireComments() );
        medicalExam.setQuestionnaireMedicationsDetail( dto.getQuestionnaireMedicationsDetail() );
        medicalExam.setRecommendationRemarks( dto.getRecommendationRemarks() );
        medicalExam.setRespiratoryRate( dto.getRespiratoryRate() );
        medicalExam.setSkin( dto.getSkin() );
        medicalExam.setSkinRemarks( dto.getSkinRemarks() );
        medicalExam.setSpeechImpairedHearing( dto.getSpeechImpairedHearing() );
        medicalExam.setTemperature( dto.getTemperature() );
        medicalExam.setValidUntil( dto.getValidUntil() );
        medicalExam.setVisionColor( dto.getVisionColor() );
        medicalExam.setVisionContactLenses( dto.getVisionContactLenses() );
        medicalExam.setVisionCorrectedFarOd( dto.getVisionCorrectedFarOd() );
        medicalExam.setVisionCorrectedFarOs( dto.getVisionCorrectedFarOs() );
        medicalExam.setVisionCorrectedNearOd( dto.getVisionCorrectedNearOd() );
        medicalExam.setVisionCorrectedNearOs( dto.getVisionCorrectedNearOs() );
        medicalExam.setVisionDateTaken( dto.getVisionDateTaken() );
        medicalExam.setVisionFarOd( dto.getVisionFarOd() );
        medicalExam.setVisionFarOs( dto.getVisionFarOs() );
        medicalExam.setVisionMeetsStcw( dto.getVisionMeetsStcw() );
        medicalExam.setVisionNearOd( dto.getVisionNearOd() );
        medicalExam.setVisionNearOs( dto.getVisionNearOs() );
        medicalExam.setVisionUncorrectedFarOd( dto.getVisionUncorrectedFarOd() );
        medicalExam.setVisionUncorrectedFarOs( dto.getVisionUncorrectedFarOs() );
        medicalExam.setVisionUncorrectedNearOd( dto.getVisionUncorrectedNearOd() );
        medicalExam.setVisionUncorrectedNearOs( dto.getVisionUncorrectedNearOs() );
        medicalExam.setVisionVisualAcuity( dto.getVisionVisualAcuity() );
        medicalExam.setVisualAcuityCorrected( dto.getVisualAcuityCorrected() );
        medicalExam.setVisualAcuityLeft( dto.getVisualAcuityLeft() );
        medicalExam.setVisualAcuityRight( dto.getVisualAcuityRight() );
        medicalExam.setVisualAidsRequired( dto.getVisualAidsRequired() );
        medicalExam.setWeight( dto.getWeight() );
        medicalExam.setXrayNo( dto.getXrayNo() );

        return medicalExam;
    }

    @Override
    public void updateEntity(MedicalExamDto dto, MedicalExam entity) {
        if ( dto == null ) {
            return;
        }

        entity.setAbdomen( dto.getAbdomen() );
        entity.setAbdomenRemarks( dto.getAbdomenRemarks() );
        entity.setAge( dto.getAge() );
        entity.setAncillaryAdditionalTests( dto.getAncillaryAdditionalTests() );
        entity.setAncillaryBloodType( dto.getAncillaryBloodType() );
        entity.setAncillaryCbc( dto.getAncillaryCbc() );
        entity.setAncillaryCbcFindings( dto.getAncillaryCbcFindings() );
        entity.setAncillaryChestXray( dto.getAncillaryChestXray() );
        entity.setAncillaryChestXrayFindings( dto.getAncillaryChestXrayFindings() );
        entity.setAncillaryEcg( dto.getAncillaryEcg() );
        entity.setAncillaryEcgFindings( dto.getAncillaryEcgFindings() );
        entity.setAncillaryHbsag( dto.getAncillaryHbsag() );
        entity.setAncillaryHivAids( dto.getAncillaryHivAids() );
        entity.setAncillaryPregnancyTest( dto.getAncillaryPregnancyTest() );
        entity.setAncillaryPsychologicalTest( dto.getAncillaryPsychologicalTest() );
        entity.setAncillaryRpr( dto.getAncillaryRpr() );
        entity.setAncillaryRprFindings( dto.getAncillaryRprFindings() );
        entity.setAncillaryStoolExam( dto.getAncillaryStoolExam() );
        entity.setAncillaryStoolExamFindings( dto.getAncillaryStoolExamFindings() );
        entity.setAncillaryUrinalysis( dto.getAncillaryUrinalysis() );
        entity.setAncillaryUrinalysisFindings( dto.getAncillaryUrinalysisFindings() );
        entity.setAudioAdLeft1( dto.getAudioAdLeft1() );
        entity.setAudioAdLeft2( dto.getAudioAdLeft2() );
        entity.setAudioAdRight1( dto.getAudioAdRight1() );
        entity.setAudioAdRight2( dto.getAudioAdRight2() );
        entity.setAudioAsLeft1( dto.getAudioAsLeft1() );
        entity.setAudioAsLeft2( dto.getAudioAsLeft2() );
        entity.setAudioAsRight1( dto.getAudioAsRight1() );
        entity.setAudioAsRight2( dto.getAudioAsRight2() );
        entity.setAudioHearingBy( dto.getAudioHearingBy() );
        entity.setAudioSatisfactory( dto.getAudioSatisfactory() );
        entity.setAuthorizedPhysician( dto.getAuthorizedPhysician() );
        entity.setBloodPressure( dto.getBloodPressure() );
        entity.setBmi( dto.getBmi() );
        entity.setBpClassification( dto.getBpClassification() );
        entity.setCardiovascular( dto.getCardiovascular() );
        entity.setCardiovascularRemarks( dto.getCardiovascularRemarks() );
        entity.setCertAdditionalLabs( dto.getCertAdditionalLabs() );
        entity.setCertAdditionalLabsFindings( dto.getCertAdditionalLabsFindings() );
        entity.setCertBasicOoh( dto.getCertBasicOoh() );
        entity.setCertBasicOohFindings( dto.getCertBasicOohFindings() );
        entity.setCertFlagpost( dto.getCertFlagpost() );
        entity.setCertFlagpostFindings( dto.getCertFlagpostFindings() );
        entity.setChestLungs( dto.getChestLungs() );
        entity.setChestLungsRemarks( dto.getChestLungsRemarks() );
        entity.setColorVision( dto.getColorVision() );
        entity.setConditionAggravatedSea( dto.getConditionAggravatedSea() );
        entity.setConsultedDoctorPast( dto.getConsultedDoctorPast() );
        entity.setDateInitialPeme( dto.getDateInitialPeme() );
        entity.setDateOfBirth( dto.getDateOfBirth() );
        entity.setDateOfFitness( dto.getDateOfFitness() );
        entity.setExaminingPhysician( dto.getExaminingPhysician() );
        entity.setExtremities( dto.getExtremities() );
        entity.setExtremitiesRemarks( dto.getExtremitiesRemarks() );
        if ( entity.getFindingsA() != null ) {
            Map<String, Boolean> map = dto.getFindingsA();
            if ( map != null ) {
                entity.getFindingsA().clear();
                entity.getFindingsA().putAll( map );
            }
            else {
                entity.setFindingsA( null );
            }
        }
        else {
            Map<String, Boolean> map = dto.getFindingsA();
            if ( map != null ) {
                entity.setFindingsA( new LinkedHashMap<String, Boolean>( map ) );
            }
        }
        if ( entity.getFindingsB() != null ) {
            Map<String, Boolean> map1 = dto.getFindingsB();
            if ( map1 != null ) {
                entity.getFindingsB().clear();
                entity.getFindingsB().putAll( map1 );
            }
            else {
                entity.setFindingsB( null );
            }
        }
        else {
            Map<String, Boolean> map1 = dto.getFindingsB();
            if ( map1 != null ) {
                entity.setFindingsB( new LinkedHashMap<String, Boolean>( map1 ) );
            }
        }
        if ( entity.getFindingsC() != null ) {
            Map<String, Boolean> map2 = dto.getFindingsC();
            if ( map2 != null ) {
                entity.getFindingsC().clear();
                entity.getFindingsC().putAll( map2 );
            }
            else {
                entity.setFindingsC( null );
            }
        }
        else {
            Map<String, Boolean> map2 = dto.getFindingsC();
            if ( map2 != null ) {
                entity.setFindingsC( new LinkedHashMap<String, Boolean>( map2 ) );
            }
        }
        entity.setFitForLookout( dto.getFitForLookout() );
        entity.setFitnessCateringServices( dto.getFitnessCateringServices() );
        entity.setFitnessDeckServices( dto.getFitnessDeckServices() );
        entity.setFitnessEngineServices( dto.getFitnessEngineServices() );
        entity.setFitnessOtherServices( dto.getFitnessOtherServices() );
        entity.setHeartRate( dto.getHeartRate() );
        entity.setHeent( dto.getHeent() );
        entity.setHeentRemarks( dto.getHeentRemarks() );
        entity.setHeight( dto.getHeight() );
        entity.setIdentificationDocsChecked( dto.getIdentificationDocsChecked() );
        entity.setLicenseNo( dto.getLicenseNo() );
        entity.setMaintenanceMedications( dto.getMaintenanceMedications() );
        entity.setMedicalCertificationNo( dto.getMedicalCertificationNo() );
        entity.setMedicalDirector( dto.getMedicalDirector() );
        if ( entity.getMedicalHistory() != null ) {
            Map<String, String> map3 = dto.getMedicalHistory();
            if ( map3 != null ) {
                entity.getMedicalHistory().clear();
                entity.getMedicalHistory().putAll( map3 );
            }
            else {
                entity.setMedicalHistory( null );
            }
        }
        else {
            Map<String, String> map3 = dto.getMedicalHistory();
            if ( map3 != null ) {
                entity.setMedicalHistory( new LinkedHashMap<String, String>( map3 ) );
            }
        }
        entity.setMedicalHistoryOthers( dto.getMedicalHistoryOthers() );
        entity.setNeck( dto.getNeck() );
        entity.setNeckRemarks( dto.getNeckRemarks() );
        entity.setNeurological( dto.getNeurological() );
        entity.setNeurologicalRemarks( dto.getNeurologicalRemarks() );
        entity.setOxygenSaturation( dto.getOxygenSaturation() );
        entity.setPeBmi( dto.getPeBmi() );
        entity.setPeBodyTemperature( dto.getPeBodyTemperature() );
        entity.setPeBpDiastolic( dto.getPeBpDiastolic() );
        entity.setPeBpSystolic( dto.getPeBpSystolic() );
        entity.setPeHeight( dto.getPeHeight() );
        entity.setPeMmYm( dto.getPeMmYm() );
        entity.setPePulseRate( dto.getPePulseRate() );
        entity.setPeRespiration( dto.getPeRespiration() );
        entity.setPeWeight( dto.getPeWeight() );
        if ( entity.getQuestionnaire() != null ) {
            Map<String, String> map4 = dto.getQuestionnaire();
            if ( map4 != null ) {
                entity.getQuestionnaire().clear();
                entity.getQuestionnaire().putAll( map4 );
            }
            else {
                entity.setQuestionnaire( null );
            }
        }
        else {
            Map<String, String> map4 = dto.getQuestionnaire();
            if ( map4 != null ) {
                entity.setQuestionnaire( new LinkedHashMap<String, String>( map4 ) );
            }
        }
        entity.setQuestionnaireComments( dto.getQuestionnaireComments() );
        entity.setQuestionnaireMedicationsDetail( dto.getQuestionnaireMedicationsDetail() );
        entity.setRecommendationRemarks( dto.getRecommendationRemarks() );
        entity.setRespiratoryRate( dto.getRespiratoryRate() );
        entity.setSkin( dto.getSkin() );
        entity.setSkinRemarks( dto.getSkinRemarks() );
        entity.setSpeechImpairedHearing( dto.getSpeechImpairedHearing() );
        entity.setTemperature( dto.getTemperature() );
        entity.setValidUntil( dto.getValidUntil() );
        entity.setVisionColor( dto.getVisionColor() );
        entity.setVisionContactLenses( dto.getVisionContactLenses() );
        entity.setVisionCorrectedFarOd( dto.getVisionCorrectedFarOd() );
        entity.setVisionCorrectedFarOs( dto.getVisionCorrectedFarOs() );
        entity.setVisionCorrectedNearOd( dto.getVisionCorrectedNearOd() );
        entity.setVisionCorrectedNearOs( dto.getVisionCorrectedNearOs() );
        entity.setVisionDateTaken( dto.getVisionDateTaken() );
        entity.setVisionFarOd( dto.getVisionFarOd() );
        entity.setVisionFarOs( dto.getVisionFarOs() );
        entity.setVisionMeetsStcw( dto.getVisionMeetsStcw() );
        entity.setVisionNearOd( dto.getVisionNearOd() );
        entity.setVisionNearOs( dto.getVisionNearOs() );
        entity.setVisionUncorrectedFarOd( dto.getVisionUncorrectedFarOd() );
        entity.setVisionUncorrectedFarOs( dto.getVisionUncorrectedFarOs() );
        entity.setVisionUncorrectedNearOd( dto.getVisionUncorrectedNearOd() );
        entity.setVisionUncorrectedNearOs( dto.getVisionUncorrectedNearOs() );
        entity.setVisionVisualAcuity( dto.getVisionVisualAcuity() );
        entity.setVisualAcuityCorrected( dto.getVisualAcuityCorrected() );
        entity.setVisualAcuityLeft( dto.getVisualAcuityLeft() );
        entity.setVisualAcuityRight( dto.getVisualAcuityRight() );
        entity.setVisualAidsRequired( dto.getVisualAidsRequired() );
        entity.setWeight( dto.getWeight() );
        entity.setXrayNo( dto.getXrayNo() );
    }

    private UUID entitySeafarerProfileId(MedicalExam medicalExam) {
        SeafarerProfile seafarerProfile = medicalExam.getSeafarerProfile();
        if ( seafarerProfile == null ) {
            return null;
        }
        return seafarerProfile.getId();
    }
}
