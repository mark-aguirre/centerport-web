"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import { ClipboardPlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MedicalExam, MedicalSectionProps } from "./types";

/**
 * Treatment Plan section for the Medical Examination form.
 *
 * Captures treatment plan, medications prescribed, follow-up date,
 * referral, consultation status, and examining physician details.
 */
export default function TreatmentPlanSection({
  data,
  onChange,
}: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader title="Treatment Plan" icon={ClipboardPlus} />
      <div className="space-y-2">
        {/* Treatment Plan */}
        <div className="space-y-0.5">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            Treatment / Management Plan
          </Label>
          <Textarea
            value={data.treatment_plan}
            onChange={(e) => update("treatment_plan", e.target.value)}
            className="h-20 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
            placeholder="Describe treatment plan, interventions, and recommendations..."
          />
        </div>

        {/* Medications Prescribed */}
        <div className="space-y-0.5">
          <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
            Medications Prescribed
          </Label>
          <Textarea
            value={data.medications_prescribed}
            onChange={(e) => update("medications_prescribed", e.target.value)}
            className="h-16 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none"
            placeholder="List medications, dosages, and frequency..."
          />
        </div>

        {/* Follow-up, Referral, Status row */}
        <div className="grid grid-cols-3 gap-2">
          <FormField
            label="Follow-up Date"
            value={data.follow_up_date}
            onChange={(v) => update("follow_up_date", v)}
            type="date"
          />
          <FormField
            label="Referral To"
            value={data.referral_to}
            onChange={(v) => update("referral_to", v)}
            placeholder="Specialist / Department"
          />
          <FormSelect
            label="Consultation Status"
            value={data.consultation_status}
            onChange={(v) => update("consultation_status", v)}
            options={["For Follow-up", "Cleared", "Referred", "Pending"]}
          />
        </div>

        {/* Examining Physician & License */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/10">
          <FormSelect
            label="Examining Physician"
            value={data.examining_physician}
            onChange={(v) => update("examining_physician", v)}
            options={[
              "Dr. Juan Dela Cruz",
              "Dr. Maria Santos",
              "Dr. Jose Rizal",
              "Dr. Ana Reyes",
            ]}
          />
          <FormField
            label="License No."
            value={data.license_no}
            onChange={(v) => update("license_no", v)}
          />
        </div>
      </div>
    </div>
  );
}
