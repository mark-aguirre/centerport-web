"use client";

import { Waves } from "lucide-react";

import { SectionHeader } from "@/components/common/section-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import RadiologyNarrativeFields from "@/components/radiology/NarrativeFields";
import { createFieldUpdater } from "./utils";
import type { UltrasoundSectionProps } from "./types";

/**
 * Ultrasound Result section.
 *
 * Mirrors the reference form: the examination performed and the ultrasound
 * reference number on one row, followed by the Radiology Findings and
 * Impression narratives.
 */
export default function UltrasoundResultSection({
  data,
  onChange,
  disabled,
}: UltrasoundSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  const inputClasses = cn(
    "h-8 text-sm bg-white border border-primary/20 rounded-md px-2",
    "focus:outline-none focus-visible:border-primary dark:bg-input/30",
    disabled && "pointer-events-none opacity-70"
  );

  const labelClasses =
    "text-[11px] font-bold text-primary/70 uppercase tracking-wider whitespace-nowrap";

  return (
    <div className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
      <SectionHeader title="Ultrasound Result" icon={Waves} banner />

      <div className="grid grid-cols-[auto_1fr_auto_minmax(8rem,14rem)] gap-x-2 gap-y-2 items-center mb-4">
        <Label htmlFor="ultrasound-examination" className={labelClasses}>
          Examination <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ultrasound-examination"
          value={data.examination}
          onChange={(e) => updateField("examination", e.target.value)}
          className={cn(inputClasses, "min-w-0")}
          disabled={disabled}
        />
        <Label htmlFor="ultrasound-no" className={labelClasses}>
          Ultrasound No.
        </Label>
        <Input
          id="ultrasound-no"
          value={data.ultrasound_no}
          onChange={(e) => updateField("ultrasound_no", e.target.value)}
          className={cn(inputClasses, "min-w-0")}
          disabled={disabled}
        />
      </div>

      <RadiologyNarrativeFields data={data} onChange={onChange} disabled={disabled} />
    </div>
  );
}
