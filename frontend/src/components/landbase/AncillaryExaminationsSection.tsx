"use client";

import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { FormSelect } from "@/components/common/form-select";
import RadioGroup from "@/components/common/radio-group";
import { TestTube2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { LandbaseSectionProps } from "./types";

/** Normal/With Findings options used by multiple exam fields. */
const NORMAL_FINDINGS_OPTIONS = [
  { label: "Normal", value: "normal" },
  { label: "With Findings", value: "with_findings" },
];

/** Reactive/Non-Reactive options used by serology tests. */
const REACTIVE_OPTIONS = [
  { label: "Reactive", value: "reactive" },
  { label: "Non Reactive", value: "non_reactive" },
];

/** Psychological test result options. */
const PSYCHOLOGICAL_OPTIONS = [
  { label: "Recommended", value: "Recommended" },
  { label: "Rec. w/Reservation", value: "Rec. w/Reservation" },
  { label: "Not Recommended", value: "Not Recommended" },
  { label: "Not Done", value: "Not Done" },
];

/**
 * Result of Ancillary Examinations section for the Landbase PEME form.
 *
 * Covers all laboratory and diagnostic test results:
 * - Column 1: Chest X-ray, ECG, CBC, Pregnancy Test
 * - Column 2: Urinalysis, Stool Exam, HBsAg, HIV/AIDS
 * - Column 3: RPR, Blood Type
 * - Full-width: Psychological Test, Additional Tests
 *
 * "Set Normal" defaults:
 * - Normal/Findings tests → "normal"
 * - Reactive tests → "non_reactive"
 * - Pregnancy → "N/A"
 * - Psychological → "Recommended"
 * - Preserves X-ray number, clears additional tests
 *
 * @see ResultsSection — summarizes pass/fail based on these findings
 */
export default function AncillaryExaminationsSection({
  data,
  onChange,
  disabled,
}: LandbaseSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  /** Set all ancillary exam fields to normal/healthy defaults. */
  const handleSetNormal = () => {
    onChange({
      ...data,
      xray_no: data.xray_no, // preserve x-ray number
      chest_xray: "normal",
      cbc: "normal",
      cec: "normal",
      pregnancy_test: "N/A",
      urinalysis: "normal",
      stool_exam: "normal",
      hbsag: "non_reactive",
      hiv_aids_test: "non_reactive",
      apb: "non_reactive",
      drug_test: "normal",
      psychological_test: "Recommended",
      additional_tests: "",
    });
  };

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <SectionHeader
        title="Result of Ancillary Examinations"
        icon={TestTube2}
        subtitle="Check appropriate box"
        action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
      />

      {/* X-ray No */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wide shrink-0">
          X-ray No.:
        </span>
        <input
          type="text"
          value={data.xray_no ?? ""}
          onChange={(e) => updateField("xray_no", e.target.value)}
          readOnly={disabled}
          className={cn(
            "h-7 w-32 text-xs bg-white border border-primary/20 rounded px-2",
            "focus:outline-none focus:border-primary dark:bg-input/30",
            disabled && "pointer-events-none"
          )}
        />
      </div>

      {/* Main tests grid - 3 columns */}
      <div className="grid grid-cols-3 gap-x-4 border border-muted/40 rounded p-3 mb-3">
        {/* Column 1 */}
        <div className="space-y-2">
          <ExamRow label="A. Chest x-ray:" labelWidth="w-24" className="bg-muted/30">
            <RadioGroup
              name="chest_xray"
              value={data.chest_xray}
              onChange={(v) => updateField("chest_xray", v)}
              options={NORMAL_FINDINGS_OPTIONS}
              ariaLabel="Chest X-ray result"
              className="!space-y-0"
              disabled={disabled}
            />
          </ExamRow>
          <ExamRow label="B. ECG:" labelWidth="w-24">
            <RadioGroup
              name="cec"
              value={data.cec}
              onChange={(v) => updateField("cec", v)}
              options={NORMAL_FINDINGS_OPTIONS}
              ariaLabel="ECG result"
              className="!space-y-0"
              disabled={disabled}
            />
          </ExamRow>
          <ExamRow label="C. CBC:" labelWidth="w-24" className="bg-muted/30">
            <RadioGroup
              name="cbc"
              value={data.cbc}
              onChange={(v) => updateField("cbc", v)}
              options={NORMAL_FINDINGS_OPTIONS}
              ariaLabel="CBC result"
              className="!space-y-0"
              disabled={disabled}
            />
          </ExamRow>
          <ExamRow label="D. Pregnancy Test" labelWidth="w-24">
            <FormSelect
              value={data.pregnancy_test}
              onChange={(v) => updateField("pregnancy_test", v)}
              options={["N/A", "Positive", "Negative"]}
              className="flex-1"
              disabled={disabled}
            />
          </ExamRow>
        </div>

        {/* Column 2 */}
        <div className="space-y-2 border-l border-muted/40 pl-4">
          <ExamRow label="E. Urinalysis:" labelWidth="w-24" className="bg-muted/30">
            <RadioGroup
              name="urinalysis"
              value={data.urinalysis}
              onChange={(v) => updateField("urinalysis", v)}
              options={NORMAL_FINDINGS_OPTIONS}
              ariaLabel="Urinalysis result"
              className="!space-y-0"
              disabled={disabled}
            />
          </ExamRow>
          <ExamRow label="F. Stool Exam" labelWidth="w-24">
            <RadioGroup
              name="stool_exam"
              value={data.stool_exam}
              onChange={(v) => updateField("stool_exam", v)}
              options={NORMAL_FINDINGS_OPTIONS}
              ariaLabel="Stool Exam result"
              className="!space-y-0"
              disabled={disabled}
            />
          </ExamRow>
          <ExamRow label="G. HBsAg:" labelWidth="w-24" className="bg-muted/30">
            <RadioGroup
              name="hbsag"
              value={data.hbsag}
              onChange={(v) => updateField("hbsag", v)}
              options={REACTIVE_OPTIONS}
              ariaLabel="HBsAg result"
              className="!space-y-0"
              disabled={disabled}
            />
          </ExamRow>
          <ExamRow label="H. HIV/AID test:" labelWidth="w-24">
            <RadioGroup
              name="hiv_aids_test"
              value={data.hiv_aids_test}
              onChange={(v) => updateField("hiv_aids_test", v)}
              options={REACTIVE_OPTIONS}
              ariaLabel="HIV/AIDS Test result"
              className="!space-y-0"
              disabled={disabled}
            />
          </ExamRow>
        </div>

        {/* Column 3 */}
        <div className="space-y-2 border-l border-muted/40 pl-4">
          <ExamRow label="I. RPR:" labelWidth="w-16" className="bg-muted/30">
            <RadioGroup
              name="apb"
              value={data.apb}
              onChange={(v) => updateField("apb", v)}
              options={REACTIVE_OPTIONS}
              ariaLabel="RPR result"
              className="!space-y-0"
              disabled={disabled}
            />
          </ExamRow>
          <ExamRow label="J. Blood Type:" labelWidth="w-16">
            <FormSelect
              value={data.blood_type}
              onChange={(v) => updateField("blood_type", v)}
              options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              className="flex-1"
              disabled={disabled}
            />
          </ExamRow>
        </div>
      </div>

      {/* Drug Test - full width row */}
      <div className="flex items-center gap-3 mb-2 px-1 py-0.5 rounded-sm bg-muted/30">
        <span className="text-[11px] font-semibold text-primary/70 shrink-0">
          Drug Test:
        </span>
        <RadioGroup
          name="drug_test"
          value={data.drug_test}
          onChange={(v) => updateField("drug_test", v)}
          options={NORMAL_FINDINGS_OPTIONS}
          ariaLabel="Drug Test result"
          className="!space-y-0"
          disabled={disabled}
        />
      </div>

      {/* Psychological Test - full width row */}
      <div className="flex items-center gap-3 mb-2 px-1 py-0.5 rounded-sm">
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
          disabled={disabled}
        />
      </div>

      {/* Additional Tests */}
      <div className="space-y-1">
        <Label className="text-[11px] font-semibold text-primary/60 uppercase tracking-wider">
          Additional Test (Specify): e.g Blood Chemistries, Drug Tests, Alcohol Tests, Liver Function Test, Stool Culture, etc.:
        </Label>
        <input
          type="text"
          value={data.additional_tests ?? ""}
          onChange={(e) => updateField("additional_tests", e.target.value)}
          readOnly={disabled}
          className={cn(
            "w-full h-7 text-xs bg-white border border-primary/20 rounded px-2",
            "focus:outline-none focus:border-primary dark:bg-input/30",
            disabled && "pointer-events-none"
          )}
        />
      </div>
    </div>
  );
}

// --- Sub-components ---

/**
 * Layout wrapper for a single exam row (label + control).
 *
 * Provides consistent spacing and label styling for each
 * examination field within the grid columns.
 */
function ExamRow({
  label,
  labelWidth,
  children,
  className: extraClassName,
}: {
  label: string;
  labelWidth: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 px-1 py-0.5 rounded-sm", extraClassName)}>
      <span className={cn("text-[11px] font-semibold text-primary/70 shrink-0", labelWidth)}>
        {label}
      </span>
      {children}
    </div>
  );
}
