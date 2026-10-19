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
   * rendered under a single section header (e.g. "Accounting").
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
  {
    title: "Seafarer's Medical Examination Certificate",
    shortTitle: "Seabase",
    subtitle: "Seafarer's Medical Examination — ILO/WHO",
    href: "/seabase",
    icon: HeartPulse,
    group: "Medical Examination",
  },
  {
    title: "Overseas Land-Based Workers Medical Certificate",
    shortTitle: "Landbase",
    subtitle: "POEA/DMW Medical Examination — Land-Based OFW",
    href: "/landbase",
    icon: Building2,
    group: "Medical Examination",
  },
  {
    title: "Laboratory",
    href: "/laboratory",
    icon: FlaskConical,
    group: "Medical Examination",
  },
  {
    title: "Seafarer's Medical Examination Certificate",
    shortTitle: "MLC",
    subtitle: "Seafarer's Medical Examination — MLC Convention",
    href: "/mlc",
    icon: ClipboardCheck,
    group: "Medical Examination",
  },
  {
    title: "Panama Medical Certificate",
    shortTitle: "Panama",
    subtitle: "Seafarer's Medical Examination — Panama Registry",
    href: "/panama",
    icon: Globe,
    group: "Medical Examination",
  },
  {
    title: "Psychological Evaluation",
    shortTitle: "Psychology",
    subtitle: "Seafarer Psychological Fitness Assessment",
    href: "/psychology",
    icon: Brain,
    group: "Medical Examination",
  },
  {
    title: "Medical Personnel",
    shortTitle: "Personnel",
    subtitle: "Super Admin — signatories, roles, and module assignments",
    href: "/medical-personnel",
    icon: Users,
    group: "Setting",
  },
];