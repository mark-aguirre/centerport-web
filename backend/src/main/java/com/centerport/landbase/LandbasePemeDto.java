package com.centerport.landbase;

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
 * Data transfer object for LandbasePeme. All field names serialize to snake_case
 * via the global JacksonConfig. System fields (id, pemeId, createdDate, updatedDate)
 * are included for response output but ignored on create/update input.
 *
 * On create/update requests, only {@code seafarerProfileId} is required to link
 * the PEME to an existing seafarer profile. The nested {@code seafarerProfile}
 * object is populated in responses for convenience.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LandbasePemeDto {

    private UUID id;
    private String pemeId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // --- Seafarer Profile Reference ---
    @NotNull(message = "must not be null")
    private UUID seafarerProfileId;

    /** Populated in responses; ignored on input. */
    private SeafarerProfileDto seafarerProfile;

    // --- Past Medical History (JSONB map) ---
    private Map<String, String> medicalHistory;
    private String medicalHistoryOthers;
    private Boolean consultedDoctor;
    private String maintenanceMedications;

    // --- Questionnaire ---
    @JsonProperty("questionnaire_1")
    private YesNo questionnaire1;
    @JsonProperty("questionnaire_2")
    private YesNo questionnaire2;
    @JsonProperty("questionnaire_3")
    private YesNo questionnaire3;
    @JsonProperty("questionnaire_4")
    private YesNo questionnaire4;
    @JsonProperty("questionnaire_5")
    private YesNo questionnaire5;
    @JsonProperty("questionnaire_6")
    private YesNo questionnaire6;
    @JsonProperty("questionnaire_7")
    private YesNo questionnaire7;
    private String questionnaireComments;
    @JsonProperty("questionnaire_8")
    private YesNo questionnaire8;
    @JsonProperty("questionnaire_8_details")
    private String questionnaire8Details;

    // --- Ancillary Examinations ---
    private String xrayNo;
    private ExamResult chestXray;
    private ExamResult cbc;
    private ExamResult cec;
    private PregnancyTestResult pregnancyTest;
    private ExamResult urinalysis;
    private ExamResult stoolExam;
    private ReactiveResult hbsag;
    private ReactiveResult hivAidsTest;
    private ReactiveResult apb;
    private BloodType bloodType;
    private ExamResult drugTest;
    private PsychologicalTestResult psychologicalTest;
    private String additionalTests;

    // --- DOH / Certificate Identifiers ---
    private String dohAccreditationNo;
    private String refNo;

    // --- Physical Examination - Vital Signs ---
    private String peWeight;
    private String peHeight;
    private String peBmi;
    private String pePulseRate;
    private String peBloodPressure;
    private String peRespiration;
    private String peBodyTemperature;

    // --- Vision Acuity - Far Vision ---
    private String visionFarOdUncorrected;
    private String visionFarOsUncorrected;
    private String visionFarOdCorrected;
    private String visionFarOsCorrected;

    // --- Vision Acuity - Near Vision ---
    private String visionNearOdUncorrected;
    private String visionNearOsUncorrected;
    private String visionNearOdCorrected;
    private String visionNearOsCorrected;

    // --- Ishihara Color Vision ---
    private Boolean visionColorAdequate;

    // --- Hearing Audiometry ---
    private String hearingAd;
    private String hearingAs;

    // --- Physical Exploration - Column A ---
    private PhysicalExplorationValue peSkin;
    private String peSkinFindings;
    private PhysicalExplorationValue peHeadScalp;
    private String peHeadScalpFindings;
    private PhysicalExplorationValue peEyesExternal;
    private String peEyesExternalFindings;
    private PhysicalExplorationValue pePupils;
    private String pePupilsFindings;
    private PhysicalExplorationValue peEars;
    private String peEarsFindings;
    private PhysicalExplorationValue peNoseSinuses;
    private String peNoseSinusesFindings;
    private PhysicalExplorationValue peMouthThroat;
    private String peMouthThroatFindings;

    // --- Physical Exploration - Column B ---
    private PhysicalExplorationValue peNeckLymphNodes;
    private String peNeckLymphNodesFindings;
    private PhysicalExplorationValue peBreastAxilla;
    private String peBreastAxillaFindings;
    private PhysicalExplorationValue peChestLungs;
    private String peChestLungsFindings;
    private PhysicalExplorationValue peHeart;
    private String peHeartFindings;
    private PhysicalExplorationValue peAbdomen;
    private String peAbdomenFindings;
    private PhysicalExplorationValue peBack;
    private String peBackFindings;

    // --- Physical Exploration - Column C ---
    private PhysicalExplorationValue peAnusRectum;
    private String peAnusRectumFindings;
    private PhysicalExplorationValue peGenitoUrinary;
    private String peGenitoUrinaryFindings;
    private PhysicalExplorationValue peInguinalsGenitals;
    private String peInguinalsGenitalsFindings;
    private PhysicalExplorationValue peExtremities;
    private String peExtremitiesFindings;
    private PhysicalExplorationValue peReflexes;
    private String peReflexesFindings;
    private PhysicalExplorationValue peDental;
    private String peDentalFindings;

    // --- Remarks ---
    private String remarks;

    // --- Results ---
    private PassStatus basicPemeResult;
    private PassStatus additionalLabResult;
    private PassStatus flagMedicalLabResult;

    // --- Recommendation ---
    private RecommendationValue recommendation;
    private String dateInitialPeme;
    private String dateOfFitness;
    private String validUntil;
    private String authorizedPhysician;
    private String medicalCertificationNo;
    private String medicalDirector;
}
