/**
 * Utility functions for Landbase PEME form data transformation.
 *
 * Handles flattening nested API responses, sanitizing payloads for
 * backend submission, and field-level formatting helpers.
 */

import { EMPTY_PEME, type LandbasePeme } from "./types";

/** System-managed fields excluded from PEME update payloads. */
const SYSTEM_FIELDS = ["id", "peme_id", "created_date", "updated_date"] as const;

/**
 * Shape of the nested seafarer profile returned by the PEME API.
 *
 * The backend embeds the linked SeafarerProfile as a nested object
 * within the PEME response. This interface types that nested shape
 * so we avoid `Record<string, unknown>` casts.
 */
interface NestedSeafarerProfile {
  id?: string;
  last_name?: string;
  first_name?: string;
  middle_name?: string;
  place_of_birth?: string;
  passport_no?: string;
  religion?: string;
  nationality?: string;
  gender?: string;
  marital_status?: string;
  address?: string;
  contact_no?: string;
  employer?: string;
  position?: string;
}

/**
 * Raw PEME record shape as returned by the API before flattening.
 *
 * The API returns personal info nested inside `seafarer_profile`.
 * This type represents that raw response shape.
 */
export interface RawPemeResponse extends Partial<LandbasePeme> {
  seafarer_profile?: NestedSeafarerProfile;
  seafarer_profile_id?: string;
}

/**
 * Flatten the nested `seafarer_profile` from the API response into
 * top-level personal info fields expected by the form.
 *
 * The backend stores personal info on the SeafarerProfile entity and
 * nests it in the PEME DTO response. This function merges those nested
 * fields onto the flat form model.
 *
 * @param record - Raw API response with optional nested profile
 * @returns Flat LandbasePeme with personal info at top level
 */
export function flattenProfileIntoRecord(record: RawPemeResponse): LandbasePeme {
  const profile = record.seafarer_profile;
  const personalData: Partial<LandbasePeme> = profile
    ? {
        seafarer_profile_id: profile.id ?? record.seafarer_profile_id,
        last_name: profile.last_name ?? "",
        first_name: profile.first_name ?? "",
        middle_name: profile.middle_name ?? "",
        place_of_birth: profile.place_of_birth ?? "",
        passport_no: profile.passport_no ?? "",
        religion: profile.religion ?? "",
        nationality: profile.nationality ?? "",
        gender: (profile.gender ?? "") as LandbasePeme["gender"],
        civil_status: (profile.marital_status ?? "") as LandbasePeme["civil_status"],
        address: profile.address ?? "",
        contact_no: profile.contact_no ?? "",
        employer: profile.employer ?? "",
        position: profile.position ?? "",
      }
    : {};

  // Omit the nested profile before spreading to avoid leftover keys
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { seafarer_profile: _, ...rest } = record;

  // Coerce null values to empty strings so form controls work correctly
  // Preserve objects (medical_history) and booleans (consulted_doctor) as-is
  const coerced: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (value === null || value === undefined) {
      coerced[key] = key === "consulted_doctor" ? false : key === "medical_history" ? {} : "";
    } else {
      coerced[key] = value;
    }
  }

  return { ...EMPTY_PEME, ...coerced, ...personalData } as LandbasePeme;
}

/**
 * Strip system-managed fields from a PEME record for API mutations.
 *
 * Removes `id`, `peme_id`, `created_date`, and `updated_date` which
 * are server-generated and must not be sent in create/update payloads.
 *
 * @param record - Full PEME record from form state
 * @returns Record without system fields
 */
export function stripSystemFields(record: LandbasePeme): Partial<LandbasePeme> {
  const entries = Object.entries(record).filter(
    ([key]) => !(SYSTEM_FIELDS as readonly string[]).includes(key)
  );
  return Object.fromEntries(entries) as Partial<LandbasePeme>;
}

/**
 * Sanitize payload before sending to the backend.
 *
 * Converts empty strings to null for enum-typed and optional fields
 * so the backend doesn't reject them during deserialization.
 *
 * @param record - Partial PEME record to sanitize
 * @returns Sanitized record with empty strings replaced by null
 */
export function sanitizePayload(record: Partial<LandbasePeme>): Partial<LandbasePeme> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    result[key] = value === "" ? null : value;
  }
  return result as Partial<LandbasePeme>;
}

/**
 * Create a field updater function for section components.
 *
 * Returns a callback that updates a single field on the LandbasePeme
 * record and calls the parent onChange with the new state. Eliminates
 * the repeated `(field, value) => onChange({ ...data, [field]: value })`
 * pattern across all section components.
 *
 * @param data - Current form data
 * @param onChange - Parent state setter
 * @returns Updater function accepting a field key and new value
 *
 * @example
 * ```tsx
 * const updateField = createFieldUpdater(data, onChange);
 * <input onChange={(e) => updateField("remarks", e.target.value)} />
 * ```
 */
export function createFieldUpdater(
  data: LandbasePeme,
  onChange: (data: LandbasePeme) => void
): (field: keyof LandbasePeme, value: string | boolean) => void {
  return (field, value) =>
    onChange({ ...data, [field]: value } as LandbasePeme);
}

/**
 * Convert a snake_case or camelCase field name to a human-readable label.
 *
 * Used for displaying validation error messages with friendly field names.
 *
 * @param field - Raw field name (e.g. "last_name", "seafarerProfileId")
 * @returns Human-friendly label (e.g. "Last Name", "Seafarer Profile Id")
 *
 * @example
 * ```ts
 * humanizeField("last_name")         // "Last Name"
 * humanizeField("seafarerProfileId") // "Seafarer Profile Id"
 * ```
 */
export function humanizeField(field: string): string {
  return field
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
