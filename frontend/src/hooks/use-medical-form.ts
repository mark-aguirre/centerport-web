"use client";

import { api, type SeafarerProfile } from "@/lib/api";
import { useEntityForm, type EntityFormConfig, type UseEntityFormResult } from "./use-entity-form";
import type { MedicalExam } from "@/components/medical/types";
import type { RecordSummary } from "@/components/common/record-selector";
import { coerceNulls } from "@/lib/form-utils";

// ---------------------------------------------------------------------------
// Empty record constant
// ---------------------------------------------------------------------------

/** Empty default state for a new Medical Examination record */
export const EMPTY_EXAM: MedicalExam = {
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

  // Past Medical History
  medical_history: {},
  medical_history_others: "",
  consulted_doctor_past: "",
  maintenance_medications: "",

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

  // Physician
  examining_physician: "",
  license_no: "",
};

// ---------------------------------------------------------------------------
// Response flattening
// ---------------------------------------------------------------------------

/** System fields to strip before API mutation. */
const SYSTEM_FIELDS = ["id", "exam_id", "created_date", "updated_date", "seafarer_profile"] as const;

/** Field defaults for null coercion (non-string fields). */
const FIELD_DEFAULTS: Record<string, unknown> = {
  findings_a: {},
  findings_b: {},
  findings_c: {},
  questionnaire: {},
  medical_history: {},
};

/**
 * Flatten the nested seafarer_profile response into top-level personal info fields.
 */
function flattenResponse(record: MedicalExam): MedicalExam {
  const raw = record as MedicalExam & {
    seafarer_profile?: {
      id?: string;
      last_name?: string;
      first_name?: string;
      middle_name?: string;
      place_of_birth?: string;
      passport_no?: string;
      religion?: string;
      nationality?: string;
      gender?: string;
      marital_status?: string;
      address?: string;
      contact_no?: string;
      employer?: string;
      position?: string;
      birthdate?: string;
      age?: string;
    };
  };

  const profile = raw.seafarer_profile;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { seafarer_profile: _, ...rest } = raw;
  const coerced = coerceNulls(rest as Record<string, unknown>, FIELD_DEFAULTS);

  if (!profile) return { ...EMPTY_EXAM, ...coerced };

  return {
    ...EMPTY_EXAM,
    ...coerced,
    seafarer_profile_id: profile.id ?? record.seafarer_profile_id,
    last_name: record.last_name || profile.last_name || "",
    first_name: record.first_name || profile.first_name || "",
    middle_name: record.middle_name || profile.middle_name || "",
    place_of_birth: record.place_of_birth || profile.place_of_birth || "",
    passport_no: record.passport_no || profile.passport_no || "",
    religion: record.religion || profile.religion || "",
    nationality: record.nationality || profile.nationality || "",
    gender: (record.gender || profile.gender || "") as MedicalExam["gender"],
    civil_status: (record.civil_status || profile.marital_status || "") as MedicalExam["civil_status"],
    address: record.address || profile.address || "",
    contact_no: record.contact_no || profile.contact_no || "",
    employer: record.employer || profile.employer || "",
    position: record.position || profile.position || "",
    date_of_birth: record.date_of_birth || profile.birthdate || "",
    age: record.age || profile.age || "",
  };
}

/** Strip system fields from the payload. */
function stripSystemFields(record: MedicalExam): Partial<MedicalExam> {
  const payload = { ...record };
  for (const field of SYSTEM_FIELDS) {
    delete (payload as Record<string, unknown>)[field];
  }
  return payload;
}

/** Sanitize payload (empty strings → null). */
function sanitizePayload(record: Partial<MedicalExam>): Partial<MedicalExam> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record as Record<string, unknown>)) {
    result[key] = value === "" ? null : value;
  }
  return result as Partial<MedicalExam>;
}

// ---------------------------------------------------------------------------
// Entity form configuration
// ---------------------------------------------------------------------------

const medicalConfig: EntityFormConfig<MedicalExam> = {
  entityApi: api.entities.MedicalExam,
  emptyRecord: EMPTY_EXAM,
  flattenResponse,
  stripSystemFields,
  sanitizePayload,

  validate: (data) => {
    if (!data.seafarer_profile_id) {
      return "Please select a patient before saving.";
    }
    return null;
  },

  buildPersonalData: (profile: SeafarerProfile): Partial<MedicalExam> => ({
    seafarer_profile_id: profile.id,
    last_name: profile.last_name ?? "",
    first_name: profile.first_name ?? "",
    middle_name: profile.middle_name ?? "",
    place_of_birth: profile.place_of_birth ?? "",
    passport_no: profile.passport_no ?? "",
    religion: profile.religion ?? "",
    nationality: profile.nationality ?? "",
    gender: (profile.gender ?? "") as MedicalExam["gender"],
    civil_status: (profile.marital_status ?? "") as MedicalExam["civil_status"],
    address: profile.address ?? "",
    contact_no: profile.contact_no ?? "",
    employer: profile.employer ?? "",
    position: profile.position ?? "",
    date_of_birth: profile.birthdate ?? "",
    age: profile.age ?? "",
  }),

  matchRecordToProfile: (record, profile) => {
    if (record.seafarer_profile_id === profile.id) return true;
    return (
      record.last_name?.toLowerCase() === profile.last_name?.toLowerCase() &&
      record.first_name?.toLowerCase() === profile.first_name?.toLowerCase()
    );
  },

  getRecordId: (record) => record.id,
  getProfileId: (record) => record.seafarer_profile_id,
  getBusinessId: (record) => record.exam_id,
  getCreatedDate: (record) => record.created_date,

  successMessages: {
    create: "Medical exam created successfully",
    update: "Medical exam updated successfully",
  },
};

// ---------------------------------------------------------------------------
// Public hook & types
// ---------------------------------------------------------------------------

export interface UseMedicalFormResult extends UseEntityFormResult<MedicalExam> {
  /** List of record summaries for the current patient (for the dropdown). */
  profileRecords: RecordSummary[];
  /** Switch to a different record by its UUID. */
  handleSelectRecord: (id: string) => void;
}

/**
 * Manages Medical Examination form state with full CRUD button behavior.
 *
 * Delegates to the generic `useEntityForm` with medical-specific config.
 *
 * @returns Object with form state, action handlers, and ref for first-field focus
 */
export function useMedicalForm(): UseMedicalFormResult {
  return useEntityForm(medicalConfig);
}
