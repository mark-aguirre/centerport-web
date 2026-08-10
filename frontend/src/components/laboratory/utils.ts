/**
 * Utility functions for Laboratory Report form data transformation.
 *
 * Handles flattening nested API responses into flat form models.
 * Generic utilities are re-exported from `@/lib/form-utils`.
 */

import { EMPTY_REPORT, type LaboratoryReport } from "./types";
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
 * Shape of the nested seafarer profile returned by the Laboratory Report API.
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
 * Raw laboratory report shape as returned by the API before flattening.
 */
export interface RawLabReportResponse extends Partial<LaboratoryReport> {
  seafarer_profile?: NestedSeafarerProfile;
  seafarer_profile_id?: string;
}

/** Field defaults for null coercion (non-string fields). */
const FIELD_DEFAULTS: Record<string, unknown> = {
  fbs_high: false,
  bun_high: false,
  creatinine_high: false,
  cholesterol_high: false,
  triglycerides_high: false,
  uric_acid_high: false,
  sgot_high: false,
  sgpt_high: false,
  alk_phos_high: false,
  hba1c_high: false,
};

/**
 * Flatten the nested `seafarer_profile` from the API response into
 * top-level personal info fields expected by the form.
 */
export function flattenProfileIntoRecord(record: RawLabReportResponse): LaboratoryReport {
  const profile = record.seafarer_profile;
  const personalData: Partial<LaboratoryReport> = profile
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
      }
    : {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { seafarer_profile: _, ...rest } = record;
  const coerced = coerceNulls(rest as Record<string, unknown>, FIELD_DEFAULTS);

  return { ...EMPTY_REPORT, ...coerced, ...personalData } as LaboratoryReport;
}

/** Strip system-managed fields from a laboratory report for API mutations. */
export function stripSystemFields(record: LaboratoryReport): Partial<LaboratoryReport> {
  return genericStrip(record, SYSTEM_FIELDS);
}

/** Sanitize payload before sending to the backend. */
export function sanitizePayload(record: Partial<LaboratoryReport>): Partial<LaboratoryReport> {
  return genericSanitize(record);
}

/** Create a field updater for laboratory section components. */
export function createFieldUpdater(
  data: LaboratoryReport,
  onChange: (data: LaboratoryReport) => void
): (field: keyof LaboratoryReport, value: string | boolean) => void {
  return genericUpdater(data, onChange) as (field: keyof LaboratoryReport, value: string | boolean) => void;
}
