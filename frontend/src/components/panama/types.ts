/**
 * Data model for the Panama Medical Certificate form.
 *
 * Covers general information, examinee's personal declaration,
 * physical examination, laboratory results, and fitness assessment
 * as required by the Panama Maritime Authority.
 */

/** Sex options */
export type Sex = "Male" | "Female" | "";

/** Type of ship options */
export type ShipType = "Container" | "Tanker" | "Passenger" | "Others" | "";

/** Trade area options */
export type TradeArea = "Coastal" | "Tropical" | "Worldwide" | "";

/** Yes/No answer type */
export type YesNo = "yes" | "no" | "";

/** Full Panama Medical Certificate record */
export interface PanamaCertificate {
  id?: string;
  panama_id?: string;
  created_date?: string;
  updated_date?: string;

  // Seafarer Profile link (required on create)
  seafarer_profile_id?: string;

  // General Information
  full_name: string;
  day: string;
  month: string;
  year: string;
  sex: Sex;
  rh_typing: string;
  passport_seaman_no: string;
  home_address: string;
  department: string;
  crew_position: string;
  lookout_duties: string;
  routine_emergency_duties: string;
  type_of_ship: ShipType;
  trade_area: TradeArea;

  // Examinee's Personal Declaration — Medical Conditions (1–36)
  conditions: Record<string, YesNo>;
  conditions_details: string;

  // Additional Questions (37–44)
  question_37: YesNo;
  question_38: YesNo;
  question_39: YesNo;
  question_40: YesNo;
  question_41: YesNo;
  question_42: YesNo;
  question_43: YesNo;
  question_44: YesNo;
  declaration_comments: string;

  // Medication Question (45)
  question_45: YesNo;
  question_45_details: string;

  // Data related to Covid-19
  covid_1: YesNo;
  covid_2: YesNo;
  covid_3_date: string;
  covid_4: YesNo;
  covid_5: YesNo;
  covid_6_vaccine_type: string;
  covid_6_num_doses: string;
  covid_6_boosters: string;

  // III. Statement
  statement_name: string;
  statement_signature: string;
  statement_day: string;
  statement_month: string;
  statement_year: string;
  statement_witness_name: string;
  statement_practitioner_name: string;
  statement_practitioner_signature: string;
  statement_practitioner_date_day: string;
  statement_practitioner_date_month: string;
  statement_practitioner_date_year: string;
  statement_practitioner_witness: string;
  statement_previous_exam_details: string;

  // IV. Medical Examination — i. Clinical Data
  height_cm: string;
  weight_kg: string;
  bmi: string;
  oxygen_saturation: string;
  heart_rate: string;
  respiratory_rate: string;
  blood_pressure_systolic: string;
  blood_pressure_diastolic: string;

  // IV. Medical Examination — ii. Sight
  sight_glasses_contact: string;
  // Visual acuity — Unaided
  sight_unaided_distant_right: string;
  sight_unaided_distant_left: string;
  sight_unaided_distant_binocular: string;
  sight_unaided_short_right: string;
  sight_unaided_short_left: string;
  // Visual acuity — Aided
  sight_aided_distant_right: string;
  sight_aided_distant_left: string;
  sight_aided_distant_binocular: string;
  sight_aided_short_right: string;
  sight_aided_short_left: string;
  // Visual fields
  sight_fields_right: string;
  sight_fields_left: string;
  // Color vision
  sight_color_vision: string;
  sight_color_method: string;

  // IV. Medical Examination — iii. Hearing (Tonal Audiometric)
  hearing_right_500: string;
  hearing_right_1000: string;
  hearing_right_2000: string;
  hearing_right_3000: string;
  hearing_right_4000: string;
  hearing_right_6000: string;
  hearing_right_8000: string;
  hearing_left_500: string;
  hearing_left_1000: string;
  hearing_left_2000: string;
  hearing_left_3000: string;
  hearing_left_4000: string;
  hearing_left_6000: string;
  hearing_left_8000: string;

  // IV. Medical Examination — iv. Physical Exploration
  physical_exploration: Record<string, PhysicalExplorationValue>;
  physical_exploration_comments: string;

  // V. Diagnostic Test and Results — Laboratory Tests
  lab_tests: Record<string, LabTestResult>;
  lab_other_tests: Record<string, OtherLabTestResult>;
  lab_mandatory_text: string;

  // VI. Other Diagnostic Tests and Results
  other_diag_test: string;
  other_diag_result: string;
  other_diag_comments: string;

  // VII. Assessment of Fitness for Service at Sea
  fitness_lookout: string;
  fitness_deck_fit: boolean;
  fitness_deck_unfit: boolean;
  fitness_engine_fit: boolean;
  fitness_engine_unfit: boolean;
  fitness_catering_fit: boolean;
  fitness_catering_unfit: boolean;
  fitness_other_fit: boolean;
  fitness_other_unfit: boolean;
  fitness_restriction: string;
  fitness_restriction_details: string;
  fitness_visual_aid: YesNo;
  cert_expiry_day: string;
  cert_expiry_month: string;
  cert_expiry_year: string;
  cert_issued_day: string;
  cert_issued_month: string;
  cert_issued_year: string;
  cert_number: string;
  physician_name: string;
  physician_signature: string;
}

