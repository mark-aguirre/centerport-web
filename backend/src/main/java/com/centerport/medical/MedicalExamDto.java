package com.centerport.medical;

import com.centerport.common.enums.*;
import jakarta.validation.constraints.NotBlank;
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

    // --- Personal Information ---
    @NotBlank(message = "must not be blank")
    private String lastName;
    private String firstName;
    private String middleName;
    private String placeOfBirth;
    private String passportNo;
    private String religion;
    private String nationality;
    private Gender gender;
    private CivilStatus civilStatus;
    private String address;
    private String contactNo;
    private String employer;
    private String position;
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
    private String audioAsRight1;
    private String audioAsRight2;
    private String audioAsLeft1;
    private String audioAsLeft2;
    private String audioAdRight1;
    private String audioAdRight2;
    private String audioAdLeft1;
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

    // --- Medical History ---
    private Map<String, String> medicalHistory;
    private String medicalHistoryOthers;
    private String consultedDoctorPast;
    private String maintenanceMedications;
    private String surgicalHistory;
    private String familyHistory;
    private String allergies;
    private String currentMedications;
    private String smokingHistory;
    private String alcoholHistory;

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

    // --- Laboratory Results ---
    private LabStatus cbcResult;
    private String cbcRemarks;
    private LabStatus urinalysisResult;
    private String urinalysisRemarks;
    private LabStatus bloodChemistryResult;
    private String bloodChemistryRemarks;
    private LabStatus chestXrayResult;
    private String chestXrayRemarks;
    private LabStatus ecgResult;
    private String ecgRemarks;
    private LabStatus drugTestResult;
    private String drugTestRemarks;
    private LabStatus hepatitisBResult;
    private String hepatitisBRemarks;
    private LabStatus hivResult;
    private String hivRemarks;
    private String additionalLabs;

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

    // --- Diagnosis ---
    private String primaryDiagnosis;
    private String secondaryDiagnosis;
    private String icdCode;

    // --- Treatment Plan ---
    private String treatmentPlan;
    private String medicationsPrescribed;
    private String followUpDate;
    private String referralTo;
    private ConsultationStatus consultationStatus;

    // --- Remarks ---
    private String remarks;

    // --- Physician ---
    private String examiningPhysician;
    private String licenseNo;
}
