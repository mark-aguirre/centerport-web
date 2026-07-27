package com.centerport.panama;

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
 * Panama Maritime Authority medical certificate entity.
 *
 * Represents a complete PEME (Pre-Employment Medical Examination) certificate
 * as required by the Panama Maritime Authority for seafarer fitness assessment.
 *
 * Sections:
 * - General Information — identity, vessel assignment, and crew position
 * - Personal Declaration — medical history conditions (questions 1-44)
 * - Statement — examinee and practitioner signatures with dates
 * - Medical Examination — clinical data, sight, hearing, physical exploration
 * - Laboratory Tests — mandatory and supplementary lab results
 * - Other Diagnostic Tests — additional tests and observations
 * - Assessment of Fitness — department fitness, restrictions, certificate dates
 *
 * JSONB Columns:
 * Dynamic maps ({@code conditions}, {@code physical_exploration},
 * {@code lab_tests}, {@code lab_other_tests}) are stored as PostgreSQL JSONB
 * to accommodate variable-length key sets without schema migration.
 *
 * @see BaseEntity
 * @see LabTestResult
 * @see OtherLabTestResult
 * @see PanamaCertificateDto
 */
@Getter
@Setter
@Entity
@Table(name = "panama_certificates")
public class PanamaCertificate extends BaseEntity {

    @Column(name = "panama_id", unique = true)
    private String panamaId;

    // --- Seafarer Profile Reference ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seafarer_profile_id", nullable = false)
    private SeafarerProfile seafarerProfile;

    // --- General Information ---
    @Column(name = "day")
    private String day;

    @Column(name = "month")
    private String month;

    @Column(name = "year")
    private String year;

    @Column(name = "rh_typing")
    private String rhTyping;

    @Column(name = "lookout_duties")
    private String lookoutDuties;

    @Column(name = "routine_emergency_duties")
    private String routineEmergencyDuties;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_of_ship")
    private ShipType typeOfShip;

    @Enumerated(EnumType.STRING)
    @Column(name = "trade_area")
    private TradeArea tradeArea;

