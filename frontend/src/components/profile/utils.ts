/**
 * Utility functions for Seafarer Profile form section components.
 *
 * Generic form helpers are re-exported from `@/lib/form-utils` with a
 * `SeafarerProfile`-typed signature so section components share a single
 * field-updater implementation instead of re-declaring it locally.
 */

import { createFieldUpdater as genericUpdater } from "@/lib/form-utils";
import type { SeafarerProfile } from "@/lib/api";

/**
 * Create a field updater for profile section components.
 *
 * Replaces the repeated
 * `(field, value) => onChange({ ...data, [field]: value })` helper that each
 * section previously declared.
 *
 * @param data - Current seafarer profile form data
 * @param onChange - Parent state setter that replaces the whole record
 * @returns Updater accepting a `SeafarerProfile` field key and its new value
 */
export function createFieldUpdater(
  data: SeafarerProfile,
  onChange: (data: SeafarerProfile) => void
): (field: keyof SeafarerProfile, value: string) => void {
  return genericUpdater(data, onChange) as (
    field: keyof SeafarerProfile,
    value: string
  ) => void;
}
