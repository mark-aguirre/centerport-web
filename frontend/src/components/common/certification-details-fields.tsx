"use client";

import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";

/** Physician options shared across all certification sections. */
const PHYSICIAN_OPTIONS = [
  "Dr. Juan Dela Cruz",
  "Dr. Maria Santos",
  "Dr. Jose Rizal",
  "Dr. Ana Reyes",
];

/** Values for the certification details fields. */
export interface CertificationDetailsValues {
  dateInitialPeme: string;
  dateOfFitness: string;
  validUntil: string;
  authorizedPhysician: string;
  medicalCertificationNo: string;
  medicalDirector: string;
}

export interface CertificationDetailsFieldsProps {
  /** Current field values. */
  values: CertificationDetailsValues;
  /** Called when any field value changes. */
  onChange: (field: keyof CertificationDetailsValues, value: string) => void;
  /** Disables all fields when true. */
  disabled?: boolean;
  /** Override the default physician options if needed. */
  physicianOptions?: string[];
}

/**
 * Reusable certification details fields group.
 *
 * Renders the standard layout used across Medical, MLC, and Landbase forms:
 * - Row 1: Date of Initial PEME, Date of Fitness, Valid Until
 * - Row 2: Authorized Physician, Medical Certification No.
 * - Row 3: Medical Director
 *
 * @example
 * ```tsx
 * <CertificationDetailsFields
 *   values={{
 *     dateInitialPeme: data.date_initial_peme,
 *     dateOfFitness: data.date_of_fitness,
 *     validUntil: data.valid_until,
 *     authorizedPhysician: data.authorized_physician,
 *     medicalCertificationNo: data.medical_certification_no,
 *     medicalDirector: data.medical_director,
 *   }}
 *   onChange={(field, value) => { ... }}
 *   disabled={disabled}
 * />
 * ```
 */
export function CertificationDetailsFields({
  values,
  onChange,
  disabled,
  physicianOptions = PHYSICIAN_OPTIONS,
}: CertificationDetailsFieldsProps) {
  return (
    <div className="space-y-2">
      {/* Row 1: Date of Initial PEME, Date of Fitness, Valid Until */}
      <div className="grid grid-cols-3 gap-2">
        <FormField
          label="Date of Initial PEME (MM/DD/YYYY)"
          value={values.dateInitialPeme}
          onChange={(v) => onChange("dateInitialPeme", v)}
          type="date"
          disabled={disabled}
        />
        <FormField
          label="Date of Fitness (MM/DD/YYYY)"
          value={values.dateOfFitness}
          onChange={(v) => onChange("dateOfFitness", v)}
          type="date"
          disabled={disabled}
        />
        <FormField
          label="Valid Until (MM/DD/YYYY)"
          value={values.validUntil}
          onChange={(v) => onChange("validUntil", v)}
          type="date"
          disabled={disabled}
        />
      </div>

      {/* Row 2: Authorized Physician, Medical Certification No. */}
      <div className="grid grid-cols-[2fr_3fr] gap-2">
        <FormSelect
          label="Authorized Physician"
          value={values.authorizedPhysician}
          onChange={(v) => onChange("authorizedPhysician", v)}
          options={physicianOptions}
          disabled={disabled}
        />
        <FormField
          label="Medical Certification No."
          value={values.medicalCertificationNo}
          onChange={(v) => onChange("medicalCertificationNo", v)}
          disabled={disabled}
        />
      </div>

      {/* Row 3: Medical Director */}
      <div className="max-w-sm">
        <FormSelect
          label="Medical Director"
          value={values.medicalDirector}
          onChange={(v) => onChange("medicalDirector", v)}
          options={physicianOptions}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
