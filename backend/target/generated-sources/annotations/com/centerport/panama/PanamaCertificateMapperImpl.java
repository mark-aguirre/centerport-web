package com.centerport.panama;

import java.util.LinkedHashMap;
import java.util.Map;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-25T22:42:37+0800",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Amazon.com Inc.)"
)
@Component
public class PanamaCertificateMapperImpl implements PanamaCertificateMapper {

    @Override
    public PanamaCertificateDto toDto(PanamaCertificate entity) {
        if ( entity == null ) {
            return null;
        }

        PanamaCertificateDto panamaCertificateDto = new PanamaCertificateDto();

        panamaCertificateDto.setId( entity.getId() );
        panamaCertificateDto.setPanamaId( entity.getPanamaId() );
        panamaCertificateDto.setCreatedDate( entity.getCreatedDate() );
        panamaCertificateDto.setUpdatedDate( entity.getUpdatedDate() );
        panamaCertificateDto.setFullName( entity.getFullName() );
        panamaCertificateDto.setDay( entity.getDay() );
        panamaCertificateDto.setMonth( entity.getMonth() );
        panamaCertificateDto.setYear( entity.getYear() );
        panamaCertificateDto.setSex( entity.getSex() );
        panamaCertificateDto.setRhTyping( entity.getRhTyping() );
        panamaCertificateDto.setPassportSeamanNo( entity.getPassportSeamanNo() );
        panamaCertificateDto.setHomeAddress( entity.getHomeAddress() );
        panamaCertificateDto.setDepartment( entity.getDepartment() );
        panamaCertificateDto.setCrewPosition( entity.getCrewPosition() );
        panamaCertificateDto.setLookoutDuties( entity.getLookoutDuties() );
        panamaCertificateDto.setRoutineEmergencyDuties( entity.getRoutineEmergencyDuties() );
        panamaCertificateDto.setTypeOfShip( entity.getTypeOfShip() );
        panamaCertificateDto.setTradeArea( entity.getTradeArea() );
        Map<String, String> map = entity.getConditions();
        if ( map != null ) {
            panamaCertificateDto.setConditions( new LinkedHashMap<String, String>( map ) );
        }
        panamaCertificateDto.setConditionsDetails( entity.getConditionsDetails() );
        panamaCertificateDto.setQuestion37( entity.getQuestion37() );
        panamaCertificateDto.setQuestion38( entity.getQuestion38() );
        panamaCertificateDto.setQuestion39( entity.getQuestion39() );
        panamaCertificateDto.setQuestion40( entity.getQuestion40() );
        panamaCertificateDto.setQuestion41( entity.getQuestion41() );
        panamaCertificateDto.setQuestion42( entity.getQuestion42() );
        panamaCertificateDto.setQuestion43( entity.getQuestion43() );
        panamaCertificateDto.setQuestion44( entity.getQuestion44() );
        panamaCertificateDto.setDeclarationComments( entity.getDeclarationComments() );
        panamaCertificateDto.setQuestion45( entity.getQuestion45() );
        panamaCertificateDto.setQuestion45Details( entity.getQuestion45Details() );
        panamaCertificateDto.setCovid1( entity.getCovid1() );
        panamaCertificateDto.setCovid2( entity.getCovid2() );
        panamaCertificateDto.setCovid3Date( entity.getCovid3Date() );
        panamaCertificateDto.setCovid4( entity.getCovid4() );
        panamaCertificateDto.setCovid5( entity.getCovid5() );
        panamaCertificateDto.setCovid6VaccineType( entity.getCovid6VaccineType() );
        panamaCertificateDto.setCovid6NumDoses( entity.getCovid6NumDoses() );
        panamaCertificateDto.setCovid6Boosters( entity.getCovid6Boosters() );
        panamaCertificateDto.setStatementName( entity.getStatementName() );
        panamaCertificateDto.setStatementSignature( entity.getStatementSignature() );
        panamaCertificateDto.setStatementDay( entity.getStatementDay() );
        panamaCertificateDto.setStatementMonth( entity.getStatementMonth() );
        panamaCertificateDto.setStatementYear( entity.getStatementYear() );
        panamaCertificateDto.setStatementWitnessName( entity.getStatementWitnessName() );
        panamaCertificateDto.setStatementPractitionerName( entity.getStatementPractitionerName() );
        panamaCertificateDto.setStatementPractitionerSignature( entity.getStatementPractitionerSignature() );
        panamaCertificateDto.setStatementPractitionerDateDay( entity.getStatementPractitionerDateDay() );
        panamaCertificateDto.setStatementPractitionerDateMonth( entity.getStatementPractitionerDateMonth() );
        panamaCertificateDto.setStatementPractitionerDateYear( entity.getStatementPractitionerDateYear() );
        panamaCertificateDto.setStatementPractitionerWitness( entity.getStatementPractitionerWitness() );
        panamaCertificateDto.setStatementPreviousExamDetails( entity.getStatementPreviousExamDetails() );
        panamaCertificateDto.setHeightCm( entity.getHeightCm() );
        panamaCertificateDto.setWeightKg( entity.getWeightKg() );
        panamaCertificateDto.setBmi( entity.getBmi() );
        panamaCertificateDto.setOxygenSaturation( entity.getOxygenSaturation() );
        panamaCertificateDto.setHeartRate( entity.getHeartRate() );
        panamaCertificateDto.setRespiratoryRate( entity.getRespiratoryRate() );
        panamaCertificateDto.setBloodPressureSystolic( entity.getBloodPressureSystolic() );
        panamaCertificateDto.setBloodPressureDiastolic( entity.getBloodPressureDiastolic() );
        panamaCertificateDto.setSightGlassesContact( entity.getSightGlassesContact() );
        panamaCertificateDto.setSightUnaidedDistantRight( entity.getSightUnaidedDistantRight() );
        panamaCertificateDto.setSightUnaidedDistantLeft( entity.getSightUnaidedDistantLeft() );
        panamaCertificateDto.setSightUnaidedDistantBinocular( entity.getSightUnaidedDistantBinocular() );
        panamaCertificateDto.setSightUnaidedShortRight( entity.getSightUnaidedShortRight() );
        panamaCertificateDto.setSightUnaidedShortLeft( entity.getSightUnaidedShortLeft() );
        panamaCertificateDto.setSightAidedDistantRight( entity.getSightAidedDistantRight() );
        panamaCertificateDto.setSightAidedDistantLeft( entity.getSightAidedDistantLeft() );
        panamaCertificateDto.setSightAidedDistantBinocular( entity.getSightAidedDistantBinocular() );
        panamaCertificateDto.setSightAidedShortRight( entity.getSightAidedShortRight() );
        panamaCertificateDto.setSightAidedShortLeft( entity.getSightAidedShortLeft() );
        panamaCertificateDto.setSightFieldsRight( entity.getSightFieldsRight() );
        panamaCertificateDto.setSightFieldsLeft( entity.getSightFieldsLeft() );
        panamaCertificateDto.setSightColorVision( entity.getSightColorVision() );
        panamaCertificateDto.setSightColorMethod( entity.getSightColorMethod() );
        panamaCertificateDto.setHearingRight500( entity.getHearingRight500() );
        panamaCertificateDto.setHearingRight1000( entity.getHearingRight1000() );
        panamaCertificateDto.setHearingRight2000( entity.getHearingRight2000() );
        panamaCertificateDto.setHearingRight3000( entity.getHearingRight3000() );
        panamaCertificateDto.setHearingRight4000( entity.getHearingRight4000() );
        panamaCertificateDto.setHearingRight6000( entity.getHearingRight6000() );
        panamaCertificateDto.setHearingRight8000( entity.getHearingRight8000() );
        panamaCertificateDto.setHearingLeft500( entity.getHearingLeft500() );
        panamaCertificateDto.setHearingLeft1000( entity.getHearingLeft1000() );
        panamaCertificateDto.setHearingLeft2000( entity.getHearingLeft2000() );
        panamaCertificateDto.setHearingLeft3000( entity.getHearingLeft3000() );
        panamaCertificateDto.setHearingLeft4000( entity.getHearingLeft4000() );
        panamaCertificateDto.setHearingLeft6000( entity.getHearingLeft6000() );
        panamaCertificateDto.setHearingLeft8000( entity.getHearingLeft8000() );
        Map<String, String> map1 = entity.getPhysicalExploration();
        if ( map1 != null ) {
            panamaCertificateDto.setPhysicalExploration( new LinkedHashMap<String, String>( map1 ) );
        }
        panamaCertificateDto.setPhysicalExplorationComments( entity.getPhysicalExplorationComments() );
        Map<String, LabTestResult> map2 = entity.getLabTests();
        if ( map2 != null ) {
            panamaCertificateDto.setLabTests( new LinkedHashMap<String, LabTestResult>( map2 ) );
        }
        Map<String, OtherLabTestResult> map3 = entity.getLabOtherTests();
        if ( map3 != null ) {
            panamaCertificateDto.setLabOtherTests( new LinkedHashMap<String, OtherLabTestResult>( map3 ) );
        }
        panamaCertificateDto.setLabMandatoryText( entity.getLabMandatoryText() );
        panamaCertificateDto.setOtherDiagTest( entity.getOtherDiagTest() );
        panamaCertificateDto.setOtherDiagResult( entity.getOtherDiagResult() );
        panamaCertificateDto.setOtherDiagComments( entity.getOtherDiagComments() );
        panamaCertificateDto.setFitnessLookout( entity.getFitnessLookout() );
        panamaCertificateDto.setFitnessDeckFit( entity.getFitnessDeckFit() );
        panamaCertificateDto.setFitnessDeckUnfit( entity.getFitnessDeckUnfit() );
        panamaCertificateDto.setFitnessEngineFit( entity.getFitnessEngineFit() );
        panamaCertificateDto.setFitnessEngineUnfit( entity.getFitnessEngineUnfit() );
        panamaCertificateDto.setFitnessCateringFit( entity.getFitnessCateringFit() );
        panamaCertificateDto.setFitnessCateringUnfit( entity.getFitnessCateringUnfit() );
        panamaCertificateDto.setFitnessOtherFit( entity.getFitnessOtherFit() );
        panamaCertificateDto.setFitnessOtherUnfit( entity.getFitnessOtherUnfit() );
        panamaCertificateDto.setFitnessRestriction( entity.getFitnessRestriction() );
        panamaCertificateDto.setFitnessRestrictionDetails( entity.getFitnessRestrictionDetails() );
        panamaCertificateDto.setFitnessVisualAid( entity.getFitnessVisualAid() );
        panamaCertificateDto.setCertExpiryDay( entity.getCertExpiryDay() );
        panamaCertificateDto.setCertExpiryMonth( entity.getCertExpiryMonth() );
        panamaCertificateDto.setCertExpiryYear( entity.getCertExpiryYear() );
        panamaCertificateDto.setCertIssuedDay( entity.getCertIssuedDay() );
        panamaCertificateDto.setCertIssuedMonth( entity.getCertIssuedMonth() );
        panamaCertificateDto.setCertIssuedYear( entity.getCertIssuedYear() );
        panamaCertificateDto.setCertNumber( entity.getCertNumber() );
        panamaCertificateDto.setPhysicianName( entity.getPhysicianName() );
        panamaCertificateDto.setPhysicianSignature( entity.getPhysicianSignature() );

        return panamaCertificateDto;
    }

