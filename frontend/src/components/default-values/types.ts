/**
 * Default Values feature types.
 *
 * A "default values" record is a named set of laboratory (hematology)
 * reference / "normal value" strings used to pre-fill a Laboratory Report
 * (Hematology). It is configuration data maintained by Laboratory staff, not
 * per-patient data — there is no seafarer profile link. Range values such as
 * `"11-17"` or `"150,000-450,000"` are stored verbatim as free text.
 *
 * These types are the source of truth for the Default Values page and are
 * imported into `lib/api.ts` for endpoint typing. Field names are snake_case
 * to match the backend JSON contract (`/api/default-values`,
 * {@code DefaultValuesDto}).
 */

/** A named set of hematology default/reference values. */
export interface DefaultValues {
  /** Server-generated UUID (absent for a new, unsaved record). */
  id?: string;

  /** Human-readable label for this set (required). */
  name: string;

  // --- Left column — primary hematology values (each with its own unit) ---
  hemoglobin: string;
  hematocrit: string;
  rbc_count: string;
  wbc_count: string;
  platelet: string;
  blood_type: string;
  esr_male: string;
  esr_female: string;

  // --- Middle column — differential count (percentages) ---
  lymphocytes: string;
  segmenters: string;
  eosinophils: string;
  monocytes: string;
  myelocytes: string;
  juveniles: string;

  // --- Right column — additional differential (percentages) ---
  stab_cells: string;
  basophils: string;
  others: string;

  /** Audit fields (output-only). */
  created_date?: string;
  updated_date?: string;
}

/**
 * Empty default state for a new record. The reference-value fields are
 * seeded with the standard normal values from the Laboratory Report
 * (Hematology) form so a newly added set starts from sensible defaults.
 */
export const EMPTY_DEFAULT_VALUES: DefaultValues = {
  // This is a single-record settings form with no visible name field. The
  // backend requires a non-blank name (@NotBlank), so seed a stable default
  // instead of an empty string to avoid a 400 on the initial create.
  name: "Default",

  // Left column
  hemoglobin: "11-17",
  hematocrit: "11-17",
  rbc_count: "4.0-6.2",
  wbc_count: "4,000-12,000",
  platelet: "150,000-450,000",
  blood_type: "",
  esr_male: "0-9",
  esr_female: "0-20",

  // Middle column (differential %)
  lymphocytes: "25-50",
  segmenters: "50-80",
  eosinophils: "1-4",
  monocytes: "2-10",
  myelocytes: "",
  juveniles: "",

  // Right column (differential %)
  stab_cells: "0-7",
  basophils: "0-1",
  others: "",
};
