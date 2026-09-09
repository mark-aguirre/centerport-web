/**
 * Data model for the Landbase Pre-Employment Medical Examination (PEME) form.
 *
 * Covers personal information, past medical history, questionnaire,
 * ancillary examination results, remarks, results summary, and recommendation.
 */

/** Represents a yes/no/empty option for medical history conditions */
export type MedicalConditionValue = "yes" | "no" | "";

/** Questionnaire answer: yes or no */
export type YesNo = "yes" | "no" | "";

/** Normal/abnormal value used by Landbase physical-exploration fields. */
export type PhysicalExplorationValue = "N" | "A" | "";

/** Adequacy assessment used by hearing and speech fields. */
export type AdequacyValue = "adequate" | "inadequate" | "";

/** Visual-aid selection used by the Landbase vision assessment. */
export type VisualAidValue = "glasses" | "contact_lens" | "";

/** Pulse rhythm selection. */
export type RhythmValue = "Regular" | "Irregular" | "";

/** Result status for ancillary exams */
export type ExamResult = "normal" | "with_findings" | "";

/** Reactive/Non-Reactive for certain tests */
export type ReactiveResult = "reactive" | "non_reactive" | "";

/** Pass/Fail status for results */
export type PassStatus = "passed" | "with_significant_findings" | "";

/** Gender options */
export type Gender = "Male" | "Female" | "";

/** Civil status options */
export type CivilStatus = "Single" | "Married" | "Widowed" | "Separated" | "";

/** Pregnancy test options */
export type PregnancyTestResult = "N/A" | "Positive" | "Negative" | "";

/** Psychological test recommendation options */
export type PsychologicalTestResult =
  | "Recommended"
  | "Rec. w/Reservation"
  | "Not Recommended"
  | "Not Done"
  | "";

/** Blood type options */
export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "";

/**
 * PEME recommendation options.
 *
 * These string literals must match the backend `RecommendationValue` enum
 * `@JsonValue` strings exactly (case-sensitive); the API rejects any other value.
 */
export type RecommendationValue =
  | "Fit for Employment"
  | "Unfit for Employment"
  | "Requires Further Evaluation"
  | "Temporarily Unfit"
  | "Fit with Restriction"
  | "";

/** Full Landbase PEME record */
export interface LandbasePeme {
  id?: string;
  peme_id?: string;
  created_date?: string;
  updated_date?: string;

  // Seafarer Profile link (required on create)
  seafarer_profile_id?: string;

  // Patient photo (sourced from the linked seafarer profile; used by the MLC print template)
  photo_url?: string;

  // Personal Information
  last_name: string;
  first_name: string;
  middle_name: string;
  place_of_birth: string;
  passport_no: string;
  religion: string;
  nationality: string;
  gender: Gender;
  civil_status: CivilStatus;
  address: string;
  contact_no: string;
  employer: string;
  position: string;

  // Additional personal details (sourced from the linked seafarer profile;
  // used by the detailed print template, not editable on the PEME form)
  birthdate?: string;
  age?: string;
  seamans_book_no?: string;
  country_of_destination?: string;

  // Past Medical History - stored as record of condition keys to values
  medical_history: Record<string, string>;

  // Medical history others/comments
  medical_history_others: string;
  consulted_doctor: boolean;
  consulted_doctor_details: string;
  maintenance_medications: string;

  // Questionnaire
  questionnaire_1: YesNo; // signed off as sick or repatriated
  questionnaire_1_details: string;
  questionnaire_2: YesNo; // been hospitalized
  questionnaire_2_details: string;
  questionnaire_3: YesNo; // declared unfit for work overseas
  questionnaire_3_details: string;
  questionnaire_4: YesNo; // medical certificate restricted or revoked
  questionnaire_4_details: string;
  questionnaire_5: YesNo; // aware of medical problems, disease or illness
  questionnaire_5_details: string;
  questionnaire_6: YesNo; // feel healthy and fit to perform duties
  questionnaire_6_details: string;
  questionnaire_7: YesNo; // allergic to any medication
  questionnaire_comments: string;
  questionnaire_8: YesNo; // taking non-prescription or prescription medication
  questionnaire_8_details: string;

