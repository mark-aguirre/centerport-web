package com.centerport.medical;

import com.centerport.common.enums.*;
import com.centerport.profile.SeafarerProfileDto;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Data transfer object for medical examination records.
 *
 * Mirrors the field structure of {@link MedicalExam} for REST serialization.
 * All field names serialize to snake_case via the global
 * {@link com.centerport.config.JacksonConfig}.
 *
 * System Fields:
 * The fields {@code id}, {@code examId}, {@code createdDate}, and
 * {@code updatedDate} are included in responses but ignored during
 * create and update operations — the server manages these values.
 *
 * Validation:
 * - {@code lastName} is required ({@code @NotBlank})
 * - All other fields are optional
 *
 * @see MedicalExam
 * @see MedicalExamMapper
 * @see MedicalExamController
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalExamDto {

    private UUID id;
    private String examId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // --- Seafarer Profile Reference ---
    @NotNull(message = "must not be null")
    private UUID seafarerProfileId;

    /** Populated in responses; ignored on input. */
    private SeafarerProfileDto seafarerProfile;

    private String dateOfBirth;
    private String age;

    // --- Physical Examination - Vital Signs ---
    private String peHeight;
    private String peBpSystolic;
    private String peBpDiastolic;
    private String pePulseRate;
    private String peRespiration;
    private String peBodyTemperature;
    private String peWeight;
    private String peMmYm;
    private String peBmi;
    private String bloodPressure;
    private BPClassification bpClassification;
    private String heartRate;
    private String respiratoryRate;
    private String temperature;
    private String weight;
    private String height;
    private String bmi;
    private String oxygenSaturation;

    // --- Vision ---
    private String visionFarOd;
    private String visionFarOs;
    private String visionNearOd;
    private String visionNearOs;
    private String visionUncorrectedFarOd;
    private String visionUncorrectedFarOs;
    private String visionUncorrectedNearOd;
    private String visionUncorrectedNearOs;
    private String visionCorrectedFarOd;
    private String visionCorrectedFarOs;
    private String visionCorrectedNearOd;
    private String visionCorrectedNearOs;
    private String visionColor;
    private String visionVisualAcuity;
    private String visionMeetsStcw;
    private String visionContactLenses;
    private String visionDateTaken;

    // --- Audiometry ---
    private String audioHearingBy;
    @com.fasterxml.jackson.annotation.JsonProperty("audio_as_right_1")
    private String audioAsRight1;
    @com.fasterxml.jackson.annotation.JsonProperty("audio_as_right_2")
    private String audioAsRight2;
    @com.fasterxml.jackson.annotation.JsonProperty("audio_as_left_1")
    private String audioAsLeft1;
    @com.fasterxml.jackson.annotation.JsonProperty("audio_as_left_2")
    private String audioAsLeft2;
    @com.fasterxml.jackson.annotation.JsonProperty("audio_ad_right_1")
    private String audioAdRight1;
    @com.fasterxml.jackson.annotation.JsonProperty("audio_ad_right_2")
    private String audioAdRight2;
    @com.fasterxml.jackson.annotation.JsonProperty("audio_ad_left_1")
    private String audioAdLeft1;
    @com.fasterxml.jackson.annotation.JsonProperty("audio_ad_left_2")
    private String audioAdLeft2;
    private String audioSatisfactory;

    // --- Speech ---
    private String speechImpairedHearing;

    // --- Condition questions ---
    private String conditionAggravatedSea;
    private String identificationDocsChecked;
    private String fitForLookout;

    // --- Physical Examination - Systems ---
    private ExamFinding skin;
    private String skinRemarks;
    private ExamFinding heent;
    private String heentRemarks;
    private ExamFinding neck;
    private String neckRemarks;
    private ExamFinding chestLungs;
    private String chestLungsRemarks;
    private ExamFinding cardiovascular;
    private String cardiovascularRemarks;
    private ExamFinding abdomen;
    private String abdomenRemarks;
    private ExamFinding extremities;
    private String extremitiesRemarks;
    private ExamFinding neurological;
    private String neurologicalRemarks;

    // --- JSONB Maps: Findings ---
    private Map<String, Boolean> findingsA;
    private Map<String, Boolean> findingsB;
    private Map<String, Boolean> findingsC;

    // --- Visual Acuity (legacy) ---
    private String visualAcuityRight;
    private String visualAcuityLeft;
    private VisualAcuityResult visualAcuityCorrected;
    private ExamFinding colorVision;

    // --- Questionnaire ---
    private Map<String, String> questionnaire;
    private String questionnaireComments;
    private String questionnaireMedicationsDetail;

    // --- Past Medical History (used by Physical Examination sub-section) ---
    private Map<String, String> medicalHistory;
    private String medicalHistoryOthers;
    private String consultedDoctorPast;
    private String maintenanceMedications;

    // --- Ancillary Examinations ---
    private String xrayNo;
    private String ancillaryChestXray;
    private String ancillaryChestXrayFindings;
    private String ancillaryEcg;
    private String ancillaryEcgFindings;
    private String ancillaryCbc;
    private String ancillaryCbcFindings;
    private String ancillaryUrinalysis;
    private String ancillaryUrinalysisFindings;
    private String ancillaryStoolExam;
    private String ancillaryStoolExamFindings;
    private String ancillaryHbsag;
    private String ancillaryHivAids;
    private String ancillaryPregnancyTest;
    private String ancillaryRpr;
    private String ancillaryRprFindings;
    private String ancillaryBloodType;
    private String ancillaryPsychologicalTest;
    private String ancillaryAdditionalTests;



    // --- Final Recommendation ---
    private String recommendationRemarks;
    private String certBasicOoh;
    private String certBasicOohFindings;
    private String certAdditionalLabs;
    private String certAdditionalLabsFindings;
    private String certFlagpost;
    private String certFlagpostFindings;

    // --- Fitness ---
    private String fitnessDeckServices;
    private String fitnessEngineServices;
    private String fitnessCateringServices;
    private String fitnessOtherServices;
    private String visualAidsRequired;

    // --- Dates and Certification ---
    private String dateInitialPeme;
    private String dateOfFitness;
    private String validUntil;
    private String authorizedPhysician;
    private String medicalCertificationNo;
    private String medicalDirector;



    // --- Physician ---
    private String examiningPhysician;
    private String licenseNo;
}
