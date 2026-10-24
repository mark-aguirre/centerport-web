/**
 * Utility functions for Ultrasound Result form data transformation.
 *
 * Handles flattening nested API responses into flat form models.
 * Generic utilities are re-exported from `@/lib/form-utils`.
 */

import { EMPTY_ULTRASOUND_REPORT, type UltrasoundReport } from "./types";
import {
  stripSystemFields as genericStrip,
  sanitizePayload as genericSanitize,
  createFieldUpdater as genericUpdater,
  coerceNulls,
} from "@/lib/form-utils";

export { humanizeField } from "@/lib/form-utils";

/** System-managed fields excluded from update payloads. */
const SYSTEM_FIELDS = ["id", "report_id", "created_date", "updated_date"] as const;

/**
 * Shape of the nested seafarer profile returned by the Ultrasound Result API.
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
  address?: string;
  marital_status?: string;
  photo_url?: string;
}

/**
 * Raw ultrasound report shape as returned by the API before flattening.
 */
export interface RawUltrasoundReportResponse extends Partial<UltrasoundReport> {
  seafarer_profile?: NestedSeafarerProfile;
  seafarer_profile_id?: string;
}

/**
 * Flatten the nested `seafarer_profile` from the API response into
 * top-level personal info fields expected by the form.
 */
export function flattenProfileIntoRecord(
  record: RawUltrasoundReportResponse
): UltrasoundReport {
  const profile = record.seafarer_profile;
  const personalData: Partial<UltrasoundReport> = profile
    ? {
        seafarer_profile_id: profile.id ?? record.seafarer_profile_id,
        last_name: profile.last_name ?? "",
        first_name: profile.first_name ?? "",
        middle_name: profile.middle_name ?? "",
        birthdate: profile.birthdate ?? "",
        age: profile.age ?? "",
        gender: profile.gender ?? "",
        employer: profile.employer ?? "",
        position: profile.position ?? "",
        address: profile.address ?? "",
        civil_status: profile.marital_status ?? "",
        photo_url: profile.photo_url ?? "",
      }
    : {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { seafarer_profile: _, ...rest } = record;
  const coerced = coerceNulls(rest as Record<string, unknown>);

  return {
    ...EMPTY_ULTRASOUND_REPORT,
    ...coerced,
    ...personalData,
  } as UltrasoundReport;
}

/** Strip system-managed fields from an ultrasound report for API mutations. */
export function stripSystemFields(
  record: UltrasoundReport
): Partial<UltrasoundReport> {
  return genericStrip(record, SYSTEM_FIELDS);
}

/** Sanitize payload before sending to the backend. */
export function sanitizePayload(
  record: Partial<UltrasoundReport>
): Partial<UltrasoundReport> {
  return genericSanitize(record);
}

/** Create a field updater for Ultrasound section components. */
export function createFieldUpdater(
  data: UltrasoundReport,
  onChange: (data: UltrasoundReport) => void
): (field: keyof UltrasoundReport, value: string) => void {
  return genericUpdater(data, onChange) as (
    field: keyof UltrasoundReport,
    value: string
  ) => void;
}
