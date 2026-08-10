/**
 * Data model for the Laboratory Report form.
 *
 * Covers patient information header, hematology (CBC + differential count),
 * clinical chemistry and serology/immunology, urinalysis (macroscopic,
 * chemical, microscopic, crystals, cast), and fecalysis.
 */

/** Full Laboratory Report record */
export interface LaboratoryReport {
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

  // Report Header
  result_date: string;
  med_tech: string;
  med_tech_license_no: string;
  pathologist: string;
  pathologist_license_no: string;
  laboratory_no: string;

  // ==========================================================================
  // HEMATOLOGY
  // ==========================================================================
  hematology_result_date: string;

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

  // ==========================================================================
  // CLINICAL CHEMISTRY AND SEROLOGY/IMMUNOLOGY
  // ==========================================================================
  chemistry_result_date: string;

  // FBS
  fbs_si: string;
  fbs_si_normal: string;
  fbs_conv: string;
  fbs_result_si: string;
  fbs_result_conv: string;
  fbs_high: boolean;

  // BUN
  bun_si: string;
  bun_si_normal: string;
  bun_conv: string;
  bun_result_si: string;
  bun_result_conv: string;
  bun_high: boolean;

  // Creatinine
  creatinine_si: string;
  creatinine_si_normal: string;
  creatinine_conv: string;
  creatinine_result_si: string;
  creatinine_result_conv: string;
  creatinine_high: boolean;

  // Cholesterol
  cholesterol_si: string;
  cholesterol_si_normal: string;
  cholesterol_conv: string;
  cholesterol_result_si: string;
  cholesterol_result_conv: string;
  cholesterol_high: boolean;

  // Triglycerides
  triglycerides_si: string;
  triglycerides_si_normal: string;
  triglycerides_conv: string;
  triglycerides_result_si: string;
  triglycerides_result_conv: string;
  triglycerides_high: boolean;

  // Uric Acid
  uric_acid_si: string;
  uric_acid_si_normal: string;
  uric_acid_conv: string;
  uric_acid_result_si: string;
  uric_acid_result_conv: string;
  uric_acid_high: boolean;

  // SGOT
  sgot_si: string;
  sgot_result_si: string;
  sgot_result_conv: string;
  sgot_high: boolean;

  // SGPT
  sgpt_si: string;
  sgpt_result_si: string;
  sgpt_result_conv: string;
  sgpt_high: boolean;

  // ALK. PHOS
  alk_phos_si: string;
  alk_phos_result_si: string;
  alk_phos_result_conv: string;
  alk_phos_high: boolean;

  // HbA1c
  hba1c_normal: string;
  hba1c_result: string;
  hba1c_high: boolean;

  // ==========================================================================
  // URINALYSIS
  // ==========================================================================
  urinalysis_result_date: string;

  // Macroscopic
  urine_color: string;
  urine_transparency: string;

  // Chemical
  urine_leucocytes: string;
  urine_nitrite: string;
  urine_urobilinogen: string;
  urine_protein: string;
  urine_ph: string;
  urine_blood: string;
  urine_specific_gravity: string;
  urine_ketone: string;
  urine_bilirubin: string;
  urine_glucose: string;
  urine_others: string;

  // Microscopic
  urine_rbc: string;
  urine_wbc: string;
  urine_amorphous_urates: string;
  urine_amorphous_phosphate: string;
  urine_epithelial_cells: string;
  urine_mucus_threads: string;
  urine_microscopic_others: string;

  // Crystals
  urine_uric_acid: string;
  urine_calcium_oxalate: string;
  urine_crystals_others: string;

  // Cast
  urine_fine_granular: string;
  urine_coarse_granular: string;
  urine_cast_others: string;

  // ==========================================================================
  // FECALYSIS
  // ==========================================================================
  fecalysis_result_date: string;

  fecal_color: string;
  fecal_consistency: string;

  fecal_rbc: string;
  fecal_rbc_hpf: string;
  fecal_wbc: string;
  fecal_wbc_hpf: string;
  fecal_others: string;

