package com.centerport.panama;

import com.centerport.common.enums.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Data transfer object for Panama certificate API requests and responses.
 *
 * All field names serialize to snake_case via the global
 * {@link com.centerport.config.JacksonConfig}. System fields (id, panamaId,
 * createdDate, updatedDate) are included in responses but ignored on
 * create/update input — the service layer clears them before persistence.
 *
 * Validation:
 * {@code fullName} is required on create and update operations. All other
 * fields are optional.
 *
 * @see PanamaCertificate
 * @see PanamaCertificateMapper
 * @see PanamaCertificateService
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PanamaCertificateDto {

    private UUID id;
    private String panamaId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // --- General Information ---
    @NotBlank(message = "must not be blank")
    private String fullName;

    private String day;
    private String month;
    private String year;
    private Gender sex;
    private String rhTyping;
    private String passportSeamanNo;
    private String homeAddress;
    private String department;
    private String crewPosition;
    private String lookoutDuties;
    private String routineEmergencyDuties;
    private ShipType typeOfShip;
    private TradeArea tradeArea;

    // --- Conditions ---
    private Map<String, String> conditions;
    private String conditionsDetails;

    // --- Additional Questions (37–44) ---
    private YesNo question37;
    private YesNo question38;
    private YesNo question39;
    private YesNo question40;
    private YesNo question41;
    private YesNo question42;
    private YesNo question43;
    private YesNo question44;
    private String declarationComments;

    // --- Medication Question (45) ---
    private YesNo question45;
    private String question45Details;

    // --- Covid-19 ---
    private YesNo covid1;
    private YesNo covid2;
    private String covid3Date;
    private YesNo covid4;
    private YesNo covid5;
    private String covid6VaccineType;
    private String covid6NumDoses;
    private String covid6Boosters;

    // --- III. Statement ---
    private String statementName;
    private String statementSignature;
    private String statementDay;
    private String statementMonth;
    private String statementYear;
    private String statementWitnessName;
    private String statementPractitionerName;
    private String statementPractitionerSignature;
    private String statementPractitionerDateDay;
    private String statementPractitionerDateMonth;
    private String statementPractitionerDateYear;
    private String statementPractitionerWitness;
    private String statementPreviousExamDetails;

    // --- IV. Clinical Data ---
    private String heightCm;
    private String weightKg;
    private String bmi;
    private String oxygenSaturation;
    private String heartRate;
    private String respiratoryRate;
    private String bloodPressureSystolic;
    private String bloodPressureDiastolic;

    // --- Sight ---
    private String sightGlassesContact;
    private String sightUnaidedDistantRight;
    private String sightUnaidedDistantLeft;
    private String sightUnaidedDistantBinocular;
    private String sightUnaidedShortRight;
    private String sightUnaidedShortLeft;
    private String sightAidedDistantRight;
    private String sightAidedDistantLeft;
    private String sightAidedDistantBinocular;
    private String sightAidedShortRight;
    private String sightAidedShortLeft;
    private String sightFieldsRight;
    private String sightFieldsLeft;
    private String sightColorVision;
    private String sightColorMethod;

    // --- Hearing ---
    private String hearingRight500;
    private String hearingRight1000;
    private String hearingRight2000;
    private String hearingRight3000;
    private String hearingRight4000;
    private String hearingRight6000;
    private String hearingRight8000;
    private String hearingLeft500;
    private String hearingLeft1000;
    private String hearingLeft2000;
    private String hearingLeft3000;
    private String hearingLeft4000;
    private String hearingLeft6000;
    private String hearingLeft8000;

    // --- Physical Exploration ---
    private Map<String, String> physicalExploration;
    private String physicalExplorationComments;

    // --- Laboratory Tests ---
    private Map<String, LabTestResult> labTests;
    private Map<String, OtherLabTestResult> labOtherTests;
    private String labMandatoryText;

    // --- Other Diagnostic Tests ---
    private String otherDiagTest;
    private String otherDiagResult;
    private String otherDiagComments;

    // --- Fitness ---
    private String fitnessLookout;
    private Boolean fitnessDeckFit;
    private Boolean fitnessDeckUnfit;
    private Boolean fitnessEngineFit;
    private Boolean fitnessEngineUnfit;
    private Boolean fitnessCateringFit;
    private Boolean fitnessCateringUnfit;
    private Boolean fitnessOtherFit;
    private Boolean fitnessOtherUnfit;
    private String fitnessRestriction;
    private String fitnessRestrictionDetails;
    private YesNo fitnessVisualAid;
    private String certExpiryDay;
    private String certExpiryMonth;
    private String certExpiryYear;
    private String certIssuedDay;
    private String certIssuedMonth;
    private String certIssuedYear;
    private String certNumber;
    private String physicianName;
    private String physicianSignature;
}
