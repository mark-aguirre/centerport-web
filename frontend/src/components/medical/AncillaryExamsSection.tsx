"use client";

import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { FormSelect } from "@/components/common/form-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { MedicalExam, MedicalSectionProps } from "./types";

/**
 * Result of Ancillary Examinations sub-section of the Physical Examination form.
 *
 * Captures results for Chest X-ray, ECG, CBC, Pregnancy Test, Urinalysis,
 * Stool Exam, HbsAg, HIV/AIDS, RPR, Blood Type, Psychological Test, and
 * additional test specifications.
 *
 * @see PhysicalExaminationSection — parent orchestrator
 */
export function AncillaryExamsSection({ data, onChange, disabled }: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  /** Set all ancillary exam fields to normal/healthy defaults. */
  const handleSetNormal = () => {
    onChange({
      ...data,
      xray_no: data.xray_no, // preserve x-ray number
      ancillary_chest_xray: "normal",
      ancillary_ecg: "normal",
      ancillary_cbc: "normal",
      ancillary_urinalysis: "normal",
      ancillary_stool_exam: "normal",
      ancillary_hbsag: "non_reactive",
      ancillary_hiv_aids: "non_reactive",
      ancillary_rpr: "non_reactive",
      ancillary_pregnancy_test: "N/A",
      ancillary_psychological_test: "recommended",
      ancillary_additional_tests: "",
    });
  };

  return (
    <div className={cn("bg-card rounded-lg p-3 shadow-sm border border-primary/10", disabled && "pointer-events-none")}>
      <SectionHeader
        title="Result of Ancillary Examinations"
        subtitle="Check appropriate box"
        action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
      />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-[11px] font-semibold text-foreground/70 shrink-0">X-ray No.:</Label>
          <Input value={data.xray_no} onChange={(e) => update("xray_no", e.target.value)} className="h-7 text-xs w-24" readOnly={disabled} tabIndex={disabled ? -1 : undefined} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
          {/* Row: Chest X-ray */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-foreground/70 w-20 shrink-0">A. Chest X-ray</span>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_cxr" checked={data.ancillary_chest_xray === "normal"} onChange={() => update("ancillary_chest_xray", "normal")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Normal</span></label>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_cxr" checked={data.ancillary_chest_xray === "with_findings"} onChange={() => update("ancillary_chest_xray", "with_findings")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">with findings</span></label>
          </div>
          {/* Row: Urinalysis */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-foreground/70 w-20 shrink-0">E. Urinalysis</span>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_uri" checked={data.ancillary_urinalysis === "normal"} onChange={() => update("ancillary_urinalysis", "normal")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Normal</span></label>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_uri" checked={data.ancillary_urinalysis === "with_findings"} onChange={() => update("ancillary_urinalysis", "with_findings")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">with findings</span></label>
          </div>
          {/* Row: RPR */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-foreground/70 w-20 shrink-0">I. RPR</span>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_rpr" checked={data.ancillary_rpr === "reactive"} onChange={() => update("ancillary_rpr", "reactive")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Reactive</span></label>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_rpr" checked={data.ancillary_rpr === "non_reactive"} onChange={() => update("ancillary_rpr", "non_reactive")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Non Reactive</span></label>
          </div>

          {/* Row: ECG */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-foreground/70 w-20 shrink-0">B. ECG</span>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_ecg" checked={data.ancillary_ecg === "normal"} onChange={() => update("ancillary_ecg", "normal")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Normal</span></label>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_ecg" checked={data.ancillary_ecg === "with_findings"} onChange={() => update("ancillary_ecg", "with_findings")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">with findings</span></label>
          </div>
          {/* Row: Stool Exam */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-foreground/70 w-20 shrink-0">F. Stool Exam</span>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_stool" checked={data.ancillary_stool_exam === "normal"} onChange={() => update("ancillary_stool_exam", "normal")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Normal</span></label>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_stool" checked={data.ancillary_stool_exam === "non_reactive"} onChange={() => update("ancillary_stool_exam", "non_reactive")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Non Reactive</span></label>
          </div>
          {/* Row: Blood Type */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-foreground/70 w-20 shrink-0">J. Blood Type</span>
            <FormSelect label="" value={data.ancillary_blood_type} onChange={(v) => update("ancillary_blood_type", v)} options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} />
          </div>

          {/* Row: CBC */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-foreground/70 w-20 shrink-0">C. CBC</span>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_cbc" checked={data.ancillary_cbc === "normal"} onChange={() => update("ancillary_cbc", "normal")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Normal</span></label>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_cbc" checked={data.ancillary_cbc === "with_findings"} onChange={() => update("ancillary_cbc", "with_findings")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">with findings</span></label>
          </div>
          {/* Row: HbsAg */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-foreground/70 w-20 shrink-0">G. HbsAg</span>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_hbs" checked={data.ancillary_hbsag === "reactive"} onChange={() => update("ancillary_hbsag", "reactive")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Reactive</span></label>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_hbs" checked={data.ancillary_hbsag === "non_reactive"} onChange={() => update("ancillary_hbsag", "non_reactive")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Non Reactive</span></label>
          </div>
          {/* Spacer */}
          <div />

          {/* Row: Pregnancy Test */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-foreground/70 w-20 shrink-0">D. Pregnancy Test</span>
            <FormSelect label="" value={data.ancillary_pregnancy_test} onChange={(v) => update("ancillary_pregnancy_test", v)} options={["Positive", "Negative", "N/A"]} />
          </div>
          {/* Row: HIV/AIDS test */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-foreground/70 w-20 shrink-0">H. HIV/AIDS test</span>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_hiv" checked={data.ancillary_hiv_aids === "reactive"} onChange={() => update("ancillary_hiv_aids", "reactive")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Reactive</span></label>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="anc_hiv" checked={data.ancillary_hiv_aids === "non_reactive"} onChange={() => update("ancillary_hiv_aids", "non_reactive")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Non Reactive</span></label>
          </div>
          <div />
        </div>

        {/* Psychological Test */}
        <div className="flex items-center gap-3 pt-2 border-t border-muted/30">
          <Label className="text-[11px] font-semibold text-foreground/70 shrink-0">Psychological Test:</Label>
          <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="psych" checked={data.ancillary_psychological_test === "recommended"} onChange={() => update("ancillary_psychological_test", "recommended")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Recommended</span></label>
          <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="psych" checked={data.ancillary_psychological_test === "rec_with_reservation"} onChange={() => update("ancillary_psychological_test", "rec_with_reservation")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Rec. w/Reservation</span></label>
          <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="psych" checked={data.ancillary_psychological_test === "not_recommended"} onChange={() => update("ancillary_psychological_test", "not_recommended")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Not Recommended</span></label>
          <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="psych" checked={data.ancillary_psychological_test === "not_done"} onChange={() => update("ancillary_psychological_test", "not_done")} className="w-4 h-4 accent-primary" /><span className="text-xs text-foreground/80">Not Done</span></label>
        </div>

        {/* Additional Tests */}
        <div className="flex items-center gap-2 pt-1">
          <Label className="text-[11px] font-semibold text-foreground/70 shrink-0">Additional Test (Specify):</Label>
          <Input value={data.ancillary_additional_tests} onChange={(e) => update("ancillary_additional_tests", e.target.value)} className="h-7 text-xs flex-1" placeholder="e.g Blood Chemistries, Drug Tests, Alcohol Tests, Liver Function Test, Stool Culture, etc." readOnly={disabled} tabIndex={disabled ? -1 : undefined} />
        </div>
      </div>
    </div>
  );
}
