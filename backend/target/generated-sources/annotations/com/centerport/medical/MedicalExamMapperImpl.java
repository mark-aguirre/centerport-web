package com.centerport.medical;

import java.util.LinkedHashMap;
import java.util.Map;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-26T09:35:26+0800",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Amazon.com Inc.)"
)
@Component
public class MedicalExamMapperImpl implements MedicalExamMapper {

    @Override
    public MedicalExamDto toDto(MedicalExam entity) {
        if ( entity == null ) {
            return null;
        }

        MedicalExamDto medicalExamDto = new MedicalExamDto();

        medicalExamDto.setId( entity.getId() );
        medicalExamDto.setExamId( entity.getExamId() );
        medicalExamDto.setCreatedDate( entity.getCreatedDate() );
        medicalExamDto.setUpdatedDate( entity.getUpdatedDate() );
        medicalExamDto.setLastName( entity.getLastName() );
        medicalExamDto.setFirstName( entity.getFirstName() );
        medicalExamDto.setMiddleName( entity.getMiddleName() );
        medicalExamDto.setPlaceOfBirth( entity.getPlaceOfBirth() );
        medicalExamDto.setPassportNo( entity.getPassportNo() );
        medicalExamDto.setReligion( entity.getReligion() );
        medicalExamDto.setNationality( entity.getNationality() );
        medicalExamDto.setGender( entity.getGender() );
        medicalExamDto.setCivilStatus( entity.getCivilStatus() );
        medicalExamDto.setAddress( entity.getAddress() );
        medicalExamDto.setContactNo( entity.getContactNo() );
        medicalExamDto.setEmployer( entity.getEmployer() );
        medicalExamDto.setPosition( entity.getPosition() );
        medicalExamDto.setDateOfBirth( entity.getDateOfBirth() );
        medicalExamDto.setAge( entity.getAge() );
        medicalExamDto.setPeHeight( entity.getPeHeight() );
        medicalExamDto.setPeBpSystolic( entity.getPeBpSystolic() );
        medicalExamDto.setPeBpDiastolic( entity.getPeBpDiastolic() );
        medicalExamDto.setPePulseRate( entity.getPePulseRate() );
        medicalExamDto.setPeRespiration( entity.getPeRespiration() );
        medicalExamDto.setPeBodyTemperature( entity.getPeBodyTemperature() );
        medicalExamDto.setPeWeight( entity.getPeWeight() );
        medicalExamDto.setPeMmYm( entity.getPeMmYm() );
        medicalExamDto.setPeBmi( entity.getPeBmi() );
        medicalExamDto.setBloodPressure( entity.getBloodPressure() );
        medicalExamDto.setBpClassification( entity.getBpClassification() );
        medicalExamDto.setHeartRate( entity.getHeartRate() );
        medicalExamDto.setRespiratoryRate( entity.getRespiratoryRate() );
        medicalExamDto.setTemperature( entity.getTemperature() );
        medicalExamDto.setWeight( entity.getWeight() );
        medicalExamDto.setHeight( entity.getHeight() );
        medicalExamDto.setBmi( entity.getBmi() );
        medicalExamDto.setOxygenSaturation( entity.getOxygenSaturation() );
        medicalExamDto.setVisionFarOd( entity.getVisionFarOd() );
        medicalExamDto.setVisionFarOs( entity.getVisionFarOs() );
        medicalExamDto.setVisionNearOd( entity.getVisionNearOd() );
        medicalExamDto.setVisionNearOs( entity.getVisionNearOs() );
        medicalExamDto.setVisionUncorrectedFarOd( entity.getVisionUncorrectedFarOd() );
        medicalExamDto.setVisionUncorrectedFarOs( entity.getVisionUncorrectedFarOs() );
        medicalExamDto.setVisionUncorrectedNearOd( entity.getVisionUncorrectedNearOd() );
        medicalExamDto.setVisionUncorrectedNearOs( entity.getVisionUncorrectedNearOs() );
        medicalExamDto.setVisionCorrectedFarOd( entity.getVisionCorrectedFarOd() );
        medicalExamDto.setVisionCorrectedFarOs( entity.getVisionCorrectedFarOs() );
        medicalExamDto.setVisionCorrectedNearOd( entity.getVisionCorrectedNearOd() );
        medicalExamDto.setVisionCorrectedNearOs( entity.getVisionCorrectedNearOs() );
        medicalExamDto.setVisionColor( entity.getVisionColor() );
        medicalExamDto.setVisionVisualAcuity( entity.getVisionVisualAcuity() );
        medicalExamDto.setVisionMeetsStcw( entity.getVisionMeetsStcw() );
        medicalExamDto.setVisionContactLenses( entity.getVisionContactLenses() );
        medicalExamDto.setVisionDateTaken( entity.getVisionDateTaken() );
        medicalExamDto.setAudioHearingBy( entity.getAudioHearingBy() );
        medicalExamDto.setAudioAsRight1( entity.getAudioAsRight1() );
        medicalExamDto.setAudioAsRight2( entity.getAudioAsRight2() );
        medicalExamDto.setAudioAsLeft1( entity.getAudioAsLeft1() );
        medicalExamDto.setAudioAsLeft2( entity.getAudioAsLeft2() );
        medicalExamDto.setAudioAdRight1( entity.getAudioAdRight1() );
        medicalExamDto.setAudioAdRight2( entity.getAudioAdRight2() );
        medicalExamDto.setAudioAdLeft1( entity.getAudioAdLeft1() );
        medicalExamDto.setAudioAdLeft2( entity.getAudioAdLeft2() );
        medicalExamDto.setAudioSatisfactory( entity.getAudioSatisfactory() );
        medicalExamDto.setSpeechImpairedHearing( entity.getSpeechImpairedHearing() );
        medicalExamDto.setConditionAggravatedSea( entity.getConditionAggravatedSea() );
        medicalExamDto.setIdentificationDocsChecked( entity.getIdentificationDocsChecked() );
        medicalExamDto.setFitForLookout( entity.getFitForLookout() );
        medicalExamDto.setSkin( entity.getSkin() );
        medicalExamDto.setSkinRemarks( entity.getSkinRemarks() );
        medicalExamDto.setHeent( entity.getHeent() );
        medicalExamDto.setHeentRemarks( entity.getHeentRemarks() );
        medicalExamDto.setNeck( entity.getNeck() );
        medicalExamDto.setNeckRemarks( entity.getNeckRemarks() );
        medicalExamDto.setChestLungs( entity.getChestLungs() );
        medicalExamDto.setChestLungsRemarks( entity.getChestLungsRemarks() );
        medicalExamDto.setCardiovascular( entity.getCardiovascular() );
        medicalExamDto.setCardiovascularRemarks( entity.getCardiovascularRemarks() );
        medicalExamDto.setAbdomen( entity.getAbdomen() );
        medicalExamDto.setAbdomenRemarks( entity.getAbdomenRemarks() );
        medicalExamDto.setExtremities( entity.getExtremities() );
        medicalExamDto.setExtremitiesRemarks( entity.getExtremitiesRemarks() );
        medicalExamDto.setNeurological( entity.getNeurological() );
        medicalExamDto.setNeurologicalRemarks( entity.getNeurologicalRemarks() );
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
        medicalExamDto.setVisualAcuityRight( entity.getVisualAcuityRight() );
        medicalExamDto.setVisualAcuityLeft( entity.getVisualAcuityLeft() );
        medicalExamDto.setVisualAcuityCorrected( entity.getVisualAcuityCorrected() );
        medicalExamDto.setColorVision( entity.getColorVision() );
        Map<String, String> map3 = entity.getQuestionnaire();
        if ( map3 != null ) {
            medicalExamDto.setQuestionnaire( new LinkedHashMap<String, String>( map3 ) );
        }
        medicalExamDto.setQuestionnaireComments( entity.getQuestionnaireComments() );
        medicalExamDto.setQuestionnaireMedicationsDetail( entity.getQuestionnaireMedicationsDetail() );
        Map<String, String> map4 = entity.getMedicalHistory();
        if ( map4 != null ) {
            medicalExamDto.setMedicalHistory( new LinkedHashMap<String, String>( map4 ) );
        }
        medicalExamDto.setMedicalHistoryOthers( entity.getMedicalHistoryOthers() );
        medicalExamDto.setConsultedDoctorPast( entity.getConsultedDoctorPast() );
        medicalExamDto.setMaintenanceMedications( entity.getMaintenanceMedications() );
        medicalExamDto.setSurgicalHistory( entity.getSurgicalHistory() );
        medicalExamDto.setFamilyHistory( entity.getFamilyHistory() );
        medicalExamDto.setAllergies( entity.getAllergies() );
        medicalExamDto.setCurrentMedications( entity.getCurrentMedications() );
        medicalExamDto.setSmokingHistory( entity.getSmokingHistory() );
        medicalExamDto.setAlcoholHistory( entity.getAlcoholHistory() );
        medicalExamDto.setXrayNo( entity.getXrayNo() );
        medicalExamDto.setAncillaryChestXray( entity.getAncillaryChestXray() );
        medicalExamDto.setAncillaryChestXrayFindings( entity.getAncillaryChestXrayFindings() );
        medicalExamDto.setAncillaryEcg( entity.getAncillaryEcg() );
        medicalExamDto.setAncillaryEcgFindings( entity.getAncillaryEcgFindings() );
        medicalExamDto.setAncillaryCbc( entity.getAncillaryCbc() );
        medicalExamDto.setAncillaryCbcFindings( entity.getAncillaryCbcFindings() );
        medicalExamDto.setAncillaryUrinalysis( entity.getAncillaryUrinalysis() );
        medicalExamDto.setAncillaryUrinalysisFindings( entity.getAncillaryUrinalysisFindings() );
        medicalExamDto.setAncillaryStoolExam( entity.getAncillaryStoolExam() );
        medicalExamDto.setAncillaryStoolExamFindings( entity.getAncillaryStoolExamFindings() );
        medicalExamDto.setAncillaryHbsag( entity.getAncillaryHbsag() );
        medicalExamDto.setAncillaryHivAids( entity.getAncillaryHivAids() );
        medicalExamDto.setAncillaryPregnancyTest( entity.getAncillaryPregnancyTest() );
        medicalExamDto.setAncillaryRpr( entity.getAncillaryRpr() );
        medicalExamDto.setAncillaryRprFindings( entity.getAncillaryRprFindings() );
        medicalExamDto.setAncillaryBloodType( entity.getAncillaryBloodType() );
        medicalExamDto.setAncillaryPsychologicalTest( entity.getAncillaryPsychologicalTest() );
        medicalExamDto.setAncillaryAdditionalTests( entity.getAncillaryAdditionalTests() );
        medicalExamDto.setCbcResult( entity.getCbcResult() );
        medicalExamDto.setCbcRemarks( entity.getCbcRemarks() );
        medicalExamDto.setUrinalysisResult( entity.getUrinalysisResult() );
        medicalExamDto.setUrinalysisRemarks( entity.getUrinalysisRemarks() );
        medicalExamDto.setBloodChemistryResult( entity.getBloodChemistryResult() );
        medicalExamDto.setBloodChemistryRemarks( entity.getBloodChemistryRemarks() );
        medicalExamDto.setChestXrayResult( entity.getChestXrayResult() );
        medicalExamDto.setChestXrayRemarks( entity.getChestXrayRemarks() );
        medicalExamDto.setEcgResult( entity.getEcgResult() );
        medicalExamDto.setEcgRemarks( entity.getEcgRemarks() );
        medicalExamDto.setDrugTestResult( entity.getDrugTestResult() );
        medicalExamDto.setDrugTestRemarks( entity.getDrugTestRemarks() );
        medicalExamDto.setHepatitisBResult( entity.getHepatitisBResult() );
        medicalExamDto.setHepatitisBRemarks( entity.getHepatitisBRemarks() );
        medicalExamDto.setHivResult( entity.getHivResult() );
        medicalExamDto.setHivRemarks( entity.getHivRemarks() );
        medicalExamDto.setAdditionalLabs( entity.getAdditionalLabs() );
        medicalExamDto.setRecommendationRemarks( entity.getRecommendationRemarks() );
        medicalExamDto.setCertBasicOoh( entity.getCertBasicOoh() );
        medicalExamDto.setCertBasicOohFindings( entity.getCertBasicOohFindings() );
        medicalExamDto.setCertAdditionalLabs( entity.getCertAdditionalLabs() );
        medicalExamDto.setCertAdditionalLabsFindings( entity.getCertAdditionalLabsFindings() );
        medicalExamDto.setCertFlagpost( entity.getCertFlagpost() );
        medicalExamDto.setCertFlagpostFindings( entity.getCertFlagpostFindings() );
        medicalExamDto.setFitnessDeckServices( entity.getFitnessDeckServices() );
        medicalExamDto.setFitnessEngineServices( entity.getFitnessEngineServices() );
        medicalExamDto.setFitnessCateringServices( entity.getFitnessCateringServices() );
        medicalExamDto.setFitnessOtherServices( entity.getFitnessOtherServices() );
        medicalExamDto.setVisualAidsRequired( entity.getVisualAidsRequired() );
        medicalExamDto.setDateInitialPeme( entity.getDateInitialPeme() );
        medicalExamDto.setDateOfFitness( entity.getDateOfFitness() );
        medicalExamDto.setValidUntil( entity.getValidUntil() );
        medicalExamDto.setAuthorizedPhysician( entity.getAuthorizedPhysician() );
        medicalExamDto.setMedicalCertificationNo( entity.getMedicalCertificationNo() );
        medicalExamDto.setMedicalDirector( entity.getMedicalDirector() );
        medicalExamDto.setPrimaryDiagnosis( entity.getPrimaryDiagnosis() );
        medicalExamDto.setSecondaryDiagnosis( entity.getSecondaryDiagnosis() );
        medicalExamDto.setIcdCode( entity.getIcdCode() );
        medicalExamDto.setTreatmentPlan( entity.getTreatmentPlan() );
        medicalExamDto.setMedicationsPrescribed( entity.getMedicationsPrescribed() );
        medicalExamDto.setFollowUpDate( entity.getFollowUpDate() );
        medicalExamDto.setReferralTo( entity.getReferralTo() );
        medicalExamDto.setConsultationStatus( entity.getConsultationStatus() );
        medicalExamDto.setRemarks( entity.getRemarks() );
        medicalExamDto.setExaminingPhysician( entity.getExaminingPhysician() );
        medicalExamDto.setLicenseNo( entity.getLicenseNo() );

        return medicalExamDto;
    }

