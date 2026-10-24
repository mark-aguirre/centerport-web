"use client";

import { User, Anchor, Users, GraduationCap, Briefcase } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PersonalInfoSection from "./PersonalInfoSection";
import EmploymentSection from "./EmploymentSection";
import FamilyDataSection from "./FamilyDataSection";
import EducationSection from "./EducationSection";
import WorkExperienceSection from "./WorkExperienceSection";
import type { ProfileSectionProps } from "./types";

/** Describes a single section in both the sidebar nav and the content column. */
export interface ProfileSectionDef {
  /** Stable key, also used as the scroll-anchor id (`section-<key>`). */
  key: string;
  /** Label shown in the header band and the sidebar nav. */
  title: string;
  /** Leading icon. */
  icon: LucideIcon;
  /** Body component (renders fields only; the wrapper supplies card + header). */
  component: React.ComponentType<ProfileSectionProps>;
}

/** Scroll-anchor id for a section key. */
export function sectionAnchorId(key: string): string {
  return `profile-section-${key}`;
}

/**
 * Ordered section definitions driving the profile page.
 *
 * The sidebar nav and the content column both map over this list so the
 * labels, icons, and order stay in sync from one source. Every section uses
 * the shared primary-tinted header band (matching the visit page), so there
 * is no per-section color here.
 */
export const PROFILE_SECTIONS: ProfileSectionDef[] = [
  {
    key: "personal",
    title: "Personal Information",
    icon: User,
    component: PersonalInfoSection,
  },
  {
    key: "employment",
    title: "Employment Details",
    icon: Anchor,
    component: EmploymentSection,
  },
  {
    key: "family",
    title: "Family Data",
    icon: Users,
    component: FamilyDataSection,
  },
  {
    key: "education",
    title: "Educational History",
    icon: GraduationCap,
    component: EducationSection,
  },
  {
    key: "work",
    title: "Previous Work Experience (Last Vessel Only)",
    icon: Briefcase,
    component: WorkExperienceSection,
  },
];

/** Short labels for the sidebar nav (the band uses the full `title`). */
export const SECTION_NAV_LABELS: Record<string, string> = {
  personal: "Personal Information",
  employment: "Employment Details",
  family: "Family Data",
  education: "Educational History",
  work: "Previous Work Experience",
};
