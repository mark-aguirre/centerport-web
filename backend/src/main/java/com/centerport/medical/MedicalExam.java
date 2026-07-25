package com.centerport.medical;

import com.centerport.common.BaseEntity;
import com.centerport.common.enums.*;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

/**
 * JPA entity representing a comprehensive medical examination record.
 *
 * This entity captures the full lifecycle of a pre-employment medical
 * examination (PEME) for maritime personnel, covering approximately 150
 * data points organized into the following domains:
 *
 * Field Groups:
 * - Personal Information — demographics, contact, employer, passport
 * - Physical Examination — vital signs (BP, HR, temp, BMI, O2 sat)
 * - Vision — far/near acuity (corrected and uncorrected), color, STCW
 * - Audiometry — air/bone conduction thresholds per ear
 * - Physical Systems — skin, HEENT, neck, chest/lungs, cardiovascular,
 *   abdomen, extremities, neurological (each with finding + remarks)
 * - Findings (JSONB) — dynamic boolean maps for checklist categories A/B/C
 * - Questionnaire (JSONB) — patient-reported symptom responses
 * - Medical History (JSONB) — past conditions, surgeries, family history
 * - Ancillary Examinations — chest X-ray, ECG, CBC, urinalysis, etc.
 * - Laboratory Results — structured result/remarks pairs per test type
 * - Diagnosis and Treatment — ICD codes, medications, referrals
 * - Certification — fitness determinations, validity dates, physician info
 *
 * Storage:
 * Variable-structure data (findings, questionnaire, medical history) is
 * persisted as PostgreSQL JSONB columns, allowing schema flexibility without
 * additional join tables.
 *
 * Identity:
 * Inherits UUID primary key and audit timestamps from {@link
 * com.centerport.common.BaseEntity}. Additionally carries a human-readable
 * {@code examId} (format {@code MED00000001}) generated via
 * {@link com.centerport.common.BusinessIdGenerator}.
 *
 * @see com.centerport.common.BaseEntity
 * @see MedicalExamDto
 * @see MedicalExamMapper
 */
@Getter
@Setter
@Entity
@Table(name = "medical_exams")
public class MedicalExam extends BaseEntity {

    @Column(name = "exam_id", unique = true)
    private String examId;

