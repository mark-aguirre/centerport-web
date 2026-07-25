"use client";

import { useLocalStorageForm } from "./use-local-storage-form";
import type { PanamaCertificate } from "@/components/panama/types";

const STORAGE_KEY = "panama_certificate_records";

/** Empty default state for a new Panama certificate record */
const EMPTY_CERTIFICATE: PanamaCertificate = {
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

/**
 * Manages Panama Medical Certificate form state, loading, and persistence.
 *
 * Thin wrapper around `useLocalStorageForm` configured for the Panama module.
 * Handles both create and edit flows by reading the `id` search param.
 * On save, validates required fields, generates a Panama ID for new records,
 * and navigates back to the Panama page.
 *
 * @returns Object with form state, setters, and the save handler
 *
 * @example
 * ```tsx
 * const { data, setData, loading, saving, handleSave } = usePanamaForm();
 * ```
 */
export function usePanamaForm() {
  return useLocalStorageForm<PanamaCertificate>({
    storageKey: STORAGE_KEY,
    emptyRecord: EMPTY_CERTIFICATE,
    idPrefix: "PN",
    idField: "panama_id",
    returnRoute: "/panama",
    validate: (data) =>
      !data.full_name
        ? "Please fill in the required field (Full Name)"
        : null,
    successCreateMessage: "Panama certificate created successfully",
    successUpdateMessage: "Panama certificate updated successfully",
  });
}
