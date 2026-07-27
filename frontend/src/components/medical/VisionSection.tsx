"use client";

import { SectionHeader } from "@/components/common/section-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { MedicalExam, MedicalSectionProps } from "./types";

/**
 * Vision sub-section of the Physical Examination form.
 *
 * Captures uncorrected/corrected far and near vision for OD/OS,
 * color vision, visual acuity, STCW compliance, contact lens usage,
 * and the date the vision test was taken.
 *
 * @see PhysicalExaminationSection — parent orchestrator
 */
export function VisionSection({ data, onChange, disabled }: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className={cn("bg-card rounded-lg p-3 shadow-sm border border-primary/10", disabled && "pointer-events-none")}>
      <SectionHeader title="Vision" />
      <div className="grid grid-cols-2 gap-4">
        {/* Left: Vision table */}
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-1 items-end">
            <div />
            <span className="text-[11px] font-bold text-primary/70 uppercase text-center col-span-2">Far Vision</span>
            <span className="text-[11px] font-bold text-primary/70 uppercase text-center col-span-2">Near Vision</span>
          </div>
          <div className="grid grid-cols-5 gap-1 items-center">
            <div />
            <span className="text-[11px] text-muted-foreground text-center">OD</span>
            <span className="text-[11px] text-muted-foreground text-center">OS</span>
            <span className="text-[11px] text-muted-foreground text-center">OD</span>
            <span className="text-[11px] text-muted-foreground text-center">OS</span>
          </div>
          <div className="grid grid-cols-5 gap-1 items-center">
            <span className="text-[11px] text-foreground/70">Uncorrected</span>
            <Input value={data.vision_uncorrected_far_od} onChange={(e) => update("vision_uncorrected_far_od", e.target.value)} className="h-7 text-xs" readOnly={disabled} tabIndex={disabled ? -1 : undefined} />
            <Input value={data.vision_uncorrected_far_os} onChange={(e) => update("vision_uncorrected_far_os", e.target.value)} className="h-7 text-xs" readOnly={disabled} tabIndex={disabled ? -1 : undefined} />
            <Input value={data.vision_uncorrected_near_od} onChange={(e) => update("vision_uncorrected_near_od", e.target.value)} className="h-7 text-xs" readOnly={disabled} tabIndex={disabled ? -1 : undefined} />
            <Input value={data.vision_uncorrected_near_os} onChange={(e) => update("vision_uncorrected_near_os", e.target.value)} className="h-7 text-xs" readOnly={disabled} tabIndex={disabled ? -1 : undefined} />
          </div>
          <div className="grid grid-cols-5 gap-1 items-center">
            <span className="text-[11px] text-foreground/70">Corrected</span>
            <Input value={data.vision_corrected_far_od} onChange={(e) => update("vision_corrected_far_od", e.target.value)} className="h-7 text-xs" readOnly={disabled} tabIndex={disabled ? -1 : undefined} />
            <Input value={data.vision_corrected_far_os} onChange={(e) => update("vision_corrected_far_os", e.target.value)} className="h-7 text-xs" readOnly={disabled} tabIndex={disabled ? -1 : undefined} />
            <Input value={data.vision_corrected_near_od} onChange={(e) => update("vision_corrected_near_od", e.target.value)} className="h-7 text-xs" readOnly={disabled} tabIndex={disabled ? -1 : undefined} />
            <Input value={data.vision_corrected_near_os} onChange={(e) => update("vision_corrected_near_os", e.target.value)} className="h-7 text-xs" readOnly={disabled} tabIndex={disabled ? -1 : undefined} />
          </div>
        </div>

        {/* Right: Vision extras */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Label className="text-[11px] font-semibold text-foreground/70 shrink-0">Color Vision:</Label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="vision_color" checked={data.vision_color === "normal"} onChange={() => update("vision_color", "normal")} className="w-4 h-4 accent-primary" />
              <span className="text-xs text-foreground/80">Normal</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="vision_color" checked={data.vision_color === "defective"} onChange={() => update("vision_color", "defective")} className="w-4 h-4 accent-primary" />
              <span className="text-xs text-foreground/80">Defective</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Label className="text-[11px] font-semibold text-foreground/70 shrink-0">Visual Acuity:</Label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="vision_va" checked={data.vision_visual_acuity === "normal"} onChange={() => update("vision_visual_acuity", "normal")} className="w-4 h-4 accent-primary" />
              <span className="text-xs text-foreground/80">Normal</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="vision_va" checked={data.vision_visual_acuity === "defective"} onChange={() => update("vision_visual_acuity", "defective")} className="w-4 h-4 accent-primary" />
              <span className="text-xs text-foreground/80">Defective</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Label className="text-[11px] font-semibold text-foreground/70 shrink-0">Meets Standards STCW:</Label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="vision_stcw" checked={data.vision_meets_stcw === "yes"} onChange={() => update("vision_meets_stcw", "yes")} className="w-4 h-4 accent-primary" />
              <span className="text-xs text-foreground/80">Yes</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="vision_stcw" checked={data.vision_meets_stcw === "no"} onChange={() => update("vision_meets_stcw", "no")} className="w-4 h-4 accent-primary" />
              <span className="text-xs text-foreground/80">No</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Label className="text-[11px] font-semibold text-foreground/70 shrink-0">Contact Lenses:</Label>
            <input type="checkbox" checked={data.vision_contact_lenses === "yes"} onChange={(e) => update("vision_contact_lenses", e.target.checked ? "yes" : "no")} className="w-4 h-4 accent-primary" />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-[11px] font-semibold text-foreground/70 shrink-0">Date Taken:</Label>
            <Input type="date" value={data.vision_date_taken} onChange={(e) => update("vision_date_taken", e.target.value)} className="h-7 text-xs w-36" readOnly={disabled} tabIndex={disabled ? -1 : undefined} />
          </div>
        </div>
      </div>
    </div>
  );
}
