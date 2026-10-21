/**
 * Utility functions for Immunology Report form data transformation.
 *
 * Handles flattening nested API responses into flat form models.
 * Generic utilities are re-exported from `@/lib/form-utils`.
 */

import { EMPTY_IMMUNOLOGY_REPORT, type ImmunologyReport } from "./types";
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
 * Shape of the nested seafarer profile returned by the Immunology Report API.
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
}

/**
 * Raw immunology report shape as returned by the API before flattening.
 */
export interface RawImmunologyReportResponse extends Partial<ImmunologyReport> {
  seafarer_profile?: NestedSeafarerProfile;
  seafarer_profile_id?: string;
}

/**
 * Flatten the nested `seafarer_profile` from the API response into
 * top-level personal info fields expected by the form.
 */
export function flattenProfileIntoRecord(
  record: RawImmunologyReportResponse
): ImmunologyReport {
  const profile = record.seafarer_profile;
  const personalData: Partial<ImmunologyReport> = profile
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
      }
    : {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { seafarer_profile: _, ...rest } = record;
  const coerced = coerceNulls(rest as Record<string, unknown>);

  return { ...EMPTY_IMMUNOLOGY_REPORT, ...coerced, ...personalData } as ImmunologyReport;
}

/** Strip system-managed fields from an immunology report for API mutations. */
export function stripSystemFields(
  record: ImmunologyReport
): Partial<ImmunologyReport> {
  return genericStrip(record, SYSTEM_FIELDS);
}

/** Sanitize payload before sending to the backend. */
export function sanitizePayload(
  record: Partial<ImmunologyReport>
): Partial<ImmunologyReport> {
  return genericSanitize(record);
}

/** Create a field updater for immunology section components. */
export function createFieldUpdater(
  data: ImmunologyReport,
  onChange: (data: ImmunologyReport) => void
): (field: keyof ImmunologyReport, value: string | boolean) => void {
  return genericUpdater(data, onChange) as (
    field: keyof ImmunologyReport,
    value: string | boolean
  ) => void;
}
