package com.centerport.panama;

import com.centerport.profile.SeafarerProfile;
import com.centerport.profile.SeafarerProfileDto;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-29T17:58:04+0800",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class PanamaCertificateMapperImpl implements PanamaCertificateMapper {

    @Override
    public PanamaCertificateDto toDto(PanamaCertificate entity) {
        if ( entity == null ) {
            return null;
        }

        PanamaCertificateDto panamaCertificateDto = new PanamaCertificateDto();

        panamaCertificateDto.setSeafarerProfileId( entitySeafarerProfileId( entity ) );
        panamaCertificateDto.setSeafarerProfile( profileToDto( entity.getSeafarerProfile() ) );
        panamaCertificateDto.setBloodPressureDiastolic( entity.getBloodPressureDiastolic() );
        panamaCertificateDto.setBloodPressureSystolic( entity.getBloodPressureSystolic() );
        panamaCertificateDto.setBmi( entity.getBmi() );
        panamaCertificateDto.setCertExpiryDay( entity.getCertExpiryDay() );
        panamaCertificateDto.setCertExpiryMonth( entity.getCertExpiryMonth() );
        panamaCertificateDto.setCertExpiryYear( entity.getCertExpiryYear() );
        panamaCertificateDto.setCertIssuedDay( entity.getCertIssuedDay() );
        panamaCertificateDto.setCertIssuedMonth( entity.getCertIssuedMonth() );
        panamaCertificateDto.setCertIssuedYear( entity.getCertIssuedYear() );
        panamaCertificateDto.setCertNumber( entity.getCertNumber() );
        Map<String, String> map = entity.getConditions();
        if ( map != null ) {
            panamaCertificateDto.setConditions( new LinkedHashMap<String, String>( map ) );
        }
        panamaCertificateDto.setConditionsDetails( entity.getConditionsDetails() );
        panamaCertificateDto.setCovid1( entity.getCovid1() );
        panamaCertificateDto.setCovid2( entity.getCovid2() );
        panamaCertificateDto.setCovid3Date( entity.getCovid3Date() );
        panamaCertificateDto.setCovid4( entity.getCovid4() );
        panamaCertificateDto.setCovid5( entity.getCovid5() );
        panamaCertificateDto.setCovid6Boosters( entity.getCovid6Boosters() );
        panamaCertificateDto.setCovid6NumDoses( entity.getCovid6NumDoses() );
        panamaCertificateDto.setCovid6VaccineType( entity.getCovid6VaccineType() );
        panamaCertificateDto.setCreatedDate( entity.getCreatedDate() );
        panamaCertificateDto.setDay( entity.getDay() );
        panamaCertificateDto.setDeclarationComments( entity.getDeclarationComments() );
        panamaCertificateDto.setFitnessCateringFit( entity.getFitnessCateringFit() );
        panamaCertificateDto.setFitnessCateringUnfit( entity.getFitnessCateringUnfit() );
        panamaCertificateDto.setFitnessDeckFit( entity.getFitnessDeckFit() );
        panamaCertificateDto.setFitnessDeckUnfit( entity.getFitnessDeckUnfit() );
        panamaCertificateDto.setFitnessEngineFit( entity.getFitnessEngineFit() );
        panamaCertificateDto.setFitnessEngineUnfit( entity.getFitnessEngineUnfit() );
        panamaCertificateDto.setFitnessLookout( entity.getFitnessLookout() );
        panamaCertificateDto.setFitnessOtherFit( entity.getFitnessOtherFit() );
        panamaCertificateDto.setFitnessOtherUnfit( entity.getFitnessOtherUnfit() );
        panamaCertificateDto.setFitnessRestriction( entity.getFitnessRestriction() );
        panamaCertificateDto.setFitnessRestrictionDetails( entity.getFitnessRestrictionDetails() );
        panamaCertificateDto.setFitnessVisualAid( entity.getFitnessVisualAid() );
        panamaCertificateDto.setHearingLeft1000( entity.getHearingLeft1000() );
        panamaCertificateDto.setHearingLeft2000( entity.getHearingLeft2000() );
        panamaCertificateDto.setHearingLeft3000( entity.getHearingLeft3000() );
        panamaCertificateDto.setHearingLeft4000( entity.getHearingLeft4000() );
        panamaCertificateDto.setHearingLeft500( entity.getHearingLeft500() );
        panamaCertificateDto.setHearingLeft6000( entity.getHearingLeft6000() );
        panamaCertificateDto.setHearingLeft8000( entity.getHearingLeft8000() );
        panamaCertificateDto.setHearingRight1000( entity.getHearingRight1000() );
        panamaCertificateDto.setHearingRight2000( entity.getHearingRight2000() );
        panamaCertificateDto.setHearingRight3000( entity.getHearingRight3000() );
        panamaCertificateDto.setHearingRight4000( entity.getHearingRight4000() );
        panamaCertificateDto.setHearingRight500( entity.getHearingRight500() );
        panamaCertificateDto.setHearingRight6000( entity.getHearingRight6000() );
        panamaCertificateDto.setHearingRight8000( entity.getHearingRight8000() );
        panamaCertificateDto.setHeartRate( entity.getHeartRate() );
        panamaCertificateDto.setHeightCm( entity.getHeightCm() );
        panamaCertificateDto.setId( entity.getId() );
        panamaCertificateDto.setLabMandatoryText( entity.getLabMandatoryText() );
        Map<String, OtherLabTestResult> map1 = entity.getLabOtherTests();
        if ( map1 != null ) {
            panamaCertificateDto.setLabOtherTests( new LinkedHashMap<String, OtherLabTestResult>( map1 ) );
        }
        Map<String, LabTestResult> map2 = entity.getLabTests();
        if ( map2 != null ) {
            panamaCertificateDto.setLabTests( new LinkedHashMap<String, LabTestResult>( map2 ) );
        }
        panamaCertificateDto.setLookoutDuties( entity.getLookoutDuties() );
        panamaCertificateDto.setMonth( entity.getMonth() );
        panamaCertificateDto.setOtherDiagComments( entity.getOtherDiagComments() );
        panamaCertificateDto.setOtherDiagResult( entity.getOtherDiagResult() );
        panamaCertificateDto.setOtherDiagTest( entity.getOtherDiagTest() );
        panamaCertificateDto.setOxygenSaturation( entity.getOxygenSaturation() );
        panamaCertificateDto.setPanamaId( entity.getPanamaId() );
        Map<String, String> map3 = entity.getPhysicalExploration();
        if ( map3 != null ) {
            panamaCertificateDto.setPhysicalExploration( new LinkedHashMap<String, String>( map3 ) );
        }
        panamaCertificateDto.setPhysicalExplorationComments( entity.getPhysicalExplorationComments() );
        panamaCertificateDto.setPhysicianName( entity.getPhysicianName() );
        panamaCertificateDto.setPhysicianSignature( entity.getPhysicianSignature() );
        panamaCertificateDto.setQuestion37( entity.getQuestion37() );
        panamaCertificateDto.setQuestion38( entity.getQuestion38() );
        panamaCertificateDto.setQuestion39( entity.getQuestion39() );
        panamaCertificateDto.setQuestion40( entity.getQuestion40() );
        panamaCertificateDto.setQuestion41( entity.getQuestion41() );
        panamaCertificateDto.setQuestion42( entity.getQuestion42() );
        panamaCertificateDto.setQuestion43( entity.getQuestion43() );
        panamaCertificateDto.setQuestion44( entity.getQuestion44() );
        panamaCertificateDto.setQuestion45( entity.getQuestion45() );
        panamaCertificateDto.setQuestion45Details( entity.getQuestion45Details() );
        panamaCertificateDto.setRespiratoryRate( entity.getRespiratoryRate() );
        panamaCertificateDto.setRhTyping( entity.getRhTyping() );
        panamaCertificateDto.setRoutineEmergencyDuties( entity.getRoutineEmergencyDuties() );
        panamaCertificateDto.setSightAidedDistantBinocular( entity.getSightAidedDistantBinocular() );
        panamaCertificateDto.setSightAidedDistantLeft( entity.getSightAidedDistantLeft() );
        panamaCertificateDto.setSightAidedDistantRight( entity.getSightAidedDistantRight() );
        panamaCertificateDto.setSightAidedShortLeft( entity.getSightAidedShortLeft() );
        panamaCertificateDto.setSightAidedShortRight( entity.getSightAidedShortRight() );
        panamaCertificateDto.setSightColorMethod( entity.getSightColorMethod() );
        panamaCertificateDto.setSightColorVision( entity.getSightColorVision() );
        panamaCertificateDto.setSightFieldsLeft( entity.getSightFieldsLeft() );
        panamaCertificateDto.setSightFieldsRight( entity.getSightFieldsRight() );
        panamaCertificateDto.setSightGlassesContact( entity.getSightGlassesContact() );
        panamaCertificateDto.setSightUnaidedDistantBinocular( entity.getSightUnaidedDistantBinocular() );
        panamaCertificateDto.setSightUnaidedDistantLeft( entity.getSightUnaidedDistantLeft() );
        panamaCertificateDto.setSightUnaidedDistantRight( entity.getSightUnaidedDistantRight() );
        panamaCertificateDto.setSightUnaidedShortLeft( entity.getSightUnaidedShortLeft() );
        panamaCertificateDto.setSightUnaidedShortRight( entity.getSightUnaidedShortRight() );
        panamaCertificateDto.setStatementDay( entity.getStatementDay() );
        panamaCertificateDto.setStatementMonth( entity.getStatementMonth() );
        panamaCertificateDto.setStatementName( entity.getStatementName() );
        panamaCertificateDto.setStatementPractitionerDateDay( entity.getStatementPractitionerDateDay() );
        panamaCertificateDto.setStatementPractitionerDateMonth( entity.getStatementPractitionerDateMonth() );
        panamaCertificateDto.setStatementPractitionerDateYear( entity.getStatementPractitionerDateYear() );
        panamaCertificateDto.setStatementPractitionerName( entity.getStatementPractitionerName() );
        panamaCertificateDto.setStatementPractitionerSignature( entity.getStatementPractitionerSignature() );
        panamaCertificateDto.setStatementPractitionerWitness( entity.getStatementPractitionerWitness() );
        panamaCertificateDto.setStatementPreviousExamDetails( entity.getStatementPreviousExamDetails() );
        panamaCertificateDto.setStatementSignature( entity.getStatementSignature() );
        panamaCertificateDto.setStatementWitnessName( entity.getStatementWitnessName() );
        panamaCertificateDto.setStatementYear( entity.getStatementYear() );
        panamaCertificateDto.setTradeArea( entity.getTradeArea() );
        panamaCertificateDto.setTypeOfShip( entity.getTypeOfShip() );
        panamaCertificateDto.setUpdatedDate( entity.getUpdatedDate() );
        panamaCertificateDto.setWeightKg( entity.getWeightKg() );
        panamaCertificateDto.setYear( entity.getYear() );

        return panamaCertificateDto;
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
    public PanamaCertificate toEntity(PanamaCertificateDto dto) {
        if ( dto == null ) {
            return null;
        }

        PanamaCertificate panamaCertificate = new PanamaCertificate();

        panamaCertificate.setBloodPressureDiastolic( dto.getBloodPressureDiastolic() );
        panamaCertificate.setBloodPressureSystolic( dto.getBloodPressureSystolic() );
        panamaCertificate.setBmi( dto.getBmi() );
        panamaCertificate.setCertExpiryDay( dto.getCertExpiryDay() );
        panamaCertificate.setCertExpiryMonth( dto.getCertExpiryMonth() );
        panamaCertificate.setCertExpiryYear( dto.getCertExpiryYear() );
        panamaCertificate.setCertIssuedDay( dto.getCertIssuedDay() );
        panamaCertificate.setCertIssuedMonth( dto.getCertIssuedMonth() );
        panamaCertificate.setCertIssuedYear( dto.getCertIssuedYear() );
        panamaCertificate.setCertNumber( dto.getCertNumber() );
        Map<String, String> map = dto.getConditions();
        if ( map != null ) {
            panamaCertificate.setConditions( new LinkedHashMap<String, String>( map ) );
        }
        panamaCertificate.setConditionsDetails( dto.getConditionsDetails() );
        panamaCertificate.setCovid1( dto.getCovid1() );
        panamaCertificate.setCovid2( dto.getCovid2() );
        panamaCertificate.setCovid3Date( dto.getCovid3Date() );
        panamaCertificate.setCovid4( dto.getCovid4() );
        panamaCertificate.setCovid5( dto.getCovid5() );
        panamaCertificate.setCovid6Boosters( dto.getCovid6Boosters() );
        panamaCertificate.setCovid6NumDoses( dto.getCovid6NumDoses() );
        panamaCertificate.setCovid6VaccineType( dto.getCovid6VaccineType() );
        panamaCertificate.setDay( dto.getDay() );
        panamaCertificate.setDeclarationComments( dto.getDeclarationComments() );
        panamaCertificate.setFitnessCateringFit( dto.getFitnessCateringFit() );
        panamaCertificate.setFitnessCateringUnfit( dto.getFitnessCateringUnfit() );
        panamaCertificate.setFitnessDeckFit( dto.getFitnessDeckFit() );
        panamaCertificate.setFitnessDeckUnfit( dto.getFitnessDeckUnfit() );
        panamaCertificate.setFitnessEngineFit( dto.getFitnessEngineFit() );
        panamaCertificate.setFitnessEngineUnfit( dto.getFitnessEngineUnfit() );
        panamaCertificate.setFitnessLookout( dto.getFitnessLookout() );
        panamaCertificate.setFitnessOtherFit( dto.getFitnessOtherFit() );
        panamaCertificate.setFitnessOtherUnfit( dto.getFitnessOtherUnfit() );
        panamaCertificate.setFitnessRestriction( dto.getFitnessRestriction() );
        panamaCertificate.setFitnessRestrictionDetails( dto.getFitnessRestrictionDetails() );
        panamaCertificate.setFitnessVisualAid( dto.getFitnessVisualAid() );
        panamaCertificate.setHearingLeft1000( dto.getHearingLeft1000() );
        panamaCertificate.setHearingLeft2000( dto.getHearingLeft2000() );
        panamaCertificate.setHearingLeft3000( dto.getHearingLeft3000() );
        panamaCertificate.setHearingLeft4000( dto.getHearingLeft4000() );
        panamaCertificate.setHearingLeft500( dto.getHearingLeft500() );
        panamaCertificate.setHearingLeft6000( dto.getHearingLeft6000() );
        panamaCertificate.setHearingLeft8000( dto.getHearingLeft8000() );
        panamaCertificate.setHearingRight1000( dto.getHearingRight1000() );
        panamaCertificate.setHearingRight2000( dto.getHearingRight2000() );
        panamaCertificate.setHearingRight3000( dto.getHearingRight3000() );
        panamaCertificate.setHearingRight4000( dto.getHearingRight4000() );
        panamaCertificate.setHearingRight500( dto.getHearingRight500() );
        panamaCertificate.setHearingRight6000( dto.getHearingRight6000() );
        panamaCertificate.setHearingRight8000( dto.getHearingRight8000() );
        panamaCertificate.setHeartRate( dto.getHeartRate() );
        panamaCertificate.setHeightCm( dto.getHeightCm() );
        panamaCertificate.setLabMandatoryText( dto.getLabMandatoryText() );
        Map<String, OtherLabTestResult> map1 = dto.getLabOtherTests();
        if ( map1 != null ) {
            panamaCertificate.setLabOtherTests( new LinkedHashMap<String, OtherLabTestResult>( map1 ) );
        }
        Map<String, LabTestResult> map2 = dto.getLabTests();
        if ( map2 != null ) {
            panamaCertificate.setLabTests( new LinkedHashMap<String, LabTestResult>( map2 ) );
        }
        panamaCertificate.setLookoutDuties( dto.getLookoutDuties() );
        panamaCertificate.setMonth( dto.getMonth() );
        panamaCertificate.setOtherDiagComments( dto.getOtherDiagComments() );
        panamaCertificate.setOtherDiagResult( dto.getOtherDiagResult() );
        panamaCertificate.setOtherDiagTest( dto.getOtherDiagTest() );
        panamaCertificate.setOxygenSaturation( dto.getOxygenSaturation() );
        Map<String, String> map3 = dto.getPhysicalExploration();
        if ( map3 != null ) {
            panamaCertificate.setPhysicalExploration( new LinkedHashMap<String, String>( map3 ) );
        }
        panamaCertificate.setPhysicalExplorationComments( dto.getPhysicalExplorationComments() );
        panamaCertificate.setPhysicianName( dto.getPhysicianName() );
        panamaCertificate.setPhysicianSignature( dto.getPhysicianSignature() );
        panamaCertificate.setQuestion37( dto.getQuestion37() );
        panamaCertificate.setQuestion38( dto.getQuestion38() );
        panamaCertificate.setQuestion39( dto.getQuestion39() );
        panamaCertificate.setQuestion40( dto.getQuestion40() );
        panamaCertificate.setQuestion41( dto.getQuestion41() );
        panamaCertificate.setQuestion42( dto.getQuestion42() );
        panamaCertificate.setQuestion43( dto.getQuestion43() );
        panamaCertificate.setQuestion44( dto.getQuestion44() );
        panamaCertificate.setQuestion45( dto.getQuestion45() );
        panamaCertificate.setQuestion45Details( dto.getQuestion45Details() );
        panamaCertificate.setRespiratoryRate( dto.getRespiratoryRate() );
        panamaCertificate.setRhTyping( dto.getRhTyping() );
        panamaCertificate.setRoutineEmergencyDuties( dto.getRoutineEmergencyDuties() );
        panamaCertificate.setSightAidedDistantBinocular( dto.getSightAidedDistantBinocular() );
        panamaCertificate.setSightAidedDistantLeft( dto.getSightAidedDistantLeft() );
        panamaCertificate.setSightAidedDistantRight( dto.getSightAidedDistantRight() );
        panamaCertificate.setSightAidedShortLeft( dto.getSightAidedShortLeft() );
        panamaCertificate.setSightAidedShortRight( dto.getSightAidedShortRight() );
        panamaCertificate.setSightColorMethod( dto.getSightColorMethod() );
        panamaCertificate.setSightColorVision( dto.getSightColorVision() );
        panamaCertificate.setSightFieldsLeft( dto.getSightFieldsLeft() );
        panamaCertificate.setSightFieldsRight( dto.getSightFieldsRight() );
        panamaCertificate.setSightGlassesContact( dto.getSightGlassesContact() );
        panamaCertificate.setSightUnaidedDistantBinocular( dto.getSightUnaidedDistantBinocular() );
        panamaCertificate.setSightUnaidedDistantLeft( dto.getSightUnaidedDistantLeft() );
        panamaCertificate.setSightUnaidedDistantRight( dto.getSightUnaidedDistantRight() );
        panamaCertificate.setSightUnaidedShortLeft( dto.getSightUnaidedShortLeft() );
        panamaCertificate.setSightUnaidedShortRight( dto.getSightUnaidedShortRight() );
        panamaCertificate.setStatementDay( dto.getStatementDay() );
        panamaCertificate.setStatementMonth( dto.getStatementMonth() );
        panamaCertificate.setStatementName( dto.getStatementName() );
        panamaCertificate.setStatementPractitionerDateDay( dto.getStatementPractitionerDateDay() );
        panamaCertificate.setStatementPractitionerDateMonth( dto.getStatementPractitionerDateMonth() );
        panamaCertificate.setStatementPractitionerDateYear( dto.getStatementPractitionerDateYear() );
        panamaCertificate.setStatementPractitionerName( dto.getStatementPractitionerName() );
        panamaCertificate.setStatementPractitionerSignature( dto.getStatementPractitionerSignature() );
        panamaCertificate.setStatementPractitionerWitness( dto.getStatementPractitionerWitness() );
        panamaCertificate.setStatementPreviousExamDetails( dto.getStatementPreviousExamDetails() );
        panamaCertificate.setStatementSignature( dto.getStatementSignature() );
        panamaCertificate.setStatementWitnessName( dto.getStatementWitnessName() );
        panamaCertificate.setStatementYear( dto.getStatementYear() );
        panamaCertificate.setTradeArea( dto.getTradeArea() );
        panamaCertificate.setTypeOfShip( dto.getTypeOfShip() );
        panamaCertificate.setWeightKg( dto.getWeightKg() );
        panamaCertificate.setYear( dto.getYear() );

        return panamaCertificate;
    }

    @Override
    public void updateEntity(PanamaCertificateDto dto, PanamaCertificate entity) {
        if ( dto == null ) {
            return;
        }

        entity.setBloodPressureDiastolic( dto.getBloodPressureDiastolic() );
        entity.setBloodPressureSystolic( dto.getBloodPressureSystolic() );
        entity.setBmi( dto.getBmi() );
        entity.setCertExpiryDay( dto.getCertExpiryDay() );
        entity.setCertExpiryMonth( dto.getCertExpiryMonth() );
        entity.setCertExpiryYear( dto.getCertExpiryYear() );
        entity.setCertIssuedDay( dto.getCertIssuedDay() );
        entity.setCertIssuedMonth( dto.getCertIssuedMonth() );
        entity.setCertIssuedYear( dto.getCertIssuedYear() );
        entity.setCertNumber( dto.getCertNumber() );
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
        entity.setCovid1( dto.getCovid1() );
        entity.setCovid2( dto.getCovid2() );
        entity.setCovid3Date( dto.getCovid3Date() );
        entity.setCovid4( dto.getCovid4() );
        entity.setCovid5( dto.getCovid5() );
        entity.setCovid6Boosters( dto.getCovid6Boosters() );
        entity.setCovid6NumDoses( dto.getCovid6NumDoses() );
        entity.setCovid6VaccineType( dto.getCovid6VaccineType() );
        entity.setDay( dto.getDay() );
        entity.setDeclarationComments( dto.getDeclarationComments() );
        entity.setFitnessCateringFit( dto.getFitnessCateringFit() );
        entity.setFitnessCateringUnfit( dto.getFitnessCateringUnfit() );
        entity.setFitnessDeckFit( dto.getFitnessDeckFit() );
        entity.setFitnessDeckUnfit( dto.getFitnessDeckUnfit() );
        entity.setFitnessEngineFit( dto.getFitnessEngineFit() );
        entity.setFitnessEngineUnfit( dto.getFitnessEngineUnfit() );
        entity.setFitnessLookout( dto.getFitnessLookout() );
        entity.setFitnessOtherFit( dto.getFitnessOtherFit() );
        entity.setFitnessOtherUnfit( dto.getFitnessOtherUnfit() );
        entity.setFitnessRestriction( dto.getFitnessRestriction() );
        entity.setFitnessRestrictionDetails( dto.getFitnessRestrictionDetails() );
        entity.setFitnessVisualAid( dto.getFitnessVisualAid() );
        entity.setHearingLeft1000( dto.getHearingLeft1000() );
        entity.setHearingLeft2000( dto.getHearingLeft2000() );
        entity.setHearingLeft3000( dto.getHearingLeft3000() );
        entity.setHearingLeft4000( dto.getHearingLeft4000() );
        entity.setHearingLeft500( dto.getHearingLeft500() );
        entity.setHearingLeft6000( dto.getHearingLeft6000() );
        entity.setHearingLeft8000( dto.getHearingLeft8000() );
        entity.setHearingRight1000( dto.getHearingRight1000() );
        entity.setHearingRight2000( dto.getHearingRight2000() );
        entity.setHearingRight3000( dto.getHearingRight3000() );
        entity.setHearingRight4000( dto.getHearingRight4000() );
        entity.setHearingRight500( dto.getHearingRight500() );
        entity.setHearingRight6000( dto.getHearingRight6000() );
        entity.setHearingRight8000( dto.getHearingRight8000() );
        entity.setHeartRate( dto.getHeartRate() );
        entity.setHeightCm( dto.getHeightCm() );
        entity.setLabMandatoryText( dto.getLabMandatoryText() );
        if ( entity.getLabOtherTests() != null ) {
            Map<String, OtherLabTestResult> map1 = dto.getLabOtherTests();
            if ( map1 != null ) {
                entity.getLabOtherTests().clear();
                entity.getLabOtherTests().putAll( map1 );
            }
            else {
                entity.setLabOtherTests( null );
            }
        }
        else {
            Map<String, OtherLabTestResult> map1 = dto.getLabOtherTests();
            if ( map1 != null ) {
                entity.setLabOtherTests( new LinkedHashMap<String, OtherLabTestResult>( map1 ) );
            }
        }
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
        entity.setLookoutDuties( dto.getLookoutDuties() );
        entity.setMonth( dto.getMonth() );
        entity.setOtherDiagComments( dto.getOtherDiagComments() );
        entity.setOtherDiagResult( dto.getOtherDiagResult() );
        entity.setOtherDiagTest( dto.getOtherDiagTest() );
        entity.setOxygenSaturation( dto.getOxygenSaturation() );
        if ( entity.getPhysicalExploration() != null ) {
            Map<String, String> map3 = dto.getPhysicalExploration();
            if ( map3 != null ) {
                entity.getPhysicalExploration().clear();
                entity.getPhysicalExploration().putAll( map3 );
            }
            else {
                entity.setPhysicalExploration( null );
            }
        }
        else {
            Map<String, String> map3 = dto.getPhysicalExploration();
            if ( map3 != null ) {
                entity.setPhysicalExploration( new LinkedHashMap<String, String>( map3 ) );
            }
        }
        entity.setPhysicalExplorationComments( dto.getPhysicalExplorationComments() );
        entity.setPhysicianName( dto.getPhysicianName() );
        entity.setPhysicianSignature( dto.getPhysicianSignature() );
        entity.setQuestion37( dto.getQuestion37() );
        entity.setQuestion38( dto.getQuestion38() );
        entity.setQuestion39( dto.getQuestion39() );
        entity.setQuestion40( dto.getQuestion40() );
        entity.setQuestion41( dto.getQuestion41() );
        entity.setQuestion42( dto.getQuestion42() );
        entity.setQuestion43( dto.getQuestion43() );
        entity.setQuestion44( dto.getQuestion44() );
        entity.setQuestion45( dto.getQuestion45() );
        entity.setQuestion45Details( dto.getQuestion45Details() );
        entity.setRespiratoryRate( dto.getRespiratoryRate() );
        entity.setRhTyping( dto.getRhTyping() );
        entity.setRoutineEmergencyDuties( dto.getRoutineEmergencyDuties() );
        entity.setSightAidedDistantBinocular( dto.getSightAidedDistantBinocular() );
        entity.setSightAidedDistantLeft( dto.getSightAidedDistantLeft() );
        entity.setSightAidedDistantRight( dto.getSightAidedDistantRight() );
        entity.setSightAidedShortLeft( dto.getSightAidedShortLeft() );
        entity.setSightAidedShortRight( dto.getSightAidedShortRight() );
        entity.setSightColorMethod( dto.getSightColorMethod() );
        entity.setSightColorVision( dto.getSightColorVision() );
        entity.setSightFieldsLeft( dto.getSightFieldsLeft() );
        entity.setSightFieldsRight( dto.getSightFieldsRight() );
        entity.setSightGlassesContact( dto.getSightGlassesContact() );
        entity.setSightUnaidedDistantBinocular( dto.getSightUnaidedDistantBinocular() );
        entity.setSightUnaidedDistantLeft( dto.getSightUnaidedDistantLeft() );
        entity.setSightUnaidedDistantRight( dto.getSightUnaidedDistantRight() );
        entity.setSightUnaidedShortLeft( dto.getSightUnaidedShortLeft() );
        entity.setSightUnaidedShortRight( dto.getSightUnaidedShortRight() );
        entity.setStatementDay( dto.getStatementDay() );
        entity.setStatementMonth( dto.getStatementMonth() );
        entity.setStatementName( dto.getStatementName() );
        entity.setStatementPractitionerDateDay( dto.getStatementPractitionerDateDay() );
        entity.setStatementPractitionerDateMonth( dto.getStatementPractitionerDateMonth() );
        entity.setStatementPractitionerDateYear( dto.getStatementPractitionerDateYear() );
        entity.setStatementPractitionerName( dto.getStatementPractitionerName() );
        entity.setStatementPractitionerSignature( dto.getStatementPractitionerSignature() );
        entity.setStatementPractitionerWitness( dto.getStatementPractitionerWitness() );
        entity.setStatementPreviousExamDetails( dto.getStatementPreviousExamDetails() );
        entity.setStatementSignature( dto.getStatementSignature() );
        entity.setStatementWitnessName( dto.getStatementWitnessName() );
        entity.setStatementYear( dto.getStatementYear() );
        entity.setTradeArea( dto.getTradeArea() );
        entity.setTypeOfShip( dto.getTypeOfShip() );
        entity.setWeightKg( dto.getWeightKg() );
        entity.setYear( dto.getYear() );
    }

    private UUID entitySeafarerProfileId(PanamaCertificate panamaCertificate) {
        SeafarerProfile seafarerProfile = panamaCertificate.getSeafarerProfile();
        if ( seafarerProfile == null ) {
            return null;
        }
        return seafarerProfile.getId();
    }
}
