import {
  LayoutDashboard,
  User,
  HeartPulse,
  FlaskConical,
  ClipboardCheck,
  Globe,
  Building2,
  CalendarCheck,
  Brain,
  Users,
  TestTube,
  ShieldPlus,
  SlidersHorizontal,
  Waves,
  ScanLine,
  type LucideIcon,
} from "lucide-react";

/** Single navigation entry for the sidebar/mobile nav. */
export interface NavigationItem {
  title: string;
  /** Short label for sidebar display (uses title if not set) */
  shortTitle?: string;
  /** Subtitle shown next to the title in the app header */
  subtitle?: string;
  href: string;
  icon: LucideIcon;
  /**
   * Optional group label. Consecutive items sharing the same group are
   * rendered under a single section header in the sidebar (e.g. "Laboratory")
   * and as one divider-separated cluster in the top navigation strip.
   *
   * Items are grouped by adjacency, so an item only joins a group when it sits
   * next to its peers in this list — reordering the list regroups the UI.
   */
  group?: string;
}

/** A rendered navigation group: an optional header label plus its items. */
export interface NavigationGroup {
  /** Group label shown as a section header. Undefined for ungrouped items. */
  label?: string;
  items: NavigationItem[];
}

/**
 * Collapse a flat navigation list into ordered groups.
 *
 * Consecutive items with the same `group` value are merged under one header;
 * items without a `group` become standalone (headerless) sections. Order is
 * preserved from the source list.
 */
export function groupNavigation(items: NavigationItem[]): NavigationGroup[] {
  const groups: NavigationGroup[] = [];

  for (const item of items) {
    const last = groups[groups.length - 1];
    if (item.group && last?.label === item.group) {
      last.items.push(item);
    } else if (item.group) {
      groups.push({ label: item.group, items: [item] });
    } else if (last && last.label === undefined) {
      last.items.push(item);
    } else {
      groups.push({ items: [item] });
    }
  }

  return groups;
}

/**
 * Routes that share a single "selected patient" so opening one after another
 * shows the same seafarer. Scoped strictly to Seabase <-> Panama: navigating
 * between these two carries the selected patient via a `?profileId=` param.
 * Every other route (Landbase, Laboratory, MLC, Psychology, etc.) is omitted,
 * so a patient never carries into or out of them.
 */
export const PATIENT_AWARE_ROUTES: ReadonlySet<string> = new Set([
  "/seabase",
  "/panama",
]);

/**
 * Build the href to use for a navigation item, carrying the currently selected
 * patient only between the sharing-group routes (Seabase <-> Panama).
 *
 * For a sharing-group route with a selected patient, appends `?profileId=<id>`
 * so navigating there opens the same seafarer. Every other route, and the case
 * where no patient is selected, returns the plain href.
 *
 * @param href - The route's base href.
 * @param selectedProfileId - The currently selected seafarer id, or null.
 * @returns The href to navigate to.
 */
export function buildNavHref(
  href: string,
  selectedProfileId: string | null
): string {
  if (!selectedProfileId || !PATIENT_AWARE_ROUTES.has(href)) return href;
  return `${href}?profileId=${encodeURIComponent(selectedProfileId)}`;
}

/** Application navigation routes used by sidebar and mobile nav. */
export const navigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    subtitle: "Overview and quick actions",
    icon: LayoutDashboard,
  },
  {
    title: "Visit",
    subtitle: "Patient Registration — Today's Visits",
    href: "/visit",
    icon: CalendarCheck,
    group: "Patient",
  },
  {
    title: "Patient",
    subtitle: "Seafarer's Information",
    href: "/profile",
    icon: User,
    group: "Patient",
  },
  // Medical Certificate — the four certificate modules, kept adjacent so the
  // toolbar renders them as one cluster. MLC and Panama belong here rather
  // than beside the diagnostics they cite.
  {
    title: "Seafarer's Medical Examination Certificate",
    shortTitle: "Seabase",
    subtitle: "Seafarer's Medical Examination — ILO/WHO",
    href: "/seabase",
    icon: HeartPulse,
    group: "Medical Certificate",
  },
  {
    title: "Overseas Land-Based Workers Medical Certificate",
    shortTitle: "Landbase",
    subtitle: "POEA/DMW Medical Examination — Land-Based OFW",
    href: "/landbase",
    icon: Building2,
    group: "Medical Certificate",
  },
  {
    title: "Seafarer's Medical Examination Certificate",
    shortTitle: "MLC",
    subtitle: "Seafarer's Medical Examination — MLC Convention",
    href: "/mlc",
    icon: ClipboardCheck,
    group: "Medical Certificate",
  },
  {
    title: "Panama Medical Certificate",
    shortTitle: "Panama",
    subtitle: "Seafarer's Medical Examination — Panama Registry",
    href: "/panama",
    icon: Globe,
    group: "Medical Certificate",
  },

  // Laboratory — the LABORATORY role's diagnostic modules.
  {
    title: "Laboratory",
    href: "/laboratory",
    icon: FlaskConical,
    group: "Laboratory",
  },
  {
    title: "Immunology",
    subtitle: "Immunology / Serology Report",
    href: "/immunology",
    icon: TestTube,
    group: "Laboratory",
  },
  {
    title: "HIV",
    subtitle: "Human Immunodeficiency Virus (HIV) Screening",
    href: "/hiv",
    icon: ShieldPlus,
    group: "Laboratory",
  },

  // Radiology — owned by the RADIOLOGY role, not LABORATORY (see lib/roles.ts).
  {
    title: "Ultrasound",
    subtitle: "Ultrasound Result — Radiology",
    href: "/ultrasound",
    icon: Waves,
    group: "Radiology",
  },
  {
    title: "X-Ray",
    subtitle: "X-Ray Result — Radiology",
    href: "/xray",
    icon: ScanLine,
    group: "Radiology",
  },

  // Psychology stands alone. Deliberately ungrouped: a one-item group would
  // put a "PSYCHOLOGY" section header above a single "Psychology" link in the
  // sidebar. Without a group it still starts its own toolbar cluster, since
  // groupNavigation gives an ungrouped item its own headerless group.
  {
    title: "Psychological Evaluation",
    shortTitle: "Psychology",
    subtitle: "Seafarer Psychological Fitness Assessment",
    href: "/psychology",
    icon: Brain,
  },
  {
    title: "Default Values",
    subtitle: "Laboratory Report Reference Values — Hematology & Clinical Chemistry",
    href: "/default-values",
    icon: SlidersHorizontal,
    group: "Setting",
  },
  {
    title: "Medical Personnel",
    shortTitle: "Personnel",
    subtitle: "Signatories, roles, and module assignments",
    href: "/medical-personnel",
    icon: Users,
    group: "Setting",
  },
];

/**
 * Module icon by route href, built once at module load.
 *
 * Lets any component render a route's icon without searching `navigation` on
 * every render — which would also create the component value during render.
 */
export const NAV_ICON_BY_HREF: Record<string, LucideIcon> = Object.fromEntries(
  navigation.map((item) => [item.href, item.icon])
);
