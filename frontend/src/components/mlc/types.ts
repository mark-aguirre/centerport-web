/**
 * Data model for the MLC (Maritime Labour Convention) Health Certificate form.
 *
 * Covers seafarer personal information, vessel details, medical fitness
 * assessment, and certificate issuance data per MLC 2006 requirements.
 */

/** Gender options */
export type Gender = "Male" | "Female" | "";

/** Civil status options */
export type CivilStatus = "Single" | "Married" | "Widowed" | "Separated" | "";

/** Yes/No answer for declaration conditions */
export type YesNo = "yes" | "no" | "";

/** Visual aid type (multiple can be selected) */
export type VisualAid = "spectacles" | "contact_lenses" | "none";

/** MLC fitness determination */
export type FitnessDetermination =
  | "Fit for Sea Duty"
  | "Fit with Restrictions"
  | "Temporarily Unfit"
  | "Unfit for Sea Service"
  | "";

/** Certificate type per MLC standards */
export type CertificateType =
  | "ILO/MLC"
  | "STCW"
  | "Flag State"
  | "";

/** Full MLC Health Certificate record */
export interface MlcRecord {
  id?: string;
  mlc_id?: string;
  created_date?: string;
  updated_date?: string;

  // Seafarer Profile link (required on create)
  seafarer_profile_id?: string;

  // Personal Information (from linked profile)
  last_name: string;
  first_name: string;
  middle_name: string;
  place_of_birth: string;
  passport_no: string;
  religion: string;
  nationality: string;
  gender: Gender;
  civil_status: CivilStatus;
  address: string;
  contact_no: string;
  employer: string;
  position: string;

  // Additional Seafarer Details
  date_of_birth: string;
  age: string;
  sirb_no: string;
  rank: string;
  vessel_name: string;
  vessel_type: string;
  shipping_company: string;
  manning_agency: string;

  // Certificate Details
  certificate_type: CertificateType;
  fitness_determination: FitnessDetermination;
  date_of_examination: string;
  date_issued: string;
  valid_until: string;
  issuing_authority: string;
  examining_physician: string;
  medical_director: string;
  limitations_remarks: string;

  // Declaration of the Authorized Physician
  id_documents_checked: YesNo;
  hearing_meets_standards: YesNo;
  unaided_hearing_satisfactory: YesNo;
  visual_acuity_meets_standards: YesNo;
  colour_vision_meets_standards: YesNo;
  visual_aids: VisualAid[];
  date_colour_vision_test: string;
  fit_for_lookout: YesNo;
  no_limitations: YesNo;
  limitations_details: string;
  applicant_condition_risk: YesNo;

  // Final Recommendation
  date_initial_peme: string;
  date_of_fitness: string;
  valid_until_date: string;
  medical_certification_no: string;
}

/**
 * Shared props interface for all MLC form section components.
 */
export interface MlcSectionProps {
  /** Current MLC form data */
  data: MlcRecord;
  /** Callback to update the form state with modified data */
  onChange: (data: MlcRecord) => void;
  /** When true, all fields in this section are read-only (view mode) */
  disabled?: boolean;
}

/**
 * Default empty MLC record used for form initialization and reset.
 *
 * All string fields default to empty string, arrays to empty.
 * Used by `useMlcForm` for new records and cancel-to-empty flows.
 */
export const EMPTY_MLC: MlcRecord = {
  seafarer_profile_id: undefined,

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
