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
