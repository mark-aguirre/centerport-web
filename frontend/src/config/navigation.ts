import {
  LayoutDashboard,
  User,
  HeartPulse,
  FlaskConical,
  ClipboardCheck,
  Globe,
  Building2,
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
    title: "Profile",
    subtitle: "Seafarer's Information",
    href: "/profile",
    icon: User,
  },
  {
    title: "Seafarer's Medical Examination Certificate",
    shortTitle: "Seabase",
    subtitle: "Seafarer's Medical Examination — ILO/WHO",
    href: "/medical",
    icon: HeartPulse,
  },
  {
    title: "Laboratory",
    href: "/laboratory",
    icon: FlaskConical,
  },
  {
    title: "Seafarer's Medical Examination Certificate",
    shortTitle: "MLC",
    subtitle: "Seafarer's Medical Examination — MLC Convention",
    href: "/mlc",
    icon: ClipboardCheck,
  },
  {
    title: "Panama Medical Certificate",
    shortTitle: "Panama",
    subtitle: "Seafarer's Medical Examination — Panama Registry",
    href: "/panama",
    icon: Globe,
  },
  {
    title: "Overseas Land-Based Workers Medical Certificate",
    shortTitle: "Landbase",
    subtitle: "POEA/DMW Medical Examination — Land-Based OFW",
    href: "/landbase",
    icon: Building2,
  },
];