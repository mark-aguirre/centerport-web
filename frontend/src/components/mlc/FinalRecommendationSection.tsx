"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import { Award } from "lucide-react";
import type { MlcRecord, MlcSectionProps } from "./types";

/** Placeholder physician options — replace with API data when available */
const PHYSICIAN_OPTIONS = [
  "Dr. Maria Santos",
  "Dr. Juan Reyes",
  "Dr. Elena Cruz",
];

/** Placeholder medical director options — replace with API data when available */
const DIRECTOR_OPTIONS = [
  "Dr. Roberto Lim",
  "Dr. Patricia Gomez",
];

/**
 * Final Recommendation section for the MLC Health Certificate form.
 *
 * Captures: fitness determination dropdown, date of initial PEME,
 * date of fitness, valid until, authorized physician, medical
 * certification number, and medical director.
 */
export default function FinalRecommendationSection({
  data,
  onChange,
}: MlcSectionProps) {
  const update = (field: keyof MlcRecord, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader title="Final Recommendation" icon={Award} />
      <div className="space-y-2">
        {/* Row 1: Fitness Determination */}
        <div className="grid grid-cols-3 gap-2">
          <FormSelect
            label="Fitness Determination"
            value={data.fitness_determination}
            onChange={(v) => update("fitness_determination", v)}
            options={[
              "Fit for Sea Duty",
              "Fit with Restrictions",
              "Temporarily Unfit",
              "Unfit for Sea Service",
            ]}
            required
          />
        </div>

        {/* Row 2: Date of Initial PEME, Date of Fitness, Valid Until */}
        <div className="grid grid-cols-3 gap-2">
          <FormField
            label="Date of Initial PEME (MM/DD/YYYY)"
            value={data.date_initial_peme}
            onChange={(v) => update("date_initial_peme", v)}
            type="date"
          />
          <FormField
            label="Date of Fitness (MM/DD/YYYY)"
            value={data.date_of_fitness}
            onChange={(v) => update("date_of_fitness", v)}
            type="date"
          />
          <FormField
            label="Valid Until (MM/DD/YYYY)"
            value={data.valid_until_date}
            onChange={(v) => update("valid_until_date", v)}
            type="date"
          />
        </div>

        {/* Row 3: Authorized Physician, Medical Certification No */}
        <div className="grid grid-cols-[2fr_3fr] gap-2">
          <FormSelect
            label="Authorized Physician"
            value={data.examining_physician}
            onChange={(v) => update("examining_physician", v)}
            options={PHYSICIAN_OPTIONS}
          />
          <FormField
            label="Medical Certification No."
            value={data.medical_certification_no}
            onChange={(v) => update("medical_certification_no", v)}
          />
        </div>

        {/* Row 4: Medical Director */}
        <div className="grid grid-cols-3 gap-2">
          <FormSelect
            label="Medical Director"
            value={data.medical_director}
            onChange={(v) => update("medical_director", v)}
            options={DIRECTOR_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
}
