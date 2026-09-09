"use client";

import {
  CertificationDetailsFields,
  type CertificationDetailsValues,
} from "@/components/common/certification-details-fields";
import { FormSelect } from "@/components/common/form-select";
import { SetNormalButton } from "@/components/common/set-normal-button";
import type { LandbasePeme, LandbaseSectionProps } from "./types";
import { createFieldUpdater } from "./utils";

// Must match the backend `RecommendationValue` enum values exactly (case-sensitive).
const RECOMMENDATION_OPTIONS = [
  "Fit for Employment",
  "Unfit for Employment",
  "Requires Further Evaluation",
  "Temporarily Unfit",
  "Fit with Restriction",
];

const FIELD_MAP: Record<keyof CertificationDetailsValues, string> = {
  dateInitialPeme: "date_initial_peme",
  dateOfFitness: "date_of_fitness",
  validUntil: "valid_until",
  authorizedPhysician: "authorized_physician",
  medicalCertificationNo: "medical_certification_no",
  medicalDirector: "medical_director",
};

/**
 * Paper-form recommendation and certification section for Landbase PEME.
 *
 * Uses the existing recommendation, date, physician, certification number,
 * and medical director fields without changing their persistence contract.
 */
export default function RecommendationSection({
  data,
  onChange,
  disabled,
}: LandbaseSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  const handleSetNormal = () => {
    onChange({ ...data, recommendation: "Fit for Employment" });
  };

  const handleCertChange = (
    field: keyof CertificationDetailsValues,
    value: string,
  ) => {
    updateField(FIELD_MAP[field] as keyof LandbasePeme, value);
  };

  const handleCertBatchChange = (
    updates: Partial<CertificationDetailsValues>,
  ) => {
    const mapped: Record<string, string> = {};
    for (const [key, value] of Object.entries(updates)) {
      mapped[FIELD_MAP[key as keyof CertificationDetailsValues]] = value;
    }
    onChange({ ...data, ...mapped });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm">
      <div className="grid grid-cols-1 gap-2 border-b border-primary/20 px-3 py-2 sm:grid-cols-[190px_minmax(0,1fr)_auto] sm:items-center">
        <h2 className="text-sm font-bold uppercase tracking-wide text-primary">
          V. Recommendation:
        </h2>
        <FormSelect
          value={data.recommendation}
          onChange={(value) => updateField("recommendation", value)}
          options={RECOMMENDATION_OPTIONS}
          disabled={disabled}
          className="w-full"
        />
        <SetNormalButton
          onClick={handleSetNormal}
          readOnly={disabled}
          className="justify-self-end"
        />
      </div>

      <div
        className={
          disabled
            ? "p-3 [&_button]:!opacity-100 [&_input]:!opacity-100"
            : "p-3"
        }
      >
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
          onBatchChange={handleCertBatchChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
