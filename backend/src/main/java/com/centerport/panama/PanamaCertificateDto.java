package com.centerport.panama;

import com.centerport.common.enums.*;
import com.centerport.profile.SeafarerProfileDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
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

    // --- Seafarer Profile Reference ---
    @NotNull(message = "must not be null")
    private UUID seafarerProfileId;

    /** Populated in responses; ignored on input. */
    private SeafarerProfileDto seafarerProfile;

    // --- General Information ---
    private String day;
    private String month;
    private String year;
    private String rhTyping;
    private String lookoutDuties;
    private String routineEmergencyDuties;
    private ShipType typeOfShip;
    private TradeArea tradeArea;

    // --- Conditions ---
    private Map<String, String> conditions;
    private String conditionsDetails;

    // --- Additional Questions (37–44) ---
    @JsonProperty("question_37")
    private YesNo question37;
    @JsonProperty("question_38")
    private YesNo question38;
    @JsonProperty("question_39")
    private YesNo question39;
    @JsonProperty("question_40")
    private YesNo question40;
    @JsonProperty("question_41")
    private YesNo question41;
    @JsonProperty("question_42")
    private YesNo question42;
    @JsonProperty("question_43")
    private YesNo question43;
    @JsonProperty("question_44")
    private YesNo question44;
    private String declarationComments;

    // --- Medication Question (45) ---
    @JsonProperty("question_45")
    private YesNo question45;
    @JsonProperty("question_45_details")
    private String question45Details;

    // --- Covid-19 ---
    @JsonProperty("covid_1")
    private YesNo covid1;
    @JsonProperty("covid_2")
    private YesNo covid2;
    @JsonProperty("covid_3_date")
    private String covid3Date;
    @JsonProperty("covid_4")
    private YesNo covid4;
    @JsonProperty("covid_5")
    private YesNo covid5;
    @JsonProperty("covid_6_vaccine_type")
    private String covid6VaccineType;
    @JsonProperty("covid_6_num_doses")
    private String covid6NumDoses;
    @JsonProperty("covid_6_boosters")
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
    @JsonProperty("hearing_right_500")
    private String hearingRight500;
    @JsonProperty("hearing_right_1000")
    private String hearingRight1000;
    @JsonProperty("hearing_right_2000")
    private String hearingRight2000;
    @JsonProperty("hearing_right_3000")
    private String hearingRight3000;
    @JsonProperty("hearing_right_4000")
    private String hearingRight4000;
    @JsonProperty("hearing_right_6000")
    private String hearingRight6000;
    @JsonProperty("hearing_right_8000")
    private String hearingRight8000;
    @JsonProperty("hearing_left_500")
    private String hearingLeft500;
    @JsonProperty("hearing_left_1000")
    private String hearingLeft1000;
    @JsonProperty("hearing_left_2000")
    private String hearingLeft2000;
    @JsonProperty("hearing_left_3000")
    private String hearingLeft3000;
    @JsonProperty("hearing_left_4000")
    private String hearingLeft4000;
    @JsonProperty("hearing_left_6000")
    private String hearingLeft6000;
    @JsonProperty("hearing_left_8000")
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
