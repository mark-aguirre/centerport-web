"use client";

import type { MedicalExam, MedicalSectionProps } from "./types";

/**
 * Condition Questions sub-section of the Physical Examination form.
 *
 * Captures three Yes/No condition assessments:
 * - Whether the applicant has a condition aggravated by sea service
 * - Whether identification documents were checked
 * - Whether the applicant is fit for look-out duties
 *
 * @see PhysicalExaminationSection — parent orchestrator
 */
export function ConditionQuestionsSection({ data, onChange }: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10 space-y-0">
      <div className="flex items-start gap-3 py-2 border-b border-muted/30 rounded-t" style={{ backgroundColor: "#fefdf3" }}>
        <p className="text-xs text-foreground/80 font-semibold uppercase leading-relaxed flex-1">
          Is applicant suffering from any medical condition likely to be aggravated by service at sea or to render the seafarer unfit for such service or to endanger the health of other persons on board?
        </p>
        <div className="flex items-center gap-4 shrink-0">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="cond_sea" checked={data.condition_aggravated_sea === "yes"} onChange={() => update("condition_aggravated_sea", "yes")} className="w-4 h-4 accent-primary" />
            <span className="text-xs text-foreground/80">YES</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="cond_sea" checked={data.condition_aggravated_sea === "no"} onChange={() => update("condition_aggravated_sea", "no")} className="w-4 h-4 accent-primary" />
            <span className="text-xs text-foreground/80">NO</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 py-2 border-b border-muted/30">
        <span className="text-xs font-semibold text-foreground/80 uppercase">
          Confirmation that identification documents were checked at the point of examination:
        </span>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="radio" name="id_docs" checked={data.identification_docs_checked === "yes"} onChange={() => update("identification_docs_checked", "yes")} className="w-4 h-4 accent-primary" />
          <span className="text-xs text-foreground/80">YES</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="radio" name="id_docs" checked={data.identification_docs_checked === "no"} onChange={() => update("identification_docs_checked", "no")} className="w-4 h-4 accent-primary" />
          <span className="text-xs text-foreground/80">NO</span>
        </label>
      </div>

      <div className="flex items-center gap-3 py-2">
        <span className="text-xs font-semibold text-foreground/80 uppercase">Fit for look-out duties:</span>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="radio" name="fit_lookout" checked={data.fit_for_lookout === "yes"} onChange={() => update("fit_for_lookout", "yes")} className="w-4 h-4 accent-primary" />
          <span className="text-xs text-foreground/80">YES</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="radio" name="fit_lookout" checked={data.fit_for_lookout === "no"} onChange={() => update("fit_for_lookout", "no")} className="w-4 h-4 accent-primary" />
          <span className="text-xs text-foreground/80">NO</span>
        </label>
      </div>
    </div>
  );
}
