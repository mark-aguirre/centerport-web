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
 * Base Tailwind classes for the compact grid/table result inputs used by the
 * Diagnostic Tests (Section V) and Medical Examination (Section IV) tables.
 *
 * Combine with `cn(CELL_INPUT_CLASS, disabled && "pointer-events-none")` at the
 * call site to apply the read-only variant.
 */
export const CELL_INPUT_CLASS =
  "h-7 text-xs bg-white border-primary/20 dark:bg-input/30";
