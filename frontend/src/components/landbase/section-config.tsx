"use client";

import {
  ClipboardCheck,
  ClipboardList,
  FlaskConical,
  ListChecks,
  MessageSquare,
  Stethoscope,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PersonalInfoSection from "./PersonalInfoSection";
import PastMedicalHistorySection from "./PastMedicalHistorySection";
import QuestionnaireSection from "./QuestionnaireSection";
import PhysicalExaminationSection from "./PhysicalExaminationSection";
import AncillaryExaminationsSection from "./AncillaryExaminationsSection";
import RemarksSection from "./RemarksSection";
import ResultsSection from "./ResultsSection";
import RecommendationSection from "./RecommendationSection";
import type { LandbaseSectionProps } from "./types";

/** Scroll-anchor id for a Landbase section key. */
export function landbaseAnchorId(key: string): string {
  return `landbase-section-${key}`;
}

/**
 * Describes one navigable section of the Landbase PEME form.
 *
 * The cards keep their own banded headers; the wrapper only adds the scroll
 * anchor the left-rail navigator jumps to.
 */
export interface LandbaseSectionDef {
  /** Stable key, also the anchor id suffix. */
  key: string;
  /** Label shown in the left-rail navigator. */
  label: string;
  /** Leading icon for the navigator entry. */
  icon: LucideIcon;
  /** Anchored section body. */
  component: React.ComponentType<LandbaseSectionProps>;
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
  Body: React.ComponentType<LandbaseSectionProps>
): React.ComponentType<LandbaseSectionProps> {
  function AnchoredSection(props: LandbaseSectionProps) {
    return (
      <div id={landbaseAnchorId(key)} className={ANCHOR_CLASS}>
        <Body {...props} />
      </div>
    );
  }
  AnchoredSection.displayName = `LandbaseSection(${key})`;
  return AnchoredSection;
}

/**
 * Ordered Landbase sections driving both the left-rail navigator and the
 * content column.
 *
 * The order matches the paper PEME form and is unchanged from the previous
 * single-column stack.
 */
export const LANDBASE_SECTIONS: LandbaseSectionDef[] = [
  {
    key: "personal",
    label: "Personal Information",
    icon: User,
    component: anchored(
      "personal",
      PersonalInfoSection as React.ComponentType<LandbaseSectionProps>
    ),
  },
  {
    key: "medical-history",
    label: "Past Medical History",
    icon: Stethoscope,
    component: anchored("medical-history", PastMedicalHistorySection),
  },
  {
    key: "questionnaire",
    label: "Questionnaire",
    icon: ClipboardList,
    component: anchored("questionnaire", QuestionnaireSection),
  },
  {
    key: "physical-examination",
    label: "Physical Examination",
    icon: Stethoscope,
    component: anchored("physical-examination", PhysicalExaminationSection),
  },
  {
    key: "ancillary",
    label: "Ancillary Examinations",
    icon: FlaskConical,
    component: anchored("ancillary", AncillaryExaminationsSection),
  },
  {
    key: "remarks",
    label: "Remarks / Restriction",
    icon: MessageSquare,
    component: anchored("remarks", RemarksSection),
  },
  {
    key: "results",
    label: "Result Summary",
    icon: ListChecks,
    component: anchored("results", ResultsSection),
  },
  {
    key: "recommendation",
    label: "Recommendation",
    icon: ClipboardCheck,
    component: anchored("recommendation", RecommendationSection),
  },
];
