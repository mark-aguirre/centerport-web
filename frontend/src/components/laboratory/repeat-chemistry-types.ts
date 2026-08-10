/**
 * Data model for the Chemistry Repeat Test popup form.
 */

/** Chemistry Repeat Test record */
export interface ChemistryRepeatTest {
  id?: string;
  result_id?: string;
  created_date?: string;
  updated_date?: string;

  laboratory_report_id?: string;

  // Metadata
  result_date: string;
  laboratory_no: string;
  med_tech: string;
  med_tech_license_no: string;
  pathologist: string;
  pathologist_license_no: string;
  requested_by: string;
  remarks: string;

  // FBS
  fbs_result_si: string;
  fbs_result_conv: string;
  fbs_high: boolean;

  // BUN
  bun_result_si: string;
  bun_result_conv: string;
  bun_high: boolean;

  // Creatinine
  creatinine_result_si: string;
  creatinine_result_conv: string;
  creatinine_high: boolean;

  // Cholesterol
  cholesterol_result_si: string;
  cholesterol_result_conv: string;
  cholesterol_high: boolean;

  // Triglycerides
  triglycerides_result_si: string;
  triglycerides_result_conv: string;
  triglycerides_high: boolean;

  // Uric Acid
  uric_acid_result_si: string;
  uric_acid_result_conv: string;
  uric_acid_high: boolean;

  // SGOT
  sgot_result_si: string;
  sgot_result_conv: string;
  sgot_high: boolean;

  // SGPT
  sgpt_result_si: string;
  sgpt_result_conv: string;
  sgpt_high: boolean;

  // ALK. PHOS
  alk_phos_result_si: string;
  alk_phos_result_conv: string;
  alk_phos_high: boolean;

  // HbA1c
  hba1c_result: string;
  hba1c_high: boolean;

  // Serology/Immunology
  rpr: string;
  hbsag: string;
  widal_test: string;
  malarial_smear: string;
}

/** Empty record for form initialization. */
export const EMPTY_CHEMISTRY_REPEAT: ChemistryRepeatTest = {
  result_date: "",
  laboratory_no: "",
  med_tech: "",
  med_tech_license_no: "",
  pathologist: "",
  pathologist_license_no: "",
  requested_by: "",
  remarks: "",

  fbs_result_si: "",
  fbs_result_conv: "",
  fbs_high: false,

  bun_result_si: "",
  bun_result_conv: "",
  bun_high: false,

  creatinine_result_si: "",
  creatinine_result_conv: "",
  creatinine_high: false,

  cholesterol_result_si: "",
  cholesterol_result_conv: "",
  cholesterol_high: false,

  triglycerides_result_si: "",
  triglycerides_result_conv: "",
  triglycerides_high: false,

  uric_acid_result_si: "",
  uric_acid_result_conv: "",
  uric_acid_high: false,

  sgot_result_si: "",
  sgot_result_conv: "",
  sgot_high: false,

  sgpt_result_si: "",
  sgpt_result_conv: "",
  sgpt_high: false,

  alk_phos_result_si: "",
  alk_phos_result_conv: "",
  alk_phos_high: false,

  hba1c_result: "",
  hba1c_high: false,

  rpr: "",
  hbsag: "",
  widal_test: "",
  malarial_smear: "",
};

/** Summary record for the "Select Previous Exams" picker. */
export interface ChemistryRepeatTestSummary {
  id: string;
  result_id: string;
  result_date: string;
}
