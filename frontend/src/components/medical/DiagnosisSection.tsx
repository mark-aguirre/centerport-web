"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MedicalExam, MedicalSectionProps } from "./types";

/**
 * Diagnosis section for the Medical Examination form.
 *
 * Captures primary diagnosis, secondary diagnosis, and ICD-10 code.
 */
export default function DiagnosisSection({
  data,
  onChange,
}: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader title="Diagnosis" icon={FileText} />
      <div className="space-y-2">
        {/* Primary Diagnosis */}
        <div className="space-y-0.5">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            Primary Diagnosis
          </Label>
          <Textarea
            value={data.primary_diagnosis}
            onChange={(e) => update("primary_diagnosis", e.target.value)}
            className="h-16 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
            placeholder="Enter primary diagnosis..."
          />
        </div>

        {/* Secondary Diagnosis & ICD Code */}
        <div className="grid grid-cols-[3fr_1fr] gap-3">
          <div className="space-y-0.5">
            <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
              Secondary Diagnosis
            </Label>
            <Textarea
              value={data.secondary_diagnosis}
              onChange={(e) => update("secondary_diagnosis", e.target.value)}
              className="h-16 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
              placeholder="Enter secondary diagnosis (if any)..."
            />
          </div>
          <FormField
            label="ICD-10 Code"
            value={data.icd_code}
            onChange={(v) => update("icd_code", v)}
            placeholder="e.g. J06.9"
          />
        </div>
      </div>
    </div>
  );
}
