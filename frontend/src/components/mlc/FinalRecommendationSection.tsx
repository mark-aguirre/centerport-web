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

  /**
   * Set the section to its "normal" defaults:
   * - Fitness determination: "Fit for Sea Duty"
   * - Date of Initial PEME and Date of Fitness: today
   * - Valid Until: two years after Date of Fitness (keeps validity in sync)
   *
   * Dates are stored as ISO (`yyyy-mm-dd`) — the native `type="date"` input
   * renders them in the MM/DD/YYYY format shown on the field labels.
   */
  const handleSetNormal = () => {
    const today = new Date();
    const toIso = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    const todayIso = toIso(today);
    const validUntil = new Date(today);
    validUntil.setFullYear(validUntil.getFullYear() + 2);

    onChange({
      ...data,
      fitness_determination: "Fit for Sea Duty",
      date_initial_peme: todayIso,
      date_of_fitness: todayIso,
      valid_until_date: toIso(validUntil),
    });
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

  const handleCertBatchChange = (updates: Partial<CertificationDetailsValues>) => {
    const mapped: Record<string, string> = {};
    for (const [key, val] of Object.entries(updates)) {
      mapped[FIELD_MAP[key as keyof CertificationDetailsValues]] = val as string;
    }
    onChange({ ...data, ...mapped } as typeof data);
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="Final Recommendation"
        icon={Award}
        action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
        banner
      />
      <div className="space-y-2">
        {/* Row 1: Fitness Determination */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
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
          onBatchChange={handleCertBatchChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