    @Override
    public PanamaCertificate toEntity(PanamaCertificateDto dto) {
        if ( dto == null ) {
            return null;
        }

        PanamaCertificate panamaCertificate = new PanamaCertificate();

        panamaCertificate.setId( dto.getId() );
        panamaCertificate.setCreatedDate( dto.getCreatedDate() );
        panamaCertificate.setUpdatedDate( dto.getUpdatedDate() );
        panamaCertificate.setPanamaId( dto.getPanamaId() );
        panamaCertificate.setFullName( dto.getFullName() );
        panamaCertificate.setDay( dto.getDay() );
        panamaCertificate.setMonth( dto.getMonth() );
        panamaCertificate.setYear( dto.getYear() );
        panamaCertificate.setSex( dto.getSex() );
        panamaCertificate.setRhTyping( dto.getRhTyping() );
        panamaCertificate.setPassportSeamanNo( dto.getPassportSeamanNo() );
        panamaCertificate.setHomeAddress( dto.getHomeAddress() );
        panamaCertificate.setDepartment( dto.getDepartment() );
        panamaCertificate.setCrewPosition( dto.getCrewPosition() );
        panamaCertificate.setLookoutDuties( dto.getLookoutDuties() );
        panamaCertificate.setRoutineEmergencyDuties( dto.getRoutineEmergencyDuties() );
        panamaCertificate.setTypeOfShip( dto.getTypeOfShip() );
        panamaCertificate.setTradeArea( dto.getTradeArea() );
        Map<String, String> map = dto.getConditions();
        if ( map != null ) {
            panamaCertificate.setConditions( new LinkedHashMap<String, String>( map ) );
        }
        panamaCertificate.setConditionsDetails( dto.getConditionsDetails() );
        panamaCertificate.setQuestion37( dto.getQuestion37() );
        panamaCertificate.setQuestion38( dto.getQuestion38() );
        panamaCertificate.setQuestion39( dto.getQuestion39() );
        panamaCertificate.setQuestion40( dto.getQuestion40() );
        panamaCertificate.setQuestion41( dto.getQuestion41() );
        panamaCertificate.setQuestion42( dto.getQuestion42() );
        panamaCertificate.setQuestion43( dto.getQuestion43() );
        panamaCertificate.setQuestion44( dto.getQuestion44() );
        panamaCertificate.setDeclarationComments( dto.getDeclarationComments() );
        panamaCertificate.setQuestion45( dto.getQuestion45() );
        panamaCertificate.setQuestion45Details( dto.getQuestion45Details() );
        panamaCertificate.setCovid1( dto.getCovid1() );
        panamaCertificate.setCovid2( dto.getCovid2() );
        panamaCertificate.setCovid3Date( dto.getCovid3Date() );
        panamaCertificate.setCovid4( dto.getCovid4() );
        panamaCertificate.setCovid5( dto.getCovid5() );
        panamaCertificate.setCovid6VaccineType( dto.getCovid6VaccineType() );
        panamaCertificate.setCovid6NumDoses( dto.getCovid6NumDoses() );
        panamaCertificate.setCovid6Boosters( dto.getCovid6Boosters() );
        panamaCertificate.setStatementName( dto.getStatementName() );
        panamaCertificate.setStatementSignature( dto.getStatementSignature() );
        panamaCertificate.setStatementDay( dto.getStatementDay() );
        panamaCertificate.setStatementMonth( dto.getStatementMonth() );
        panamaCertificate.setStatementYear( dto.getStatementYear() );
        panamaCertificate.setStatementWitnessName( dto.getStatementWitnessName() );
        panamaCertificate.setStatementPractitionerName( dto.getStatementPractitionerName() );
        panamaCertificate.setStatementPractitionerSignature( dto.getStatementPractitionerSignature() );
        panamaCertificate.setStatementPractitionerDateDay( dto.getStatementPractitionerDateDay() );
        panamaCertificate.setStatementPractitionerDateMonth( dto.getStatementPractitionerDateMonth() );
        panamaCertificate.setStatementPractitionerDateYear( dto.getStatementPractitionerDateYear() );
        panamaCertificate.setStatementPractitionerWitness( dto.getStatementPractitionerWitness() );
        panamaCertificate.setStatementPreviousExamDetails( dto.getStatementPreviousExamDetails() );
        panamaCertificate.setHeightCm( dto.getHeightCm() );
        panamaCertificate.setWeightKg( dto.getWeightKg() );
        panamaCertificate.setBmi( dto.getBmi() );
        panamaCertificate.setOxygenSaturation( dto.getOxygenSaturation() );
        panamaCertificate.setHeartRate( dto.getHeartRate() );
        panamaCertificate.setRespiratoryRate( dto.getRespiratoryRate() );
        panamaCertificate.setBloodPressureSystolic( dto.getBloodPressureSystolic() );
        panamaCertificate.setBloodPressureDiastolic( dto.getBloodPressureDiastolic() );
        panamaCertificate.setSightGlassesContact( dto.getSightGlassesContact() );
        panamaCertificate.setSightUnaidedDistantRight( dto.getSightUnaidedDistantRight() );
        panamaCertificate.setSightUnaidedDistantLeft( dto.getSightUnaidedDistantLeft() );
        panamaCertificate.setSightUnaidedDistantBinocular( dto.getSightUnaidedDistantBinocular() );
        panamaCertificate.setSightUnaidedShortRight( dto.getSightUnaidedShortRight() );
        panamaCertificate.setSightUnaidedShortLeft( dto.getSightUnaidedShortLeft() );
        panamaCertificate.setSightAidedDistantRight( dto.getSightAidedDistantRight() );
        panamaCertificate.setSightAidedDistantLeft( dto.getSightAidedDistantLeft() );
        panamaCertificate.setSightAidedDistantBinocular( dto.getSightAidedDistantBinocular() );
        panamaCertificate.setSightAidedShortRight( dto.getSightAidedShortRight() );
        panamaCertificate.setSightAidedShortLeft( dto.getSightAidedShortLeft() );
        panamaCertificate.setSightFieldsRight( dto.getSightFieldsRight() );
        panamaCertificate.setSightFieldsLeft( dto.getSightFieldsLeft() );
        panamaCertificate.setSightColorVision( dto.getSightColorVision() );
        panamaCertificate.setSightColorMethod( dto.getSightColorMethod() );
        panamaCertificate.setHearingRight500( dto.getHearingRight500() );
        panamaCertificate.setHearingRight1000( dto.getHearingRight1000() );
        panamaCertificate.setHearingRight2000( dto.getHearingRight2000() );
        panamaCertificate.setHearingRight3000( dto.getHearingRight3000() );
        panamaCertificate.setHearingRight4000( dto.getHearingRight4000() );
        panamaCertificate.setHearingRight6000( dto.getHearingRight6000() );
        panamaCertificate.setHearingRight8000( dto.getHearingRight8000() );
        panamaCertificate.setHearingLeft500( dto.getHearingLeft500() );
        panamaCertificate.setHearingLeft1000( dto.getHearingLeft1000() );
        panamaCertificate.setHearingLeft2000( dto.getHearingLeft2000() );
        panamaCertificate.setHearingLeft3000( dto.getHearingLeft3000() );
        panamaCertificate.setHearingLeft4000( dto.getHearingLeft4000() );
        panamaCertificate.setHearingLeft6000( dto.getHearingLeft6000() );
        panamaCertificate.setHearingLeft8000( dto.getHearingLeft8000() );
        Map<String, String> map1 = dto.getPhysicalExploration();
        if ( map1 != null ) {
            panamaCertificate.setPhysicalExploration( new LinkedHashMap<String, String>( map1 ) );
        }
        panamaCertificate.setPhysicalExplorationComments( dto.getPhysicalExplorationComments() );
        Map<String, LabTestResult> map2 = dto.getLabTests();
        if ( map2 != null ) {
            panamaCertificate.setLabTests( new LinkedHashMap<String, LabTestResult>( map2 ) );
        }
        Map<String, OtherLabTestResult> map3 = dto.getLabOtherTests();
        if ( map3 != null ) {
            panamaCertificate.setLabOtherTests( new LinkedHashMap<String, OtherLabTestResult>( map3 ) );
        }
        panamaCertificate.setLabMandatoryText( dto.getLabMandatoryText() );
        panamaCertificate.setOtherDiagTest( dto.getOtherDiagTest() );
        panamaCertificate.setOtherDiagResult( dto.getOtherDiagResult() );
        panamaCertificate.setOtherDiagComments( dto.getOtherDiagComments() );
        panamaCertificate.setFitnessLookout( dto.getFitnessLookout() );
        panamaCertificate.setFitnessDeckFit( dto.getFitnessDeckFit() );
        panamaCertificate.setFitnessDeckUnfit( dto.getFitnessDeckUnfit() );
        panamaCertificate.setFitnessEngineFit( dto.getFitnessEngineFit() );
        panamaCertificate.setFitnessEngineUnfit( dto.getFitnessEngineUnfit() );
        panamaCertificate.setFitnessCateringFit( dto.getFitnessCateringFit() );
        panamaCertificate.setFitnessCateringUnfit( dto.getFitnessCateringUnfit() );
        panamaCertificate.setFitnessOtherFit( dto.getFitnessOtherFit() );
        panamaCertificate.setFitnessOtherUnfit( dto.getFitnessOtherUnfit() );
        panamaCertificate.setFitnessRestriction( dto.getFitnessRestriction() );
        panamaCertificate.setFitnessRestrictionDetails( dto.getFitnessRestrictionDetails() );
        panamaCertificate.setFitnessVisualAid( dto.getFitnessVisualAid() );
        panamaCertificate.setCertExpiryDay( dto.getCertExpiryDay() );
        panamaCertificate.setCertExpiryMonth( dto.getCertExpiryMonth() );
        panamaCertificate.setCertExpiryYear( dto.getCertExpiryYear() );
        panamaCertificate.setCertIssuedDay( dto.getCertIssuedDay() );
        panamaCertificate.setCertIssuedMonth( dto.getCertIssuedMonth() );
        panamaCertificate.setCertIssuedYear( dto.getCertIssuedYear() );
        panamaCertificate.setCertNumber( dto.getCertNumber() );
        panamaCertificate.setPhysicianName( dto.getPhysicianName() );
        panamaCertificate.setPhysicianSignature( dto.getPhysicianSignature() );

        return panamaCertificate;
    }

