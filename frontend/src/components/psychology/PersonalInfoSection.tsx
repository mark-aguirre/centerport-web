"use client";

import PersonalInfoSection from "@/components/common/personal-info-section";
import type { RowConfig } from "@/components/common/personal-info-section";
import type { PsychologySectionProps } from "./types";

/** Psychology evaluation personal info row layout */
const PSYCHOLOGY_PERSONAL_ROWS: RowConfig[] = [
  // Row 1: Name, Birth date, Age, Gender
  [
    { field: "last_name", label: "Last Name", required: true },
    { field: "first_name", label: "First Name", required: true },
    { field: "middle_name", label: "Middle Name" },
    { field: "date_of_birth", label: "Birth Date", type: "date" },
    { field: "age", label: "Age" },
    { field: "gender", label: "Gender", options: ["Male", "Female"] },
  ],
  // Row 2: Agency, Position
  [
    { field: "employer", label: "Agency" },
    { field: "position", label: "Position" },
  ],
];

/** Grid overrides */
const PSYCHOLOGY_GRID_OVERRIDES: Record<number, string> = {
  0: "grid-cols-[2fr_2fr_2fr_1.5fr_0.5fr_1fr]",
  1: "grid-cols-[3fr_2fr]",
};

/**
 * Psychology evaluation personal information section.
 *
 * Displays Name, Birth date, Age, Gender, Agency, and Position.
 * Personal information is always read-only — only the /profile page
 * can edit personal info.
 */
export default function PsychologyPersonalInfoSection({
  data,
  onChange,
}: PsychologySectionProps) {
  return (
    <PersonalInfoSection
      data={data}
      onChange={onChange}
      rows={PSYCHOLOGY_PERSONAL_ROWS}
      gridOverrides={PSYCHOLOGY_GRID_OVERRIDES}
      disabled={true}
    />
  );
}
