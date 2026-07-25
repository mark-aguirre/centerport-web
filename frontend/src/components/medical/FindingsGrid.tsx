"use client";

import type { MedicalExam, MedicalSectionProps } from "./types";

/** Findings Column A — body systems */
const FINDINGS_A = [
  "Skin",
  "Head, Scalp",
  "Eyes External",
  "Pupils",
  "Ears",
  "Nose, Sinuses",
  "Mouth, Throat",
] as const;

/** Findings Column B — body systems */
const FINDINGS_B = [
  "Neck, Lymph Nodes",
  "Thyroid",
  "Breast, Axilla",
  "Chest and Lungs",
  "Heart",
  "Abdomen",
  "Back",
] as const;

/** Findings Column C — body systems */
const FINDINGS_C = [
  "Anus, Rectum",
  "Genito-Urinary System",
  "Inguinals, genitalia",
  "Extremities",
  "Reflexes",
  "Dental (Teeth/gums)",
] as const;

/** Column definition for rendering */
type FindingsColumn = "findings_a" | "findings_b" | "findings_c";

interface ColumnConfig {
  field: FindingsColumn;
  label: string;
  items: readonly string[];
}

const COLUMNS: ColumnConfig[] = [
  { field: "findings_a", label: "A Findings", items: FINDINGS_A },
  { field: "findings_b", label: "B Findings", items: FINDINGS_B },
  { field: "findings_c", label: "C Findings", items: FINDINGS_C },
];

/**
 * Findings grid sub-section of the Physical Examination form.
 *
 * Displays three columns (A, B, C) of body system checkboxes. Checked
 * indicates "normal"; unchecked indicates findings that need specification.
 *
 * @see PhysicalExaminationSection — parent orchestrator
 */
export function FindingsGrid({ data, onChange }: MedicalSectionProps) {
  const updateFinding = (col: FindingsColumn, item: string, checked: boolean) => {
    const updated: Record<string, boolean> = { ...data[col], [item]: checked };
    onChange({ ...data, [col]: updated } as MedicalExam);
  };

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map(({ field, label, items }) => (
          <div key={field}>
            <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider">
              {label}
            </span>
            <div className="space-y-1 mt-1">
              {items.map((item) => (
                <label key={item} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!data[field][item]}
                    onChange={(e) => updateFinding(field, item, e.target.checked)}
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <span className="text-xs text-foreground/80">{item}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
