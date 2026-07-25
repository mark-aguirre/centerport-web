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

/** PEME recommendation options */
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

  // Past Medical History - stored as record of condition keys to values
  medical_history: Record<string, MedicalConditionValue>;

  // Medical history others/comments
  medical_history_others: string;
  consulted_doctor: boolean;
  maintenance_medications: string;

  // Questionnaire
  questionnaire_1: YesNo; // signed off as sick or repatriated
  questionnaire_2: YesNo; // been hospitalized
  questionnaire_3: YesNo; // declared unfit for work overseas
  questionnaire_4: YesNo; // medical certificate restricted or revoked
  questionnaire_5: YesNo; // aware of medical problems, disease or illness
  questionnaire_6: YesNo; // feel healthy and fit to perform duties
  questionnaire_7: YesNo; // allergic to any conduct/oil
  questionnaire_comments: string;
  questionnaire_8: YesNo; // taking non-prescription or prescription medication
  questionnaire_8_details: string;

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
}
