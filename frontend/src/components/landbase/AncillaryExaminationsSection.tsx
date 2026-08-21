"use client";

import { FormSelect } from "@/components/common/form-select";
import RadioGroup from "@/components/common/radio-group";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { LandbaseSectionProps } from "./types";
import { createFieldUpdater } from "./utils";

const NORMAL_FINDINGS_OPTIONS = [
  { label: "normal", value: "normal" },
  { label: "with findings", value: "with_findings" },
];

const REACTIVE_OPTIONS = [
  { label: "Reactive", value: "reactive" },
  { label: "Non Reactive", value: "non_reactive" },
];

const PSYCHOLOGICAL_OPTIONS = [
  { label: "Recommended", value: "Recommended" },
  { label: "Rec. w/Reservation", value: "Rec. w/Reservation" },
  { label: "Not Recommended", value: "Not Recommended" },
  { label: "Not Done", value: "Not Done" },
];

interface ExamRowProps {
  label: string;
  children: ReactNode;
  className?: string;
}

function ExamRow({ label, children, className }: ExamRowProps) {
  return (
    <div
      className={cn(
        "grid min-h-9 grid-cols-[132px_minmax(0,1fr)] items-center gap-2 border-b border-primary/20 px-2 py-1",
        className,
      )}
    >
      <span className="text-xs font-semibold text-foreground/80">{label}</span>
      {children}
    </div>
  );
}

/**
 * Displays Section III of the Landbase examination form as the paper-form A-J
 * ancillary-results table while retaining the existing persisted field names.
 */
