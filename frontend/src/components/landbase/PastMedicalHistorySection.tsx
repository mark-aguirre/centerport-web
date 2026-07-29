"use client";

import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { Stethoscope } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { LandbaseSectionProps, MedicalConditionValue } from "./types";

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

const ALL_CONDITIONS = [...COLUMN_1, ...COLUMN_2, ...COLUMN_3];

export default function PastMedicalHistorySection({
  data,
  onChange,
  disabled,
}: LandbaseSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  const updateCondition = (condition: string, value: MedicalConditionValue) => {
    const updatedHistory = { ...(data.medical_history ?? {}), [condition]: value };
    onChange({ ...data, medical_history: updatedHistory });
  };

  const handleSetNormal = () => {
    const normalHistory: Record<string, MedicalConditionValue> = {};
    ALL_CONDITIONS.forEach((condition) => {
      normalHistory[condition] = "no";
    });
    onChange({
      ...data,
      medical_history: normalHistory,
      medical_history_others: "",
      consulted_doctor: false,
      maintenance_medications: "",
    });
  };

  const renderConditionRow = (condition: string) => {
    const currentValue = (data.medical_history ?? {})[condition] || "";
    return (
      <label
        key={condition}
        className="flex items-center gap-3 py-1.5 cursor-pointer select-none"
      >
        <span className="flex-1 text-sm text-foreground">{condition}</span>
        <span className="flex items-center gap-3 shrink-0">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name={`pmh-${condition}`}
              checked={currentValue === "yes"}
              onChange={() => updateCondition(condition, "yes")}
              disabled={disabled}
              className="w-3.5 h-3.5 accent-primary"
            />
            <span className="text-xs text-muted-foreground">Y</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name={`pmh-${condition}`}
              checked={currentValue === "no"}
              onChange={() => updateCondition(condition, "no")}
              disabled={disabled}
              className="w-3.5 h-3.5 accent-primary"
            />
            <span className="text-xs text-muted-foreground">N</span>
          </label>
        </span>
      </label>
    );
  };

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Past Medical History"
        icon={Stethoscope}
        subtitle="Has applicant suffered from or been told he has any of the following?"
        action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-0 divide-y divide-border">
          {COLUMN_1.map(renderConditionRow)}
        </div>
        <div className="space-y-0 divide-y divide-border">
          {COLUMN_2.map(renderConditionRow)}
        </div>
        <div className="space-y-0 divide-y divide-border">
          {COLUMN_3.map(renderConditionRow)}
        </div>
      </div>

      {/* Supplementary fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-1">
          <Label htmlFor="pmh-others" className="text-sm font-medium">
            Others
          </Label>
          <Input
            id="pmh-others"
            value={data.medical_history_others ?? ""}
            onChange={(e) => updateField("medical_history_others", e.target.value)}
            readOnly={disabled}
            className={cn(disabled && "pointer-events-none opacity-60")}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="pmh-medications" className="text-sm font-medium">
            Maintenance medications (specify if Yes)
          </Label>
          <Input
            id="pmh-medications"
            value={data.maintenance_medications ?? ""}
            onChange={(e) => updateField("maintenance_medications", e.target.value)}
            readOnly={disabled}
            className={cn(disabled && "pointer-events-none opacity-60")}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="consulted_doctor"
          checked={!!data.consulted_doctor}
          onCheckedChange={(checked) => updateField("consulted_doctor", !!checked)}
          disabled={disabled}
        />
        <Label htmlFor="consulted_doctor" className="text-sm cursor-pointer">
          Have you consulted any doctor about a disease in the past?
        </Label>
      </div>
    </section>
  );
}
