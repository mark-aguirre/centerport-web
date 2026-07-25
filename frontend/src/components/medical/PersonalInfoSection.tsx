"use client";

import PersonalInfoSection from "@/components/common/personal-info-section";
import type { RowConfig } from "@/components/common/personal-info-section";
import type { MedicalSectionProps } from "./types";

/** Medical exam personal info row layout */
const MEDICAL_PERSONAL_ROWS: RowConfig[] = [
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
  // Row 4: Date of Birth, Age, Contact No
  [
    { field: "date_of_birth", label: "Date of Birth", type: "date" },
    { field: "age", label: "Age" },
    { field: "contact_no", label: "Contact No." },
  ],
  // Row 5: Address
  [
    { field: "address", label: "Address" },
  ],
  // Row 6: Employer, Position
  [
    { field: "employer", label: "Employer" },
    { field: "position", label: "Position" },
  ],
];

/** Grid overrides for rows that need custom proportions */
const MEDICAL_GRID_OVERRIDES: Record<number, string> = {
  5: "grid-cols-[3fr_2fr]", // Employer, Position
};

/**
 * Medical exam personal information section.
 *
 * Thin wrapper around the common PersonalInfoSection configured
 * with medical-specific fields: name, place of birth, passport,
 * religion, nationality, gender, civil status, DOB, age, contact,
 * address, employer, and position.
 */
export default function MedicalPersonalInfoSection({
  data,
  onChange,
}: MedicalSectionProps) {
  return (
    <PersonalInfoSection
      data={data}
      onChange={onChange}
      rows={MEDICAL_PERSONAL_ROWS}
      gridOverrides={MEDICAL_GRID_OVERRIDES}
    />
  );
}
