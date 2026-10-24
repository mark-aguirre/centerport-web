"use client";

import { Brain, ClipboardCheck, ClipboardList, Smile, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PersonalInfoSection from "./PersonalInfoSection";
import ExaminationDetailsSection from "./ExaminationDetailsSection";
import IntellectualLevelSection from "./IntellectualLevelSection";
import PersonalityTraitsSection from "./PersonalityTraitsSection";
import ConclusionSection from "./ConclusionSection";
import type { PsychologySectionProps } from "./types";

/** Scroll-anchor id for a Psychology section key. */
export function psychologyAnchorId(key: string): string {
  return `psychology-section-${key}`;
}

/**
 * Describes one navigable section of the psychological evaluation form.
 *
 * The cards keep their own banded headers; the wrapper only adds the scroll
 * anchor the left-rail navigator jumps to.
 */
export interface PsychologySectionDef {
  /** Stable key, also the anchor id suffix. */
  key: string;
  /** Label shown in the left-rail navigator. */
  label: string;
  /** Leading icon for the navigator entry. */
  icon: LucideIcon;
  /** Anchored section body. */
  component: React.ComponentType<PsychologySectionProps>;
}

/**
 * Scroll margin only — the sections scroll inside their own column, which has
 * no sticky header of its own to clear.
 */
const ANCHOR_CLASS = "scroll-mt-4";

/**
 * Wraps a section body in its scroll anchor.
 *
 * Called once per section at module load, so the returned components are
 * stable across renders.
 */
function anchored(
  key: string,
  Body: React.ComponentType<PsychologySectionProps>
): React.ComponentType<PsychologySectionProps> {
  function AnchoredSection(props: PsychologySectionProps) {
    return (
      <div id={psychologyAnchorId(key)} className={ANCHOR_CLASS}>
        <Body {...props} />
      </div>
    );
  }
  AnchoredSection.displayName = `PsychologySection(${key})`;
  return AnchoredSection;
}

/**
 * Ordered sections of the psychological evaluation form.
 *
 * Matches the standard form layout and is unchanged from the previous
 * single-column stack:
 * - Patient Information (read-only, from profile)
 * - Examination Details (date, psychometrician, psychologist, tests used)
 * - I. Intellectual Level (radio classification)
 * - II. Personality Traits and Characteristics (1-7 rating grid)
 * - III. Conclusion/Remarks (recommendation radio + notes)
 */
export const PSYCHOLOGY_SECTIONS: PsychologySectionDef[] = [
  {
    key: "personal",
    label: "Patient Information",
    icon: User,
    component: anchored(
      "personal",
      PersonalInfoSection as React.ComponentType<PsychologySectionProps>
    ),
  },
  {
    key: "examination-details",
    label: "Examination Details",
    icon: ClipboardList,
    component: anchored("examination-details", ExaminationDetailsSection),
  },
  {
    key: "intellectual-level",
    label: "Intellectual Level",
    icon: Brain,
    component: anchored("intellectual-level", IntellectualLevelSection),
  },
  {
    key: "personality-traits",
    label: "Personality Traits",
    icon: Smile,
    component: anchored("personality-traits", PersonalityTraitsSection),
  },
  {
    key: "conclusion",
    label: "Conclusion / Remarks",
    icon: ClipboardCheck,
    component: anchored("conclusion", ConclusionSection),
  },
];
