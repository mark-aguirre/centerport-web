"use client";

import { ScanLine } from "lucide-react";

import { SectionHeader } from "@/components/common/section-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import RadiologyNarrativeFields from "@/components/radiology/NarrativeFields";
import { createFieldUpdater } from "./utils";
import type { XraySectionProps } from "./types";

/**
 * X-Ray Result section.
 *
 * Mirrors the reference form: the x-ray reference number aligned to the right,
 * followed by the Radiology Findings and Impression narratives.
 */
export default function XrayResultSection({
  data,
  onChange,
  disabled,
}: XraySectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  const inputClasses = cn(
    "h-8 text-sm bg-white border border-primary/20 rounded-md px-2",
    "focus:outline-none focus-visible:border-primary dark:bg-input/30",
    disabled && "pointer-events-none opacity-70"
  );

  return (
    <div className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
      <SectionHeader title="X-Ray Result" icon={ScanLine} banner />

      <div className="flex items-center justify-end gap-2 mb-4">
        <Label
          htmlFor="xray-no"
          className="text-[11px] font-bold text-primary/70 uppercase tracking-wider whitespace-nowrap"
        >
          X-Ray No.
        </Label>
        <Input
          id="xray-no"
          value={data.xray_no}
          onChange={(e) => updateField("xray_no", e.target.value)}
          className={cn(inputClasses, "w-56")}
          disabled={disabled}
        />
      </div>

      <RadiologyNarrativeFields data={data} onChange={onChange} disabled={disabled} />
    </div>
  );
}
