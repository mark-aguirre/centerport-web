"use client";

import PersonalInfoSection from "@/components/common/personal-info-section";
import type { RowConfig } from "@/components/common/personal-info-section";
import type { LandbaseSectionProps } from "./types";

/** Landbase PEME personal info row layout */
const LANDBASE_PERSONAL_ROWS: RowConfig[] = [
  // Row 1: Name
  [
    { field: "last_name", label: "Last Name", required: true },
    { field: "first_name", label: "First Name", required: true },
    { field: "middle_name", label: "Middle Name" },
  ],
  // Row 2: Place of Birth, Passport No, Religion
  [
    { field: "place_of_birth", label: "Place of Birth" },
    { field: "passport_no", label: "Passport No." },
    { field: "religion", label: "Religion" },
  ],
  // Row 3: Nationality, Gender, Civil Status
  [
    { field: "nationality", label: "Nationality" },
    { field: "gender", label: "Gender", options: ["Male", "Female"] },
    { field: "civil_status", label: "Civil Status", options: ["Single", "Married", "Widowed", "Separated"] },
  ],
  // Row 4: Address, Contact No
  [
    { field: "address", label: "Address" },
    { field: "contact_no", label: "Contact No." },
  ],
  // Row 5: Employer, Position
  [
    { field: "employer", label: "Employer" },
    { field: "position", label: "Position" },
  ],
];

/** Grid overrides for rows that need custom proportions */
const LANDBASE_GRID_OVERRIDES: Record<number, string> = {
  3: "grid-cols-[3fr_2fr]", // Address, Contact No
  4: "grid-cols-[3fr_2fr]", // Employer, Position
};

/**
 * Landbase PEME personal information section.
 *
 * Thin wrapper around the common PersonalInfoSection configured
 * with landbase-specific fields: name, place of birth, passport,
 * religion, nationality, gender, civil status, address, contact,
 * employer, and position.
 *
 * Personal information is always read-only in the landbase context.
 * Only the /profile page is allowed to edit personal information.
 */
export default function LandbasePersonalInfoSection({
  data,
  onChange,
}: LandbaseSectionProps) {
  return (
    <PersonalInfoSection
      data={data}
      onChange={onChange}
      rows={LANDBASE_PERSONAL_ROWS}
      gridOverrides={LANDBASE_GRID_OVERRIDES}
      disabled={true}
    />
  );
}
