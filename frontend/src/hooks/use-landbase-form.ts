"use client";

import { useLocalStorageForm } from "./use-local-storage-form";
import type { LandbasePeme } from "@/components/landbase/types";

const STORAGE_KEY = "landbase_peme_records";

/** Empty default state for a new PEME record */
const EMPTY_PEME: LandbasePeme = {
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
  medical_history: {},
  medical_history_others: "",
  consulted_doctor: false,
  maintenance_medications: "",
  questionnaire_1: "",
  questionnaire_2: "",
  questionnaire_3: "",
  questionnaire_4: "",
  questionnaire_5: "",
  questionnaire_6: "",
  questionnaire_7: "",
  questionnaire_comments: "",
  questionnaire_8: "",
  questionnaire_8_details: "",
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

/**
 * Manages Landbase PEME form state, loading, and persistence.
 *
 * Thin wrapper around `useLocalStorageForm` configured for the Landbase
 * PEME module. Handles both create and edit flows by reading the `id`
 * search param. On save, validates required fields, generates a PEME ID
 * for new records, and navigates back to the landbase page.
 *
 * @returns Object with form state, setters, and the save handler
 *
 * @example
 * ```tsx
 * const { data, setData, loading, saving, handleSave } = useLandbaseForm();
 * ```
 */
export function useLandbaseForm() {
  return useLocalStorageForm<LandbasePeme>({
    storageKey: STORAGE_KEY,
    emptyRecord: EMPTY_PEME,
    idPrefix: "LB",
    idField: "peme_id",
    returnRoute: "/landbase",
    validate: (data) =>
      !data.last_name || !data.first_name
        ? "Please fill in the required fields (Last Name, First Name)"
        : null,
    successCreateMessage: "PEME record created successfully",
    successUpdateMessage: "PEME record updated successfully",
  });
}
