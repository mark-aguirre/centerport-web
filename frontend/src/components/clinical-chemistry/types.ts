/**
 * Clinical Chemistry feature types.
 *
 * A "clinical chemistry" record is a named set of Clinical Chemistry &
 * Serology/Immunology reference / "normal value" strings used to pre-fill a
 * Clinical Chemistry report. It is configuration data maintained by Laboratory
 * staff, not per-patient data — there is no seafarer profile link.
 *
 * Each examination carries two reference ranges: an S.I. Unit value and a
 * Conventional Unit value, both stored verbatim as free text (e.g. "3.8 - 5.8"
 * / "70 - 105").
 *
 * Field names are snake_case to match the backend JSON contract
 * (`/api/clinical-chemistry`, {@code ClinicalChemistryDto}).
 */

/** A named set of clinical-chemistry default/reference values. */
export interface ClinicalChemistry {
  /** Server-generated UUID (absent for a new, unsaved record). */
  id?: string;

  /** Human-readable label for this set (required). */
  name: string;

  fbs_si: string;
  fbs_conv: string;

  bun_si: string;
  bun_conv: string;

  creatinine_si: string;
  creatinine_conv: string;

  cholesterol_si: string;
  cholesterol_conv: string;

  triglycerides_si: string;
  triglycerides_conv: string;

  uric_acid_si: string;
  uric_acid_conv: string;

  sgot_si: string;
  sgot_conv: string;

  sgpt_si: string;
  sgpt_conv: string;

  alk_phos_si: string;
  alk_phos_conv: string;

  /** Audit fields (output-only). */
  created_date?: string;
  updated_date?: string;
}

/**
 * Empty default state for a new record. Seeded with the standard reference
 * ranges from the Clinical Chemistry & Serology/Immunology form so a newly
 * added set starts from sensible defaults.
 */
export const EMPTY_CLINICAL_CHEMISTRY: ClinicalChemistry = {
  // This is a single-record settings form with no visible name field. The
  // backend requires a non-blank name (@NotBlank), so seed a stable default
  // instead of an empty string to avoid a 400 on the initial create.
  name: "Default",

  fbs_si: "3.9 - 5.8",
  fbs_conv: "70 - 105",

  bun_si: "2.1 - 7.1",
  bun_conv: "6.0 - 20.0",

  creatinine_si: "80 - 115",
  creatinine_conv: "0.9 - 1.3",

  cholesterol_si: "<5.2",
  cholesterol_conv: "<200",

  triglycerides_si: "<1.70",
  triglycerides_conv: "<150",

  uric_acid_si: "0.21 - 0.43",
  uric_acid_conv: "3.4 - 7.2",

  sgot_si: "0 - 40",
  sgot_conv: "",

  sgpt_si: "0 - 40",
  sgpt_conv: "",

  alk_phos_si: "45 - 135",
  alk_phos_conv: "",
};
