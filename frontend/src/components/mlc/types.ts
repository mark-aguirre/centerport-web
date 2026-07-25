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

  // Personal Information
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
}
