package com.centerport.landbase;

import com.centerport.common.entity.BaseEntity;
import com.centerport.common.enums.*;
import com.centerport.profile.SeafarerProfile;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

/**
 * Landbase PEME (Pre-Employment Medical Examination) entity.
 * Links to a SeafarerProfile for patient identity. Contains past medical history
 * (JSONB map), questionnaire, ancillary examinations, results, and certification fields.
 */
@Getter
@Setter
@Entity
@Table(name = "landbase_pemes")
public class LandbasePeme extends BaseEntity {

    @Column(name = "peme_id", unique = true)
    private String pemeId;

    // --- Seafarer Profile Reference ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seafarer_profile_id", nullable = false)
    private SeafarerProfile seafarerProfile;

    // --- Past Medical History (JSONB map) ---
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "medical_history", columnDefinition = "jsonb")
    private Map<String, String> medicalHistory;

    @Column(name = "medical_history_others")
    private String medicalHistoryOthers;

    @Column(name = "consulted_doctor")
    private Boolean consultedDoctor;

    @Column(name = "maintenance_medications")
    private String maintenanceMedications;

    // --- Questionnaire ---
    @Enumerated(EnumType.STRING)
    @Column(name = "questionnaire_1")
    private YesNo questionnaire1;

    @Enumerated(EnumType.STRING)
    @Column(name = "questionnaire_2")
    private YesNo questionnaire2;

    @Enumerated(EnumType.STRING)
    @Column(name = "questionnaire_3")
    private YesNo questionnaire3;

    @Enumerated(EnumType.STRING)
    @Column(name = "questionnaire_4")
    private YesNo questionnaire4;

    @Enumerated(EnumType.STRING)
    @Column(name = "questionnaire_5")
    private YesNo questionnaire5;

    @Enumerated(EnumType.STRING)
    @Column(name = "questionnaire_6")
    private YesNo questionnaire6;

    @Enumerated(EnumType.STRING)
    @Column(name = "questionnaire_7")
    private YesNo questionnaire7;

    @Column(name = "questionnaire_comments")
    private String questionnaireComments;

    @Enumerated(EnumType.STRING)
    @Column(name = "questionnaire_8")
    private YesNo questionnaire8;

    @Column(name = "questionnaire_8_details")
    private String questionnaire8Details;

    // --- Ancillary Examinations ---
    @Column(name = "xray_no")
    private String xrayNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "chest_xray")
    private ExamResult chestXray;

    @Enumerated(EnumType.STRING)
    @Column(name = "cbc")
    private ExamResult cbc;

    @Enumerated(EnumType.STRING)
    @Column(name = "cec")
    private ExamResult cec;

    @Enumerated(EnumType.STRING)
    @Column(name = "pregnancy_test")
    private PregnancyTestResult pregnancyTest;

    @Enumerated(EnumType.STRING)
    @Column(name = "urinalysis")
    private ExamResult urinalysis;

    @Enumerated(EnumType.STRING)
    @Column(name = "stool_exam")
    private ExamResult stoolExam;

    @Enumerated(EnumType.STRING)
    @Column(name = "hbsag")
    private ReactiveResult hbsag;

    @Enumerated(EnumType.STRING)
    @Column(name = "hiv_aids_test")
    private ReactiveResult hivAidsTest;

    @Enumerated(EnumType.STRING)
    @Column(name = "apb")
    private ReactiveResult apb;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_type")
    private BloodType bloodType;

    @Enumerated(EnumType.STRING)
    @Column(name = "drug_test")
    private ExamResult drugTest;

    @Enumerated(EnumType.STRING)
    @Column(name = "psychological_test")
    private PsychologicalTestResult psychologicalTest;

    @Column(name = "additional_tests")
    private String additionalTests;

    // --- DOH / Certificate Identifiers ---
    @Column(name = "doh_accreditation_no")
    private String dohAccreditationNo;

    @Column(name = "ref_no")
    private String refNo;

    // --- Physical Examination - Vital Signs ---
    @Column(name = "pe_weight")
    private String peWeight;

    @Column(name = "pe_height")
    private String peHeight;

    @Column(name = "pe_bmi")
    private String peBmi;

    @Column(name = "pe_pulse_rate")
    private String pePulseRate;

    @Column(name = "pe_blood_pressure")
    private String peBloodPressure;

    @Column(name = "pe_respiration")
    private String peRespiration;

    @Column(name = "pe_body_temperature")
    private String peBodyTemperature;

    // --- Vision Acuity - Far Vision ---
    @Column(name = "vision_far_od_uncorrected")
    private String visionFarOdUncorrected;

    @Column(name = "vision_far_os_uncorrected")
    private String visionFarOsUncorrected;

    @Column(name = "vision_far_od_corrected")
    private String visionFarOdCorrected;

    @Column(name = "vision_far_os_corrected")
    private String visionFarOsCorrected;

    // --- Vision Acuity - Near Vision ---
    @Column(name = "vision_near_od_uncorrected")
    private String visionNearOdUncorrected;

    @Column(name = "vision_near_os_uncorrected")
    private String visionNearOsUncorrected;

    @Column(name = "vision_near_od_corrected")
    private String visionNearOdCorrected;

    @Column(name = "vision_near_os_corrected")
    private String visionNearOsCorrected;

    // --- Ishihara Color Vision ---
    @Column(name = "vision_color_adequate")
    private Boolean visionColorAdequate;

    // --- Hearing Audiometry ---
    @Column(name = "hearing_ad")
    private String hearingAd;

    @Column(name = "hearing_as")
    private String hearingAs;

    // --- Physical Exploration - Column A ---
    @Enumerated(EnumType.STRING)
    @Column(name = "pe_skin")
    private PhysicalExplorationValue peSkin;

    @Column(name = "pe_skin_findings")
    private String peSkinFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_head_scalp")
    private PhysicalExplorationValue peHeadScalp;

    @Column(name = "pe_head_scalp_findings")
    private String peHeadScalpFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_eyes_external")
    private PhysicalExplorationValue peEyesExternal;

    @Column(name = "pe_eyes_external_findings")
    private String peEyesExternalFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_pupils")
    private PhysicalExplorationValue pePupils;

    @Column(name = "pe_pupils_findings")
    private String pePupilsFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_ears")
    private PhysicalExplorationValue peEars;

    @Column(name = "pe_ears_findings")
    private String peEarsFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_nose_sinuses")
    private PhysicalExplorationValue peNoseSinuses;

    @Column(name = "pe_nose_sinuses_findings")
    private String peNoseSinusesFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_mouth_throat")
    private PhysicalExplorationValue peMouthThroat;

    @Column(name = "pe_mouth_throat_findings")
    private String peMouthThroatFindings;

    // --- Physical Exploration - Column B ---
    @Enumerated(EnumType.STRING)
    @Column(name = "pe_neck_lymph_nodes")
    private PhysicalExplorationValue peNeckLymphNodes;

    @Column(name = "pe_neck_lymph_nodes_findings")
    private String peNeckLymphNodesFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_breast_axilla")
    private PhysicalExplorationValue peBreastAxilla;

    @Column(name = "pe_breast_axilla_findings")
    private String peBreastAxillaFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_chest_lungs")
    private PhysicalExplorationValue peChestLungs;

    @Column(name = "pe_chest_lungs_findings")
    private String peChestLungsFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_heart")
    private PhysicalExplorationValue peHeart;

    @Column(name = "pe_heart_findings")
    private String peHeartFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_abdomen")
    private PhysicalExplorationValue peAbdomen;

    @Column(name = "pe_abdomen_findings")
    private String peAbdomenFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_back")
    private PhysicalExplorationValue peBack;

    @Column(name = "pe_back_findings")
    private String peBackFindings;

    // --- Physical Exploration - Column C ---
    @Enumerated(EnumType.STRING)
    @Column(name = "pe_anus_rectum")
    private PhysicalExplorationValue peAnusRectum;

    @Column(name = "pe_anus_rectum_findings")
    private String peAnusRectumFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_genito_urinary")
    private PhysicalExplorationValue peGenitoUrinary;

    @Column(name = "pe_genito_urinary_findings")
    private String peGenitoUrinaryFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_inguinals_genitals")
    private PhysicalExplorationValue peInguinalsGenitals;

    @Column(name = "pe_inguinals_genitals_findings")
    private String peInguinalsGenitalsFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_extremities")
    private PhysicalExplorationValue peExtremities;

    @Column(name = "pe_extremities_findings")
    private String peExtremitiesFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_reflexes")
    private PhysicalExplorationValue peReflexes;

    @Column(name = "pe_reflexes_findings")
    private String peReflexesFindings;

    @Enumerated(EnumType.STRING)
    @Column(name = "pe_dental")
    private PhysicalExplorationValue peDental;

    @Column(name = "pe_dental_findings")
    private String peDentalFindings;

    // --- Remarks ---
    @Column(name = "remarks")
    private String remarks;

    // --- Results ---
    @Enumerated(EnumType.STRING)
    @Column(name = "basic_peme_result")
    private PassStatus basicPemeResult;

    @Enumerated(EnumType.STRING)
    @Column(name = "additional_lab_result")
    private PassStatus additionalLabResult;

    @Enumerated(EnumType.STRING)
    @Column(name = "flag_medical_lab_result")
    private PassStatus flagMedicalLabResult;

    // --- Recommendation ---
    @Enumerated(EnumType.STRING)
    @Column(name = "recommendation")
    private RecommendationValue recommendation;

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
}
