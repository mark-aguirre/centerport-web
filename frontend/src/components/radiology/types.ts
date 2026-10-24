/**
 * Shared data contract for the radiology result forms (Ultrasound, X-Ray).
 *
 * Both forms open with the same patient header and the same signatory block
 * (result date, x-ray technologist, radiologist, and their license numbers).
 * Modelling that overlap here lets a single patient-information section serve
 * both modules instead of duplicating the layout per module.
 */

/** The patient + signatory fields every radiology result record carries. */
export interface RadiologyRecord {
  // Personal Information (mirrored from the linked SeafarerProfile)
  last_name: string;
  first_name: string;
  middle_name: string;
  birthdate: string;
  age: string;
  gender: string;
  employer: string;
  position: string;

  // Report Header
  result_date: string;
  xray_tech: string;
  xray_tech_license_no: string;
  radiologist: string;
  radiologist_license_no: string;
}

/** Props shared by every radiology section component. */
export interface RadiologySectionProps<T> {
  data: T;
  onChange: (data: T) => void;
  disabled?: boolean;
}