    @Override
    public void updateEntity(PanamaCertificateDto dto, PanamaCertificate entity) {
        if ( dto == null ) {
            return;
        }

        entity.setFullName( dto.getFullName() );
        entity.setDay( dto.getDay() );
        entity.setMonth( dto.getMonth() );
        entity.setYear( dto.getYear() );
        entity.setSex( dto.getSex() );
        entity.setRhTyping( dto.getRhTyping() );
        entity.setPassportSeamanNo( dto.getPassportSeamanNo() );
        entity.setHomeAddress( dto.getHomeAddress() );
        entity.setDepartment( dto.getDepartment() );
        entity.setCrewPosition( dto.getCrewPosition() );
        entity.setLookoutDuties( dto.getLookoutDuties() );
        entity.setRoutineEmergencyDuties( dto.getRoutineEmergencyDuties() );
        entity.setTypeOfShip( dto.getTypeOfShip() );
        entity.setTradeArea( dto.getTradeArea() );
        if ( entity.getConditions() != null ) {
            Map<String, String> map = dto.getConditions();
            if ( map != null ) {
                entity.getConditions().clear();
                entity.getConditions().putAll( map );
            }
            else {
                entity.setConditions( null );
            }
        }
        else {
            Map<String, String> map = dto.getConditions();
            if ( map != null ) {
                entity.setConditions( new LinkedHashMap<String, String>( map ) );
            }
        }
        entity.setConditionsDetails( dto.getConditionsDetails() );
        entity.setQuestion37( dto.getQuestion37() );
        entity.setQuestion38( dto.getQuestion38() );
        entity.setQuestion39( dto.getQuestion39() );
        entity.setQuestion40( dto.getQuestion40() );
        entity.setQuestion41( dto.getQuestion41() );
        entity.setQuestion42( dto.getQuestion42() );
        entity.setQuestion43( dto.getQuestion43() );
        entity.setQuestion44( dto.getQuestion44() );
        entity.setDeclarationComments( dto.getDeclarationComments() );
        entity.setQuestion45( dto.getQuestion45() );
        entity.setQuestion45Details( dto.getQuestion45Details() );
        entity.setCovid1( dto.getCovid1() );
        entity.setCovid2( dto.getCovid2() );
        entity.setCovid3Date( dto.getCovid3Date() );
        entity.setCovid4( dto.getCovid4() );
        entity.setCovid5( dto.getCovid5() );
        entity.setCovid6VaccineType( dto.getCovid6VaccineType() );
        entity.setCovid6NumDoses( dto.getCovid6NumDoses() );
        entity.setCovid6Boosters( dto.getCovid6Boosters() );
        entity.setStatementName( dto.getStatementName() );
        entity.setStatementSignature( dto.getStatementSignature() );
        entity.setStatementDay( dto.getStatementDay() );
        entity.setStatementMonth( dto.getStatementMonth() );
        entity.setStatementYear( dto.getStatementYear() );
        entity.setStatementWitnessName( dto.getStatementWitnessName() );
        entity.setStatementPractitionerName( dto.getStatementPractitionerName() );
        entity.setStatementPractitionerSignature( dto.getStatementPractitionerSignature() );
        entity.setStatementPractitionerDateDay( dto.getStatementPractitionerDateDay() );
        entity.setStatementPractitionerDateMonth( dto.getStatementPractitionerDateMonth() );
        entity.setStatementPractitionerDateYear( dto.getStatementPractitionerDateYear() );
        entity.setStatementPractitionerWitness( dto.getStatementPractitionerWitness() );
        entity.setStatementPreviousExamDetails( dto.getStatementPreviousExamDetails() );
        entity.setHeightCm( dto.getHeightCm() );
        entity.setWeightKg( dto.getWeightKg() );
        entity.setBmi( dto.getBmi() );
        entity.setOxygenSaturation( dto.getOxygenSaturation() );
        entity.setHeartRate( dto.getHeartRate() );
        entity.setRespiratoryRate( dto.getRespiratoryRate() );
        entity.setBloodPressureSystolic( dto.getBloodPressureSystolic() );
        entity.setBloodPressureDiastolic( dto.getBloodPressureDiastolic() );
        entity.setSightGlassesContact( dto.getSightGlassesContact() );
        entity.setSightUnaidedDistantRight( dto.getSightUnaidedDistantRight() );
        entity.setSightUnaidedDistantLeft( dto.getSightUnaidedDistantLeft() );
        entity.setSightUnaidedDistantBinocular( dto.getSightUnaidedDistantBinocular() );
        entity.setSightUnaidedShortRight( dto.getSightUnaidedShortRight() );
        entity.setSightUnaidedShortLeft( dto.getSightUnaidedShortLeft() );
        entity.setSightAidedDistantRight( dto.getSightAidedDistantRight() );
        entity.setSightAidedDistantLeft( dto.getSightAidedDistantLeft() );
        entity.setSightAidedDistantBinocular( dto.getSightAidedDistantBinocular() );
        entity.setSightAidedShortRight( dto.getSightAidedShortRight() );
        entity.setSightAidedShortLeft( dto.getSightAidedShortLeft() );
        entity.setSightFieldsRight( dto.getSightFieldsRight() );
        entity.setSightFieldsLeft( dto.getSightFieldsLeft() );
        entity.setSightColorVision( dto.getSightColorVision() );
        entity.setSightColorMethod( dto.getSightColorMethod() );
        entity.setHearingRight500( dto.getHearingRight500() );
        entity.setHearingRight1000( dto.getHearingRight1000() );
        entity.setHearingRight2000( dto.getHearingRight2000() );
        entity.setHearingRight3000( dto.getHearingRight3000() );
        entity.setHearingRight4000( dto.getHearingRight4000() );
        entity.setHearingRight6000( dto.getHearingRight6000() );
        entity.setHearingRight8000( dto.getHearingRight8000() );
        entity.setHearingLeft500( dto.getHearingLeft500() );
        entity.setHearingLeft1000( dto.getHearingLeft1000() );
        entity.setHearingLeft2000( dto.getHearingLeft2000() );
        entity.setHearingLeft3000( dto.getHearingLeft3000() );
        entity.setHearingLeft4000( dto.getHearingLeft4000() );
        entity.setHearingLeft6000( dto.getHearingLeft6000() );
        entity.setHearingLeft8000( dto.getHearingLeft8000() );
        if ( entity.getPhysicalExploration() != null ) {
            Map<String, String> map1 = dto.getPhysicalExploration();
            if ( map1 != null ) {
                entity.getPhysicalExploration().clear();
                entity.getPhysicalExploration().putAll( map1 );
            }
            else {
                entity.setPhysicalExploration( null );
            }
        }
        else {
            Map<String, String> map1 = dto.getPhysicalExploration();
            if ( map1 != null ) {
                entity.setPhysicalExploration( new LinkedHashMap<String, String>( map1 ) );
            }
        }
        entity.setPhysicalExplorationComments( dto.getPhysicalExplorationComments() );
        if ( entity.getLabTests() != null ) {
            Map<String, LabTestResult> map2 = dto.getLabTests();
            if ( map2 != null ) {
                entity.getLabTests().clear();
                entity.getLabTests().putAll( map2 );
            }
            else {
                entity.setLabTests( null );
            }
        }
        else {
            Map<String, LabTestResult> map2 = dto.getLabTests();
            if ( map2 != null ) {
                entity.setLabTests( new LinkedHashMap<String, LabTestResult>( map2 ) );
            }
        }
        if ( entity.getLabOtherTests() != null ) {
            Map<String, OtherLabTestResult> map3 = dto.getLabOtherTests();
            if ( map3 != null ) {
                entity.getLabOtherTests().clear();
                entity.getLabOtherTests().putAll( map3 );
            }
            else {
                entity.setLabOtherTests( null );
            }
        }
        else {
            Map<String, OtherLabTestResult> map3 = dto.getLabOtherTests();
            if ( map3 != null ) {
                entity.setLabOtherTests( new LinkedHashMap<String, OtherLabTestResult>( map3 ) );
            }
        }
        entity.setLabMandatoryText( dto.getLabMandatoryText() );
        entity.setOtherDiagTest( dto.getOtherDiagTest() );
        entity.setOtherDiagResult( dto.getOtherDiagResult() );
        entity.setOtherDiagComments( dto.getOtherDiagComments() );
        entity.setFitnessLookout( dto.getFitnessLookout() );
        entity.setFitnessDeckFit( dto.getFitnessDeckFit() );
        entity.setFitnessDeckUnfit( dto.getFitnessDeckUnfit() );
        entity.setFitnessEngineFit( dto.getFitnessEngineFit() );
        entity.setFitnessEngineUnfit( dto.getFitnessEngineUnfit() );
        entity.setFitnessCateringFit( dto.getFitnessCateringFit() );
        entity.setFitnessCateringUnfit( dto.getFitnessCateringUnfit() );
        entity.setFitnessOtherFit( dto.getFitnessOtherFit() );
        entity.setFitnessOtherUnfit( dto.getFitnessOtherUnfit() );
        entity.setFitnessRestriction( dto.getFitnessRestriction() );
        entity.setFitnessRestrictionDetails( dto.getFitnessRestrictionDetails() );
        entity.setFitnessVisualAid( dto.getFitnessVisualAid() );
        entity.setCertExpiryDay( dto.getCertExpiryDay() );
        entity.setCertExpiryMonth( dto.getCertExpiryMonth() );
        entity.setCertExpiryYear( dto.getCertExpiryYear() );
        entity.setCertIssuedDay( dto.getCertIssuedDay() );
        entity.setCertIssuedMonth( dto.getCertIssuedMonth() );
        entity.setCertIssuedYear( dto.getCertIssuedYear() );
        entity.setCertNumber( dto.getCertNumber() );
        entity.setPhysicianName( dto.getPhysicianName() );
        entity.setPhysicianSignature( dto.getPhysicianSignature() );
    }
}
