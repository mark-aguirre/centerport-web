/**
 * Data model for the Fecalysis Repeat Test popup form.
 */

/** Fecalysis Repeat Test record */
export interface FecalysisRepeatTest {
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

  // Macroscopic
  fecal_color: string;
  fecal_consistency: string;

  // Microscopic
  fecal_rbc: string;
  fecal_rbc_hpf: string;
  fecal_wbc: string;
  fecal_wbc_hpf: string;
  fecal_others: string;

  // Ova/Parasite & Amoeba
  fecal_ova_parasite: string;
  fecal_ova_parasite_lpf: string;
  fecal_amoeba: string;
  fecal_amoeba_lpf: string;

  // Occult Blood
  fecal_occult_blood: string;
}

/** Empty record for form initialization. */
export const EMPTY_FECALYSIS_REPEAT: FecalysisRepeatTest = {
  result_date: "",
  laboratory_no: "",
  med_tech: "",
  med_tech_license_no: "",
  pathologist: "",
  pathologist_license_no: "",
  requested_by: "",
  remarks: "",

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

/** Summary record for the "Select Previous Exams" picker. */
export interface FecalysisRepeatTestSummary {
  id: string;
  result_id: string;
  result_date: string;
}