    // --- Examinee's Personal Declaration — Conditions ---
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "conditions", columnDefinition = "jsonb")
    private Map<String, String> conditions;

    @Column(name = "conditions_details")
    private String conditionsDetails;

    // --- Additional Questions (37–44) ---
    @Enumerated(EnumType.STRING)
    @Column(name = "question_37")
    private YesNo question37;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_38")
    private YesNo question38;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_39")
    private YesNo question39;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_40")
    private YesNo question40;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_41")
    private YesNo question41;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_42")
    private YesNo question42;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_43")
    private YesNo question43;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_44")
    private YesNo question44;

    @Column(name = "declaration_comments")
    private String declarationComments;

    // --- Medication Question (45) ---
    @Enumerated(EnumType.STRING)
    @Column(name = "question_45")
    private YesNo question45;

    @Column(name = "question_45_details")
    private String question45Details;

    // --- Covid-19 ---
    @Enumerated(EnumType.STRING)
    @Column(name = "covid_1")
    private YesNo covid1;

    @Enumerated(EnumType.STRING)
    @Column(name = "covid_2")
    private YesNo covid2;

    @Column(name = "covid_3_date")
    private String covid3Date;

    @Enumerated(EnumType.STRING)
    @Column(name = "covid_4")
    private YesNo covid4;

    @Enumerated(EnumType.STRING)
    @Column(name = "covid_5")
    private YesNo covid5;

    @Column(name = "covid_6_vaccine_type")
    private String covid6VaccineType;

    @Column(name = "covid_6_num_doses")
    private String covid6NumDoses;

    @Column(name = "covid_6_boosters")
    private String covid6Boosters;

    // --- III. Statement ---
    @Column(name = "statement_name")
    private String statementName;

    @Column(name = "statement_signature")
    private String statementSignature;

    @Column(name = "statement_day")
    private String statementDay;

    @Column(name = "statement_month")
    private String statementMonth;

    @Column(name = "statement_year")
    private String statementYear;

    @Column(name = "statement_witness_name")
    private String statementWitnessName;

    @Column(name = "statement_practitioner_name")
    private String statementPractitionerName;

    @Column(name = "statement_practitioner_signature")
    private String statementPractitionerSignature;

    @Column(name = "statement_practitioner_date_day")
    private String statementPractitionerDateDay;

    @Column(name = "statement_practitioner_date_month")
    private String statementPractitionerDateMonth;

    @Column(name = "statement_practitioner_date_year")
    private String statementPractitionerDateYear;

    @Column(name = "statement_practitioner_witness")
    private String statementPractitionerWitness;

    @Column(name = "statement_previous_exam_details")
    private String statementPreviousExamDetails;

    // --- IV. Medical Examination — i. Clinical Data ---
    @Column(name = "height_cm")
    private String heightCm;

    @Column(name = "weight_kg")
    private String weightKg;

    @Column(name = "bmi")
    private String bmi;

    @Column(name = "oxygen_saturation")
    private String oxygenSaturation;

    @Column(name = "heart_rate")
    private String heartRate;

    @Column(name = "respiratory_rate")
    private String respiratoryRate;

    @Column(name = "blood_pressure_systolic")
    private String bloodPressureSystolic;

    @Column(name = "blood_pressure_diastolic")
    private String bloodPressureDiastolic;

    // --- IV. Medical Examination — ii. Sight ---
    @Column(name = "sight_glasses_contact")
    private String sightGlassesContact;

    @Column(name = "sight_unaided_distant_right")
    private String sightUnaidedDistantRight;

    @Column(name = "sight_unaided_distant_left")
    private String sightUnaidedDistantLeft;

    @Column(name = "sight_unaided_distant_binocular")
    private String sightUnaidedDistantBinocular;

    @Column(name = "sight_unaided_short_right")
    private String sightUnaidedShortRight;

    @Column(name = "sight_unaided_short_left")
    private String sightUnaidedShortLeft;

    @Column(name = "sight_aided_distant_right")
    private String sightAidedDistantRight;

    @Column(name = "sight_aided_distant_left")
    private String sightAidedDistantLeft;

    @Column(name = "sight_aided_distant_binocular")
    private String sightAidedDistantBinocular;

    @Column(name = "sight_aided_short_right")
    private String sightAidedShortRight;

    @Column(name = "sight_aided_short_left")
    private String sightAidedShortLeft;

    @Column(name = "sight_fields_right")
    private String sightFieldsRight;

    @Column(name = "sight_fields_left")
    private String sightFieldsLeft;

    @Column(name = "sight_color_vision")
    private String sightColorVision;

    @Column(name = "sight_color_method")
    private String sightColorMethod;

    // --- IV. Medical Examination — iii. Hearing ---
    @Column(name = "hearing_right_500")
    private String hearingRight500;

    @Column(name = "hearing_right_1000")
    private String hearingRight1000;

    @Column(name = "hearing_right_2000")
    private String hearingRight2000;

    @Column(name = "hearing_right_3000")
    private String hearingRight3000;

    @Column(name = "hearing_right_4000")
    private String hearingRight4000;

    @Column(name = "hearing_right_6000")
    private String hearingRight6000;

    @Column(name = "hearing_right_8000")
    private String hearingRight8000;

    @Column(name = "hearing_left_500")
    private String hearingLeft500;

    @Column(name = "hearing_left_1000")
    private String hearingLeft1000;

    @Column(name = "hearing_left_2000")
    private String hearingLeft2000;

    @Column(name = "hearing_left_3000")
    private String hearingLeft3000;

    @Column(name = "hearing_left_4000")
    private String hearingLeft4000;

    @Column(name = "hearing_left_6000")
    private String hearingLeft6000;

    @Column(name = "hearing_left_8000")
    private String hearingLeft8000;

    // --- IV. Medical Examination — iv. Physical Exploration ---
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "physical_exploration", columnDefinition = "jsonb")
    private Map<String, String> physicalExploration;

    @Column(name = "physical_exploration_comments")
    private String physicalExplorationComments;

    // --- V. Laboratory Tests ---
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "lab_tests", columnDefinition = "jsonb")
    private Map<String, LabTestResult> labTests;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "lab_other_tests", columnDefinition = "jsonb")
    private Map<String, OtherLabTestResult> labOtherTests;

    @Column(name = "lab_mandatory_text")
    private String labMandatoryText;

    // --- VI. Other Diagnostic Tests ---
    @Column(name = "other_diag_test")
    private String otherDiagTest;

    @Column(name = "other_diag_result")
    private String otherDiagResult;

    @Column(name = "other_diag_comments")
    private String otherDiagComments;

    // --- VII. Assessment of Fitness ---
    @Column(name = "fitness_lookout")
    private String fitnessLookout;

    @Column(name = "fitness_deck_fit")
    private Boolean fitnessDeckFit;

    @Column(name = "fitness_deck_unfit")
    private Boolean fitnessDeckUnfit;

    @Column(name = "fitness_engine_fit")
    private Boolean fitnessEngineFit;

    @Column(name = "fitness_engine_unfit")
    private Boolean fitnessEngineUnfit;

    @Column(name = "fitness_catering_fit")
    private Boolean fitnessCateringFit;

    @Column(name = "fitness_catering_unfit")
    private Boolean fitnessCateringUnfit;

    @Column(name = "fitness_other_fit")
    private Boolean fitnessOtherFit;

    @Column(name = "fitness_other_unfit")
    private Boolean fitnessOtherUnfit;

    @Column(name = "fitness_restriction")
    private String fitnessRestriction;

    @Column(name = "fitness_restriction_details")
    private String fitnessRestrictionDetails;

    @Enumerated(EnumType.STRING)
    @Column(name = "fitness_visual_aid")
    private YesNo fitnessVisualAid;

    @Column(name = "cert_expiry_day")
    private String certExpiryDay;

    @Column(name = "cert_expiry_month")
    private String certExpiryMonth;

    @Column(name = "cert_expiry_year")
    private String certExpiryYear;

    @Column(name = "cert_issued_day")
    private String certIssuedDay;

    @Column(name = "cert_issued_month")
    private String certIssuedMonth;

    @Column(name = "cert_issued_year")
    private String certIssuedYear;

    @Column(name = "cert_number")
    private String certNumber;

    @Column(name = "physician_name")
    private String physicianName;

    @Column(name = "physician_signature")
    private String physicianSignature;
}
