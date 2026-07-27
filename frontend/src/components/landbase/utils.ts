/**
 * Utility functions for Landbase PEME form data transformation.
 *
 * Handles flattening nested API responses into flat form models.
 * Generic utilities (stripSystemFields, sanitizePayload, createFieldUpdater,
 * humanizeField) are re-exported from `@/lib/form-utils`.
 */

import { EMPTY_PEME, type LandbasePeme } from "./types";
import {
  stripSystemFields as genericStrip,
  sanitizePayload as genericSanitize,
  createFieldUpdater as genericUpdater,
  coerceNulls,
} from "@/lib/form-utils";

// Re-export shared utilities with landbase-specific signatures
export { humanizeField } from "@/lib/form-utils";

/** System-managed fields excluded from PEME update payloads. */
const SYSTEM_FIELDS = ["id", "peme_id", "created_date", "updated_date"] as const;

/**
 * Shape of the nested seafarer profile returned by the PEME API.
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
 */
export interface RawPemeResponse extends Partial<LandbasePeme> {
  seafarer_profile?: NestedSeafarerProfile;
  seafarer_profile_id?: string;
}

/** Field defaults for null coercion (non-string fields). */
const FIELD_DEFAULTS: Record<string, unknown> = {
  consulted_doctor: false,
  medical_history: {},
};

/**
 * Flatten the nested `seafarer_profile` from the API response into
 * top-level personal info fields expected by the form.
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { seafarer_profile: _, ...rest } = record;
  const coerced = coerceNulls(rest as Record<string, unknown>, FIELD_DEFAULTS);

  return { ...EMPTY_PEME, ...coerced, ...personalData } as LandbasePeme;
}

/** Strip system-managed fields from a PEME record for API mutations. */
export function stripSystemFields(record: LandbasePeme): Partial<LandbasePeme> {
  return genericStrip(record, SYSTEM_FIELDS);
}

/** Sanitize payload before sending to the backend. */
export function sanitizePayload(record: Partial<LandbasePeme>): Partial<LandbasePeme> {
  return genericSanitize(record);
}

/** Create a field updater for landbase section components. */
export function createFieldUpdater(
  data: LandbasePeme,
  onChange: (data: LandbasePeme) => void
): (field: keyof LandbasePeme, value: string | boolean) => void {
  return genericUpdater(data, onChange) as (field: keyof LandbasePeme, value: string | boolean) => void;
}
