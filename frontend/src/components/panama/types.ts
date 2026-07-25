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
}
