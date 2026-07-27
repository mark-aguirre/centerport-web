"use client";

import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { FormSelect } from "@/components/common/form-select";
import {
  CertificationDetailsFields,
  type CertificationDetailsValues,
} from "@/components/common/certification-details-fields";
import { Award } from "lucide-react";
import { createFieldUpdater } from "./utils";
import type { LandbaseSectionProps } from "./types";

/** Available recommendation values for the fitness determination. */
const RECOMMENDATION_OPTIONS = [
  "Fit for Employment",
  "Unfit for Employment",
  "Requires Further Evaluation",
  "Temporarily Unfit",
  "Fit with Restriction",
];

/**
 * Recommendation section for the Landbase PEME form.
 *
 * Split into two visual cards:
 * 1. Fitness recommendation select with "Set Normal" shortcut
 * 2. Certification details: dates, authorized physician,
 *    medical certification number, and medical director
 *
 * The "Set Normal" button sets recommendation to "Fit for Employment"
 * for quick entry when the applicant passes all examinations.
 *
 * @see ResultsSection — provides the examination outcomes that inform this recommendation
 */
export default function RecommendationSection({
  data,
  onChange,
  disabled,
}: LandbaseSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  /** Set recommendation to "Fit for Employment". */
  const handleSetNormal = () => {
    onChange({ ...data, recommendation: "Fit for Employment" });
  };

  /** Map from CertificationDetailsValues keys to landbase field names. */
  const FIELD_MAP: Record<keyof CertificationDetailsValues, string> = {
    dateInitialPeme: "date_initial_peme",
    dateOfFitness: "date_of_fitness",
    validUntil: "valid_until",
    authorizedPhysician: "authorized_physician",
    medicalCertificationNo: "medical_certification_no",
    medicalDirector: "medical_director",
  };

  const handleCertChange = (field: keyof CertificationDetailsValues, value: string) => {
    updateField(FIELD_MAP[field], value);
  };

  return (
    <div className="space-y-3">
      {/* Card 1: Recommendation */}
      <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
        <SectionHeader
          title="Recommendation"
          icon={Award}
          action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
        />
        <div className="max-w-sm">
          <FormSelect
            value={data.recommendation}
            onChange={(v) => updateField("recommendation", v)}
            options={RECOMMENDATION_OPTIONS}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Card 2: Dates, Physician, Certification, Director */}
      <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
        <CertificationDetailsFields
          values={{
            dateInitialPeme: data.date_initial_peme,
            dateOfFitness: data.date_of_fitness,
            validUntil: data.valid_until,
            authorizedPhysician: data.authorized_physician,
            medicalCertificationNo: data.medical_certification_no,
            medicalDirector: data.medical_director,
          }}
          onChange={handleCertChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
