"use client";

import { useLocalStorageForm } from "./use-local-storage-form";
import type { MedicalExam } from "@/components/medical/types";

const STORAGE_KEY = "medical_exam_records";

/** Empty default state for a new Medical Examination record */
const EMPTY_EXAM: MedicalExam = {
  // Personal Information
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
  date_of_birth: "",
  age: "",

  // Physical Examination - Vital Signs
  pe_height: "",
  pe_bp_systolic: "",
  pe_bp_diastolic: "",
  pe_pulse_rate: "",
  pe_respiration: "",
  pe_body_temperature: "",
  pe_weight: "",
  pe_mm_ym: "",
  pe_bmi: "",
  blood_pressure: "",
  bp_classification: "",
  heart_rate: "",
  respiratory_rate: "",
  temperature: "",
  weight: "",
  height: "",
  bmi: "",
  oxygen_saturation: "",

  // Vision
  vision_far_od: "",
  vision_far_os: "",
  vision_near_od: "",
  vision_near_os: "",
  vision_uncorrected_far_od: "",
  vision_uncorrected_far_os: "",
  vision_uncorrected_near_od: "",
  vision_uncorrected_near_os: "",
  vision_corrected_far_od: "",
  vision_corrected_far_os: "",
  vision_corrected_near_od: "",
  vision_corrected_near_os: "",
  vision_color: "",
  vision_visual_acuity: "",
  vision_meets_stcw: "",
  vision_contact_lenses: "",
  vision_date_taken: "",

  // Audiometry
  audio_hearing_by: "",
  audio_as_right_1: "",
  audio_as_right_2: "",
  audio_as_left_1: "",
  audio_as_left_2: "",
  audio_ad_right_1: "",
  audio_ad_right_2: "",
  audio_ad_left_1: "",
  audio_ad_left_2: "",
  audio_satisfactory: "",

  // Speech
  speech_impaired_hearing: "",

  // Medical condition questions
  condition_aggravated_sea: "",
  identification_docs_checked: "",
  fit_for_lookout: "",

  // Physical Examination - Systems
  skin: "",
  skin_remarks: "",
  heent: "",
  heent_remarks: "",
  neck: "",
  neck_remarks: "",
  chest_lungs: "",
  chest_lungs_remarks: "",
  cardiovascular: "",
  cardiovascular_remarks: "",
  abdomen: "",
  abdomen_remarks: "",
  extremities: "",
  extremities_remarks: "",
  neurological: "",
  neurological_remarks: "",

  // Visual Acuity
  visual_acuity_right: "",
  visual_acuity_left: "",
  visual_acuity_corrected: "",
  color_vision: "",

  // Findings
  findings_a: {},
  findings_b: {},
  findings_c: {},

  // Questionnaire
  questionnaire: {},
  questionnaire_comments: "",
  questionnaire_medications_detail: "",

  // Medical History
  medical_history: {},
  medical_history_others: "",
  consulted_doctor_past: "",
  maintenance_medications: "",
  surgical_history: "",
  family_history: "",
  allergies: "",
  current_medications: "",
  smoking_history: "",
  alcohol_history: "",

  // Laboratory Results
  cbc_result: "",
  cbc_remarks: "",
  urinalysis_result: "",
  urinalysis_remarks: "",
  blood_chemistry_result: "",
  blood_chemistry_remarks: "",
  chest_xray_result: "",
  chest_xray_remarks: "",
  ecg_result: "",
  ecg_remarks: "",
  drug_test_result: "",
  drug_test_remarks: "",
  hepatitis_b_result: "",
  hepatitis_b_remarks: "",
  hiv_result: "",
  hiv_remarks: "",
  additional_labs: "",

  // Result of Ancillary Examinations
  xray_no: "",
  ancillary_chest_xray: "",
  ancillary_chest_xray_findings: "",
  ancillary_ecg: "",
  ancillary_ecg_findings: "",
  ancillary_cbc: "",
  ancillary_cbc_findings: "",
  ancillary_urinalysis: "",
  ancillary_urinalysis_findings: "",
  ancillary_stool_exam: "",
  ancillary_stool_exam_findings: "",
  ancillary_hbsag: "",
  ancillary_hiv_aids: "",
  ancillary_pregnancy_test: "",
  ancillary_rpr: "",
  ancillary_rpr_findings: "",
  ancillary_blood_type: "",
  ancillary_psychological_test: "",
  ancillary_additional_tests: "",

  // Final Recommendation
  recommendation_remarks: "",
  cert_basic_ooh: "",
  cert_basic_ooh_findings: "",
  cert_additional_labs: "",
  cert_additional_labs_findings: "",
  cert_flagpost: "",
  cert_flagpost_findings: "",

  // Assessment of Fitness for Service at Sea
  fitness_deck_services: "",
  fitness_engine_services: "",
  fitness_catering_services: "",
  fitness_other_services: "",
  visual_aids_required: "",

  // Dates and Certification
  date_initial_peme: "",
  date_of_fitness: "",
  valid_until: "",
  authorized_physician: "",
  medical_certification_no: "",
  medical_director: "",

  // Diagnosis
  primary_diagnosis: "",
  secondary_diagnosis: "",
  icd_code: "",

  // Treatment Plan
  treatment_plan: "",
  medications_prescribed: "",
  follow_up_date: "",
  referral_to: "",
  consultation_status: "",

  // Remarks
  remarks: "",

  // Physician
  examining_physician: "",
  license_no: "",
};

/**
 * Manages Medical Examination form state, loading, and persistence.
 *
 * Thin wrapper around `useLocalStorageForm` configured for the Medical
 * Examination module. Handles both create and edit flows by reading the
 * `id` search param. On save, validates required fields, generates an
 * Exam ID for new records, and navigates back to the medical page.
 *
 * @returns Object with form state, setters, and the save handler
 *
 * @example
 * ```tsx
 * const { data, setData, loading, saving, handleSave } = useMedicalForm();
 * ```
 */
export function useMedicalForm() {
  return useLocalStorageForm<MedicalExam>({
    storageKey: STORAGE_KEY,
    emptyRecord: EMPTY_EXAM,
    idPrefix: "MED",
    idField: "exam_id",
    returnRoute: "/medical",
    validate: (data) =>
      !data.last_name || !data.first_name
        ? "Please fill in the required fields (Last Name, First Name)"
        : null,
    successCreateMessage: "Medical record created successfully",
    successUpdateMessage: "Medical record updated successfully",
  });
}
