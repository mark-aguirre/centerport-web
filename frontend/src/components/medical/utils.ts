/**
 * Utility functions for Medical Examination form section components.
 *
 * Generic form helpers are re-exported from `@/lib/form-utils` with a
 * `MedicalExam`-typed signature so section components share a single
 * field-updater implementation instead of re-declaring it locally.
 */

import { createFieldUpdater as genericUpdater } from "@/lib/form-utils";
import type { MedicalExam } from "./types";

export { humanizeField } from "@/lib/form-utils";

/**
 * Create a field updater for medical section components.
 *
 * Replaces the repeated
 * `(field, value) => onChange({ ...data, [field]: value })` helper that each
 * section previously declared. Accepts `string | boolean` so both text inputs
 * and checkbox-style fields can share the updater.
 *
 * @param data - Current medical exam form data
 * @param onChange - Parent state setter that replaces the whole record
 * @returns Updater accepting a `MedicalExam` field key and its new value
 */
export function createFieldUpdater(
  data: MedicalExam,
  onChange: (data: MedicalExam) => void
): (field: keyof MedicalExam, value: string | boolean) => void {
  return genericUpdater(data, onChange) as (
    field: keyof MedicalExam,
    value: string | boolean
  ) => void;
}
