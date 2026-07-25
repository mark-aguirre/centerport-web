"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import { Award } from "lucide-react";
import type { LandbasePeme, LandbaseSectionProps } from "./types";

/**
 * Recommendation section for the Landbase PEME form.
 *
 * Split into two cards:
 * 1. Recommendation select with section header
 * 2. Dates, physician, certification, and director fields
 */
export default function RecommendationSection({
  data,
  onChange,
}: LandbaseSectionProps) {
  const update = (field: keyof LandbasePeme, value: string) =>
    onChange({ ...data, [field]: value } as LandbasePeme);

  return (
    <div className="space-y-3">
      {/* Card 1: Recommendation */}
      <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
        <SectionHeader title="Recommendation" icon={Award} />
        <div className="max-w-sm">
          <FormSelect
            value={data.recommendation}
            onChange={(v) => update("recommendation", v)}
            options={[
              "Fit for Employment",
              "Unfit for Employment",
              "Requires Further Evaluation",
              "Temporarily Unfit",
              "Fit with Restriction",
            ]}
          />
        </div>
      </div>

      {/* Card 2: Dates, Physician, Certification, Director */}
      <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
        <div className="space-y-2">
          {/* Dates Row */}
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
              value={data.valid_until}
              onChange={(v) => update("valid_until", v)}
              type="date"
            />
          </div>

          {/* Physician & Certification Row */}
          <div className="grid grid-cols-2 gap-2">
            <FormSelect
              label="Authorized Physician"
              value={data.authorized_physician}
              onChange={(v) => update("authorized_physician", v)}
              options={[
                "Dr. Juan Dela Cruz",
                "Dr. Maria Santos",
                "Dr. Jose Rizal",
                "Dr. Ana Reyes",
              ]}
            />
            <FormField
              label="Medical Certification No."
              value={data.medical_certification_no}
              onChange={(v) => update("medical_certification_no", v)}
            />
          </div>

          {/* Medical Director */}
          <div className="max-w-sm">
            <FormSelect
              label="Medical Director"
              value={data.medical_director}
              onChange={(v) => update("medical_director", v)}
              options={[
                "Dr. Juan Dela Cruz",
                "Dr. Maria Santos",
                "Dr. Jose Rizal",
                "Dr. Ana Reyes",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
