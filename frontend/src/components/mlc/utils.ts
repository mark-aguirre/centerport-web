/**
 * Utility functions for MLC form data transformation.
 *
 * Handles flattening nested API responses, sanitizing payloads for
 * backend submission, and field-level formatting helpers.
 */

import { EMPTY_MLC, type MlcRecord } from "./types";

/** System-managed fields excluded from MLC update payloads. */
const SYSTEM_FIELDS = ["id", "mlc_id", "created_date", "updated_date"] as const;

/**
 * Shape of the nested seafarer profile returned by the MLC API.
 *
 * The backend embeds the linked SeafarerProfile as a nested object
 * within the MLC response. This interface types that nested shape.
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
  birthdate?: string;
  age?: string;
}

/**
 * Raw MLC record shape as returned by the API before flattening.
 *
 * The API returns personal info nested inside `seafarer_profile`.
 * This type represents that raw response shape.
 */
export interface RawMlcResponse extends Partial<MlcRecord> {
  seafarer_profile?: NestedSeafarerProfile;
  seafarer_profile_id?: string;
}

/**
 * Flatten the nested `seafarer_profile` from the API response into
 * top-level personal info fields expected by the form.
 *
 * The backend stores personal info on the SeafarerProfile entity and
 * nests it in the MLC DTO response. This function merges those nested
 * fields onto the flat form model.
 *
 * @param record - Raw API response with optional nested profile
 * @returns Flat MlcRecord with personal info at top level
 */
export function flattenProfileIntoRecord(record: RawMlcResponse): MlcRecord {
  const profile = record.seafarer_profile;
  const personalData: Partial<MlcRecord> = profile
    ? {
        seafarer_profile_id: profile.id ?? record.seafarer_profile_id,
        last_name: profile.last_name ?? "",
        first_name: profile.first_name ?? "",
        middle_name: profile.middle_name ?? "",
        place_of_birth: profile.place_of_birth ?? "",
        passport_no: profile.passport_no ?? "",
        religion: profile.religion ?? "",
        nationality: profile.nationality ?? "",
        gender: (profile.gender ?? "") as MlcRecord["gender"],
        civil_status: (profile.marital_status ?? "") as MlcRecord["civil_status"],
        address: profile.address ?? "",
        contact_no: profile.contact_no ?? "",
        employer: profile.employer ?? "",
        position: profile.position ?? "",
        date_of_birth: profile.birthdate ?? record.date_of_birth ?? "",
        age: profile.age ?? record.age ?? "",
      }
    : {};

  // Omit the nested profile before spreading to avoid leftover keys
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { seafarer_profile: _, ...rest } = record;

  // Coerce null values to empty strings so form controls work correctly
  // Preserve arrays (visual_aids) as-is
  const coerced: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (value === null || value === undefined) {
      coerced[key] = key === "visual_aids" ? [] : "";
    } else {
      coerced[key] = value;
    }
  }

  return { ...EMPTY_MLC, ...coerced, ...personalData } as MlcRecord;
}

/**
 * Strip system-managed fields from an MLC record for API mutations.
 *
 * Removes `id`, `mlc_id`, `created_date`, and `updated_date` which
 * are server-generated and must not be sent in create/update payloads.
 *
 * @param record - Full MLC record from form state
 * @returns Record without system fields
 */
export function stripSystemFields(record: MlcRecord): Partial<MlcRecord> {
  const entries = Object.entries(record).filter(
    ([key]) => !(SYSTEM_FIELDS as readonly string[]).includes(key)
  );
  return Object.fromEntries(entries) as Partial<MlcRecord>;
}

/**
 * Sanitize payload before sending to the backend.
 *
 * Converts empty strings to null for enum-typed and optional fields
 * so the backend doesn't reject them during deserialization.
 * Preserves arrays (visual_aids) even if empty.
 *
 * @param record - Partial MLC record to sanitize
 * @returns Sanitized record with empty strings replaced by null
 */
export function sanitizePayload(record: Partial<MlcRecord>): Partial<MlcRecord> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (Array.isArray(value)) {
      result[key] = value;
    } else {
      result[key] = value === "" ? null : value;
    }
  }
  return result as Partial<MlcRecord>;
}

/**
 * Create a field updater function for section components.
 *
 * Returns a callback that updates a single field on the MlcRecord
 * and calls the parent onChange with the new state.
 *
 * @param data - Current form data
 * @param onChange - Parent state setter
 * @returns Updater function accepting a field key and new value
 */
export function createFieldUpdater(
  data: MlcRecord,
  onChange: (data: MlcRecord) => void
): (field: keyof MlcRecord, value: string | boolean | string[]) => void {
  return (field, value) =>
    onChange({ ...data, [field]: value } as MlcRecord);
}
