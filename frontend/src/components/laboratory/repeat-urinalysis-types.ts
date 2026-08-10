/**
 * Data model for the Urinalysis Repeat Test popup form.
 */

/** Urinalysis Repeat Test record */
export interface UrinalysisRepeatTest {
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
}

/** Empty record for form initialization. */
export const EMPTY_URINALYSIS_REPEAT: UrinalysisRepeatTest = {
  result_date: "",
  laboratory_no: "",
  med_tech: "",
  med_tech_license_no: "",
  pathologist: "",
  pathologist_license_no: "",
  requested_by: "",
  remarks: "",

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
};

/** Summary record for the "Select Previous Exams" picker. */
export interface UrinalysisRepeatTestSummary {
  id: string;
  result_id: string;
  result_date: string;
}
