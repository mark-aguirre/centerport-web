/**
 * Utility functions for Panama certificate form data transformation.
 *
 * Handles flattening nested API responses into flat form models.
 * Generic utilities are re-exported from `@/lib/form-utils`.
 */

import { EMPTY_CERTIFICATE, type PanamaCertificate } from "./types";
import {
  stripSystemFields as genericStrip,
  sanitizePayload as genericSanitize,
  createFieldUpdater as genericUpdater,
  coerceNulls,
} from "@/lib/form-utils";

// Re-export shared utilities
export { humanizeField } from "@/lib/form-utils";

/** System-managed fields excluded from Panama certificate update payloads. */
const SYSTEM_FIELDS = ["id", "panama_id", "created_date", "updated_date"] as const;

/**
 * Shape of the nested seafarer profile returned by the Panama API.
 */
interface NestedSeafarerProfile {
  id?: string;
  last_name?: string;
  first_name?: string;
  middle_name?: string;
  place_of_birth?: string;
  passport_no?: string;
  seamans_book_no?: string;
  religion?: string;
  nationality?: string;
  gender?: string;
  marital_status?: string;
  address?: string;
  contact_no?: string;
  employer?: string;
  position?: string;
  birthdate?: string;
}

/**
 * Raw Panama certificate shape as returned by the API before flattening.
 */
export interface RawPanamaResponse extends Partial<PanamaCertificate> {
  seafarer_profile?: NestedSeafarerProfile;
  seafarer_profile_id?: string;
}

/** Boolean fields that default to false when null. */
const BOOLEAN_FIELDS = new Set([
  "fitness_deck_fit", "fitness_deck_unfit",
  "fitness_engine_fit", "fitness_engine_unfit",
  "fitness_catering_fit", "fitness_catering_unfit",
  "fitness_other_fit", "fitness_other_unfit",
]);

/** Object fields that default to {} when null. */
const OBJECT_FIELDS = new Set([
  "conditions", "physical_exploration", "lab_tests", "lab_other_tests",
]);

/**
 * Flatten the nested `seafarer_profile` from the API response into
 * top-level personal info fields expected by the form.
 *
 * @param record - Raw API response with optional nested profile
 * @returns Flat PanamaCertificate with personal info at top level
 */
export function flattenProfileIntoRecord(record: RawPanamaResponse): PanamaCertificate {
  const profile = record.seafarer_profile;
  const personalData: Partial<PanamaCertificate> = profile
    ? {
        seafarer_profile_id: profile.id ?? record.seafarer_profile_id,
        full_name: [profile.last_name, profile.first_name, profile.middle_name]
          .filter(Boolean)
          .join(", ") || "",
        sex: (profile.gender === "Male" ? "Male" : profile.gender === "Female" ? "Female" : "") as PanamaCertificate["sex"],
        passport_seaman_no: profile.passport_no ?? profile.seamans_book_no ?? "",
        home_address: profile.address ?? "",
        crew_position: profile.position ?? "",
        ...parseBirthdate(profile.birthdate),
      }
    : {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { seafarer_profile: _, ...rest } = record;

  // Build field defaults from the boolean/object field sets
  const fieldDefaults: Record<string, unknown> = {};
  for (const key of Object.keys(rest)) {
    if (BOOLEAN_FIELDS.has(key)) fieldDefaults[key] = false;
    else if (OBJECT_FIELDS.has(key)) fieldDefaults[key] = {};
  }

  const coerced = coerceNulls(rest as Record<string, unknown>, fieldDefaults);

  return { ...EMPTY_CERTIFICATE, ...coerced, ...personalData } as PanamaCertificate;
}

/** Strip system-managed fields from a Panama certificate for API mutations. */
export function stripSystemFields(record: PanamaCertificate): Partial<PanamaCertificate> {
  return genericStrip(record, SYSTEM_FIELDS);
}

/** Sanitize payload before sending to the backend. */
export function sanitizePayload(record: Partial<PanamaCertificate>): Partial<PanamaCertificate> {
  return genericSanitize(record);
}

/** Create a field updater for Panama section components. */
export function createFieldUpdater(
  data: PanamaCertificate,
  onChange: (data: PanamaCertificate) => void
): (field: keyof PanamaCertificate, value: string | boolean) => void {
  return genericUpdater(data, onChange) as (field: keyof PanamaCertificate, value: string | boolean) => void;
}

/**
 * Parse a birthdate string into day/month/year components.
 * Returns empty strings if the date is invalid or not provided.
 */
function parseBirthdate(birthdate?: string): { day: string; month: string; year: string } {
  if (!birthdate) return { day: "", month: "", year: "" };
  const d = new Date(birthdate);
  if (isNaN(d.getTime())) return { day: "", month: "", year: "" };
  return {
    day: String(d.getDate()),
    month: String(d.getMonth() + 1),
    year: String(d.getFullYear()),
  };
}
