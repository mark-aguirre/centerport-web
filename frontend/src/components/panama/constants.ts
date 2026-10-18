/**
 * Shared UI constants for the Panama Medical Certificate form sections.
 */

/**
 * Abbreviated month labels used by month `FormSelect` dropdowns.
 *
 * Shared by the Statement (Section III) and Fitness Assessment (Section VII)
 * sections so the option list stays consistent across certificate dates.
 */
export const MONTH_OPTIONS: string[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Year options for year `FormSelect` dropdowns on certificate dates.
 *
 * Spans a practical range around the current year (10 years back through
 * 5 years ahead) so past examinations and future certificate expirations
 * are both selectable. Rendered most-recent-first. Shared by the Statement
 * (Section III) and Fitness Assessment (Section VII) sections.
 */
export const YEAR_OPTIONS: string[] = (() => {
  const currentYear = new Date().getFullYear();
  const start = currentYear - 10;
  const end = currentYear + 5;
  const years: string[] = [];
  for (let year = end; year >= start; year--) {
    years.push(String(year));
  }
  return years;
})();

/**
 * Base Tailwind classes for the compact grid/table result inputs used by the
 * Diagnostic Tests (Section V) and Medical Examination (Section IV) tables.
 *
 * Combine with `cn(CELL_INPUT_CLASS, disabled && "pointer-events-none")` at the
 * call site to apply the read-only variant.
 */
export const CELL_INPUT_CLASS =
  "h-7 text-xs bg-white border-primary/20 dark:bg-input/30";

/**
 * Re-exported shared inline radio/checkbox option label class.
 *
 * Kept here for local imports within the Panama module; the canonical
 * definition lives in `@/lib/form-styles` so every module stays consistent.
 */
export { RADIO_OPTION_LABEL_CLASS } from "@/lib/form-styles";

import type { LabTestResult, OtherLabTestResult } from "./types";

/**
 * Default result shown for a lab test that has no stored entry yet: checked,
 * with an "X" in the Normal column. Applied by both the Diagnostic Tests UI
 * (Section V) and the PrintIO payload builder so an untouched record prints
 * the same values the form displays.
 */
export const DEFAULT_NORMAL_LAB_RESULT: LabTestResult = {
  checked: true,
  normal: "X",
  abnormal: "",
  observations: "",
};

/** Default for an "other test" with no stored entry yet: checked + "X". */
export const DEFAULT_NORMAL_OTHER_RESULT: OtherLabTestResult = {
  checked: true,
  normal: "X",
  abnormal: "",
  observations: "",
  performed_date: "",
};

/**
 * Lab-test keys that default differently from the usual checked + "X":
 *   - RH Typing: unchecked with "+" in the Normal column.
 *   - GCH (Pregnant): unchecked with "N/A" in the Normal column.
 */
export const SPECIAL_DEFAULT_LAB_RESULTS: Record<string, LabTestResult> = {
  rh_typing: { checked: false, normal: "+", abnormal: "", observations: "" },
  gch_pregnant: { checked: false, normal: "N/A", abnormal: "", observations: "" },
};

/**
 * "Other test" keys that default differently from the usual checked + "X":
 *   - Breast examination, PAP Test, PSA men: unchecked with "N/A" in Normal.
 *   - Chest X-ray, EKG: date-based rows (no Normal/Abnormal cells shown), so
 *     their Observations column defaults to "NORMAL".
 */
export const SPECIAL_DEFAULT_OTHER_RESULTS: Record<string, OtherLabTestResult> = {
  breast_examination: { checked: false, normal: "N/A", abnormal: "", observations: "", performed_date: "" },
  pap_test: { checked: false, normal: "N/A", abnormal: "", observations: "", performed_date: "" },
  psa_men: { checked: false, normal: "N/A", abnormal: "", observations: "", performed_date: "" },
  chest_xray: { checked: true, normal: "", abnormal: "", observations: "NORMAL", performed_date: "" },
  ekg: { checked: true, normal: "", abnormal: "", observations: "NORMAL", performed_date: "" },
};

/** The default LabTestResult for a lab item with no stored entry yet. */
export function defaultLabResult(key: string): LabTestResult {
  return SPECIAL_DEFAULT_LAB_RESULTS[key] ?? DEFAULT_NORMAL_LAB_RESULT;
}

/** The default OtherLabTestResult for an other-test item with no stored entry. */
export function defaultOtherResult(key: string): OtherLabTestResult {
  return SPECIAL_DEFAULT_OTHER_RESULTS[key] ?? DEFAULT_NORMAL_OTHER_RESULT;
}
