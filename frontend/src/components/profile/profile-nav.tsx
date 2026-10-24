"use client";

import { useMemo } from "react";

import { SectionNav, type SectionNavItem } from "@/components/common/section-nav";

import {
  PROFILE_SECTIONS,
  SECTION_NAV_LABELS,
  sectionAnchorId,
} from "./section-config";

/**
 * Sticky left-rail navigation for the profile sections.
 *
 * Thin binding of the generic {@link SectionNav} to the profile section
 * config: it supplies the short nav labels and the profile anchor ids, and
 * the shared component handles the active-section tracking and scrolling.
 */
export function ProfileNav() {
  const items = useMemo<SectionNavItem[]>(
    () =>
      PROFILE_SECTIONS.map(({ key, icon }) => ({
        key,
        icon,
        label: SECTION_NAV_LABELS[key] ?? key,
      })),
    []
  );

  return (
    <SectionNav
      items={items}
      anchorId={sectionAnchorId}
      ariaLabel="Profile sections"
    />
  );
}
