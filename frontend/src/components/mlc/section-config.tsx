"use client";

import { ClipboardCheck, FileCheck, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PersonalInfoSection, {
  NotEditableBadge,
  STANDARD_PERSONAL_INFO_ROWS,
} from "@/components/common/personal-info-section";

import DeclarationSection from "./DeclarationSection";
import FinalRecommendationSection from "./FinalRecommendationSection";
import type { MlcSectionProps } from "./types";

/** Scroll-anchor id for an MLC section key. */
export function mlcAnchorId(key: string): string {
  return `mlc-section-${key}`;
}

/**
 * Describes one navigable section of the MLC health certificate form.
 *
 * The cards keep their own banded headers; the wrapper only adds the scroll
 * anchor the left-rail navigator jumps to.
 */
export interface MlcSectionDef {
  /** Stable key, also the anchor id suffix. */
  key: string;
  /** Label shown in the left-rail navigator. */
  label: string;
  /** Leading icon for the navigator entry. */
  icon: LucideIcon;
  /** Anchored section body. */
  component: React.ComponentType<MlcSectionProps>;
}

/**
 * Scroll margin only — the sections scroll inside their own column, which has
 * no sticky header of its own to clear.
 */
const ANCHOR_CLASS = "scroll-mt-4";

/**
 * Personal information, rendered read-only.
 *
 * The seafarer's identity comes from the patient record, so this card is
 * always disabled regardless of the form's edit mode.
 */
function PersonalInfoGroup({ data, onChange }: MlcSectionProps) {
  return (
    <div id={mlcAnchorId("personal")} className={ANCHOR_CLASS}>
      <PersonalInfoSection
        data={data}
        onChange={onChange}
        rows={STANDARD_PERSONAL_INFO_ROWS}
        subtitle="From the selected seafarer profile"
        disabled
        headerAction={<NotEditableBadge />}
      />
    </div>
  );
}

/** Declaration of the authorized physician. */
function DeclarationGroup({ data, onChange, disabled }: MlcSectionProps) {
  return (
    <div id={mlcAnchorId("declaration")} className={ANCHOR_CLASS}>
      <DeclarationSection data={data} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/** Fitness determination, certification details, and medical director. */
function RecommendationGroup({ data, onChange, disabled }: MlcSectionProps) {
  return (
    <div id={mlcAnchorId("recommendation")} className={ANCHOR_CLASS}>
      <FinalRecommendationSection
        data={data}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

/**
 * Ordered MLC sections driving both the left-rail navigator and the content
 * column.
 *
 * The order is unchanged from the previous single-column stack; the personal
 * info card simply moved from the page's `preSections` slot into this list.
 */
export const MLC_SECTIONS: MlcSectionDef[] = [
  {
    key: "personal",
    label: "Personal Information",
    icon: User,
    component: PersonalInfoGroup,
  },
  {
    key: "declaration",
    label: "Physician Declaration",
    icon: ClipboardCheck,
    component: DeclarationGroup,
  },
  {
    key: "recommendation",
    label: "Final Recommendation",
    icon: FileCheck,
    component: RecommendationGroup,
  },
];
