package com.centerport.landbase;

import com.centerport.common.enums.*;
import jakarta.validation.constraints.NotBlank;
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
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LandbasePemeDto {

    private UUID id;
    private String pemeId;
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

    // --- Past Medical History (JSONB map) ---
    private Map<String, String> medicalHistory;
    private String medicalHistoryOthers;
    private Boolean consultedDoctor;
    private String maintenanceMedications;

    // --- Questionnaire ---
    private YesNo questionnaire1;
    private YesNo questionnaire2;
    private YesNo questionnaire3;
    private YesNo questionnaire4;
    private YesNo questionnaire5;
    private YesNo questionnaire6;
    private YesNo questionnaire7;
    private String questionnaireComments;
    private YesNo questionnaire8;
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
