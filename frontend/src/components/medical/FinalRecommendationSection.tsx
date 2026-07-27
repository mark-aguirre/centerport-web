"use client";

import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { MedicalExam, MedicalSectionProps } from "./types";

/**
 * Final Recommendation sub-section of the Physical Examination form.
 *
 * Captures remarks/special needs and certification results (Basic OOH,
 * Additional Labs, Flag/Post requirements) with Passed/With Significant
 * Findings radio options.
 *
 * @see PhysicalExaminationSection — parent orchestrator
 */
export function FinalRecommendationSection({ data, onChange, disabled }: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  /** Set all certification results to "passed". */
  const handleSetNormal = () => {
    onChange({
      ...data,
      cert_basic_ooh: "passed",
      cert_additional_labs: "passed",
      cert_flagpost: "passed",
    });
  };

  return (
    <div className={cn("bg-card rounded-lg p-3 shadow-sm border border-primary/10", disabled && "pointer-events-none")}>
      <SectionHeader
        title="Final Recommendation"
        action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
      />
      <div className="space-y-3">
        {/* Remarks */}
        <div className="space-y-1">
          <Label className="text-[11px] font-bold text-foreground/70 uppercase">Remark / Special Needs:</Label>
          <textarea
            value={data.recommendation_remarks}
            onChange={(e) => update("recommendation_remarks", e.target.value)}
            className="w-full h-16 text-sm bg-white border border-primary/20 rounded-md px-3 py-2 focus:outline-none focus:border-primary dark:bg-input/30 resize-none"
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
          />
        </div>

        {/* Certifications */}
        <div className="space-y-2 pt-2 border-t border-muted/30">
          <div className="flex items-center gap-3">
            <span className="text-xs text-foreground/70 w-64 shrink-0">Basic OOH Mandatory Medical Examination:</span>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="cert_ooh" checked={data.cert_basic_ooh === "passed"} onChange={() => update("cert_basic_ooh", "passed")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">PASSED</span></label>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="cert_ooh" checked={data.cert_basic_ooh === "with_significant_findings"} onChange={() => update("cert_basic_ooh", "with_significant_findings")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">WITH SIGNIFICANT FINDINGS</span></label>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-foreground/70 w-64 shrink-0">Additional Laboratory Tests:</span>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="cert_labs" checked={data.cert_additional_labs === "passed"} onChange={() => update("cert_additional_labs", "passed")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">PASSED</span></label>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="cert_labs" checked={data.cert_additional_labs === "with_significant_findings"} onChange={() => update("cert_additional_labs", "with_significant_findings")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">WITH SIGNIFICANT FINDINGS</span></label>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-foreground/70 w-64 shrink-0">Flag/Post Medical and Laboratory Requirements:</span>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="cert_flag" checked={data.cert_flagpost === "passed"} onChange={() => update("cert_flagpost", "passed")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">PASSED</span></label>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="cert_flag" checked={data.cert_flagpost === "with_significant_findings"} onChange={() => update("cert_flagpost", "with_significant_findings")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">WITH SIGNIFICANT FINDINGS</span></label>
          </div>
        </div>
      </div>
    </div>
  );
}
