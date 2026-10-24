/**
 * Data model for the X-Ray Result form.
 *
 * Covers the patient information header, report metadata (result date, x-ray
 * technologist and radiologist with their license numbers), and the x-ray
 * result itself: the x-ray reference number, the radiology findings narrative,
 * and the radiologist's impression.
 *
 * Field names are snake_case to match the backend JSON contract
 * (`/api/xray-reports`, {@code XrayReportDto}).
 */

/** Full X-Ray Result record. */
export interface XrayReport {
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
  result_date: string;
  xray_tech: string;
  xray_tech_license_no: string;
  radiologist: string;
  radiologist_license_no: string;

  // ==========================================================================
  // X-RAY RESULT
  // ==========================================================================

  /** X-Ray reference number assigned by the radiology section. */
  xray_no: string;
  /** Free-text radiology findings narrative. */
  radiology_findings: string;
  /** Free-text radiologist's impression. */
  impression: string;
}

/** Section component props shared by all X-Ray section components. */
export interface XraySectionProps {
  data: XrayReport;
  onChange: (data: XrayReport) => void;
  disabled?: boolean;
}

/** Empty record used to initialize the form state. */
export const EMPTY_XRAY_REPORT: XrayReport = {
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
  result_date: "",
  xray_tech: "",
  xray_tech_license_no: "",
  radiologist: "",
  radiologist_license_no: "",

  // X-Ray Result
  xray_no: "",
  radiology_findings: "",
  impression: "",
};