    @Override
    public MedicalExam toEntity(MedicalExamDto dto) {
        if ( dto == null ) {
            return null;
        }

        MedicalExam medicalExam = new MedicalExam();

        medicalExam.setId( dto.getId() );
        medicalExam.setCreatedDate( dto.getCreatedDate() );
        medicalExam.setUpdatedDate( dto.getUpdatedDate() );
        medicalExam.setExamId( dto.getExamId() );
        medicalExam.setLastName( dto.getLastName() );
        medicalExam.setFirstName( dto.getFirstName() );
        medicalExam.setMiddleName( dto.getMiddleName() );
        medicalExam.setPlaceOfBirth( dto.getPlaceOfBirth() );
        medicalExam.setPassportNo( dto.getPassportNo() );
        medicalExam.setReligion( dto.getReligion() );
        medicalExam.setNationality( dto.getNationality() );
        medicalExam.setGender( dto.getGender() );
        medicalExam.setCivilStatus( dto.getCivilStatus() );
        medicalExam.setAddress( dto.getAddress() );
        medicalExam.setContactNo( dto.getContactNo() );
        medicalExam.setEmployer( dto.getEmployer() );
        medicalExam.setPosition( dto.getPosition() );
        medicalExam.setDateOfBirth( dto.getDateOfBirth() );
        medicalExam.setAge( dto.getAge() );
        medicalExam.setPeHeight( dto.getPeHeight() );
        medicalExam.setPeBpSystolic( dto.getPeBpSystolic() );
        medicalExam.setPeBpDiastolic( dto.getPeBpDiastolic() );
        medicalExam.setPePulseRate( dto.getPePulseRate() );
        medicalExam.setPeRespiration( dto.getPeRespiration() );
        medicalExam.setPeBodyTemperature( dto.getPeBodyTemperature() );
        medicalExam.setPeWeight( dto.getPeWeight() );
        medicalExam.setPeMmYm( dto.getPeMmYm() );
        medicalExam.setPeBmi( dto.getPeBmi() );
        medicalExam.setBloodPressure( dto.getBloodPressure() );
        medicalExam.setBpClassification( dto.getBpClassification() );
        medicalExam.setHeartRate( dto.getHeartRate() );
        medicalExam.setRespiratoryRate( dto.getRespiratoryRate() );
        medicalExam.setTemperature( dto.getTemperature() );
        medicalExam.setWeight( dto.getWeight() );
        medicalExam.setHeight( dto.getHeight() );
        medicalExam.setBmi( dto.getBmi() );
        medicalExam.setOxygenSaturation( dto.getOxygenSaturation() );
        medicalExam.setVisionFarOd( dto.getVisionFarOd() );
        medicalExam.setVisionFarOs( dto.getVisionFarOs() );
        medicalExam.setVisionNearOd( dto.getVisionNearOd() );
        medicalExam.setVisionNearOs( dto.getVisionNearOs() );
        medicalExam.setVisionUncorrectedFarOd( dto.getVisionUncorrectedFarOd() );
        medicalExam.setVisionUncorrectedFarOs( dto.getVisionUncorrectedFarOs() );
        medicalExam.setVisionUncorrectedNearOd( dto.getVisionUncorrectedNearOd() );
        medicalExam.setVisionUncorrectedNearOs( dto.getVisionUncorrectedNearOs() );
        medicalExam.setVisionCorrectedFarOd( dto.getVisionCorrectedFarOd() );
        medicalExam.setVisionCorrectedFarOs( dto.getVisionCorrectedFarOs() );
        medicalExam.setVisionCorrectedNearOd( dto.getVisionCorrectedNearOd() );
        medicalExam.setVisionCorrectedNearOs( dto.getVisionCorrectedNearOs() );
        medicalExam.setVisionColor( dto.getVisionColor() );
        medicalExam.setVisionVisualAcuity( dto.getVisionVisualAcuity() );
        medicalExam.setVisionMeetsStcw( dto.getVisionMeetsStcw() );
        medicalExam.setVisionContactLenses( dto.getVisionContactLenses() );
        medicalExam.setVisionDateTaken( dto.getVisionDateTaken() );
        medicalExam.setAudioHearingBy( dto.getAudioHearingBy() );
        medicalExam.setAudioAsRight1( dto.getAudioAsRight1() );
        medicalExam.setAudioAsRight2( dto.getAudioAsRight2() );
        medicalExam.setAudioAsLeft1( dto.getAudioAsLeft1() );
        medicalExam.setAudioAsLeft2( dto.getAudioAsLeft2() );
        medicalExam.setAudioAdRight1( dto.getAudioAdRight1() );
        medicalExam.setAudioAdRight2( dto.getAudioAdRight2() );
        medicalExam.setAudioAdLeft1( dto.getAudioAdLeft1() );
        medicalExam.setAudioAdLeft2( dto.getAudioAdLeft2() );
        medicalExam.setAudioSatisfactory( dto.getAudioSatisfactory() );
        medicalExam.setSpeechImpairedHearing( dto.getSpeechImpairedHearing() );
        medicalExam.setConditionAggravatedSea( dto.getConditionAggravatedSea() );
        medicalExam.setIdentificationDocsChecked( dto.getIdentificationDocsChecked() );
        medicalExam.setFitForLookout( dto.getFitForLookout() );
        medicalExam.setSkin( dto.getSkin() );
        medicalExam.setSkinRemarks( dto.getSkinRemarks() );
        medicalExam.setHeent( dto.getHeent() );
        medicalExam.setHeentRemarks( dto.getHeentRemarks() );
        medicalExam.setNeck( dto.getNeck() );
        medicalExam.setNeckRemarks( dto.getNeckRemarks() );
        medicalExam.setChestLungs( dto.getChestLungs() );
        medicalExam.setChestLungsRemarks( dto.getChestLungsRemarks() );
        medicalExam.setCardiovascular( dto.getCardiovascular() );
        medicalExam.setCardiovascularRemarks( dto.getCardiovascularRemarks() );
        medicalExam.setAbdomen( dto.getAbdomen() );
        medicalExam.setAbdomenRemarks( dto.getAbdomenRemarks() );
        medicalExam.setExtremities( dto.getExtremities() );
        medicalExam.setExtremitiesRemarks( dto.getExtremitiesRemarks() );
        medicalExam.setNeurological( dto.getNeurological() );
        medicalExam.setNeurologicalRemarks( dto.getNeurologicalRemarks() );
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
        medicalExam.setVisualAcuityRight( dto.getVisualAcuityRight() );
        medicalExam.setVisualAcuityLeft( dto.getVisualAcuityLeft() );
        medicalExam.setVisualAcuityCorrected( dto.getVisualAcuityCorrected() );
        medicalExam.setColorVision( dto.getColorVision() );
        Map<String, String> map3 = dto.getQuestionnaire();
        if ( map3 != null ) {
            medicalExam.setQuestionnaire( new LinkedHashMap<String, String>( map3 ) );
        }
        medicalExam.setQuestionnaireComments( dto.getQuestionnaireComments() );
        medicalExam.setQuestionnaireMedicationsDetail( dto.getQuestionnaireMedicationsDetail() );
        Map<String, String> map4 = dto.getMedicalHistory();
        if ( map4 != null ) {
            medicalExam.setMedicalHistory( new LinkedHashMap<String, String>( map4 ) );
        }
        medicalExam.setMedicalHistoryOthers( dto.getMedicalHistoryOthers() );
        medicalExam.setConsultedDoctorPast( dto.getConsultedDoctorPast() );
        medicalExam.setMaintenanceMedications( dto.getMaintenanceMedications() );
        medicalExam.setSurgicalHistory( dto.getSurgicalHistory() );
        medicalExam.setFamilyHistory( dto.getFamilyHistory() );
        medicalExam.setAllergies( dto.getAllergies() );
        medicalExam.setCurrentMedications( dto.getCurrentMedications() );
        medicalExam.setSmokingHistory( dto.getSmokingHistory() );
        medicalExam.setAlcoholHistory( dto.getAlcoholHistory() );
        medicalExam.setXrayNo( dto.getXrayNo() );
        medicalExam.setAncillaryChestXray( dto.getAncillaryChestXray() );
        medicalExam.setAncillaryChestXrayFindings( dto.getAncillaryChestXrayFindings() );
        medicalExam.setAncillaryEcg( dto.getAncillaryEcg() );
        medicalExam.setAncillaryEcgFindings( dto.getAncillaryEcgFindings() );
        medicalExam.setAncillaryCbc( dto.getAncillaryCbc() );
        medicalExam.setAncillaryCbcFindings( dto.getAncillaryCbcFindings() );
        medicalExam.setAncillaryUrinalysis( dto.getAncillaryUrinalysis() );
        medicalExam.setAncillaryUrinalysisFindings( dto.getAncillaryUrinalysisFindings() );
        medicalExam.setAncillaryStoolExam( dto.getAncillaryStoolExam() );
        medicalExam.setAncillaryStoolExamFindings( dto.getAncillaryStoolExamFindings() );
        medicalExam.setAncillaryHbsag( dto.getAncillaryHbsag() );
        medicalExam.setAncillaryHivAids( dto.getAncillaryHivAids() );
        medicalExam.setAncillaryPregnancyTest( dto.getAncillaryPregnancyTest() );
        medicalExam.setAncillaryRpr( dto.getAncillaryRpr() );
        medicalExam.setAncillaryRprFindings( dto.getAncillaryRprFindings() );
        medicalExam.setAncillaryBloodType( dto.getAncillaryBloodType() );
        medicalExam.setAncillaryPsychologicalTest( dto.getAncillaryPsychologicalTest() );
        medicalExam.setAncillaryAdditionalTests( dto.getAncillaryAdditionalTests() );
        medicalExam.setCbcResult( dto.getCbcResult() );
        medicalExam.setCbcRemarks( dto.getCbcRemarks() );
        medicalExam.setUrinalysisResult( dto.getUrinalysisResult() );
        medicalExam.setUrinalysisRemarks( dto.getUrinalysisRemarks() );
        medicalExam.setBloodChemistryResult( dto.getBloodChemistryResult() );
        medicalExam.setBloodChemistryRemarks( dto.getBloodChemistryRemarks() );
        medicalExam.setChestXrayResult( dto.getChestXrayResult() );
        medicalExam.setChestXrayRemarks( dto.getChestXrayRemarks() );
        medicalExam.setEcgResult( dto.getEcgResult() );
        medicalExam.setEcgRemarks( dto.getEcgRemarks() );
        medicalExam.setDrugTestResult( dto.getDrugTestResult() );
        medicalExam.setDrugTestRemarks( dto.getDrugTestRemarks() );
        medicalExam.setHepatitisBResult( dto.getHepatitisBResult() );
        medicalExam.setHepatitisBRemarks( dto.getHepatitisBRemarks() );
        medicalExam.setHivResult( dto.getHivResult() );
        medicalExam.setHivRemarks( dto.getHivRemarks() );
        medicalExam.setAdditionalLabs( dto.getAdditionalLabs() );
        medicalExam.setRecommendationRemarks( dto.getRecommendationRemarks() );
        medicalExam.setCertBasicOoh( dto.getCertBasicOoh() );
        medicalExam.setCertBasicOohFindings( dto.getCertBasicOohFindings() );
        medicalExam.setCertAdditionalLabs( dto.getCertAdditionalLabs() );
        medicalExam.setCertAdditionalLabsFindings( dto.getCertAdditionalLabsFindings() );
        medicalExam.setCertFlagpost( dto.getCertFlagpost() );
        medicalExam.setCertFlagpostFindings( dto.getCertFlagpostFindings() );
        medicalExam.setFitnessDeckServices( dto.getFitnessDeckServices() );
        medicalExam.setFitnessEngineServices( dto.getFitnessEngineServices() );
        medicalExam.setFitnessCateringServices( dto.getFitnessCateringServices() );
        medicalExam.setFitnessOtherServices( dto.getFitnessOtherServices() );
        medicalExam.setVisualAidsRequired( dto.getVisualAidsRequired() );
        medicalExam.setDateInitialPeme( dto.getDateInitialPeme() );
        medicalExam.setDateOfFitness( dto.getDateOfFitness() );
        medicalExam.setValidUntil( dto.getValidUntil() );
        medicalExam.setAuthorizedPhysician( dto.getAuthorizedPhysician() );
        medicalExam.setMedicalCertificationNo( dto.getMedicalCertificationNo() );
        medicalExam.setMedicalDirector( dto.getMedicalDirector() );
        medicalExam.setPrimaryDiagnosis( dto.getPrimaryDiagnosis() );
        medicalExam.setSecondaryDiagnosis( dto.getSecondaryDiagnosis() );
        medicalExam.setIcdCode( dto.getIcdCode() );
        medicalExam.setTreatmentPlan( dto.getTreatmentPlan() );
        medicalExam.setMedicationsPrescribed( dto.getMedicationsPrescribed() );
        medicalExam.setFollowUpDate( dto.getFollowUpDate() );
        medicalExam.setReferralTo( dto.getReferralTo() );
        medicalExam.setConsultationStatus( dto.getConsultationStatus() );
        medicalExam.setRemarks( dto.getRemarks() );
        medicalExam.setExaminingPhysician( dto.getExaminingPhysician() );
        medicalExam.setLicenseNo( dto.getLicenseNo() );

        return medicalExam;
    }

