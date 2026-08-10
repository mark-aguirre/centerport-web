/**
 * Data model for the Hematology Repeat Test popup form.
 */

/** Hematology Repeat Test record */
export interface HematologyRepeatTest {
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

  // Hematology CBC
  hemoglobin: string;
  hemoglobin_normal_min: string;
  hemoglobin_normal_max: string;

  hematocrit: string;
  hematocrit_normal_min: string;
  hematocrit_normal_max: string;

  rbc_count: string;
  rbc_count_normal_min: string;
  rbc_count_normal_max: string;

  wbc_count: string;
  wbc_count_normal_min: string;
  wbc_count_normal_max: string;

  platelet: string;
  platelet_normal_min: string;
  platelet_normal_max: string;

  blood_type: string;

  esr: string;
  esr_normal_male: string;
  esr_normal_female: string;

  // Differential Count
  lymphocytes: string;
  lymphocytes_normal_min: string;
  lymphocytes_normal_max: string;

  segmenters: string;
  eosinophils: string;
  monocytes: string;
  myelocytes: string;
  juveniles: string;

  stab_cells: string;
  stab_cells_normal_min: string;
  stab_cells_normal_max: string;

  basophils: string;
  others_diff: string;
}

/** Empty record for form initialization. */
export const EMPTY_HEMATOLOGY_REPEAT: HematologyRepeatTest = {
  result_date: "",
  laboratory_no: "",
  med_tech: "",
  med_tech_license_no: "",
  pathologist: "",
  pathologist_license_no: "",
  requested_by: "",
  remarks: "",

  hemoglobin: "",
  hemoglobin_normal_min: "",
  hemoglobin_normal_max: "",
  hematocrit: "",
  hematocrit_normal_min: "",
  hematocrit_normal_max: "",
  rbc_count: "",
  rbc_count_normal_min: "",
  rbc_count_normal_max: "",
  wbc_count: "",
  wbc_count_normal_min: "",
  wbc_count_normal_max: "",
  platelet: "",
  platelet_normal_min: "",
  platelet_normal_max: "",
  blood_type: "",
  esr: "",
  esr_normal_male: "",
  esr_normal_female: "",

  lymphocytes: "",
  lymphocytes_normal_min: "",
  lymphocytes_normal_max: "",
  segmenters: "",
  eosinophils: "",
  monocytes: "",
  myelocytes: "",
  juveniles: "",
  stab_cells: "",
  stab_cells_normal_min: "",
  stab_cells_normal_max: "",
  basophils: "",
  others_diff: "",
};

/** Summary record for the "Select Previous Exams" grid. */
export interface RepeatTestSummary {
  id: string;
  result_id: string;
  result_date: string;
}
