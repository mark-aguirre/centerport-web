"use client";

import { SectionHeader } from "@/components/common/section-header";
import RadioGroup from "@/components/common/radio-group";
import { Stethoscope } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { LandbasePeme, LandbaseSectionProps, MedicalConditionValue } from "./types";

/** Column 1 conditions */
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

/** Column 2 conditions */
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

/** Column 3 conditions */
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

const YES_NO_OPTIONS = [
  { label: "Y", value: "yes" },
  { label: "N", value: "no" },
];

/**
 * Past Medical History section for the Landbase PEME form.
 *
 * Displays a 3-column radio grid of medical conditions with Yes/No options,
 * plus fields for "Others", doctor consultation, and maintenance meds.
 */
export default function PastMedicalHistorySection({
  data,
  onChange,
}: LandbaseSectionProps) {
  const updateCondition = (condition: string, value: MedicalConditionValue) => {
    const updatedHistory = { ...data.medical_history, [condition]: value };
    onChange({ ...data, medical_history: updatedHistory });
  };

  const updateField = (field: keyof LandbasePeme, value: string | boolean) =>
    onChange({ ...data, [field]: value } as LandbasePeme);

  const renderConditionRow = (condition: string) => {
    const currentValue = data.medical_history[condition] || "";
    return (
      <div
        key={condition}
        className="flex items-center justify-between py-1 border-b border-muted/20"
      >
        <span className="text-xs text-foreground/80 leading-tight flex-1 pr-1">
          {condition}
        </span>
        <RadioGroup
          name={`condition-${condition}`}
          value={currentValue}
          onChange={(v) => updateCondition(condition, v as MedicalConditionValue)}
          options={YES_NO_OPTIONS}
          ariaLabel={condition}
          className="space-y-0 [&_[role=radiogroup]]:h-6 [&_[role=radiogroup]]:gap-3"
        />
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader
        title="Past Medical History"
        icon={Stethoscope}
        subtitle="Has applicant suffered from or been told he has any of the following? Check the appropriate box."
      />

      {/* Condition Grid - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 mb-2">
        <div>{COLUMN_1.map(renderConditionRow)}</div>
        <div>{COLUMN_2.map(renderConditionRow)}</div>
        <div>{COLUMN_3.map(renderConditionRow)}</div>
      </div>

      {/* Others */}
      <div className="space-y-1.5 border-t border-primary/10 pt-2">
        <div className="flex items-center gap-2">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider shrink-0">
            Others:
          </Label>
          <Input
            value={data.medical_history_others}
            onChange={(e) => updateField("medical_history_others", e.target.value)}
            className="h-7 text-xs bg-white border-primary/20 focus-visible:border-primary dark:bg-input/30 flex-1"
            placeholder=""
          />
        </div>

        {/* Doctor consultation checkbox */}
        <div className="flex items-center gap-1.5">
          <Checkbox
            id="consulted_doctor"
            checked={data.consulted_doctor}
            onCheckedChange={(checked) =>
              updateField("consulted_doctor", !!checked)
            }
            className="w-4 h-4"
          />
          <Label
            htmlFor="consulted_doctor"
            className="text-[11px] text-foreground/80 cursor-pointer"
          >
            Have you consulted any doctor about a disease in the past? Check if Yes.
          </Label>
        </div>

        {/* Maintenance medications */}
        <div className="flex items-center gap-2">
          <Label className="text-[11px] text-foreground/70 italic shrink-0">
            Are you taking maintenance medications? If Yes, specify:
          </Label>
          <Input
            value={data.maintenance_medications}
            onChange={(e) => updateField("maintenance_medications", e.target.value)}
            className="h-7 text-xs bg-white border-primary/20 focus-visible:border-primary dark:bg-input/30 flex-1"
            placeholder=""
          />
        </div>
      </div>
    </div>
  );
}
