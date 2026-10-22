"use client";

import { Loader2, Pencil, Save, FlaskConical, X } from "lucide-react";

import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSingleRecordForm } from "@/hooks/use-single-record-form";
import { api } from "@/lib/api";
import {
  EMPTY_CLINICAL_CHEMISTRY,
  type ClinicalChemistry,
} from "@/components/clinical-chemistry/types";

/** The examination rows, in the order shown on the Clinical Chemistry form. */
const EXAMINATIONS: {
  label: string;
  siField: keyof ClinicalChemistry;
  siUnit: string;
  convField: keyof ClinicalChemistry;
  convUnit: string;
}[] = [
  { label: "FBS", siField: "fbs_si", siUnit: "mmol/l", convField: "fbs_conv", convUnit: "mg/dl" },
  { label: "BUN", siField: "bun_si", siUnit: "mmol/l", convField: "bun_conv", convUnit: "mg/dl" },
  { label: "Creatinine", siField: "creatinine_si", siUnit: "mmol/l", convField: "creatinine_conv", convUnit: "mg/dl" },
  { label: "Cholesterol", siField: "cholesterol_si", siUnit: "mmol/l", convField: "cholesterol_conv", convUnit: "mg/dl" },
  { label: "Triglycerides", siField: "triglycerides_si", siUnit: "mmol/l", convField: "triglycerides_conv", convUnit: "mg/dl" },
  { label: "Uric Acid", siField: "uric_acid_si", siUnit: "mmol/l", convField: "uric_acid_conv", convUnit: "mg/dl" },
  { label: "SGOT", siField: "sgot_si", siUnit: "IU/L", convField: "sgot_conv", convUnit: "IU/L" },
  { label: "SGPT", siField: "sgpt_si", siUnit: "IU/L", convField: "sgpt_conv", convUnit: "IU/L" },
  { label: "Alk. Phos", siField: "alk_phos_si", siUnit: "IU/L", convField: "alk_phos_conv", convUnit: "IU/L" },
];

/**
 * Clinical Chemistry default values — a single editable reference-values form
 * rendered directly in the tab (no list, search, or dialog).
 *
 * Loads the one persisted record (or the seeded defaults for first-time use),
 * shows it read-only, and toggles into an editable state via Edit. Each
 * examination row shows its S.I. Unit value and its Conventional Unit value.
 */
export function ClinicalChemistryView() {
  const form = useSingleRecordForm<ClinicalChemistry>({
    api: api.entities.ClinicalChemistry,
    empty: EMPTY_CLINICAL_CHEMISTRY,
    label: "clinical chemistry values",
  });

  const { data, updateField, loading, saving, editing, edit, cancel, save } = form;
  const disabled = !editing;

  const inputClass = (readOnly: boolean) =>
    `h-7 text-xs bg-white border border-primary/30 rounded-md px-2 shadow-sm focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30 ${
      readOnly ? "pointer-events-none opacity-90" : ""
    }`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        {editing ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={cancel}
              disabled={saving}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" className="cursor-pointer" onClick={save} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              Save
            </Button>
          </>
        ) : (
          <Button size="sm" className="cursor-pointer" onClick={edit}>
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}
      </div>

      <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10 space-y-4">
        <SectionHeader
          title="Clinical Chemistry & Serology/Immunology"
          icon={FlaskConical}
          subtitle="Reference values"
        />

        {/* Column headings */}
        <div className="grid grid-cols-[110px_1fr_1fr] items-end gap-3">
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider">
            Examination
          </span>
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider text-center">
            S.I. Unit
          </span>
          <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider text-center">
            Conventional Unit
          </span>
        </div>

        {/* Examination rows */}
        <div className="space-y-2">
          {EXAMINATIONS.map((exam) => (
            <div
              key={exam.label}
              className="grid grid-cols-[110px_1fr_1fr] items-center gap-3"
            >
              <Label className="text-[11px] font-semibold text-foreground/80 uppercase tracking-wide">
                {exam.label}
              </Label>

              <div className="flex items-center gap-1.5">
                <Input
                  value={(data[exam.siField] as string) ?? ""}
                  onChange={(e) => updateField(exam.siField, e.target.value as ClinicalChemistry[typeof exam.siField])}
                  readOnly={disabled}
                  tabIndex={disabled ? -1 : undefined}
                  className={inputClass(disabled)}
                />
                <span className="min-w-[48px] text-[11px] text-muted-foreground">
                  {exam.siUnit}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Input
                  value={(data[exam.convField] as string) ?? ""}
                  onChange={(e) => updateField(exam.convField, e.target.value as ClinicalChemistry[typeof exam.convField])}
                  readOnly={disabled}
                  tabIndex={disabled ? -1 : undefined}
                  className={inputClass(disabled)}
                />
                <span className="min-w-[48px] text-[11px] text-muted-foreground">
                  {exam.convUnit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
