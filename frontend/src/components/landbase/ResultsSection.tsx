"use client";

import RadioGroup from "@/components/common/radio-group";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { createFieldUpdater } from "./utils";
import type { LandbasePeme, LandbaseSectionProps } from "./types";

/** Options for result pass/findings status. */
const RESULT_OPTIONS = [
  { label: "Passed", value: "passed" },
  { label: "With Significant Findings", value: "with_significant_findings" },
];

/**
 * Result row definitions for DRY rendering.
 *
 * Maps each result field to its display label. Adding a new result
 * category only requires adding an entry here.
 */
const RESULT_ROWS: { field: keyof LandbasePeme; label: string }[] = [
  { field: "basic_peme_result", label: "Basic DOH Mandatory Medical Examination:" },
  { field: "additional_lab_result", label: "Additional Laboratory Tests:" },
  { field: "flag_medical_lab_result", label: "Flag/Host Medical and Laboratory Requirements:" },
];

/**
 * Results section for the Landbase PEME form.
 *
 * Displays overall examination outcomes as Passed / With Significant
 * Findings radio pairs in a compact table layout. Covers:
 * - Basic DOH Mandatory Medical Examination
 * - Additional Laboratory Tests
 * - Flag/Host Medical and Laboratory Requirements
 *
 * The "Set Normal" button sets all results to "passed" for quick entry
 * when the applicant has no significant findings.
 *
 * @see RecommendationSection — where the final fitness determination is made
 */
export default function ResultsSection({
  data,
  onChange,
  disabled,
}: LandbaseSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  /** Set all results to "passed". */
  const handleSetNormal = () => {
    onChange({
      ...data,
      basic_peme_result: "passed",
      additional_lab_result: "passed",
      flag_medical_lab_result: "passed",
    });
  };

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-primary/20">
        <h2 className="text-xs font-bold text-primary uppercase tracking-widest">
          Results
        </h2>
        <SetNormalButton onClick={handleSetNormal} disabled={disabled} />
      </div>
      <div className="space-y-0">
        {RESULT_ROWS.map((row, index) => (
          <div
            key={row.field}
            className={`flex items-center py-1.5 border-b border-muted/30 last:border-0 px-1 rounded-sm ${index % 2 === 0 ? "bg-muted/30" : ""}`}
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
              disabled={disabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
