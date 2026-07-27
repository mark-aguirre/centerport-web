"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import { FileCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { MlcSectionProps } from "./types";

/** Certificate type options per MLC/STCW standards. */
const CERTIFICATE_TYPE_OPTIONS = ["ILO/MLC", "STCW", "Flag State"];

/** Placeholder physician options — replace with API data when available. */
const PHYSICIAN_OPTIONS = [
  "Dr. Juan Dela Cruz",
  "Dr. Maria Santos",
  "Dr. Jose Rizal",
  "Dr. Ana Reyes",
];

/**
 * Certificate Details section for the MLC form.
 *
 * Captures the medical certificate metadata: certificate type,
 * date of examination, date issued, valid until, issuing authority,
 * examining physician, medical director, and any limitations/remarks.
 *
 * This is distinct from the Final Recommendation section which handles
 * the fitness determination and certification dates.
 */
export default function CertificateDetailsSection({
  data,
  onChange,
  disabled,
}: MlcSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader title="Certificate Details" icon={FileCheck} />
      <div className="space-y-2">
        {/* Row 1: Certificate Type, Date of Examination, Date Issued */}
        <div className="grid grid-cols-3 gap-2">
          <FormSelect
            label="Certificate Type"
            value={data.certificate_type}
            onChange={(v) => updateField("certificate_type", v)}
            options={CERTIFICATE_TYPE_OPTIONS}
            disabled={disabled}
          />
          <FormField
            label="Date of Examination"
            value={data.date_of_examination}
            onChange={(v) => updateField("date_of_examination", v)}
            type="date"
            disabled={disabled}
          />
          <FormField
            label="Date Issued"
            value={data.date_issued}
            onChange={(v) => updateField("date_issued", v)}
            type="date"
            disabled={disabled}
          />
        </div>

        {/* Row 2: Valid Until, Issuing Authority */}
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <FormField
            label="Valid Until"
            value={data.valid_until}
            onChange={(v) => updateField("valid_until", v)}
            type="date"
            disabled={disabled}
          />
          <FormField
            label="Issuing Authority"
            value={data.issuing_authority}
            onChange={(v) => updateField("issuing_authority", v)}
            disabled={disabled}
          />
        </div>

        {/* Row 3: Examining Physician, Medical Director */}
        <div className="grid grid-cols-2 gap-2">
          <FormSelect
            label="Examining Physician"
            value={data.examining_physician}
            onChange={(v) => updateField("examining_physician", v)}
            options={PHYSICIAN_OPTIONS}
            disabled={disabled}
          />
          <FormSelect
            label="Medical Director"
            value={data.medical_director}
            onChange={(v) => updateField("medical_director", v)}
            options={PHYSICIAN_OPTIONS}
            disabled={disabled}
          />
        </div>

        {/* Limitations / Remarks */}
        <div className="space-y-1">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            Limitations / Remarks
          </Label>
          <Textarea
            value={data.limitations_remarks ?? ""}
            onChange={(e) => updateField("limitations_remarks", e.target.value)}
            className={cn(
              "min-h-[60px] text-sm bg-white border border-primary/20 rounded-md px-3 py-2",
              "focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none",
              disabled && "pointer-events-none"
            )}
            placeholder="Enter limitations or remarks..."
            readOnly={disabled}
          />
        </div>
      </div>
    </div>
  );
}
