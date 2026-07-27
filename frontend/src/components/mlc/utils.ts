/**
 * Utility functions for MLC form data transformation.
 *
 * Handles flattening nested API responses into flat form models.
 * Generic utilities are re-exported from `@/lib/form-utils`.
 */

import { EMPTY_MLC, type MlcRecord } from "./types";
import {
  stripSystemFields as genericStrip,
  sanitizePayload as genericSanitize,
  createFieldUpdater as genericUpdater,
  coerceNulls,
} from "@/lib/form-utils";

// Re-export shared utilities
export { humanizeField } from "@/lib/form-utils";

/** System-managed fields excluded from MLC update payloads. */
const SYSTEM_FIELDS = ["id", "mlc_id", "created_date", "updated_date"] as const;

/**
 * Shape of the nested seafarer profile returned by the MLC API.
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
 */
export interface RawMlcResponse extends Partial<MlcRecord> {
  seafarer_profile?: NestedSeafarerProfile;
  seafarer_profile_id?: string;
}

/** Field defaults for null coercion (non-string fields). */
const FIELD_DEFAULTS: Record<string, unknown> = {
  visual_aids: [],
};

/**
 * Flatten the nested `seafarer_profile` from the API response into
 * top-level personal info fields expected by the form.
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { seafarer_profile: _, ...rest } = record;
  const coerced = coerceNulls(rest as Record<string, unknown>, FIELD_DEFAULTS);

  return { ...EMPTY_MLC, ...coerced, ...personalData } as MlcRecord;
}

/** Strip system-managed fields from an MLC record for API mutations. */
export function stripSystemFields(record: MlcRecord): Partial<MlcRecord> {
  return genericStrip(record, SYSTEM_FIELDS);
}

/** Sanitize payload before sending to the backend. */
export function sanitizePayload(record: Partial<MlcRecord>): Partial<MlcRecord> {
  return genericSanitize(record, { preserveArrayFields: ["visual_aids"] });
}

/** Create a field updater for MLC section components. */
export function createFieldUpdater(
  data: MlcRecord,
  onChange: (data: MlcRecord) => void
): (field: keyof MlcRecord, value: string | boolean | string[]) => void {
  return genericUpdater(data, onChange) as (field: keyof MlcRecord, value: string | boolean | string[]) => void;
}
