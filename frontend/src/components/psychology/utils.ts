/**
 * Utility functions for Psychology form data transformation.
 *
 * Handles flattening nested API responses into flat form models.
 * Generic utilities are re-exported from `@/lib/form-utils`.
 */

import { EMPTY_PSYCHOLOGY_RECORD, type PsychologyRecord } from "./types";
import {
  stripSystemFields as genericStrip,
  sanitizePayload as genericSanitize,
  createFieldUpdater as genericUpdater,
  coerceNulls,
} from "@/lib/form-utils";

export { humanizeField } from "@/lib/form-utils";

/** System-managed fields excluded from update payloads. */
const SYSTEM_FIELDS = ["id", "eval_id", "created_date", "updated_date"] as const;

/**
 * Shape of the nested seafarer profile returned by the API.
 */
interface NestedSeafarerProfile {
  id?: string;
  last_name?: string;
  first_name?: string;
  middle_name?: string;
  birthdate?: string;
  age?: string;
  gender?: string;
  employer?: string;
  position?: string;
}

/**
 * Raw record shape as returned by the API before flattening.
 */
export interface RawPsychologyResponse extends Partial<PsychologyRecord> {
  seafarer_profile?: NestedSeafarerProfile;
  seafarer_profile_id?: string;
}

/** Field defaults for null coercion (non-string fields). */
const FIELD_DEFAULTS: Record<string, unknown> = {
  intelligence_test_used: false,
  personal_test_used: false,
  others_test_used: false,
};

/**
 * Flatten the nested `seafarer_profile` from the API response into
 * top-level personal info fields expected by the form.
 */
export function flattenProfileIntoRecord(record: RawPsychologyResponse): PsychologyRecord {
  const profile = record.seafarer_profile;
  const personalData: Partial<PsychologyRecord> = profile
    ? {
        seafarer_profile_id: profile.id ?? record.seafarer_profile_id,
        last_name: profile.last_name ?? "",
        first_name: profile.first_name ?? "",
        middle_name: profile.middle_name ?? "",
        date_of_birth: profile.birthdate ?? "",
        age: profile.age ?? "",
        gender: (profile.gender ?? "") as PsychologyRecord["gender"],
        employer: profile.employer ?? "",
        position: profile.position ?? "",
      }
    : {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { seafarer_profile: _, ...rest } = record;
  const coerced = coerceNulls(rest as Record<string, unknown>, FIELD_DEFAULTS);

  return { ...EMPTY_PSYCHOLOGY_RECORD, ...coerced, ...personalData } as PsychologyRecord;
}

/** Strip system-managed fields from a record for API mutations. */
export function stripSystemFields(record: PsychologyRecord): Partial<PsychologyRecord> {
  return genericStrip(record, SYSTEM_FIELDS);
}

/** Sanitize payload before sending to the backend. */
export function sanitizePayload(record: Partial<PsychologyRecord>): Partial<PsychologyRecord> {
  return genericSanitize(record);
}

/** Create a field updater for psychology section components. */
export function createFieldUpdater(
  data: PsychologyRecord,
  onChange: (data: PsychologyRecord) => void
): (field: keyof PsychologyRecord, value: string | boolean) => void {
  return genericUpdater(data, onChange) as (field: keyof PsychologyRecord, value: string | boolean) => void;
}