    // --- Personal Information ---
    @Column(name = "last_name")
    private String lastName;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "place_of_birth")
    private String placeOfBirth;

    @Column(name = "passport_no")
    private String passportNo;

    @Column(name = "religion")
    private String religion;

    @Column(name = "nationality")
    private String nationality;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "civil_status")
    private CivilStatus civilStatus;

    @Column(name = "address")
    private String address;

    @Column(name = "contact_no")
    private String contactNo;

    @Column(name = "employer")
    private String employer;

    @Column(name = "position")
    private String position;

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Column(name = "age")
    private String age;

    // --- Physical Examination - Vital Signs ---
    @Column(name = "pe_height")
    private String peHeight;

    @Column(name = "pe_bp_systolic")
    private String peBpSystolic;

    @Column(name = "pe_bp_diastolic")
    private String peBpDiastolic;

    @Column(name = "pe_pulse_rate")
    private String pePulseRate;

    @Column(name = "pe_respiration")
    private String peRespiration;

    @Column(name = "pe_body_temperature")
    private String peBodyTemperature;

    @Column(name = "pe_weight")
    private String peWeight;

    @Column(name = "pe_mm_ym")
    private String peMmYm;

    @Column(name = "pe_bmi")
    private String peBmi;

    @Column(name = "blood_pressure")
    private String bloodPressure;

    @Enumerated(EnumType.STRING)
    @Column(name = "bp_classification")
    private BPClassification bpClassification;

    @Column(name = "heart_rate")
    private String heartRate;

    @Column(name = "respiratory_rate")
    private String respiratoryRate;

    @Column(name = "temperature")
    private String temperature;

    @Column(name = "weight")
    private String weight;

    @Column(name = "height")
    private String height;

    @Column(name = "bmi")
    private String bmi;

    @Column(name = "oxygen_saturation")
    private String oxygenSaturation;

    // --- Vision ---
    @Column(name = "vision_far_od")
    private String visionFarOd;

    @Column(name = "vision_far_os")
    private String visionFarOs;

    @Column(name = "vision_near_od")
    private String visionNearOd;

    @Column(name = "vision_near_os")
    private String visionNearOs;

    @Column(name = "vision_uncorrected_far_od")
    private String visionUncorrectedFarOd;

    @Column(name = "vision_uncorrected_far_os")
    private String visionUncorrectedFarOs;

    @Column(name = "vision_uncorrected_near_od")
    private String visionUncorrectedNearOd;

    @Column(name = "vision_uncorrected_near_os")
    private String visionUncorrectedNearOs;

    @Column(name = "vision_corrected_far_od")
    private String visionCorrectedFarOd;

    @Column(name = "vision_corrected_far_os")
    private String visionCorrectedFarOs;

    @Column(name = "vision_corrected_near_od")
    private String visionCorrectedNearOd;

    @Column(name = "vision_corrected_near_os")
    private String visionCorrectedNearOs;

    @Column(name = "vision_color")
    private String visionColor;

    @Column(name = "vision_visual_acuity")
    private String visionVisualAcuity;

    @Column(name = "vision_meets_stcw")
    private String visionMeetsStcw;

    @Column(name = "vision_contact_lenses")
    private String visionContactLenses;

    @Column(name = "vision_date_taken")
    private String visionDateTaken;

    // --- Audiometry ---
    @Column(name = "audio_hearing_by")
    private String audioHearingBy;

    @Column(name = "audio_as_right_1")
    private String audioAsRight1;

    @Column(name = "audio_as_right_2")
    private String audioAsRight2;

    @Column(name = "audio_as_left_1")
    private String audioAsLeft1;

    @Column(name = "audio_as_left_2")
    private String audioAsLeft2;

    @Column(name = "audio_ad_right_1")
    private String audioAdRight1;

    @Column(name = "audio_ad_right_2")
    private String audioAdRight2;

    @Column(name = "audio_ad_left_1")
    private String audioAdLeft1;

    @Column(name = "audio_ad_left_2")
    private String audioAdLeft2;

    @Column(name = "audio_satisfactory")
    private String audioSatisfactory;

    // --- Speech ---
    @Column(name = "speech_impaired_hearing")
    private String speechImpairedHearing;

    // --- Condition questions ---
    @Column(name = "condition_aggravated_sea")
    private String conditionAggravatedSea;

    @Column(name = "identification_docs_checked")
    private String identificationDocsChecked;

    @Column(name = "fit_for_lookout")
    private String fitForLookout;

    // --- Physical Examination - Systems ---
    @Enumerated(EnumType.STRING)
    @Column(name = "skin")
    private ExamFinding skin;

    @Column(name = "skin_remarks")
    private String skinRemarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "heent")
    private ExamFinding heent;

    @Column(name = "heent_remarks")
    private String heentRemarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "neck")
    private ExamFinding neck;

    @Column(name = "neck_remarks")
    private String neckRemarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "chest_lungs")
    private ExamFinding chestLungs;

    @Column(name = "chest_lungs_remarks")
    private String chestLungsRemarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "cardiovascular")
    private ExamFinding cardiovascular;

    @Column(name = "cardiovascular_remarks")
    private String cardiovascularRemarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "abdomen")
    private ExamFinding abdomen;

    @Column(name = "abdomen_remarks")
    private String abdomenRemarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "extremities")
    private ExamFinding extremities;

    @Column(name = "extremities_remarks")
    private String extremitiesRemarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "neurological")
    private ExamFinding neurological;

    @Column(name = "neurological_remarks")
    private String neurologicalRemarks;

    // --- JSONB Maps: Findings ---
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "findings_a", columnDefinition = "jsonb")
    private Map<String, Boolean> findingsA;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "findings_b", columnDefinition = "jsonb")
    private Map<String, Boolean> findingsB;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "findings_c", columnDefinition = "jsonb")
    private Map<String, Boolean> findingsC;

    // --- Visual Acuity (legacy) ---
    @Column(name = "visual_acuity_right")
    private String visualAcuityRight;

    @Column(name = "visual_acuity_left")
    private String visualAcuityLeft;

    @Enumerated(EnumType.STRING)
    @Column(name = "visual_acuity_corrected")
    private VisualAcuityResult visualAcuityCorrected;

    @Enumerated(EnumType.STRING)
    @Column(name = "color_vision")
    private ExamFinding colorVision;

    // --- JSONB Map: Questionnaire ---
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "questionnaire", columnDefinition = "jsonb")
    private Map<String, String> questionnaire;

    @Column(name = "questionnaire_comments")
    private String questionnaireComments;

    @Column(name = "questionnaire_medications_detail")
    private String questionnaireMedicationsDetail;

    // --- JSONB Map: Medical History ---
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "medical_history", columnDefinition = "jsonb")
    private Map<String, String> medicalHistory;

    @Column(name = "medical_history_others")
    private String medicalHistoryOthers;

    @Column(name = "consulted_doctor_past")
    private String consultedDoctorPast;

    @Column(name = "maintenance_medications")
    private String maintenanceMedications;

    @Column(name = "surgical_history")
    private String surgicalHistory;

    @Column(name = "family_history")
    private String familyHistory;

    @Column(name = "allergies")
    private String allergies;

    @Column(name = "current_medications")
    private String currentMedications;

    @Column(name = "smoking_history")
    private String smokingHistory;

    @Column(name = "alcohol_history")
    private String alcoholHistory;

    // --- Ancillary Examinations ---
    @Column(name = "xray_no")
    private String xrayNo;

    @Column(name = "ancillary_chest_xray")
    private String ancillaryChestXray;

    @Column(name = "ancillary_chest_xray_findings")
    private String ancillaryChestXrayFindings;

    @Column(name = "ancillary_ecg")
    private String ancillaryEcg;

    @Column(name = "ancillary_ecg_findings")
    private String ancillaryEcgFindings;

    @Column(name = "ancillary_cbc")
    private String ancillaryCbc;

    @Column(name = "ancillary_cbc_findings")
    private String ancillaryCbcFindings;

    @Column(name = "ancillary_urinalysis")
    private String ancillaryUrinalysis;

    @Column(name = "ancillary_urinalysis_findings")
    private String ancillaryUrinalysisFindings;

    @Column(name = "ancillary_stool_exam")
    private String ancillaryStoolExam;

    @Column(name = "ancillary_stool_exam_findings")
    private String ancillaryStoolExamFindings;

    @Column(name = "ancillary_hbsag")
    private String ancillaryHbsag;

    @Column(name = "ancillary_hiv_aids")
    private String ancillaryHivAids;

    @Column(name = "ancillary_pregnancy_test")
    private String ancillaryPregnancyTest;

    @Column(name = "ancillary_rpr")
    private String ancillaryRpr;

    @Column(name = "ancillary_rpr_findings")
    private String ancillaryRprFindings;

    @Column(name = "ancillary_blood_type")
    private String ancillaryBloodType;

    @Column(name = "ancillary_psychological_test")
    private String ancillaryPsychologicalTest;

    @Column(name = "ancillary_additional_tests")
    private String ancillaryAdditionalTests;

    // --- Laboratory Results ---
    @Enumerated(EnumType.STRING)
    @Column(name = "cbc_result")
    private LabStatus cbcResult;

    @Column(name = "cbc_remarks")
    private String cbcRemarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "urinalysis_result")
    private LabStatus urinalysisResult;

    @Column(name = "urinalysis_remarks")
    private String urinalysisRemarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_chemistry_result")
    private LabStatus bloodChemistryResult;

    @Column(name = "blood_chemistry_remarks")
    private String bloodChemistryRemarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "chest_xray_result")
    private LabStatus chestXrayResult;

    @Column(name = "chest_xray_remarks")
    private String chestXrayRemarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "ecg_result")
    private LabStatus ecgResult;

    @Column(name = "ecg_remarks")
    private String ecgRemarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "drug_test_result")
    private LabStatus drugTestResult;

    @Column(name = "drug_test_remarks")
    private String drugTestRemarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "hepatitis_b_result")
    private LabStatus hepatitisBResult;

    @Column(name = "hepatitis_b_remarks")
    private String hepatitisBRemarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "hiv_result")
    private LabStatus hivResult;

    @Column(name = "hiv_remarks")
    private String hivRemarks;

    @Column(name = "additional_labs")
    private String additionalLabs;

    // --- Final Recommendation ---
    @Column(name = "recommendation_remarks")
    private String recommendationRemarks;

    @Column(name = "cert_basic_ooh")
    private String certBasicOoh;

    @Column(name = "cert_basic_ooh_findings")
    private String certBasicOohFindings;

    @Column(name = "cert_additional_labs")
    private String certAdditionalLabs;

    @Column(name = "cert_additional_labs_findings")
    private String certAdditionalLabsFindings;

    @Column(name = "cert_flagpost")
    private String certFlagpost;

    @Column(name = "cert_flagpost_findings")
    private String certFlagpostFindings;

    // --- Fitness ---
    @Column(name = "fitness_deck_services")
    private String fitnessDeckServices;

    @Column(name = "fitness_engine_services")
    private String fitnessEngineServices;

    @Column(name = "fitness_catering_services")
    private String fitnessCateringServices;

    @Column(name = "fitness_other_services")
    private String fitnessOtherServices;

    @Column(name = "visual_aids_required")
    private String visualAidsRequired;

    // --- Dates and Certification ---
    @Column(name = "date_initial_peme")
    private String dateInitialPeme;

    @Column(name = "date_of_fitness")
    private String dateOfFitness;

    @Column(name = "valid_until")
    private String validUntil;

    @Column(name = "authorized_physician")
    private String authorizedPhysician;

    @Column(name = "medical_certification_no")
    private String medicalCertificationNo;

    @Column(name = "medical_director")
    private String medicalDirector;

    // --- Diagnosis ---
    @Column(name = "primary_diagnosis")
    private String primaryDiagnosis;

    @Column(name = "secondary_diagnosis")
    private String secondaryDiagnosis;

    @Column(name = "icd_code")
    private String icdCode;

    // --- Treatment Plan ---
    @Column(name = "treatment_plan")
    private String treatmentPlan;

    @Column(name = "medications_prescribed")
    private String medicationsPrescribed;

    @Column(name = "follow_up_date")
    private String followUpDate;

    @Column(name = "referral_to")
    private String referralTo;

    @Enumerated(EnumType.STRING)
    @Column(name = "consultation_status")
    private ConsultationStatus consultationStatus;

    // --- Remarks ---
    @Column(name = "remarks")
    private String remarks;

    // --- Physician ---
    @Column(name = "examining_physician")
    private String examiningPhysician;

    @Column(name = "license_no")
    private String licenseNo;
}
