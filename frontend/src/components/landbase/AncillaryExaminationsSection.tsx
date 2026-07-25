"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormSelect } from "@/components/common/form-select";
import RadioGroup from "@/components/common/radio-group";
import { TestTube2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { LandbasePeme, LandbaseSectionProps } from "./types";

/** Normal/With Findings options used by multiple exam fields */
const NORMAL_FINDINGS_OPTIONS = [
  { label: "Normal", value: "normal" },
  { label: "With Findings", value: "with_findings" },
];

/** Reactive/Non-Reactive options used by serology tests */
const REACTIVE_OPTIONS = [
  { label: "Reactive", value: "reactive" },
  { label: "Non Reactive", value: "non_reactive" },
];

/** Psychological test options */
const PSYCHOLOGICAL_OPTIONS = [
  { label: "Recommended", value: "Recommended" },
  { label: "Rec. w/Reservation", value: "Rec. w/Reservation" },
  { label: "Not Recommended", value: "Not Recommended" },
  { label: "Not Done", value: "Not Done" },
];

/**
 * Result of Ancillary Examinations section for the Landbase PEME form.
 *
 * Covers X-ray, CBC, ECG, pregnancy test, urinalysis, stool exam,
 * HBsAg, HIV/AIDS, RPR, blood type, drug test, psychological test,
 * and additional tests.
 */
export default function AncillaryExaminationsSection({
  data,
  onChange,
}: LandbaseSectionProps) {
  const updateField = (field: keyof LandbasePeme, value: string) =>
    onChange({ ...data, [field]: value } as LandbasePeme);

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader
        title="Result of Ancillary Examinations"
        icon={TestTube2}
        subtitle="Check appropriate box"
      />

      {/* X-ray No */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wide shrink-0">
          X-ray No.:
        </span>
        <input
          type="text"
          value={data.xray_no}
          onChange={(e) => updateField("xray_no", e.target.value)}
          className="h-7 w-32 text-xs bg-white border border-primary/20 rounded px-2 focus:outline-none focus:border-primary dark:bg-input/30"
        />
      </div>

      {/* Main tests grid - 3 columns */}
      <div className="grid grid-cols-3 gap-x-4 border border-muted/40 rounded p-3 mb-3">
        {/* Column 1 */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-primary/70 shrink-0 w-24">A. Chest x-ray:</span>
            <RadioGroup
              name="chest_xray"
              value={data.chest_xray}
              onChange={(v) => updateField("chest_xray", v)}
              options={NORMAL_FINDINGS_OPTIONS}
              ariaLabel="Chest X-ray result"
              className="!space-y-0"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-primary/70 shrink-0 w-24">B. ECG:</span>
            <RadioGroup
              name="cec"
              value={data.cec}
              onChange={(v) => updateField("cec", v)}
              options={NORMAL_FINDINGS_OPTIONS}
              ariaLabel="ECG result"
              className="!space-y-0"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-primary/70 shrink-0 w-24">C. CBC:</span>
            <RadioGroup
              name="cbc"
              value={data.cbc}
              onChange={(v) => updateField("cbc", v)}
              options={NORMAL_FINDINGS_OPTIONS}
              ariaLabel="CBC result"
              className="!space-y-0"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-primary/70 shrink-0 w-24">D. Pregnancy Test</span>
            <FormSelect
              value={data.pregnancy_test}
              onChange={(v) => updateField("pregnancy_test", v)}
              options={["N/A", "Positive", "Negative"]}
              className="flex-1"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-2 border-l border-muted/40 pl-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-primary/70 shrink-0 w-24">E. Urinalysis:</span>
            <RadioGroup
              name="urinalysis"
              value={data.urinalysis}
              onChange={(v) => updateField("urinalysis", v)}
              options={NORMAL_FINDINGS_OPTIONS}
              ariaLabel="Urinalysis result"
              className="!space-y-0"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-primary/70 shrink-0 w-24">F. Stool Exam</span>
            <RadioGroup
              name="stool_exam"
              value={data.stool_exam}
              onChange={(v) => updateField("stool_exam", v)}
              options={NORMAL_FINDINGS_OPTIONS}
              ariaLabel="Stool Exam result"
              className="!space-y-0"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-primary/70 shrink-0 w-24">G. HBsAg:</span>
            <RadioGroup
              name="hbsag"
              value={data.hbsag}
              onChange={(v) => updateField("hbsag", v)}
              options={REACTIVE_OPTIONS}
              ariaLabel="HBsAg result"
              className="!space-y-0"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-primary/70 shrink-0 w-24">H. HIV/AID test:</span>
            <RadioGroup
              name="hiv_aids_test"
              value={data.hiv_aids_test}
              onChange={(v) => updateField("hiv_aids_test", v)}
              options={REACTIVE_OPTIONS}
              ariaLabel="HIV/AIDS Test result"
              className="!space-y-0"
            />
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-2 border-l border-muted/40 pl-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-primary/70 shrink-0 w-16">I. RPR:</span>
            <RadioGroup
              name="apb"
              value={data.apb}
              onChange={(v) => updateField("apb", v)}
              options={REACTIVE_OPTIONS}
              ariaLabel="RPR result"
              className="!space-y-0"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-primary/70 shrink-0 w-16">J. Blood Type:</span>
            <FormSelect
              value={data.blood_type}
              onChange={(v) => updateField("blood_type", v)}
              options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Psychological Test - full width row */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[11px] font-semibold text-primary/70 shrink-0">
          Psychological Test:
        </span>
        <RadioGroup
          name="psychological_test"
          value={data.psychological_test}
          onChange={(v) => updateField("psychological_test", v)}
          options={PSYCHOLOGICAL_OPTIONS}
          ariaLabel="Psychological Test result"
          className="!space-y-0"
        />
      </div>

      {/* Additional Tests */}
      <div className="space-y-1">
        <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
          Additional Test (Specify): e.g Blood Chemistries, Drug Tests, Alcohol Tests, Liver Function Test, Stool Culture, etc.:
        </Label>
        <input
          type="text"
          value={data.additional_tests}
          onChange={(e) => updateField("additional_tests", e.target.value)}
          className="w-full h-7 text-xs bg-white border border-primary/20 rounded px-2 focus:outline-none focus:border-primary dark:bg-input/30"
        />
      </div>
    </div>
  );
}
