/**
 * Tumor / Immunological feature types.
 *
 * A "tumor/immunology" record is a named set of "FORM LAB 33" reference values
 * (Tumor Marker + Immunological Test) used to pre-fill the tumor/immunology
 * report form. Configuration data maintained by Laboratory staff, not
 * per-patient data — there is no seafarer profile link. All values are stored
 * verbatim as free text (S.I. Unit).
 *
 * Field names are snake_case to match the backend JSON contract
 * (`/api/tumor-immunology`, {@code TumorImmunologyDto}).
 */

/** A named set of tumor/immunological default/reference values. */
export interface TumorImmunology {
  /** Server-generated UUID (absent for a new, unsaved record). */
  id?: string;

  /** Human-readable label for this set (required). */
  name: string;

  // --- Tumor Marker (unit: ML) ---
  psa: string;
  afp: string;
  tumor_others: string;

  // --- Immunological Test ---
  anti_hbs: string;
  anti_hbc_total: string;
  anti_hcv: string;
  hbsag: string;
  immuno_extra: string;
  immuno_others: string;

  /** Audit fields (output-only). */
  created_date?: string;
  updated_date?: string;
}

/** Empty default state for a new record. */
export const EMPTY_TUMOR_IMMUNOLOGY: TumorImmunology = {
  // This is a single-record settings form with no visible name field. The
  // backend requires a non-blank name (@NotBlank), so seed a stable default
  // instead of an empty string to avoid a 400 on the initial create.
  name: "Default",

  psa: "",
  afp: "",
  tumor_others: "",

  anti_hbs: "",
  anti_hbc_total: "",
  anti_hcv: "",
  hbsag: "",
  immuno_extra: "",
  immuno_others: "",
};