  // Physical Examination - Vital Signs
  pe_weight: string;
  pe_height: string;
  pe_bmi: string;
  pe_pulse_rate: string;
  pe_blood_pressure: string;
  pe_bp_systolic: string;
  pe_bp_diastolic: string;
  pe_respiration: string;
  pe_rhythm: RhythmValue;
  pe_body_temperature: string;

  // Physical Examination - Vision, Hearing, Speech, and Psychology
  vision_far_od_uncorrected: string;
  vision_far_os_uncorrected: string;
  vision_far_od_corrected: string;
  vision_far_os_corrected: string;
  vision_near_od_uncorrected: string;
  vision_near_os_uncorrected: string;
  vision_near_od_corrected: string;
  vision_near_os_corrected: string;
  vision_satisfactory_sight: YesNo;
  vision_visual_aid: VisualAidValue;
  vision_color_adequate: boolean;
  hearing_ad: string;
  hearing_as: string;
  hearing_satisfactory: YesNo;
  hearing_right_adequacy: AdequacyValue;
  hearing_left_adequacy: AdequacyValue;
  speech_clarity: AdequacyValue;
  psychological_satisfactory: YesNo;

  // Physical Examination - Body-System Findings
  pe_skin: PhysicalExplorationValue;
  pe_skin_findings: string;
  pe_head_scalp: PhysicalExplorationValue;
  pe_head_scalp_findings: string;
  pe_eyes_external: PhysicalExplorationValue;
  pe_eyes_external_findings: string;
  pe_pupils: PhysicalExplorationValue;
  pe_pupils_findings: string;
  pe_ears: PhysicalExplorationValue;
  pe_ears_findings: string;
  pe_nose_sinuses: PhysicalExplorationValue;
  pe_nose_sinuses_findings: string;
  pe_mouth_throat: PhysicalExplorationValue;
  pe_mouth_throat_findings: string;
  pe_neck_lymph_nodes: PhysicalExplorationValue;
  pe_neck_lymph_nodes_findings: string;
  pe_breast_axilla: PhysicalExplorationValue;
  pe_breast_axilla_findings: string;
  pe_chest_lungs: PhysicalExplorationValue;
  pe_chest_lungs_findings: string;
  pe_heart: PhysicalExplorationValue;
  pe_heart_findings: string;
  pe_abdomen: PhysicalExplorationValue;
  pe_abdomen_findings: string;
  pe_back: PhysicalExplorationValue;
  pe_back_findings: string;
  pe_anus_rectum: PhysicalExplorationValue;
  pe_anus_rectum_findings: string;
  pe_genito_urinary: PhysicalExplorationValue;
  pe_genito_urinary_findings: string;
  pe_inguinals_genitals: PhysicalExplorationValue;
  pe_inguinals_genitals_findings: string;
  pe_extremities: PhysicalExplorationValue;
  pe_extremities_findings: string;
  pe_reflexes: PhysicalExplorationValue;
  pe_reflexes_findings: string;
  pe_dental: PhysicalExplorationValue;
  pe_dental_findings: string;

  // Ancillary Examinations
  xray_no: string;
  chest_xray: ExamResult;
  cbc: ExamResult;
  cec: ExamResult;
  pregnancy_test: PregnancyTestResult;
  urinalysis: ExamResult;
  stool_exam: ExamResult;
  hbsag: ReactiveResult;
  hiv_aids_test: ReactiveResult;
  apb: ReactiveResult;
  blood_type: BloodType;
  drug_test: ExamResult;
  psychological_test: PsychologicalTestResult;
  additional_tests: string;

  // Remarks / Restriction
  remarks: string;

  // Results
  basic_peme_result: PassStatus;
  additional_lab_result: PassStatus;
  flag_medical_lab_result: PassStatus;

  // Recommendation
  recommendation: RecommendationValue;
  date_initial_peme: string;
  date_of_fitness: string;
  valid_until: string;
  authorized_physician: string;
  medical_certification_no: string;
  medical_director: string;
}

/**
 * Shared props interface for all landbase form section components.
 */
export interface LandbaseSectionProps {
  /** Current PEME form data */
  data: LandbasePeme;
  /** Callback to update the form state with modified data */
  onChange: (data: LandbasePeme) => void;
  /** When true, all fields in this section are read-only (view mode) */
  disabled?: boolean;
}

