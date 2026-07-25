"use client";

import { useLocalStorageForm } from "./use-local-storage-form";
import type { MlcRecord } from "@/components/mlc/types";

const STORAGE_KEY = "mlc_records";

/** Empty default state for a new MLC record */
const EMPTY_MLC: MlcRecord = {
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

  // Additional Seafarer Details
  date_of_birth: "",
  age: "",
  sirb_no: "",
  rank: "",
  vessel_name: "",
  vessel_type: "",
  shipping_company: "",
  manning_agency: "",

  // Certificate Details
  certificate_type: "",
  fitness_determination: "",
  date_of_examination: "",
  date_issued: "",
  valid_until: "",
  issuing_authority: "",
  examining_physician: "",
  medical_director: "",
  limitations_remarks: "",

  // Declaration of the Authorized Physician
  id_documents_checked: "",
  hearing_meets_standards: "",
  unaided_hearing_satisfactory: "",
  visual_acuity_meets_standards: "",
  colour_vision_meets_standards: "",
  visual_aids: [],
  date_colour_vision_test: "",
  fit_for_lookout: "",
  no_limitations: "",
  limitations_details: "",
  applicant_condition_risk: "",

  // Final Recommendation
  date_initial_peme: "",
  date_of_fitness: "",
  valid_until_date: "",
  medical_certification_no: "",
};

/**
 * Manages MLC Health Certificate form state, loading, and persistence.
 *
 * Thin wrapper around `useLocalStorageForm` configured for the MLC module.
 * Handles both create and edit flows by reading the `id` search param.
 * On save, validates required fields, generates an MLC ID for new records,
 * and navigates back to the MLC page.
 *
 * @returns Object with form state, setters, and the save handler
 *
 * @example
 * ```tsx
 * const { data, setData, loading, saving, handleSave } = useMlcForm();
 * ```
 */
export function useMlcForm() {
  return useLocalStorageForm<MlcRecord>({
    storageKey: STORAGE_KEY,
    emptyRecord: EMPTY_MLC,
    idPrefix: "MLC",
    idField: "mlc_id",
    returnRoute: "/mlc",
    validate: (data) =>
      !data.last_name || !data.first_name
        ? "Please fill in the required fields (Last Name, First Name)"
        : null,
    successCreateMessage: "MLC record created successfully",
    successUpdateMessage: "MLC record updated successfully",
  });
}
