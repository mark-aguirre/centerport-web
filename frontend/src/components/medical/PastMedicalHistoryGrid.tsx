"use client";

import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { YesNoRadioRow } from "./YesNoRadioRow";
import type { MedicalExam, MedicalSectionProps } from "./types";

/** Past Medical History — Column 1 conditions */
const COLUMN_1 = [
  "Head or Neck Injury",
  "Frequent Headaches",
  "Frequent Dizziness",
  "Fainting Spells, Fits, Seizures or other Neurological Disorders",
  "Insomnia or sleep disorders, Manias, Phobias",
  "Depression, other Mental Disorders",
  "Trachoma, other eye Disorders",
  "Deafness, other Ear Disorders",
  "Nose or Throat Disorders",
  "Tuberculosis",
] as const;

/** Past Medical History — Column 2 conditions */
const COLUMN_2 = [
  "Other Lung Disorders",
  "High Blood Pressure",
  "Heart Disease/Heart Pain",
  "Rheumatic Fever",
  "Diabetes Mellitus",
  "Other Endocrine Disorders (e.g. Goiter)",
  "Cancer or Tumor",
  "Blood Disorders",
  "Stomach Pain, Gastritis or Ulcer",
  "Other Abdominal Disorders",
] as const;

/** Past Medical History — Column 3 conditions */
const COLUMN_3 = [
  "Kidney or Bladder Disorder",
  "Back Injury: Joint Pain/Arthritis/Rheumatism",
  "Genetic, Hereditary or Familial Disorders",
  "Sexually Transmitted Diseases",
  "Last Menstrual Period",
  "Tropical Diseases",
  "Schistosomiasis",
  "Asthma",
  "Allergies (Specify):",
  "Gynecological Disorder (For female)",
  "Operations (Specify)",
] as const;

/** All conditions across all columns (used for "Set Normal"). */
const ALL_CONDITIONS = [...COLUMN_1, ...COLUMN_2, ...COLUMN_3];

/**
 * Past Medical History sub-section of the Physical Examination form.
 *
 * Displays a 3-column Y/N checkbox grid of medical conditions plus
 * free-text fields for "Others", doctor consultation, and maintenance
 * medications.
 *
 * "Set Normal" sets all conditions to "no" (applicant has NOT had
 * these conditions), clears text fields, and unchecks consultation.
 *
 * @see PhysicalExaminationSection — parent orchestrator
 * @see YesNoRadioRow — shared radio row component
 */
export function PastMedicalHistoryGrid({ data, onChange, disabled }: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  const history = data.medical_history ?? {};

  const updateCondition = (condition: string, value: string) => {
    const updatedHistory = { ...history, [condition]: value };
    onChange({ ...data, medical_history: updatedHistory });
  };

  /** Set all conditions to "no", clear text fields, uncheck consultation. */
  const handleSetNormal = () => {
    const normalHistory: Record<string, string> = {};
    ALL_CONDITIONS.forEach((condition) => {
      normalHistory[condition] = "no";
    });
    onChange({
      ...data,
      medical_history: normalHistory,
      medical_history_others: "",
      consulted_doctor_past: "no",
      maintenance_medications: "",
    });
  };

  return (
    <div className={cn("bg-card rounded-lg p-3 shadow-sm border border-primary/10", disabled && "pointer-events-none")}>
      <SectionHeader
        title="Past Medical History"
        icon={Activity}
        subtitle="Has applicant suffered from or been told he has any of the following? Check the appropriate box."
        action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
      />
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
          <div>
            {COLUMN_1.map((c) => (
              <YesNoRadioRow
                key={c}
                condition={c}
                name={`pmh-${c}`}
                value={history[c] || ""}
                onChange={(v) => updateCondition(c, v)}
              />
            ))}
          </div>
          <div>
            {COLUMN_2.map((c) => (
              <YesNoRadioRow
                key={c}
                condition={c}
                name={`pmh-${c}`}
                value={history[c] || ""}
                onChange={(v) => updateCondition(c, v)}
              />
            ))}
          </div>
          <div>
            {COLUMN_3.map((c) => (
              <YesNoRadioRow
                key={c}
                condition={c}
                name={`pmh-${c}`}
                value={history[c] || ""}
                onChange={(v) => updateCondition(c, v)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-muted/30">
          <Label className="text-[11px] font-semibold text-foreground/70 shrink-0">Others:</Label>
          <Input
            value={data.medical_history_others ?? ""}
            onChange={(e) => update("medical_history_others", e.target.value)}
            className="h-7 text-xs flex-1"
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="consulted_doctor_past"
            checked={data.consulted_doctor_past === "yes"}
            onChange={(e) => update("consulted_doctor_past", e.target.checked ? "yes" : "no")}
            className="w-4 h-4 accent-primary rounded"
          />
          <Label htmlFor="consulted_doctor_past" className="text-xs text-foreground/80 cursor-pointer">
            Have you consulted any doctor about a disease in the past? Check if Yes.
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-[11px] font-semibold text-foreground/70 shrink-0">
            Are you taking maintenance medications? If yes, specify:
          </Label>
          <Input
            value={data.maintenance_medications ?? ""}
            onChange={(e) => update("maintenance_medications", e.target.value)}
            className="h-7 text-xs flex-1"
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
          />
        </div>
      </div>
    </div>
  );
}
