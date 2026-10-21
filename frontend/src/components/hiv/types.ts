/**
 * Data model for the HIV (Human Immunodeficiency Virus) Report form.
 *
 * Covers the patient information header, report metadata (medical
 * technologist, pathologist, examining physician, their license/certificate
 * numbers, result and expiry dates), and the HIV-1 screening test: the
 * screening method(s) used (RAPID, particle agglutination, EIA/CMA/ELFA, or a
 * free-text "others") and the reactive result.
 *
 * Field names are snake_case to match the backend JSON contract
 * (`/api/hiv-reports`, {@code HivReportDto}).
 */

/** Full HIV Report record. */
export interface HivReport {
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
  civil_status: string;
  photo_url: string;

  // Report Header
  med_tech: string;
  hiv_proficiency_cert_no: string;
  pathologist: string;
  pathologist_license_no: string;
  examining_physician: string;
  physician_license_no: string;
  result_date: string;
  expire_date: string;

  // ==========================================================================
  // HIV (HIV-1) SCREEN TEST
  // ==========================================================================

  // Screening test(s) used
  test_rapid: boolean;
  test_particle_agglutination: boolean;
  test_eia_cma_elfa: boolean;
  test_others: string;

  // Result — Nonreactive / Reactive
  result: string;
}

/** Section component props shared by all HIV section components. */
export interface HivSectionProps {
  data: HivReport;
  onChange: (data: HivReport) => void;
  disabled?: boolean;
}

/** Empty record used to initialize the form state. */
export const EMPTY_HIV_REPORT: HivReport = {
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
  civil_status: "",
  photo_url: "",

  // Report Header
  med_tech: "",
  hiv_proficiency_cert_no: "",
  pathologist: "",
  pathologist_license_no: "",
  examining_physician: "",
  physician_license_no: "",
  result_date: "",
  expire_date: "",

  // HIV Screen Test
  test_rapid: false,
  test_particle_agglutination: false,
  test_eia_cma_elfa: false,
  test_others: "",
  result: "",
};
