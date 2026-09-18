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
  Receipt,
  Package,
  FileText,
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
    title: "Overseas Land-Based Workers Medical Certificate",
    shortTitle: "Landbase",
    subtitle: "POEA/DMW Medical Examination — Land-Based OFW",
    href: "/landbase",
    icon: Building2,
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
    title: "Transaction",
    subtitle: "Point-of-Sale — build, settle, and void transactions",
    href: "/transactions",
    icon: Receipt,
    group: "Accounting",
  },
  {
    title: "Receivable Report",
    shortTitle: "Receivable",
    subtitle: "Amounts owed by account, payment type, and date range",
    href: "/receivable/report",
    icon: FileText,
    group: "Accounting",
  },
  {
    title: "Item Listing",
    shortTitle: "Items",
    subtitle: "Manage services, examinations, packages, and prices",
    href: "/listing",
    icon: Package,
    group: "Accounting",
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