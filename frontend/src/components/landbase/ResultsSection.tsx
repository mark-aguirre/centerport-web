"use client";

import { SetNormalButton } from "@/components/common/set-normal-button";
import { cn } from "@/lib/utils";
import { RADIO_OPTION_LABEL_CLASS } from "@/lib/form-styles";
import type { LandbasePeme, LandbaseSectionProps, PassStatus } from "./types";
import { createFieldUpdater } from "./utils";

type ResultField =
  | "basic_peme_result"
  | "additional_lab_result"
  | "flag_medical_lab_result";

const RESULT_OPTIONS: { label: string; value: Exclude<PassStatus, ""> }[] = [
  { label: "PASSED", value: "passed" },
  {
    label: "WITH SIGNIFICANT FINDINGS",
    value: "with_significant_findings",
  },
];

const RESULT_ROWS: { field: ResultField; label: string }[] = [
  {
    field: "basic_peme_result",
    label: "Basic DOH Mandatory Medical Examination",
  },
  { field: "additional_lab_result", label: "Additional Laboratory Tests" },
  {
    field: "flag_medical_lab_result",
    label: "Flag/Host Medical and Laboratory Requirements",
  },
];

/**
 * Paper-form result summary for the Landbase PEME form.
 *
 * Displays the three persisted result categories with explicit Passed and
 * With Significant Findings choices. Set Normal marks every row as passed.
 */
export default function ResultsSection({
  data,
  onChange,
  disabled,
}: LandbaseSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  const handleSetNormal = () => {
    onChange({
      ...data,
      basic_peme_result: "passed",
      additional_lab_result: "passed",
      flag_medical_lab_result: "passed",
    });
  };

  const updateResult = (field: keyof LandbasePeme, value: PassStatus) => {
    if (!disabled) {
      updateField(field, value);
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm",
        disabled && "pointer-events-none",
      )}
    >
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {RESULT_ROWS.map((row, rowIndex) => (
            <div
              key={row.field}
              className="grid min-h-10 grid-cols-[minmax(340px,1.45fr)_minmax(150px,0.65fr)_minmax(260px,1fr)_110px] items-center gap-3 border-b border-primary/15 px-3 py-1.5 last:border-b-0 even:bg-muted/10"
            >
              <span className="text-xs text-foreground/80">{row.label}:</span>
              {RESULT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    RADIO_OPTION_LABEL_CLASS,
                    disabled ? "cursor-default" : "cursor-pointer",
                  )}
                >
                  <input
                    type="radio"
                    name={row.field}
                    checked={data[row.field] === option.value}
                    onChange={() => updateResult(row.field, option.value)}
                    aria-label={`${row.label} - ${option.label}`}
                    aria-disabled={disabled}
                    tabIndex={disabled ? -1 : undefined}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="whitespace-nowrap text-xs text-foreground/80">
                    {option.label}
                  </span>
                </label>
              ))}
              {rowIndex === 0 ? (
                <SetNormalButton
                  onClick={handleSetNormal}
                  readOnly={disabled}
                  className="justify-self-end"
                />
              ) : (
                <span aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
