/**
 * Utility functions for HIV Report form data transformation.
 *
 * Handles flattening nested API responses into flat form models.
 * Generic utilities are re-exported from `@/lib/form-utils`.
 */

import { EMPTY_HIV_REPORT, type HivReport } from "./types";
import {
  stripSystemFields as genericStrip,
  sanitizePayload as genericSanitize,
  createFieldUpdater as genericUpdater,
  coerceNulls,
} from "@/lib/form-utils";

export { humanizeField } from "@/lib/form-utils";

/** System-managed fields excluded from update payloads. */
const SYSTEM_FIELDS = ["id", "report_id", "created_date", "updated_date"] as const;

/** Field defaults for null coercion (non-string fields). */
const FIELD_DEFAULTS: Record<string, unknown> = {
  test_rapid: false,
  test_particle_agglutination: false,
  test_eia_cma_elfa: false,
};

/**
 * Shape of the nested seafarer profile returned by the HIV Report API.
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
 * Raw HIV report shape as returned by the API before flattening.
 */
export interface RawHivReportResponse extends Partial<HivReport> {
  seafarer_profile?: NestedSeafarerProfile;
  seafarer_profile_id?: string;
}

/**
 * Flatten the nested `seafarer_profile` from the API response into
 * top-level personal info fields expected by the form.
 */
export function flattenProfileIntoRecord(
  record: RawHivReportResponse
): HivReport {
  const profile = record.seafarer_profile;
  const personalData: Partial<HivReport> = profile
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
  const coerced = coerceNulls(rest as Record<string, unknown>, FIELD_DEFAULTS);

  return { ...EMPTY_HIV_REPORT, ...coerced, ...personalData } as HivReport;
}

/** Strip system-managed fields from an HIV report for API mutations. */
export function stripSystemFields(record: HivReport): Partial<HivReport> {
  return genericStrip(record, SYSTEM_FIELDS);
}

/** Sanitize payload before sending to the backend. */
export function sanitizePayload(record: Partial<HivReport>): Partial<HivReport> {
  return genericSanitize(record);
}

/** Create a field updater for HIV section components. */
export function createFieldUpdater(
  data: HivReport,
  onChange: (data: HivReport) => void
): (field: keyof HivReport, value: string | boolean) => void {
  return genericUpdater(data, onChange) as (
    field: keyof HivReport,
    value: string | boolean
  ) => void;
}
