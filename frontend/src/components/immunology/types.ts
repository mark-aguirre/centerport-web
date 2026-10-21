/**
 * Data model for the Immunology Report form.
 *
 * Covers the patient information header, report metadata (med tech,
 * pathologist, licenses, laboratory no.), and the immunology / serology
 * tests: Tumor Marker (PSA + Other) and Immunology Test (HBsAg, RPR,
 * Anti-HBs with cut-off).
 *
 * Field names are snake_case to match the backend JSON contract
 * (`/api/immunology-reports`, {@code ImmunologyReportDto}).
 */

/** Full Immunology Report record. */
export interface ImmunologyReport {
  id?: string;
  report_id?: string;
  created_date?: string;
  updated_date?: string;

  // Seafarer Profile link (required on create)
  seafarer_profile_id?: string;

  // Personal Information (from profile)
  last_name: string;
  first_name: string;
  middle_name: string;
  birthdate: string;
  age: string;
  gender: string;
  employer: string;
  position: string;
  address: string;

  // Report Header
  result_date: string;
  med_tech: string;
  med_tech_license_no: string;
  pathologist: string;
  pathologist_license_no: string;
  laboratory_no: string;

  // ==========================================================================
  // IMMUNOLOGY / SEROLOGY TESTS
  // ==========================================================================

  // Tumor Marker
  psa_reference: string;
  psa_result: string;

  other_test_name: string;
  other_reference: string;
  other_result: string;

  // Immunology Test — Non Reactive / Reactive
  hbsag_result: string;
  rpr_result: string;

  anti_hbs_result: string;
  anti_hbs_cut_off: string;
  anti_hbs_result_line: string;
}

/** Section component props shared by all immunology section components. */
export interface ImmunologySectionProps {
  data: ImmunologyReport;
  onChange: (data: ImmunologyReport) => void;
  disabled?: boolean;
}

/** Empty record used to initialize the form state. */
export const EMPTY_IMMUNOLOGY_REPORT: ImmunologyReport = {
  // Personal Information
  last_name: "",
  first_name: "",
  middle_name: "",
  birthdate: "",
  age: "",
  gender: "",
  employer: "",
  position: "",
  address: "",

  // Report Header
  result_date: "",
  med_tech: "",
  med_tech_license_no: "",
  pathologist: "",
  pathologist_license_no: "",
  laboratory_no: "",

  // Immunology / Serology
  psa_reference: "< 4.0 ng/ml",
  psa_result: "",
  other_test_name: "",
  other_reference: "",
  other_result: "",
  hbsag_result: "",
  rpr_result: "",
  anti_hbs_result: "",
  anti_hbs_cut_off: "",
  anti_hbs_result_line: "",
};
