"use client";

import { SectionHeader } from "@/components/common/section-header";
import RadioGroup from "@/components/common/radio-group";
import { BrainCircuit } from "lucide-react";
import { createFieldUpdater } from "./utils";
import type { PsychologySectionProps } from "./types";

/** Intellectual level classification options matching the form. */
const INTELLECTUAL_LEVEL_OPTIONS = [
  { label: "Very Superior", value: "Very Superior" },
  { label: "Superior", value: "Superior" },
  { label: "Above Average", value: "Above Average" },
  { label: "Average", value: "Average" },
  { label: "Below Average", value: "Below Average" },
  { label: "Borderline", value: "Borderline" },
  { label: "Mentally Deficient", value: "Mentally Deficient" },
];

/**
 * Section I: Intellectual Level for the Psychological Evaluation form.
 *
 * Displays radio buttons for classifying the patient's intellectual level
 * from "Very Superior" to "Mentally Deficient" based on standardized
 * intelligence testing results.
 */
export default function IntellectualLevelSection({
  data,
  onChange,
  disabled,
}: PsychologySectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="I. Intellectual Level" icon={BrainCircuit} />
      <RadioGroup
        name="intellectual_level"
        value={data.intellectual_level}
        onChange={(v) => updateField("intellectual_level", v)}
        options={INTELLECTUAL_LEVEL_OPTIONS}
        ariaLabel="Intellectual Level classification"
        disabled={disabled}
      />
    </div>
  );
}
