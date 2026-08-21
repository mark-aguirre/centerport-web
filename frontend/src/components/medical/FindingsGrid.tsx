"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { MedicalExam, MedicalSectionProps } from "./types";

interface FindingItem {
  key: string;
  label: string;
}

const FINDINGS_A: readonly FindingItem[] = [
  { key: "Skin", label: "Skin" },
  { key: "Head, Scalp", label: "Head, Scalp" },
  { key: "Eyes External", label: "Eyes External" },
  { key: "Pupils", label: "Pupils" },
  { key: "Ears", label: "Ears" },
  { key: "Nose, Sinuses", label: "Nose, Sinuses" },
  { key: "Mouth, Throat", label: "Mouth, Throat" },
];

const FINDINGS_B: readonly FindingItem[] = [
  { key: "Neck, Lymph Nodes", label: "Neck, Lymph Node." },
  { key: "Thyroid", label: "Thyroid" },
  { key: "Breast, Axilla", label: "Breast, Axilla" },
  { key: "Chest and Lungs", label: "Chest and Lungs" },
  { key: "Heart", label: "Heart" },
  { key: "Abdomen", label: "Abdomen" },
  { key: "Back", label: "Back" },
];

const FINDINGS_C: readonly FindingItem[] = [
  { key: "Anus, Rectum", label: "Anus- Rectum" },
  { key: "Genito-Urinary System", label: "Genito-Urinary System" },
  { key: "Inguinals, genitalia", label: "Inguinals, genitals" },
  { key: "Extremities", label: "Extremities" },
  { key: "Reflexes", label: "Reflexes" },
  { key: "Dental (Teeth/gums)", label: "Dental (Teeth/gums)" },
];

type FindingsColumn = "findings_a" | "findings_b" | "findings_c";
type FindingsRemarksColumn =
  | "findings_a_remarks"
  | "findings_b_remarks"
  | "findings_c_remarks";

interface ColumnConfig {
  label: "A" | "B" | "C";
  field: FindingsColumn;
  remarksField: FindingsRemarksColumn;
  items: readonly FindingItem[];
}

const COLUMNS: readonly ColumnConfig[] = [
  {
    label: "A",
    field: "findings_a",
    remarksField: "findings_a_remarks",
    items: FINDINGS_A,
  },
  {
    label: "B",
    field: "findings_b",
    remarksField: "findings_b_remarks",
    items: FINDINGS_B,
  },
  {
    label: "C",
    field: "findings_c",
    remarksField: "findings_c_remarks",
    items: FINDINGS_C,
  },
];

/**
 * Physical Examination Findings table for the Seabase examination.
 *
 * A checked box indicates a normal finding. Each A/B/C item has an adjacent
 * persisted remarks field for abnormal findings or other clinical notes.
 */
export function FindingsGrid({
  data,
  onChange,
  disabled,
}: MedicalSectionProps) {
  const updateFinding = (
    column: FindingsColumn,
    item: string,
    checked: boolean,
  ) => {
    onChange({
      ...data,
      [column]: { ...data[column], [item]: checked },
    });
  };

  const updateRemarks = (
    column: FindingsRemarksColumn,
    item: string,
    value: string,
  ) => {
    onChange({
      ...data,
      [column]: { ...data[column], [item]: value },
    });
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm",
        disabled && "pointer-events-none",
      )}
    >
      <div className="overflow-x-auto">
        <div className="grid min-w-[900px] grid-cols-3">
          {COLUMNS.map(({ label, field, remarksField, items }, columnIndex) => (
            <section
              key={field}
              className={cn(
                columnIndex < COLUMNS.length - 1 &&
                  "border-r border-primary/20",
              )}
              aria-labelledby={`${field}-heading`}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] border-b border-primary/20 bg-muted/20">
                <h3
                  id={`${field}-heading`}
                  className="border-r border-primary/20 px-2 py-1 text-center text-[11px] font-bold uppercase tracking-wider text-foreground"
                >
                  {label}
                </h3>
                <span className="px-2 py-1 text-center text-[11px] font-bold uppercase tracking-wider text-foreground">
                  Findings
                </span>
              </div>

              <div className="space-y-1 p-1.5">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-1"
                  >
                    <label className="flex min-w-0 cursor-pointer items-center justify-between gap-1 px-1">
                      <span className="text-[11px] leading-tight text-foreground/80">
                        {item.label}
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(data[field][item.key])}
                        onChange={(event) =>
                          updateFinding(field, item.key, event.target.checked)
                        }
                        tabIndex={disabled ? -1 : undefined}
                        className="h-4 w-4 shrink-0 cursor-pointer rounded accent-primary"
                        aria-label={`${item.label} normal`}
                      />
                    </label>
                    <Input
                      value={data[remarksField][item.key] ?? ""}
                      onChange={(event) =>
                        updateRemarks(remarksField, item.key, event.target.value)
                      }
                      readOnly={disabled}
                      tabIndex={disabled ? -1 : undefined}
                      className="h-7 min-w-0 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30"
                      aria-label={`${item.label} findings`}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
