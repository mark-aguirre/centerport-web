"use client";

import { FormSelect } from "@/components/common/form-select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { MedicalExam, MedicalSectionProps } from "./types";

const ACUITY_OPTIONS = ["Adequate", "Defective"];
const STCW_OPTIONS = ["Yes", "No"];

interface AcuityInputProps {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function AcuityInput({
  label,
  value,
  disabled,
  onChange,
}: AcuityInputProps) {
  return (
    <label className="flex min-w-0 items-center gap-1.5">
      <span className="shrink-0 text-[11px] font-bold uppercase text-primary/70">
        {label}
      </span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        readOnly={disabled}
        tabIndex={disabled ? -1 : undefined}
        className="h-7 min-w-0 flex-1 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30"
        aria-label={label}
      />
    </label>
  );
}

interface VisionChoiceProps {
  label: string;
  name: string;
  value: string;
  checkedValue: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function VisionChoice({
  label,
  name,
  value,
  checkedValue,
  disabled,
  onChange,
}: VisionChoiceProps) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5">
      <input
        type="radio"
        name={name}
        checked={value === checkedValue}
        onChange={() => onChange(checkedValue)}
        tabIndex={disabled ? -1 : undefined}
        className="h-4 w-4 accent-primary"
        aria-label={label}
      />
      <span className="text-xs text-foreground/80">{label}</span>
    </label>
  );
}

/**
 * Vision assessment section matching the Seabase medical examination form.
 *
 * Displays corrected and uncorrected far/near acuity, color-vision findings,
 * and STCW compliance details in a compact bordered table.
 */
export function VisionSection({
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
      <div className="border-b border-primary/20 bg-muted px-3 py-1.5 text-center text-sm font-bold uppercase tracking-widest text-foreground">
        Vision
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.62fr_1.18fr_1.12fr_0.78fr_3.6fr]">
        <div className="hidden border-b border-primary/20 p-2 lg:block lg:border-r" />
        <div className="border-b border-primary/20 p-2 text-center text-[11px] font-bold uppercase tracking-wider text-primary/70 lg:border-r">
          Far Vision
        </div>
        <div className="border-b border-primary/20 p-2 text-center text-[11px] font-bold uppercase tracking-wider text-primary/70 lg:border-r">
          Near Vision
        </div>
        <div className="border-b border-primary/20 p-2 text-center text-[11px] font-bold uppercase tracking-wider text-primary/70 lg:border-r">
          Color Vision
        </div>
        <div className="border-b border-primary/20 p-2 text-center text-[11px] font-bold uppercase tracking-wider text-primary/70">
          Meets Standards in
          <br />
          STCW Code, Section A-I/9:
        </div>

        <div className="flex items-center justify-center border-b border-primary/20 p-2 text-xs text-foreground/80 lg:border-r">
          Uncorrected
        </div>
        <div className="grid grid-cols-2 gap-2 border-b border-primary/20 p-2 lg:border-r">
          <AcuityInput
            label="OD"
            value={data.vision_uncorrected_far_od}
            onChange={(value) => update("vision_uncorrected_far_od", value)}
            disabled={disabled}
          />
          <AcuityInput
            label="OS"
            value={data.vision_uncorrected_far_os}
            onChange={(value) => update("vision_uncorrected_far_os", value)}
            disabled={disabled}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 border-b border-primary/20 p-2 lg:border-r">
          <AcuityInput
            label="OD J/"
            value={data.vision_uncorrected_near_od}
            onChange={(value) => update("vision_uncorrected_near_od", value)}
            disabled={disabled}
          />
          <AcuityInput
            label="OS J/"
            value={data.vision_uncorrected_near_os}
            onChange={(value) => update("vision_uncorrected_near_os", value)}
            disabled={disabled}
          />
        </div>
        <div
          className="flex items-center border-b border-primary/20 p-2 lg:border-r lg:row-span-2"
          role="radiogroup"
          aria-label="Color vision"
        >
          <div className="space-y-3">
            <VisionChoice
              label="Adequate"
              name="vision-color"
              value={data.vision_color}
              checkedValue="adequate"
              onChange={(value) => update("vision_color", value)}
              disabled={disabled}
            />
            <VisionChoice
              label="Defective"
              name="vision-color"
              value={data.vision_color}
              checkedValue="defective"
              onChange={(value) => update("vision_color", value)}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="space-y-2 border-b border-primary/20 p-2 lg:row-span-2">
          <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[96px_100px_1fr]">
            <span className="text-[11px] font-bold text-primary/70">
              Visual Acuity:
            </span>
            <FormSelect
              label=""
              value={data.vision_visual_acuity}
              onChange={(value) => update("vision_visual_acuity", value)}
              options={ACUITY_OPTIONS}
              disabled={disabled}
            />
            <div
              className="flex flex-wrap items-center gap-4"
              role="radiogroup"
              aria-label="Visual aid"
            >
              <VisionChoice
                label="Spectacles"
                name="vision-aid"
                value={data.vision_contact_lenses}
                checkedValue="spectacles"
                onChange={(value) => update("vision_contact_lenses", value)}
                disabled={disabled}
              />
              <VisionChoice
                label="Contact Lenses"
                name="vision-aid"
                value={data.vision_contact_lenses}
                checkedValue="contact_lenses"
                onChange={(value) => update("vision_contact_lenses", value)}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[96px_100px_auto_1fr]">
            <span className="text-[11px] font-bold text-primary/70">
              Color Vision:
            </span>
            <FormSelect
              label=""
              value={data.vision_meets_stcw}
              onChange={(value) => update("vision_meets_stcw", value)}
              options={STCW_OPTIONS}
              disabled={disabled}
            />
            <span className="text-[11px] font-bold text-primary/70 sm:text-right">
              Date Taken (mm/dd/yyyy):
            </span>
            <Input
              type="date"
              value={data.vision_date_taken}
              onChange={(event) =>
                update("vision_date_taken", event.target.value)
              }
              readOnly={disabled}
              tabIndex={disabled ? -1 : undefined}
              className="h-8 min-w-36 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30"
              aria-label="Vision test date taken"
            />
          </div>
        </div>

        <div className="flex items-center justify-center border-b border-primary/20 p-2 text-xs text-foreground/80 lg:border-r lg:border-b-0">
          Corrected
        </div>
        <div className="grid grid-cols-2 gap-2 border-b border-primary/20 p-2 lg:border-r lg:border-b-0">
          <AcuityInput
            label="OD"
            value={data.vision_corrected_far_od}
            onChange={(value) => update("vision_corrected_far_od", value)}
            disabled={disabled}
          />
          <AcuityInput
            label="OS"
            value={data.vision_corrected_far_os}
            onChange={(value) => update("vision_corrected_far_os", value)}
            disabled={disabled}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 border-b border-primary/20 p-2 lg:border-r lg:border-b-0">
          <AcuityInput
            label="OD J/"
            value={data.vision_corrected_near_od}
            onChange={(value) => update("vision_corrected_near_od", value)}
            disabled={disabled}
          />
          <AcuityInput
            label="OS J/"
            value={data.vision_corrected_near_os}
            onChange={(value) => update("vision_corrected_near_os", value)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
