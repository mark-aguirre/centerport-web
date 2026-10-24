"use client";

import {
  Activity,
  ClipboardCheck,
  ClipboardList,
  Ear,
  FlaskConical,
  Stethoscope,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PersonalInfoSection, {
  NotEditableBadge,
  STANDARD_PERSONAL_INFO_ROWS,
} from "@/components/common/personal-info-section";

import { PastMedicalHistoryGrid } from "./PastMedicalHistoryGrid";
import { QuestionnaireGrid } from "./QuestionnaireGrid";
import { VitalsSection } from "./VitalsSection";
import { VisionSection } from "./VisionSection";
import { AudiometrySpeechSection } from "./AudiometrySpeechSection";
import { ConditionQuestionsSection } from "./ConditionQuestionsSection";
import { FindingsGrid } from "./FindingsGrid";
import { AncillaryExamsSection } from "./AncillaryExamsSection";
import { FinalRecommendationSection } from "./FinalRecommendationSection";
import { FitnessAssessmentSection } from "./FitnessAssessmentSection";
import type { MedicalSectionProps } from "./types";

/** Scroll-anchor id for a Seabase section key. */
export function seabaseAnchorId(key: string): string {
  return `seabase-section-${key}`;
}

/**
 * Describes one navigable group of the Seabase medical examination form.
 *
 * A group bundles the consecutive sub-section cards that belong together
 * under a single entry in the left-rail navigator. The cards keep their own
 * banded headers; the group only adds the scroll anchor.
 */
export interface SeabaseSectionDef {
  /** Stable key, also the anchor id suffix. */
  key: string;
  /** Label shown in the left-rail navigator. */
  label: string;
  /** Leading icon for the navigator entry. */
  icon: LucideIcon;
  /** Group body — renders the sub-section cards inside the anchor. */
  component: React.ComponentType<MedicalSectionProps>;
}

/**
 * Shared wrapper: the scroll anchor plus the card spacing of the old stack.
 *
 * The scroll margin is small because the sections scroll inside their own
 * column, which has no sticky header of its own to clear.
 */
const GROUP_CLASS = "scroll-mt-4 space-y-3";

/**
 * Personal information, rendered read-only.
 *
 * The seafarer's identity comes from the patient record, so this card is
 * always disabled regardless of the form's edit mode.
 */
function PersonalInfoGroup({ data, onChange }: MedicalSectionProps) {
  return (
    <div id={seabaseAnchorId("personal")} className={GROUP_CLASS}>
      <PersonalInfoSection
        data={data}
        onChange={onChange}
        rows={STANDARD_PERSONAL_INFO_ROWS}
        disabled={true}
        headerAction={<NotEditableBadge />}
      />
    </div>
  );
}

/** Past medical history grid plus the numbered yes/no questionnaire. */
function HistoryGroup({ data, onChange, disabled }: MedicalSectionProps) {
  return (
    <div id={seabaseAnchorId("history")} className={GROUP_CLASS}>
      <PastMedicalHistoryGrid data={data} onChange={onChange} disabled={disabled} />
      <QuestionnaireGrid data={data} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/** Vitals and vision. */
function PhysicalGroup({ data, onChange, disabled }: MedicalSectionProps) {
  return (
    <div id={seabaseAnchorId("physical")} className={GROUP_CLASS}>
      <VitalsSection data={data} onChange={onChange} disabled={disabled} />
      <VisionSection data={data} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/** Hearing and speech test results. */
function AudiometryGroup({ data, onChange, disabled }: MedicalSectionProps) {
  return (
    <div id={seabaseAnchorId("audiometry")} className={GROUP_CLASS}>
      <AudiometrySpeechSection data={data} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/** Sea-fitness condition questions and the A/B/C findings grid. */
function FindingsGroup({ data, onChange, disabled }: MedicalSectionProps) {
  return (
    <div id={seabaseAnchorId("findings")} className={GROUP_CLASS}>
      <ConditionQuestionsSection data={data} onChange={onChange} disabled={disabled} />
      <FindingsGrid data={data} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/** Laboratory and imaging results. */
function AncillaryGroup({ data, onChange, disabled }: MedicalSectionProps) {
  return (
    <div id={seabaseAnchorId("ancillary")} className={GROUP_CLASS}>
      <AncillaryExamsSection data={data} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/** Final recommendation plus the fitness-for-sea-service assessment. */
function RecommendationGroup({ data, onChange, disabled }: MedicalSectionProps) {
  return (
    <div id={seabaseAnchorId("recommendation")} className={GROUP_CLASS}>
      <FinalRecommendationSection data={data} onChange={onChange} disabled={disabled} />
      <FitnessAssessmentSection data={data} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/**
 * Ordered Seabase sections driving both the left-rail navigator and the
 * content column.
 *
 * The grouping follows the existing card order exactly — nothing was
 * reordered, the cards are only bundled into navigable runs.
 */
export const SEABASE_SECTIONS: SeabaseSectionDef[] = [
  { key: "personal", label: "Personal Information", icon: User, component: PersonalInfoGroup },
  { key: "history", label: "Past Medical History", icon: ClipboardList, component: HistoryGroup },
  { key: "physical", label: "Physical Examination", icon: Stethoscope, component: PhysicalGroup },
  { key: "audiometry", label: "Audiometry & Speech", icon: Ear, component: AudiometryGroup },
  { key: "findings", label: "Exam Findings", icon: Activity, component: FindingsGroup },
  { key: "ancillary", label: "Results & Ancillary Tests", icon: FlaskConical, component: AncillaryGroup },
  { key: "recommendation", label: "Final Recommendation", icon: ClipboardCheck, component: RecommendationGroup },
];
