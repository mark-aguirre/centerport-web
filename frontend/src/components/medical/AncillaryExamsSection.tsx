"use client";

import { FormSelect } from "@/components/common/form-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { MedicalExam, MedicalSectionProps } from "./types";

interface ResultOption {
  label: string;
  value: string;
}

interface ResultRowProps {
  code: string;
  label: string;
  name: string;
  value: string;
  options: readonly ResultOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

const NORMAL_OPTIONS: readonly ResultOption[] = [
  { label: "normal", value: "normal" },
  { label: "with findings", value: "with_findings" },
];

const REACTIVE_OPTIONS: readonly ResultOption[] = [
  { label: "Reactive", value: "reactive" },
  { label: "Non Reactive", value: "non_reactive" },
];

const BLOOD_TYPE_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const PREGNANCY_OPTIONS = ["Positive", "Negative", "N/A"];

function ResultRow({
  code,
  label,
  name,
  value,
  options,
  disabled,
  onChange,
}: ResultRowProps) {
  return (
    <div className="grid min-h-9 grid-cols-[130px_1fr] items-center border-b border-primary/20 last:border-b-0">
      <span className="border-r border-primary/20 px-2 text-xs font-semibold text-foreground/80">
        {code}. {label}:
      </span>
      <div
        className="flex flex-wrap items-center gap-x-3 gap-y-1 px-2"
        role="radiogroup"
        aria-label={`${label} result`}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-1.5"
          >
            <input
              type="radio"
              name={name}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              tabIndex={disabled ? -1 : undefined}
              className="h-4 w-4 accent-primary"
              aria-label={`${label} - ${option.label}`}
            />
            <span className="whitespace-nowrap text-xs text-foreground/80">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

interface SelectResultRowProps {
  code: string;
  label: string;
  value: string;
  options: string[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

function SelectResultRow({
  code,
  label,
  value,
  options,
  disabled,
  onChange,
}: SelectResultRowProps) {
  return (
    <div className="grid min-h-9 grid-cols-[130px_1fr] items-center border-b border-primary/20 last:border-b-0">
      <span className="border-r border-primary/20 px-2 text-xs font-semibold text-foreground/80">
        {code}. {label}
      </span>
      <FormSelect
        label=""
        value={value}
        onChange={onChange}
        options={options}
        disabled={disabled}
        className="px-2"
      />
    </div>
  );
}

/**
 * Result of Ancillary Examinations section matching the Seabase form.
 *
 * Presents examination results A-J in three fixed table columns, followed by
 * the psychological assessment and free-text additional-test specification.
 */
export function AncillaryExamsSection({
  data,
  onChange,
  disabled,
}: MedicalSectionProps) {
  const update = (field: keyof MedicalExam, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm",
        disabled && "pointer-events-none",
      )}
    >
      <div className="flex flex-col gap-1 border-b border-primary/20 px-3 py-2 sm:flex-row sm:items-baseline">
        <h2 className="shrink-0 text-sm font-bold uppercase tracking-wide text-primary">
          III. Result of Ancillary Examinations.
        </h2>
        <p className="text-xs text-foreground/80">Check appropriate box</p>
      </div>

      <div className="flex items-center gap-2 border-b border-primary/20 px-3 py-2">
        <label
          htmlFor="ancillary-xray-number"
          className="text-xs font-semibold text-foreground/80"
        >
          X-ray No.:
        </label>
        <Input
          id="ancillary-xray-number"
          value={data.xray_no}
          onChange={(event) => update("xray_no", event.target.value)}
          readOnly={disabled}
          tabIndex={disabled ? -1 : undefined}
          className="h-7 w-28 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30"
        />
      </div>

      <div className="overflow-x-auto">
        <div className="grid min-w-[960px] grid-cols-[1.08fr_1.08fr_0.84fr] border-b border-primary/20">
          <div className="border-r border-primary/20">
            <ResultRow
              code="A"
              label="Chest X-ray"
              name="ancillary-chest-xray"
              value={data.ancillary_chest_xray}
              options={NORMAL_OPTIONS}
              onChange={(value) => update("ancillary_chest_xray", value)}
              disabled={disabled}
            />
            <ResultRow
              code="B"
              label="ECG"
              name="ancillary-ecg"
              value={data.ancillary_ecg}
              options={NORMAL_OPTIONS}
              onChange={(value) => update("ancillary_ecg", value)}
              disabled={disabled}
            />
            <ResultRow
              code="C"
              label="CBC"
              name="ancillary-cbc"
              value={data.ancillary_cbc}
              options={NORMAL_OPTIONS}
              onChange={(value) => update("ancillary_cbc", value)}
              disabled={disabled}
            />
            <SelectResultRow
              code="D"
              label="Pregnancy Test"
              value={data.ancillary_pregnancy_test}
              options={PREGNANCY_OPTIONS}
              onChange={(value) => update("ancillary_pregnancy_test", value)}
              disabled={disabled}
            />
          </div>

          <div className="border-r border-primary/20">
            <ResultRow
              code="E"
              label="Urinalysis"
              name="ancillary-urinalysis"
              value={data.ancillary_urinalysis}
              options={NORMAL_OPTIONS}
              onChange={(value) => update("ancillary_urinalysis", value)}
              disabled={disabled}
            />
            <ResultRow
              code="F"
              label="Stool Exam"
              name="ancillary-stool-exam"
              value={data.ancillary_stool_exam}
              options={NORMAL_OPTIONS}
              onChange={(value) => update("ancillary_stool_exam", value)}
              disabled={disabled}
            />
            <ResultRow
              code="G"
              label="HBsAg"
              name="ancillary-hbsag"
              value={data.ancillary_hbsag}
              options={REACTIVE_OPTIONS}
              onChange={(value) => update("ancillary_hbsag", value)}
              disabled={disabled}
            />
            <ResultRow
              code="H"
              label="HIV/AIDS test"
              name="ancillary-hiv-aids"
              value={data.ancillary_hiv_aids}
              options={REACTIVE_OPTIONS}
              onChange={(value) => update("ancillary_hiv_aids", value)}
              disabled={disabled}
            />
          </div>

          <div>
            <ResultRow
              code="I"
              label="RPR"
              name="ancillary-rpr"
              value={data.ancillary_rpr}
              options={REACTIVE_OPTIONS}
              onChange={(value) => update("ancillary_rpr", value)}
              disabled={disabled}
            />
            <SelectResultRow
              code="J"
              label="Blood Type:"
              value={data.ancillary_blood_type}
              options={BLOOD_TYPE_OPTIONS}
              onChange={(value) => update("ancillary_blood_type", value)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-primary/20 px-3 py-2"
        role="radiogroup"
        aria-label="Psychological test result"
      >
        <span className="text-xs font-semibold text-foreground/80">
          Psychological Test:
        </span>
        {[
          ["recommended", "Recommended"],
          ["rec_with_reservation", "Rec. w/Reservation"],
          ["not_recommended", "Not Recommended"],
          ["not_done", "Not Done"],
        ].map(([value, label]) => (
          <label
            key={value}
            className="flex cursor-pointer items-center gap-1.5"
          >
            <input
              type="radio"
              name="ancillary-psychological-test"
              checked={data.ancillary_psychological_test === value}
              onChange={() => update("ancillary_psychological_test", value)}
              tabIndex={disabled ? -1 : undefined}
              className="h-4 w-4 accent-primary"
              aria-label={`Psychological test - ${label}`}
            />
            <span className="text-xs text-foreground/80">{label}</span>
          </label>
        ))}
      </div>

      <div className="space-y-1 px-3 py-2">
        <label
          htmlFor="ancillary-additional-tests"
          className="text-xs font-semibold italic text-foreground/80"
        >
          Additional Test (Specify): e.g Blood Chemistries, Drug Tests, Alcohol
          Test, Liver Function Test, Stool Culture, etc.:
        </label>
        <Textarea
          id="ancillary-additional-tests"
          value={data.ancillary_additional_tests}
          onChange={(event) =>
            update("ancillary_additional_tests", event.target.value)
          }
          readOnly={disabled}
          tabIndex={disabled ? -1 : undefined}
          className="h-16 resize-none border border-primary/20 bg-white px-3 py-2 text-sm dark:bg-input/30"
        />
      </div>
    </div>
  );
}
