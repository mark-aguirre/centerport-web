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