export default function AncillaryExaminationsSection({
  data,
  onChange,
  disabled,
}: LandbaseSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  const handleSetNormal = () => {
    onChange({
      ...data,
      chest_xray: "normal",
      cec: "normal",
      cbc: "normal",
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
    <section className="overflow-x-auto rounded-lg border border-primary/20 bg-card shadow-sm">
      <div className="min-w-[960px]">
        <div className="flex items-center gap-2 border-b border-primary/20 px-2 py-1.5">
          <h2 className="shrink-0 text-sm font-bold uppercase tracking-wide text-primary">
            III. Result of Ancillary Examinations.
          </h2>
          <p className="flex-1 text-xs text-foreground/80">
            Check appropriate box
          </p>
          <SetNormalButton onClick={handleSetNormal} readOnly={disabled} />
        </div>

        <div className="flex items-center gap-2 border-b border-primary/20 px-2 py-1.5">
          <label
            htmlFor="ancillary-xray-no"
            className="shrink-0 text-xs font-semibold text-foreground/80"
          >
            X-ray No.:
          </label>
          <Input
            id="ancillary-xray-no"
            value={data.xray_no ?? ""}
            onChange={(event) => updateField("xray_no", event.target.value)}
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
            className={cn(
              "h-7 w-36 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30",
              disabled && "pointer-events-none",
            )}
          />
        </div>

        <div className="grid grid-cols-3">
          <div className="border-r border-primary/20">
            <ExamRow label="A. Chest x-ray:">
              <RadioGroup
                name="chest_xray"
                value={data.chest_xray}
                onChange={(value) => updateField("chest_xray", value)}
                options={NORMAL_FINDINGS_OPTIONS}
                ariaLabel="Chest X-ray result"
                className="!space-y-0"
                disabled={disabled}
              />
            </ExamRow>
            <ExamRow label="B. ECG:">
              <RadioGroup
                name="cec"
                value={data.cec}
                onChange={(value) => updateField("cec", value)}
                options={NORMAL_FINDINGS_OPTIONS}
                ariaLabel="ECG result"
                className="!space-y-0"
                disabled={disabled}
              />
            </ExamRow>
            <ExamRow label="C. CBC:">
              <RadioGroup
                name="cbc"
                value={data.cbc}
                onChange={(value) => updateField("cbc", value)}
                options={NORMAL_FINDINGS_OPTIONS}
                ariaLabel="CBC result"
                className="!space-y-0"
                disabled={disabled}
              />
            </ExamRow>
            <ExamRow label="D. Pregnancy Test" className="border-b-0">
              <FormSelect
                label=""
                value={data.pregnancy_test}
                onChange={(value) => updateField("pregnancy_test", value)}
                options={["N/A", "Positive", "Negative"]}
                size="sm"
                disabled={disabled}
              />
            </ExamRow>
          </div>

          <div className="border-r border-primary/20">
            <ExamRow label="E. Urinalysis:">
              <RadioGroup
                name="urinalysis"
                value={data.urinalysis}
                onChange={(value) => updateField("urinalysis", value)}
                options={NORMAL_FINDINGS_OPTIONS}
                ariaLabel="Urinalysis result"
                className="!space-y-0"
                disabled={disabled}
              />
            </ExamRow>
            <ExamRow label="F. Stool Exam">
              <RadioGroup
                name="stool_exam"
                value={data.stool_exam}
                onChange={(value) => updateField("stool_exam", value)}
                options={NORMAL_FINDINGS_OPTIONS}
                ariaLabel="Stool Exam result"
                className="!space-y-0"
                disabled={disabled}
              />
            </ExamRow>
            <ExamRow label="G. HBsAg:">
              <RadioGroup
                name="hbsag"
                value={data.hbsag}
                onChange={(value) => updateField("hbsag", value)}
                options={REACTIVE_OPTIONS}
                ariaLabel="HBsAg result"
                className="!space-y-0"
                disabled={disabled}
              />
            </ExamRow>
            <ExamRow label="H. HIV/AIDS test:" className="border-b-0">
              <RadioGroup
                name="hiv_aids_test"
                value={data.hiv_aids_test}
                onChange={(value) => updateField("hiv_aids_test", value)}
                options={REACTIVE_OPTIONS}
                ariaLabel="HIV/AIDS test result"
                className="!space-y-0"
                disabled={disabled}
              />
            </ExamRow>
          </div>

          <div className="flex h-full flex-col">
            <ExamRow label="I. RPR:">
              <RadioGroup
                name="apb"
                value={data.apb}
                onChange={(value) => updateField("apb", value)}
                options={REACTIVE_OPTIONS}
                ariaLabel="RPR result"
                className="!space-y-0"
                disabled={disabled}
              />
            </ExamRow>
            <div className="grid flex-1 grid-cols-[132px_minmax(0,1fr)] items-start gap-2 px-2 py-3">
              <span className="text-xs font-semibold text-foreground/80">
                J. Blood Type:
              </span>
              <FormSelect
                label=""
                value={data.blood_type}
                onChange={(value) => updateField("blood_type", value)}
                options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                size="sm"
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-primary/20 px-3 py-1.5">
          <span className="shrink-0 text-xs font-semibold text-foreground/80">
            Psychological Test:
          </span>
          <RadioGroup
            name="psychological_test"
            value={data.psychological_test}
            onChange={(value) => updateField("psychological_test", value)}
            options={PSYCHOLOGICAL_OPTIONS}
            ariaLabel="Psychological Test result"
            className="!space-y-0"
            disabled={disabled}
          />
        </div>

        <div className="space-y-1 border-t border-primary/20 px-3 py-2">
          <label
            htmlFor="ancillary-additional-tests"
            className="text-xs italic text-foreground/80"
          >
            Additional Test (Specify): e.g Blood Chemistries, Drug Tests, Alcohol Tests, Liver Function Test, Stool Culture, etc.:
          </label>
          <Textarea
            id="ancillary-additional-tests"
            value={data.additional_tests ?? ""}
            onChange={(event) =>
              updateField("additional_tests", event.target.value)
            }
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
            className={cn(
              "h-14 resize-none rounded-md border border-primary/20 bg-white px-3 py-2 text-sm dark:bg-input/30",
              disabled && "pointer-events-none",
            )}
          />
        </div>
      </div>
    </section>
  );
}
