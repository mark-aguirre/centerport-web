"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import type { MedicalExam, MedicalSectionProps } from "./types";

/**
 * Physical Examination vitals sub-section.
 *
 * Captures height, weight, blood pressure (systolic/diastolic), pulse rate,
 * respiration, body temperature, MM/YM, and BMI in a compact grid layout.
 *
 * @see PhysicalExaminationSection — parent orchestrator
 */
export function VitalsSection({ data, onChange, disabled }: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader
        title="Physical Examination"
        subtitle="Enter the data called for. Check the appropriate box. Under columns A, B, C check YES if normal uncheck if not normal and specify findings."
      />
      <div className="space-y-2">
        {/* Row 1 */}
        <div className="grid grid-cols-5 gap-2">
          <FormField label="Height (CM)" value={data.pe_height} onChange={(v) => update("pe_height", v)} placeholder="" disabled={disabled} />
          <FormField label="Blood Pressure Systolic (mm Hg)" value={data.pe_bp_systolic} onChange={(v) => update("pe_bp_systolic", v)} placeholder="" disabled={disabled} />
          <FormField label="Pulse Rate (BPM)" value={data.pe_pulse_rate} onChange={(v) => update("pe_pulse_rate", v)} placeholder="" disabled={disabled} />
          <FormField label="Respiration" value={data.pe_respiration} onChange={(v) => update("pe_respiration", v)} placeholder="" disabled={disabled} />
          <FormField label="Body Temperature" value={data.pe_body_temperature} onChange={(v) => update("pe_body_temperature", v)} placeholder="" disabled={disabled} />
        </div>
        {/* Row 2 */}
        <div className="grid grid-cols-4 gap-2">
          <FormField label="Weight (KG)" value={data.pe_weight} onChange={(v) => update("pe_weight", v)} placeholder="" disabled={disabled} />
          <FormField label="Blood Pressure Diastolic (mm Hg)" value={data.pe_bp_diastolic} onChange={(v) => update("pe_bp_diastolic", v)} placeholder="" disabled={disabled} />
          <FormField label="MM/YM" value={data.pe_mm_ym} onChange={(v) => update("pe_mm_ym", v)} placeholder="" disabled={disabled} />
          <FormField label="BMI" value={data.pe_bmi} onChange={(v) => update("pe_bmi", v)} placeholder="" disabled={disabled} />
        </div>
      </div>
    </div>
  );
}
