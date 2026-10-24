/**
 * Data model for the Ultrasound Result form.
 *
 * Covers the patient information header, report metadata (result date, x-ray
 * technologist and radiologist with their license numbers), and the ultrasound
 * result itself: the examination performed, the ultrasound reference number,
 * the radiology findings narrative, and the radiologist's impression.
 *
 * Field names are snake_case to match the backend JSON contract
 * (`/api/ultrasound-reports`, {@code UltrasoundReportDto}).
 */

/** Full Ultrasound Result record. */
export interface UltrasoundReport {
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
  // ULTRASOUND RESULT
  // ==========================================================================

  /** The ultrasound examination performed (e.g. "Whole Abdomen"). */
  examination: string;
  /** Ultrasound reference number assigned by the radiology section. */
  ultrasound_no: string;
  /** Free-text radiology findings narrative. */
  radiology_findings: string;
  /** Free-text radiologist's impression. */
  impression: string;
}

/** Section component props shared by all Ultrasound section components. */
export interface UltrasoundSectionProps {
  data: UltrasoundReport;
  onChange: (data: UltrasoundReport) => void;
  disabled?: boolean;
}

/** Empty record used to initialize the form state. */
export const EMPTY_ULTRASOUND_REPORT: UltrasoundReport = {
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

  // Ultrasound Result
  examination: "",
  ultrasound_no: "",
  radiology_findings: "",
  impression: "",
};
