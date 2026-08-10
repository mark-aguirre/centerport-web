package com.centerport.psychology;

import com.centerport.common.entity.BaseEntity;
import com.centerport.profile.SeafarerProfile;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * JPA entity representing a psychological evaluation record.
 *
 * Captures the full psychological assessment for maritime personnel including:
 * - Examination details (date, psychometrician, psychologist)
 * - Tests used (intelligence, personal, others)
 * - Intellectual level classification
 * - Personality traits and characteristics (1-7 rating scale)
 * - Conclusion and remarks
 *
 * Identity:
 * Inherits UUID primary key and audit timestamps from {@link BaseEntity}.
 * Additionally carries a human-readable {@code evalId} (format {@code PSYCH00000001})
 * generated via {@link com.centerport.common.util.BusinessIdGenerator}.
 *
 * @see BaseEntity
 * @see PsychologyEvaluationDto
 * @see PsychologyEvaluationMapper
 */
@Getter
@Setter
@Entity
@Table(name = "psychology_evaluations")
public class PsychologyEvaluation extends BaseEntity {

    @Column(name = "eval_id", unique = true)
    private String evalId;

    // --- Seafarer Profile Reference ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seafarer_profile_id", nullable = false)
    private SeafarerProfile seafarerProfile;

    // --- Patient Information (denormalized for historical accuracy) ---
    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Column(name = "age")
    private String age;

    // --- Examination Details ---
    @Column(name = "date_of_examination")
    private String dateOfExamination;

    @Column(name = "psychometrician")
    private String psychometrician;

    @Column(name = "psychometrician_license_no")
    private String psychometricianLicenseNo;

    @Column(name = "psychologist")
    private String psychologist;

    @Column(name = "psychologist_license_no")
    private String psychologistLicenseNo;

    // --- Tests Used ---
    @Column(name = "intelligence_test_used")
    private Boolean intelligenceTestUsed;

    @Column(name = "intelligence_test_name")
    private String intelligenceTestName;

    @Column(name = "personal_test_used")
    private Boolean personalTestUsed;

    @Column(name = "personal_test_name")
    private String personalTestName;

    @Column(name = "others_test_used")
    private Boolean othersTestUsed;

    @Column(name = "others_test_name")
    private String othersTestName;

    // --- I. Intellectual Level ---
    @Column(name = "intellectual_level")
    private String intellectualLevel;

    // --- II. Personality Traits and Characteristics (1-7 rating scale) ---
    // Sense of Responsibility
    @Column(name = "trait_perseverance")
    private String traitPerseverance;

    @Column(name = "trait_obedience")
    private String traitObedience;

    @Column(name = "trait_self_discipline")
    private String traitSelfDiscipline;

    @Column(name = "trait_enthusiasm")
    private String traitEnthusiasm;

    @Column(name = "trait_initiative")
    private String traitInitiative;

    // Emotional Stability
    @Column(name = "trait_withstand_boredom")
    private String traitWithstandBoredom;

    @Column(name = "trait_stress_tolerance")
    private String traitStressTolerance;

    @Column(name = "trait_faces_reality")
    private String traitFacesReality;

    @Column(name = "trait_confidence")
    private String traitConfidence;

    @Column(name = "trait_relaxed")
    private String traitRelaxed;

    // Objectivity
    @Column(name = "trait_tough_mindedness")
    private String traitToughMindedness;

    @Column(name = "trait_adaptability")
    private String traitAdaptability;

    @Column(name = "trait_practicality")
    private String traitPracticality;

    // Motivation
    @Column(name = "trait_assertiveness")
    private String traitAssertiveness;

    @Column(name = "trait_independence")
    private String traitIndependence;

    @Column(name = "trait_resourcefulness")
    private String traitResourcefulness;

    // Interpersonal and Personal Adjustment
    @Column(name = "trait_teamwork")
    private String traitTeamwork;

    @Column(name = "trait_deference")
    private String traitDeference;

    @Column(name = "trait_self_esteem")
    private String traitSelfEsteem;

    @Column(name = "trait_aggressive_tendencies")
    private String traitAggressiveTendencies;

    // Goal Orientation
    @Column(name = "trait_goal_orientation")
    private String traitGoalOrientation;

    // --- III. Conclusion/Remarks ---
    @Column(name = "conclusion")
    private String conclusion;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;
}