/**
 * Default empty PEME record used for form initialization and reset.
 *
 * All string fields default to empty string, booleans to false,
 * and objects to empty. Used by `useLandbaseForm` for new records
 * and cancel-to-empty flows.
 */
export const EMPTY_PEME: LandbasePeme = {
  seafarer_profile_id: undefined,
  photo_url: "",
  last_name: "",
  first_name: "",
  middle_name: "",
  place_of_birth: "",
  passport_no: "",
  religion: "",
  nationality: "",
  gender: "",
  civil_status: "",
  address: "",
  contact_no: "",
  employer: "",
  position: "",
  birthdate: "",
  age: "",
  seamans_book_no: "",
  country_of_destination: "",
  medical_history: {},
  medical_history_others: "",
  consulted_doctor: false,
  consulted_doctor_details: "",
  maintenance_medications: "",
  questionnaire_1: "",
  questionnaire_1_details: "",
  questionnaire_2: "",
  questionnaire_2_details: "",
  questionnaire_3: "",
  questionnaire_3_details: "",
  questionnaire_4: "",
  questionnaire_4_details: "",
  questionnaire_5: "",
  questionnaire_5_details: "",
  questionnaire_6: "",
  questionnaire_6_details: "",
  questionnaire_7: "",
  questionnaire_comments: "",
  questionnaire_8: "",
  questionnaire_8_details: "",
  pe_weight: "",
  pe_height: "",
  pe_bmi: "",
  pe_pulse_rate: "",
  pe_blood_pressure: "",
  pe_bp_systolic: "",
  pe_bp_diastolic: "",
  pe_respiration: "",
  pe_rhythm: "",
  pe_body_temperature: "",
  vision_far_od_uncorrected: "",
  vision_far_os_uncorrected: "",
  vision_far_od_corrected: "",
  vision_far_os_corrected: "",
  vision_near_od_uncorrected: "",
  vision_near_os_uncorrected: "",
  vision_near_od_corrected: "",
  vision_near_os_corrected: "",
  vision_satisfactory_sight: "",
  vision_visual_aid: "",
  vision_color_adequate: true,
  hearing_ad: "",
  hearing_as: "",
  hearing_satisfactory: "",
  hearing_right_adequacy: "",
  hearing_left_adequacy: "",
  speech_clarity: "",
  psychological_satisfactory: "",
  pe_skin: "N",
  pe_skin_findings: "",
  pe_head_scalp: "N",
  pe_head_scalp_findings: "",
  pe_eyes_external: "N",
  pe_eyes_external_findings: "",
  pe_pupils: "N",
  pe_pupils_findings: "",
  pe_ears: "N",
  pe_ears_findings: "",
  pe_nose_sinuses: "N",
  pe_nose_sinuses_findings: "",
  pe_mouth_throat: "N",
  pe_mouth_throat_findings: "",
  pe_neck_lymph_nodes: "N",
  pe_neck_lymph_nodes_findings: "",
  pe_breast_axilla: "N",
  pe_breast_axilla_findings: "",
  pe_chest_lungs: "N",
  pe_chest_lungs_findings: "",
  pe_heart: "N",
  pe_heart_findings: "",
  pe_abdomen: "N",
  pe_abdomen_findings: "",
  pe_back: "N",
  pe_back_findings: "",
  pe_anus_rectum: "N",
  pe_anus_rectum_findings: "",
  pe_genito_urinary: "N",
  pe_genito_urinary_findings: "",
  pe_inguinals_genitals: "N",
  pe_inguinals_genitals_findings: "",
  pe_extremities: "N",
  pe_extremities_findings: "",
  pe_reflexes: "N",
  pe_reflexes_findings: "",
  pe_dental: "N",
  pe_dental_findings: "",
  xray_no: "",
  chest_xray: "",
  cbc: "",
  cec: "",
  pregnancy_test: "",
  urinalysis: "",
  stool_exam: "",
  hbsag: "",
  hiv_aids_test: "",
  apb: "",
  blood_type: "",
  drug_test: "",
  psychological_test: "",
  additional_tests: "",
  remarks: "",
  basic_peme_result: "",
  additional_lab_result: "",
  flag_medical_lab_result: "",
  recommendation: "",
  date_initial_peme: "",
  date_of_fitness: "",
  valid_until: "",
  authorized_physician: "",
  medical_certification_no: "",
  medical_director: "",
};