/** Physical exploration finding value: Normal, Abnormal, or empty */
export type PhysicalExplorationValue = "N" | "A" | "";

/** Lab test result with normal/abnormal status and observations */
export interface LabTestResult {
  normal: string;
  abnormal: string;
  observations: string;
}

/** Other lab test result with checkbox, normal/abnormal, and observations */
export interface OtherLabTestResult {
  checked: boolean;
  normal: string;
  abnormal: string;
  observations: string;
}

/**
 * Shared props interface for all Panama form section components.
 */
export interface PanamaSectionProps {
  /** Current Panama certificate form data */
  data: PanamaCertificate;
  /** Callback to update the form state with modified data */
  onChange: (data: PanamaCertificate) => void;
  /** When true, all fields in this section are read-only (view mode) */
  disabled?: boolean;
}

/**
 * Default empty Panama certificate record used for form initialization and reset.
 *
 * All string fields default to empty string, booleans to false,
 * and objects to empty. Used by `usePanamaForm` for new records
 * and cancel-to-empty flows.
 */
export const EMPTY_CERTIFICATE: PanamaCertificate = {
  seafarer_profile_id: undefined,
  full_name: "",
  day: "",
  month: "",
  year: "",
  sex: "",
  rh_typing: "",
  passport_seaman_no: "",
  home_address: "",
  department: "",
  crew_position: "",
  lookout_duties: "",
  routine_emergency_duties: "",
  type_of_ship: "",
  trade_area: "",

  // Examinee's Personal Declaration
  conditions: {},
  conditions_details: "",

  // Additional Questions
  question_37: "",
  question_38: "",
  question_39: "",
  question_40: "",
  question_41: "",
  question_42: "",
  question_43: "",
  question_44: "",
  declaration_comments: "",

  // Medication
  question_45: "",
  question_45_details: "",

  // Covid-19
  covid_1: "",
  covid_2: "",
  covid_3_date: "",
  covid_4: "",
  covid_5: "",
  covid_6_vaccine_type: "",
  covid_6_num_doses: "",
  covid_6_boosters: "",

  // Statement
  statement_name: "",
  statement_signature: "",
  statement_day: "",
  statement_month: "",
  statement_year: "",
  statement_witness_name: "",
  statement_practitioner_name: "",
  statement_practitioner_signature: "",
  statement_practitioner_date_day: "",
  statement_practitioner_date_month: "",
  statement_practitioner_date_year: "",
  statement_practitioner_witness: "",
  statement_previous_exam_details: "",

  // Clinical Data
  height_cm: "",
  weight_kg: "",
  bmi: "",
  oxygen_saturation: "",
  heart_rate: "",
  respiratory_rate: "",
  blood_pressure_systolic: "",
  blood_pressure_diastolic: "",

  // Sight
  sight_glasses_contact: "",
  sight_unaided_distant_right: "",
  sight_unaided_distant_left: "",
  sight_unaided_distant_binocular: "",
  sight_unaided_short_right: "",
  sight_unaided_short_left: "",
  sight_aided_distant_right: "",
  sight_aided_distant_left: "",
  sight_aided_distant_binocular: "",
  sight_aided_short_right: "",
  sight_aided_short_left: "",
  sight_fields_right: "",
  sight_fields_left: "",
  sight_color_vision: "",
  sight_color_method: "",

  // Hearing
  hearing_right_500: "",
  hearing_right_1000: "",
  hearing_right_2000: "",
  hearing_right_3000: "",
  hearing_right_4000: "",
  hearing_right_6000: "",
  hearing_right_8000: "",
  hearing_left_500: "",
  hearing_left_1000: "",
  hearing_left_2000: "",
  hearing_left_3000: "",
  hearing_left_4000: "",
  hearing_left_6000: "",
  hearing_left_8000: "",

  // Physical Exploration
  physical_exploration: {},
  physical_exploration_comments: "",

  // Diagnostic Tests
  lab_tests: {},
  lab_other_tests: {},
  lab_mandatory_text: "",

  // Other Diagnostic Tests
  other_diag_test: "",
  other_diag_result: "",
  other_diag_comments: "",

  // Assessment of Fitness
  fitness_lookout: "",
  fitness_deck_fit: false,
  fitness_deck_unfit: false,
  fitness_engine_fit: false,
  fitness_engine_unfit: false,
  fitness_catering_fit: false,
  fitness_catering_unfit: false,
  fitness_other_fit: false,
  fitness_other_unfit: false,
  fitness_restriction: "",
  fitness_restriction_details: "",
  fitness_visual_aid: "",
  cert_expiry_day: "",
  cert_expiry_month: "",
  cert_expiry_year: "",
  cert_issued_day: "",
  cert_issued_month: "",
  cert_issued_year: "",
  cert_number: "",
  physician_name: "",
  physician_signature: "",
};
