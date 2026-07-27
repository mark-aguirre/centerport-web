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
import type { MlcSectionProps, MlcRecord } from "./types";

/** Fitness determination options per MLC standards. */
const FITNESS_OPTIONS = [
  "Fit for Sea Duty",
  "Fit with Restrictions",
  "Temporarily Unfit",
  "Unfit for Sea Service",
];

/**
 * Final Recommendation section for the MLC Health Certificate form.
 *
 * Captures: fitness determination dropdown, date of initial PEME,
 * date of fitness, valid until, authorized physician, medical
 * certification number, and medical director.
 *
 * @see CertificateDetailsSection — related section for certificate metadata
 */
export default function FinalRecommendationSection({
  data,
  onChange,
  disabled,
}: MlcSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  /** Set fitness determination to "Fit for Sea Duty". */
  const handleSetNormal = () => {
    onChange({ ...data, fitness_determination: "Fit for Sea Duty" });
  };

  /** Map from CertificationDetailsValues keys to MLC field names. */
  const FIELD_MAP: Record<keyof CertificationDetailsValues, string> = {
    dateInitialPeme: "date_initial_peme",
    dateOfFitness: "date_of_fitness",
    validUntil: "valid_until_date",
    authorizedPhysician: "examining_physician",
    medicalCertificationNo: "medical_certification_no",
    medicalDirector: "medical_director",
  };

  const handleCertChange = (field: keyof CertificationDetailsValues, value: string) => {
    updateField(FIELD_MAP[field] as keyof MlcRecord, value);
  };

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader
        title="Final Recommendation"
        icon={Award}
        action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
      />
      <div className="space-y-2">
        {/* Row 1: Fitness Determination */}
        <div className="grid grid-cols-3 gap-2">
          <FormSelect
            label="Fitness Determination"
            value={data.fitness_determination}
            onChange={(v) => updateField("fitness_determination", v)}
            options={FITNESS_OPTIONS}
            disabled={disabled}
            required
          />
        </div>

        {/* Certification Details */}
        <CertificationDetailsFields
          values={{
            dateInitialPeme: data.date_initial_peme,
            dateOfFitness: data.date_of_fitness,
            validUntil: data.valid_until_date,
            authorizedPhysician: data.examining_physician,
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