  fecal_ova_parasite: string;
  fecal_ova_parasite_lpf: string;
  fecal_amoeba: string;
  fecal_amoeba_lpf: string;
  fecal_occult_blood: string;
}

/** Section component props shared by all laboratory section components. */
export interface LaboratorySectionProps {
  data: LaboratoryReport;
  onChange: (data: LaboratoryReport) => void;
  disabled?: boolean;
}

/** Empty record used to initialize the form state. */
export const EMPTY_REPORT: LaboratoryReport = {
  // Personal Information
  last_name: "",
  first_name: "",
  middle_name: "",
  birthdate: "",
  age: "",
  gender: "",
  employer: "",
  position: "",

  // Report Header
  result_date: "",
  med_tech: "",
  med_tech_license_no: "",
  pathologist: "",
  pathologist_license_no: "",
  laboratory_no: "",

  // Hematology
  hematology_result_date: "",
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

  // Clinical Chemistry
  chemistry_result_date: "",
  fbs_si: "",
  fbs_si_normal: "",
  fbs_conv: "",
  fbs_result_si: "",
  fbs_result_conv: "",
  fbs_high: false,
  bun_si: "",
  bun_si_normal: "",
  bun_conv: "",
  bun_result_si: "",
  bun_result_conv: "",
  bun_high: false,
  creatinine_si: "",
  creatinine_si_normal: "",
  creatinine_conv: "",
  creatinine_result_si: "",
  creatinine_result_conv: "",
  creatinine_high: false,
  cholesterol_si: "",
  cholesterol_si_normal: "",
  cholesterol_conv: "",
  cholesterol_result_si: "",
  cholesterol_result_conv: "",
  cholesterol_high: false,
  triglycerides_si: "",
  triglycerides_si_normal: "",
  triglycerides_conv: "",
  triglycerides_result_si: "",
  triglycerides_result_conv: "",
  triglycerides_high: false,
  uric_acid_si: "",
  uric_acid_si_normal: "",
  uric_acid_conv: "",
  uric_acid_result_si: "",
  uric_acid_result_conv: "",
  uric_acid_high: false,
  sgot_si: "",
  sgot_result_si: "",
  sgot_result_conv: "",
  sgot_high: false,
  sgpt_si: "",
  sgpt_result_si: "",
  sgpt_result_conv: "",
  sgpt_high: false,
  alk_phos_si: "",
  alk_phos_result_si: "",
  alk_phos_result_conv: "",
  alk_phos_high: false,
  hba1c_normal: "",
  hba1c_result: "",
  hba1c_high: false,

  // Urinalysis
  urinalysis_result_date: "",
  urine_color: "",
  urine_transparency: "",
  urine_leucocytes: "",
  urine_nitrite: "",
  urine_urobilinogen: "",
  urine_protein: "",
  urine_ph: "",
  urine_blood: "",
  urine_specific_gravity: "",
  urine_ketone: "",
  urine_bilirubin: "",
  urine_glucose: "",
  urine_others: "",
  urine_rbc: "",
  urine_wbc: "",
  urine_amorphous_urates: "",
  urine_amorphous_phosphate: "",
  urine_epithelial_cells: "",
  urine_mucus_threads: "",
  urine_microscopic_others: "",
  urine_uric_acid: "",
  urine_calcium_oxalate: "",
  urine_crystals_others: "",
  urine_fine_granular: "",
  urine_coarse_granular: "",
  urine_cast_others: "",

  // Fecalysis
  fecalysis_result_date: "",
  fecal_color: "",
  fecal_consistency: "",
  fecal_rbc: "",
  fecal_rbc_hpf: "",
  fecal_wbc: "",
  fecal_wbc_hpf: "",
  fecal_others: "",
  fecal_ova_parasite: "",
  fecal_ova_parasite_lpf: "",
  fecal_amoeba: "",
  fecal_amoeba_lpf: "",
  fecal_occult_blood: "",
};
