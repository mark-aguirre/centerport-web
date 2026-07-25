/**
 * Data model for the Medical Examination form.
 *
 * Covers personal information, physical examination, medical history,
 * laboratory results, diagnosis, treatment plan, and remarks.
 */

/** Gender options */
export type Gender = "Male" | "Female" | "";

/** Civil status options */
export type CivilStatus = "Single" | "Married" | "Widowed" | "Separated" | "";

/** Blood pressure classification */
export type BPClassification =
  | "Normal"
  | "Elevated"
  | "Hypertension Stage 1"
  | "Hypertension Stage 2"
  | "Hypertensive Crisis"
  | "";

/** Visual acuity result */
export type VisualAcuityResult = "Normal" | "With Correction" | "Impaired" | "";

/** Physical exam finding */
export type ExamFinding = "normal" | "abnormal" | "";

/** Lab result status */
export type LabStatus = "normal" | "with_findings" | "pending" | "";

/** Consultation status */
export type ConsultationStatus =
  | "For Follow-up"
  | "Cleared"
  | "Referred"
  | "Pending"
  | "";

/** Full Medical Examination record */
export interface MedicalExam {
  /** Unique database identifier (UUID) */
  id?: string;
  /** Sequential exam ID (e.g. MED00000001) */
  exam_id?: string;
  /** ISO timestamp of record creation */
  created_date?: string;
  /** ISO timestamp of last update */
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
  date_of_birth: string;
  age: string;

  // Physical Examination - Vital Signs
  pe_height: string;
  pe_bp_systolic: string;
  pe_bp_diastolic: string;
  pe_pulse_rate: string;
  pe_respiration: string;
  pe_body_temperature: string;
  pe_weight: string;
  pe_mm_ym: string;
  pe_bmi: string;
  blood_pressure: string;
  bp_classification: BPClassification;
  heart_rate: string;
  respiratory_rate: string;
  temperature: string;
  weight: string;
  height: string;
  bmi: string;
  oxygen_saturation: string;

  // Vision
  vision_far_od: string;
  vision_far_os: string;
  vision_near_od: string;
  vision_near_os: string;
  vision_uncorrected_far_od: string;
  vision_uncorrected_far_os: string;
  vision_uncorrected_near_od: string;
  vision_uncorrected_near_os: string;
  vision_corrected_far_od: string;
  vision_corrected_far_os: string;
  vision_corrected_near_od: string;
  vision_corrected_near_os: string;
  vision_color: string;
  vision_visual_acuity: string;
  vision_meets_stcw: string;
  vision_contact_lenses: string;
  vision_date_taken: string;

  // Audiometry
  audio_hearing_by: string;
  audio_as_right_1: string;
  audio_as_right_2: string;
  audio_as_left_1: string;
  audio_as_left_2: string;
  audio_ad_right_1: string;
  audio_ad_right_2: string;
  audio_ad_left_1: string;
  audio_ad_left_2: string;
  audio_satisfactory: string;

  // Speech
  speech_impaired_hearing: string;

  // Medical condition questions
  condition_aggravated_sea: string;
  identification_docs_checked: string;
  fit_for_lookout: string;

  // Physical Examination - Systems
  skin: ExamFinding;
  skin_remarks: string;
  heent: ExamFinding;
  heent_remarks: string;
  neck: ExamFinding;
  neck_remarks: string;
  chest_lungs: ExamFinding;
  chest_lungs_remarks: string;
  cardiovascular: ExamFinding;
  cardiovascular_remarks: string;
  abdomen: ExamFinding;
  abdomen_remarks: string;
  extremities: ExamFinding;
  extremities_remarks: string;
  neurological: ExamFinding;
  neurological_remarks: string;

  // Findings (checkboxes for body systems)
  findings_a: Record<string, boolean>;
  findings_b: Record<string, boolean>;
  findings_c: Record<string, boolean>;

  // Visual Acuity (legacy)
  visual_acuity_right: string;
  visual_acuity_left: string;
  visual_acuity_corrected: VisualAcuityResult;
  color_vision: ExamFinding;

  // Questionnaire
  questionnaire: Record<string, string>;
  questionnaire_comments: string;
  questionnaire_medications_detail: string;

  // Medical History
  medical_history: Record<string, string>;
  medical_history_others: string;
  consulted_doctor_past: string;
  maintenance_medications: string;
  surgical_history: string;
  family_history: string;
  allergies: string;
  current_medications: string;
  smoking_history: string;
  alcohol_history: string;

  // Result of Ancillary Examinations
  xray_no: string;
  ancillary_chest_xray: string;
  ancillary_chest_xray_findings: string;
  ancillary_ecg: string;
  ancillary_ecg_findings: string;
  ancillary_cbc: string;
  ancillary_cbc_findings: string;
  ancillary_urinalysis: string;
  ancillary_urinalysis_findings: string;
  ancillary_stool_exam: string;
  ancillary_stool_exam_findings: string;
  ancillary_hbsag: string;
  ancillary_hiv_aids: string;
  ancillary_pregnancy_test: string;
  ancillary_rpr: string;
  ancillary_rpr_findings: string;
  ancillary_blood_type: string;
  ancillary_psychological_test: string;
  ancillary_additional_tests: string;

  // Laboratory Results (legacy)
  cbc_result: LabStatus;
  cbc_remarks: string;
  urinalysis_result: LabStatus;
  urinalysis_remarks: string;
  blood_chemistry_result: LabStatus;
  blood_chemistry_remarks: string;
  chest_xray_result: LabStatus;
  chest_xray_remarks: string;
  ecg_result: LabStatus;
  ecg_remarks: string;
  drug_test_result: LabStatus;
  drug_test_remarks: string;
  hepatitis_b_result: LabStatus;
  hepatitis_b_remarks: string;
  hiv_result: LabStatus;
  hiv_remarks: string;
  additional_labs: string;

  // Final Recommendation
  recommendation_remarks: string;
  cert_basic_ooh: string;
  cert_basic_ooh_findings: string;
  cert_additional_labs: string;
  cert_additional_labs_findings: string;
  cert_flagpost: string;
  cert_flagpost_findings: string;

  // Assessment of Fitness for Service at Sea
  fitness_deck_services: string;
  fitness_engine_services: string;
  fitness_catering_services: string;
  fitness_other_services: string;
  visual_aids_required: string;

  // Dates and Certification
  date_initial_peme: string;
  date_of_fitness: string;
  valid_until: string;
  authorized_physician: string;
  medical_certification_no: string;
  medical_director: string;

  // Diagnosis (legacy)
  primary_diagnosis: string;
  secondary_diagnosis: string;
  icd_code: string;

  // Treatment Plan (legacy)
  treatment_plan: string;
  medications_prescribed: string;
  follow_up_date: string;
  referral_to: string;
  consultation_status: ConsultationStatus;

  // Remarks
  remarks: string;

  // Physician
  examining_physician: string;
  license_no: string;
}

/**
 * Shared props interface for all medical form section components.
 *
 * Every section receives the full form data object and a callback to
 * replace the entire state. Sections are responsible for spreading
 * existing data and only overwriting their own fields.
 *
 * @example
 * ```tsx
 * <PersonalInfoSection data={formData} onChange={setFormData} />
 * ```
 */
export interface MedicalSectionProps {
  /** Current medical exam form data */
  data: MedicalExam;
  /** Callback to update the form state with modified data */
  onChange: (data: MedicalExam) => void;
}
