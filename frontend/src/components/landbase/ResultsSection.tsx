"use client";

import RadioGroup from "@/components/common/radio-group";
import type { LandbasePeme, LandbaseSectionProps } from "./types";

/** Options for result pass/findings status */
const RESULT_OPTIONS = [
  { label: "Passed", value: "passed" },
  { label: "With Significant Findings", value: "with_significant_findings" },
];

/** Result row definitions for DRY rendering */
const RESULT_ROWS: { field: keyof LandbasePeme; label: string }[] = [
  { field: "basic_peme_result", label: "Basic DOH Mandatory Medical Examination:" },
  { field: "additional_lab_result", label: "Additional Laboratory Tests:" },
  { field: "flag_medical_lab_result", label: "Flag/Host Medical and Laboratory Requirements:" },
];

/**
 * Results section for the Landbase PEME form.
 *
 * Displays the overall PEME result, additional lab tests result,
 * and flag from medical/laboratory requirements as Passed / With
 * Significant Findings radio pairs in a compact table layout.
 */
export default function ResultsSection({
  data,
  onChange,
}: LandbaseSectionProps) {
  const updateField = (field: keyof LandbasePeme, value: string) =>
    onChange({ ...data, [field]: value } as LandbasePeme);

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <div className="space-y-0">
        {RESULT_ROWS.map((row) => (
          <div
            key={row.field}
            className="flex items-center py-1.5 border-b border-muted/30 last:border-0"
          >
            <span className="text-xs text-foreground/80 text-right pr-4 w-72 shrink-0">
              {row.label}
            </span>
            <RadioGroup
              name={row.field}
              value={data[row.field] as string}
              onChange={(v) => updateField(row.field, v)}
              options={RESULT_OPTIONS}
              ariaLabel={row.label}
              className="!space-y-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
