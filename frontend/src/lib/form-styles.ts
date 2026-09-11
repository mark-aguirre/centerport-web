/**
 * Shared styling constants for form controls.
 *
 * Centralizes look-and-feel that must stay consistent across every module's
 * form sections (medical, landbase, psychology, panama, mlc, etc.).
 */

/**
 * Class for an inline radio/checkbox option label — a control sitting next to
 * its visible text (e.g. "Yes", "No", "Normal").
 *
 * Enlarges the clickable target well beyond the tiny native control by padding
 * and rounding the whole label and adding a hover highlight, so users can click
 * anywhere on the option rather than having to hit the small dot/box. Compose
 * with `cn(...)` at the call site to add layout or disabled variants.
 */
export const RADIO_OPTION_LABEL_CLASS =
  "flex cursor-pointer items-center gap-1.5 rounded-sm px-1.5 py-1 transition-colors hover:bg-primary/10";
