"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import { FileSignature } from "lucide-react";
import type { PanamaSectionProps, PanamaCertificate } from "./types";

const MONTH_OPTIONS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Panama Medical Certificate — Statement section (Section III).
 *
 * Captures the examinee's certification statement including:
 * - Name and signature of person undergoing examination
 * - Date (Day/Month/Year)
 * - Witness name and signature
 * - Authorization for release of medical records
 * - Approved medical practitioner details
 * - Previous medical examination details
 */
export default function StatementSection({ data, onChange, disabled }: PanamaSectionProps) {
  const update = (field: keyof PanamaCertificate, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="Statement"
        icon={FileSignature}
        subtitle="Certification and authorization"
      />

      {/* Intro text */}
      <p className="text-xs text-foreground/80 mb-3">
        I hereby certify that the personal declaration above is a true statement to the best of my knowledge.
      </p>

      <div className="space-y-3">
        {/* Name and signature */}
        <div className="grid grid-cols-2 gap-2">
          <FormField
            label="Name and signature of person undergoing examination"
            value={data.statement_name}
            onChange={(v) => update("statement_name", v)}
            disabled={disabled}
          />
          <FormField
            label="Signature"
            value={data.statement_signature}
            onChange={(v) => update("statement_signature", v)}
            disabled={disabled}
          />
        </div>

        {/* Date */}
        <div className="grid grid-cols-[1fr_1fr_1fr_3fr] gap-2">
          <FormField
            label="Day"
            value={data.statement_day}
            onChange={(v) => update("statement_day", v)}
            type="number"
            disabled={disabled}
          />
          <FormSelect
            label="Month"
            value={data.statement_month}
            onChange={(v) => update("statement_month", v)}
            options={MONTH_OPTIONS}
            disabled={disabled}
          />
          <FormField
            label="Year"
            value={data.statement_year}
            onChange={(v) => update("statement_year", v)}
            type="number"
            disabled={disabled}
          />
          <div />
        </div>

        {/* Witness */}
        <FormField
          label="Name and signature of Witness (Print name)"
          value={data.statement_witness_name}
          onChange={(v) => update("statement_witness_name", v)}
          disabled={disabled}
        />

        {/* Authorization text */}
        <p className="text-xs text-foreground/80 italic border-t border-primary/10 pt-3">
          I hereby authorize the release of all my previous medical records from any health professionals, health, institutions, and public authorities to Dr.
        </p>

        {/* Practitioner section */}
        <p className="text-xs text-foreground/70 font-semibold">
          (The approved medical practitioner)
        </p>

        <div className="grid grid-cols-2 gap-2">
          <FormField
            label="Name and signature of person undergoing examination"
            value={data.statement_practitioner_name}
            onChange={(v) => update("statement_practitioner_name", v)}
            disabled={disabled}
          />
          <FormField
            label="Signature"
            value={data.statement_practitioner_signature}
            onChange={(v) => update("statement_practitioner_signature", v)}
            disabled={disabled}
          />
        </div>

        {/* Practitioner date */}
        <div className="grid grid-cols-[1fr_1fr_1fr_3fr] gap-2">
          <FormField
            label="Day"
            value={data.statement_practitioner_date_day}
            onChange={(v) => update("statement_practitioner_date_day", v)}
            type="number"
            disabled={disabled}
          />
          <FormSelect
            label="Month"
            value={data.statement_practitioner_date_month}
            onChange={(v) => update("statement_practitioner_date_month", v)}
            options={MONTH_OPTIONS}
            disabled={disabled}
          />
          <FormField
            label="Year"
            value={data.statement_practitioner_date_year}
            onChange={(v) => update("statement_practitioner_date_year", v)}
            type="number"
            disabled={disabled}
          />
          <div />
        </div>

        {/* Practitioner witness */}
        <FormField
          label="Name and signature of Witness (print name)"
          value={data.statement_practitioner_witness}
          onChange={(v) => update("statement_practitioner_witness", v)}
          disabled={disabled}
        />

        {/* Previous exam details */}
        <FormField
          label="Date and contact details for previous medical examination (if known)"
          value={data.statement_previous_exam_details}
          onChange={(v) => update("statement_previous_exam_details", v)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