    @Override
    public void updateEntity(MedicalExamDto dto, MedicalExam entity) {
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
        entity.setPeHeight( dto.getPeHeight() );
        entity.setPeBpSystolic( dto.getPeBpSystolic() );
        entity.setPeBpDiastolic( dto.getPeBpDiastolic() );
        entity.setPePulseRate( dto.getPePulseRate() );
        entity.setPeRespiration( dto.getPeRespiration() );
        entity.setPeBodyTemperature( dto.getPeBodyTemperature() );
        entity.setPeWeight( dto.getPeWeight() );
        entity.setPeMmYm( dto.getPeMmYm() );
        entity.setPeBmi( dto.getPeBmi() );
        entity.setBloodPressure( dto.getBloodPressure() );
        entity.setBpClassification( dto.getBpClassification() );
        entity.setHeartRate( dto.getHeartRate() );
        entity.setRespiratoryRate( dto.getRespiratoryRate() );
        entity.setTemperature( dto.getTemperature() );
        entity.setWeight( dto.getWeight() );
        entity.setHeight( dto.getHeight() );
        entity.setBmi( dto.getBmi() );
        entity.setOxygenSaturation( dto.getOxygenSaturation() );
        entity.setVisionFarOd( dto.getVisionFarOd() );
        entity.setVisionFarOs( dto.getVisionFarOs() );
        entity.setVisionNearOd( dto.getVisionNearOd() );
        entity.setVisionNearOs( dto.getVisionNearOs() );
        entity.setVisionUncorrectedFarOd( dto.getVisionUncorrectedFarOd() );
        entity.setVisionUncorrectedFarOs( dto.getVisionUncorrectedFarOs() );
        entity.setVisionUncorrectedNearOd( dto.getVisionUncorrectedNearOd() );
        entity.setVisionUncorrectedNearOs( dto.getVisionUncorrectedNearOs() );
        entity.setVisionCorrectedFarOd( dto.getVisionCorrectedFarOd() );
        entity.setVisionCorrectedFarOs( dto.getVisionCorrectedFarOs() );
        entity.setVisionCorrectedNearOd( dto.getVisionCorrectedNearOd() );
        entity.setVisionCorrectedNearOs( dto.getVisionCorrectedNearOs() );
        entity.setVisionColor( dto.getVisionColor() );
        entity.setVisionVisualAcuity( dto.getVisionVisualAcuity() );
        entity.setVisionMeetsStcw( dto.getVisionMeetsStcw() );
        entity.setVisionContactLenses( dto.getVisionContactLenses() );
        entity.setVisionDateTaken( dto.getVisionDateTaken() );
        entity.setAudioHearingBy( dto.getAudioHearingBy() );
        entity.setAudioAsRight1( dto.getAudioAsRight1() );
        entity.setAudioAsRight2( dto.getAudioAsRight2() );
        entity.setAudioAsLeft1( dto.getAudioAsLeft1() );
        entity.setAudioAsLeft2( dto.getAudioAsLeft2() );
        entity.setAudioAdRight1( dto.getAudioAdRight1() );
        entity.setAudioAdRight2( dto.getAudioAdRight2() );
        entity.setAudioAdLeft1( dto.getAudioAdLeft1() );
        entity.setAudioAdLeft2( dto.getAudioAdLeft2() );
        entity.setAudioSatisfactory( dto.getAudioSatisfactory() );
        entity.setSpeechImpairedHearing( dto.getSpeechImpairedHearing() );
        entity.setConditionAggravatedSea( dto.getConditionAggravatedSea() );
        entity.setIdentificationDocsChecked( dto.getIdentificationDocsChecked() );
        entity.setFitForLookout( dto.getFitForLookout() );
        entity.setSkin( dto.getSkin() );
        entity.setSkinRemarks( dto.getSkinRemarks() );
        entity.setHeent( dto.getHeent() );
        entity.setHeentRemarks( dto.getHeentRemarks() );
        entity.setNeck( dto.getNeck() );
        entity.setNeckRemarks( dto.getNeckRemarks() );
        entity.setChestLungs( dto.getChestLungs() );
        entity.setChestLungsRemarks( dto.getChestLungsRemarks() );
        entity.setCardiovascular( dto.getCardiovascular() );
        entity.setCardiovascularRemarks( dto.getCardiovascularRemarks() );
        entity.setAbdomen( dto.getAbdomen() );
        entity.setAbdomenRemarks( dto.getAbdomenRemarks() );
        entity.setExtremities( dto.getExtremities() );
        entity.setExtremitiesRemarks( dto.getExtremitiesRemarks() );
        entity.setNeurological( dto.getNeurological() );
        entity.setNeurologicalRemarks( dto.getNeurologicalRemarks() );
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
        entity.setVisualAcuityRight( dto.getVisualAcuityRight() );
        entity.setVisualAcuityLeft( dto.getVisualAcuityLeft() );
        entity.setVisualAcuityCorrected( dto.getVisualAcuityCorrected() );
        entity.setColorVision( dto.getColorVision() );
        if ( entity.getQuestionnaire() != null ) {
            Map<String, String> map3 = dto.getQuestionnaire();
            if ( map3 != null ) {
                entity.getQuestionnaire().clear();
                entity.getQuestionnaire().putAll( map3 );
            }
            else {
                entity.setQuestionnaire( null );
            }
        }
        else {
            Map<String, String> map3 = dto.getQuestionnaire();
            if ( map3 != null ) {
                entity.setQuestionnaire( new LinkedHashMap<String, String>( map3 ) );
            }
        }
        entity.setQuestionnaireComments( dto.getQuestionnaireComments() );
        entity.setQuestionnaireMedicationsDetail( dto.getQuestionnaireMedicationsDetail() );
        if ( entity.getMedicalHistory() != null ) {
            Map<String, String> map4 = dto.getMedicalHistory();
            if ( map4 != null ) {
                entity.getMedicalHistory().clear();
                entity.getMedicalHistory().putAll( map4 );
            }
            else {
                entity.setMedicalHistory( null );
            }
        }
        else {
            Map<String, String> map4 = dto.getMedicalHistory();
            if ( map4 != null ) {
                entity.setMedicalHistory( new LinkedHashMap<String, String>( map4 ) );
            }
        }
        entity.setMedicalHistoryOthers( dto.getMedicalHistoryOthers() );
        entity.setConsultedDoctorPast( dto.getConsultedDoctorPast() );
        entity.setMaintenanceMedications( dto.getMaintenanceMedications() );
        entity.setSurgicalHistory( dto.getSurgicalHistory() );
        entity.setFamilyHistory( dto.getFamilyHistory() );
        entity.setAllergies( dto.getAllergies() );
        entity.setCurrentMedications( dto.getCurrentMedications() );
        entity.setSmokingHistory( dto.getSmokingHistory() );
        entity.setAlcoholHistory( dto.getAlcoholHistory() );
        entity.setXrayNo( dto.getXrayNo() );
        entity.setAncillaryChestXray( dto.getAncillaryChestXray() );
        entity.setAncillaryChestXrayFindings( dto.getAncillaryChestXrayFindings() );
        entity.setAncillaryEcg( dto.getAncillaryEcg() );
        entity.setAncillaryEcgFindings( dto.getAncillaryEcgFindings() );
        entity.setAncillaryCbc( dto.getAncillaryCbc() );
        entity.setAncillaryCbcFindings( dto.getAncillaryCbcFindings() );
        entity.setAncillaryUrinalysis( dto.getAncillaryUrinalysis() );
        entity.setAncillaryUrinalysisFindings( dto.getAncillaryUrinalysisFindings() );
        entity.setAncillaryStoolExam( dto.getAncillaryStoolExam() );
        entity.setAncillaryStoolExamFindings( dto.getAncillaryStoolExamFindings() );
        entity.setAncillaryHbsag( dto.getAncillaryHbsag() );
        entity.setAncillaryHivAids( dto.getAncillaryHivAids() );
        entity.setAncillaryPregnancyTest( dto.getAncillaryPregnancyTest() );
        entity.setAncillaryRpr( dto.getAncillaryRpr() );
        entity.setAncillaryRprFindings( dto.getAncillaryRprFindings() );
        entity.setAncillaryBloodType( dto.getAncillaryBloodType() );
        entity.setAncillaryPsychologicalTest( dto.getAncillaryPsychologicalTest() );
        entity.setAncillaryAdditionalTests( dto.getAncillaryAdditionalTests() );
        entity.setCbcResult( dto.getCbcResult() );
        entity.setCbcRemarks( dto.getCbcRemarks() );
        entity.setUrinalysisResult( dto.getUrinalysisResult() );
        entity.setUrinalysisRemarks( dto.getUrinalysisRemarks() );
        entity.setBloodChemistryResult( dto.getBloodChemistryResult() );
        entity.setBloodChemistryRemarks( dto.getBloodChemistryRemarks() );
        entity.setChestXrayResult( dto.getChestXrayResult() );
        entity.setChestXrayRemarks( dto.getChestXrayRemarks() );
        entity.setEcgResult( dto.getEcgResult() );
        entity.setEcgRemarks( dto.getEcgRemarks() );
        entity.setDrugTestResult( dto.getDrugTestResult() );
        entity.setDrugTestRemarks( dto.getDrugTestRemarks() );
        entity.setHepatitisBResult( dto.getHepatitisBResult() );
        entity.setHepatitisBRemarks( dto.getHepatitisBRemarks() );
        entity.setHivResult( dto.getHivResult() );
        entity.setHivRemarks( dto.getHivRemarks() );
        entity.setAdditionalLabs( dto.getAdditionalLabs() );
        entity.setRecommendationRemarks( dto.getRecommendationRemarks() );
        entity.setCertBasicOoh( dto.getCertBasicOoh() );
        entity.setCertBasicOohFindings( dto.getCertBasicOohFindings() );
        entity.setCertAdditionalLabs( dto.getCertAdditionalLabs() );
        entity.setCertAdditionalLabsFindings( dto.getCertAdditionalLabsFindings() );
        entity.setCertFlagpost( dto.getCertFlagpost() );
        entity.setCertFlagpostFindings( dto.getCertFlagpostFindings() );
        entity.setFitnessDeckServices( dto.getFitnessDeckServices() );
        entity.setFitnessEngineServices( dto.getFitnessEngineServices() );
        entity.setFitnessCateringServices( dto.getFitnessCateringServices() );
        entity.setFitnessOtherServices( dto.getFitnessOtherServices() );
        entity.setVisualAidsRequired( dto.getVisualAidsRequired() );
        entity.setDateInitialPeme( dto.getDateInitialPeme() );
        entity.setDateOfFitness( dto.getDateOfFitness() );
        entity.setValidUntil( dto.getValidUntil() );
        entity.setAuthorizedPhysician( dto.getAuthorizedPhysician() );
        entity.setMedicalCertificationNo( dto.getMedicalCertificationNo() );
        entity.setMedicalDirector( dto.getMedicalDirector() );
        entity.setPrimaryDiagnosis( dto.getPrimaryDiagnosis() );
        entity.setSecondaryDiagnosis( dto.getSecondaryDiagnosis() );
        entity.setIcdCode( dto.getIcdCode() );
        entity.setTreatmentPlan( dto.getTreatmentPlan() );
        entity.setMedicationsPrescribed( dto.getMedicationsPrescribed() );
        entity.setFollowUpDate( dto.getFollowUpDate() );
        entity.setReferralTo( dto.getReferralTo() );
        entity.setConsultationStatus( dto.getConsultationStatus() );
        entity.setRemarks( dto.getRemarks() );
        entity.setExaminingPhysician( dto.getExaminingPhysician() );
        entity.setLicenseNo( dto.getLicenseNo() );
    }
}
