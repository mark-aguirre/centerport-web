"use client";

import { SectionHeader } from "@/components/common/section-header";
import { Stethoscope } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { YesNoRadioRow } from "./YesNoRadioRow";
import type { MedicalExam, MedicalSectionProps } from "./types";

/** Column 1 conditions */
const COLUMN_1 = [
  "Hypertension",
  "Diabetes Mellitus",
  "Heart Disease",
  "Asthma / COPD",
  "Tuberculosis",
  "Kidney Disease",
  "Liver Disease",
  "Thyroid Disorder",
  "Seizure Disorder / Epilepsy",
  "Stroke / CVA",
] as const;

/** Column 2 conditions */
const COLUMN_2 = [
  "Cancer / Malignancy",
  "Blood Disorders",
  "Peptic Ulcer / GERD",
  "Hepatitis B / C",
  "HIV / AIDS",
  "Sexually Transmitted Infections",
  "Mental Health Disorders",
  "Musculoskeletal Disorders",
  "Allergic Rhinitis / Sinusitis",
  "Skin Disorders",
] as const;

/**
 * Medical History section for the Medical Examination form.
 *
 * Displays a 2-column radio grid of medical conditions with Yes/No options,
 * plus fields for surgical history, family history, allergies, medications,
 * and social history (smoking, alcohol).
 *
 * Uses the shared `YesNoRadioRow` component for consistent condition
 * rendering across the medical form.
 *
 * @see YesNoRadioRow — shared radio row component
 * @see PastMedicalHistoryGrid — similar 3-column grid in physical exam
 */
export default function MedicalHistorySection({
  data,
  onChange,
}: MedicalSectionProps) {
  const updateCondition = (condition: string, value: string) => {
    const updatedHistory = { ...data.medical_history, [condition]: value };
    onChange({ ...data, medical_history: updatedHistory });
  };

  const updateField = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value } as MedicalExam);

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="Medical History"
        icon={Stethoscope}
        subtitle="Does the patient have or has had any of the following conditions?"
      />

      {/* Condition Grid - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mb-3">
        <div>
          {COLUMN_1.map((condition) => (
            <YesNoRadioRow
              key={condition}
              condition={condition}
              name={`med-condition-${condition}`}
              value={data.medical_history[condition] || ""}
              onChange={(v) => updateCondition(condition, v)}
            />
          ))}
        </div>
        <div>
          {COLUMN_2.map((condition) => (
            <YesNoRadioRow
              key={condition}
              condition={condition}
              name={`med-condition-${condition}`}
              value={data.medical_history[condition] || ""}
              onChange={(v) => updateCondition(condition, v)}
            />
          ))}
        </div>
      </div>

      {/* Additional history fields */}
      <div className="space-y-2 border-t border-primary/10 pt-3">
        {/* Surgical History */}
        <div className="space-y-0.5">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            Surgical History
          </Label>
          <Textarea
            value={data.surgical_history}
            onChange={(e) => updateField("surgical_history", e.target.value)}
            className="h-14 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
            placeholder="List previous surgeries and dates..."
          />
        </div>

        {/* Family History */}
        <div className="space-y-0.5">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            Family History
          </Label>
          <Textarea
            value={data.family_history}
            onChange={(e) => updateField("family_history", e.target.value)}
            className="h-14 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
            placeholder="Significant family medical history..."
          />
        </div>

        {/* Allergies & Current Medications - side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
              Allergies
            </Label>
            <Textarea
              value={data.allergies}
              onChange={(e) => updateField("allergies", e.target.value)}
              className="h-14 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
              placeholder="Drug / food / environmental allergies..."
            />
          </div>
          <div className="space-y-0.5">
            <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
              Current Medications
            </Label>
            <Textarea
              value={data.current_medications}
              onChange={(e) => updateField("current_medications", e.target.value)}
              className="h-14 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
              placeholder="List current medications, dosages..."
            />
          </div>
        </div>

        {/* Social History - Smoking & Alcohol */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
              Smoking History
            </Label>
            <input
              type="text"
              value={data.smoking_history}
              onChange={(e) => updateField("smoking_history", e.target.value)}
              className="w-full h-7 text-xs bg-white border border-primary/20 rounded px-2 focus:outline-none focus:border-primary dark:bg-input/30"
              placeholder="e.g. Non-smoker / 10 pack-years / Quit 2020"
            />
          </div>
          <div className="space-y-0.5">
            <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
              Alcohol History
            </Label>
            <input
              type="text"
              value={data.alcohol_history}
              onChange={(e) => updateField("alcohol_history", e.target.value)}
              className="w-full h-7 text-xs bg-white border border-primary/20 rounded px-2 focus:outline-none focus:border-primary dark:bg-input/30"
              placeholder="e.g. Social drinker / Non-drinker / Heavy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
