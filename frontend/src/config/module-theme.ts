/**
 * Per-module accent colours.
 *
 * The UI colour-codes every module so a user can recognise a screen, a toolbar
 * tile, an activity row, or a shortcut by its hue alone. Keeping the mapping in
 * one place means the top navigation, the dashboard tiles, the activity table,
 * and the quick-action grid all agree on what colour "Laboratory" is.
 */

/** Tailwind classes that make up a single module accent. */
export interface ModuleAccent {
  /** Icon / text colour, e.g. `text-sky-600`. */
  fg: string;
  /** Soft tinted surface behind the icon, e.g. `bg-sky-50`. */
  bg: string;
}

/** Fallback accent for routes and record types without an explicit entry. */
export const DEFAULT_ACCENT: ModuleAccent = {
  fg: "text-primary",
  bg: "bg-primary/10",
};

/** Module accent keyed by route href. */
const ACCENT_BY_HREF: Record<string, ModuleAccent> = {
  "/dashboard": { fg: "text-sky-600", bg: "bg-sky-50" },
  "/visit": { fg: "text-cyan-600", bg: "bg-cyan-50" },
  "/profile": { fg: "text-blue-600", bg: "bg-blue-50" },
  "/seabase": { fg: "text-teal-600", bg: "bg-teal-50" },
  "/landbase": { fg: "text-orange-500", bg: "bg-orange-50" },
  "/laboratory": { fg: "text-violet-600", bg: "bg-violet-50" },
  "/immunology": { fg: "text-fuchsia-600", bg: "bg-fuchsia-50" },
  "/hiv": { fg: "text-rose-600", bg: "bg-rose-50" },
  "/ultrasound": { fg: "text-sky-500", bg: "bg-sky-50" },
  "/xray": { fg: "text-indigo-600", bg: "bg-indigo-50" },
  "/mlc": { fg: "text-blue-700", bg: "bg-blue-50" },
  "/panama": { fg: "text-emerald-600", bg: "bg-emerald-50" },
  "/psychology": { fg: "text-purple-600", bg: "bg-purple-50" },
  "/default-values": { fg: "text-slate-600", bg: "bg-slate-100" },
  "/medical-personnel": { fg: "text-amber-600", bg: "bg-amber-50" },
  "/sale": { fg: "text-lime-600", bg: "bg-lime-50" },
};

/**
 * Accent for a route.
 *
 * @param href - Route href as declared in `navigation.ts`.
 * @returns The module's accent, or {@link DEFAULT_ACCENT} when unmapped.
 */
export function accentForHref(href: string): ModuleAccent {
  return ACCENT_BY_HREF[href] ?? DEFAULT_ACCENT;
}

/** Route that owns a given backend activity `type` key. */
const HREF_BY_ACTIVITY_TYPE: Record<string, string> = {
  visit: "/visit",
  medical_exam: "/seabase",
  landbase_peme: "/landbase",
  panama_certificate: "/panama",
  mlc_record: "/mlc",
  profile: "/profile",
};

/** Human-readable module name for a backend activity `type` key. */
const MODULE_LABEL_BY_ACTIVITY_TYPE: Record<string, string> = {
  visit: "Visit",
  medical_exam: "Medical examination",
  landbase_peme: "Landbase",
  panama_certificate: "Panama",
  mlc_record: "MLC",
  profile: "Patient",
};

/**
 * Resolve the display module for a recent-activity row.
 *
 * @param type - Backend activity type key (e.g. `landbase_peme`).
 * @returns The module label, its route, and its accent. Unknown types fall back
 *   to a neutral "Record" entry pointing at the dashboard, so a new backend
 *   source never breaks the table.
 */
export function moduleForActivityType(type: string): {
  label: string;
  href: string;
  accent: ModuleAccent;
} {
  const href = HREF_BY_ACTIVITY_TYPE[type] ?? "/dashboard";
  return {
    label: MODULE_LABEL_BY_ACTIVITY_TYPE[type] ?? "Record",
    href,
    accent: accentForHref(href),
  };
}
