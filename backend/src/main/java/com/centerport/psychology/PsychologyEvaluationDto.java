package com.centerport.psychology;

import com.centerport.profile.SeafarerProfileDto;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data transfer object for psychological evaluation records.
 *
 * Mirrors the field structure of {@link PsychologyEvaluation} for REST serialization.
 * All field names serialize to snake_case via the global
 * {@link com.centerport.config.JacksonConfig}.
 *
 * System Fields:
 * The fields {@code id}, {@code evalId}, {@code createdDate}, and
 * {@code updatedDate} are included in responses but ignored during
 * create and update operations — the server manages these values.
 *
 * Validation:
 * - {@code seafarerProfileId} is required ({@code @NotNull})
 *
 * @see PsychologyEvaluation
 * @see PsychologyEvaluationMapper
 * @see PsychologyEvaluationController
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PsychologyEvaluationDto {

    private UUID id;
    private String evalId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // --- Seafarer Profile Reference ---
    @NotNull(message = "must not be null")
    private UUID seafarerProfileId;

    /** Populated in responses; ignored on input. */
    private SeafarerProfileDto seafarerProfile;

    // --- Patient Information ---
    private String dateOfBirth;
    private String age;

    // --- Examination Details ---
    private String dateOfExamination;
    private String psychometrician;
    private String psychometricianLicenseNo;
    private String psychologist;
    private String psychologistLicenseNo;

    // --- Tests Used ---
    private Boolean intelligenceTestUsed;
    private String intelligenceTestName;
    private Boolean personalTestUsed;
    private String personalTestName;
    private Boolean othersTestUsed;
    private String othersTestName;

    // --- I. Intellectual Level ---
    private String intellectualLevel;

    // --- II. Personality Traits and Characteristics ---
    // Sense of Responsibility
    private String traitPerseverance;
    private String traitObedience;
    private String traitSelfDiscipline;
    private String traitEnthusiasm;
    private String traitInitiative;

    // Emotional Stability
    private String traitWithstandBoredom;
    private String traitStressTolerance;
    private String traitFacesReality;
    private String traitConfidence;
    private String traitRelaxed;

    // Objectivity
    private String traitToughMindedness;
    private String traitAdaptability;
    private String traitPracticality;

    // Motivation
    private String traitAssertiveness;
    private String traitIndependence;
    private String traitResourcefulness;

    // Interpersonal and Personal Adjustment
    private String traitTeamwork;
    private String traitDeference;
    private String traitSelfEsteem;
    private String traitAggressiveTendencies;

    // Goal Orientation
    private String traitGoalOrientation;

    // --- III. Conclusion/Remarks ---
    private String conclusion;
    private String remarks;
}
