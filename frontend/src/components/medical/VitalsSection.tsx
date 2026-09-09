"use client";

import { FormSelect } from "@/components/common/form-select";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { MedicalSectionProps } from "./types";

interface InlineVitalFieldProps {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function InlineVitalField({
  label,
  value,
  disabled,
  onChange,
}: InlineVitalFieldProps) {
  return (
    <label className="grid grid-cols-[auto_minmax(70px,1fr)] items-center gap-2">
      <span className="text-[11px] font-semibold text-foreground/80">
        {label}:
      </span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        readOnly={disabled}
        tabIndex={disabled ? -1 : undefined}
        className="h-7 min-w-0 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30"
        aria-label={label}
      />
    </label>
  );
}

/**
 * Physical Examination vital-signs section matching the Seabase form.
 *
 * Groups paired measurements into a compact five-column bordered table below
 * the numbered examination instructions.
 */
export function VitalsSection({
  data,
  onChange,
  disabled,
}: MedicalSectionProps) {
  const update = createFieldUpdater(data, onChange);

  const handleSetNormal = () => {
    update("pe_rhythm", "Regular");
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm",
        disabled && "pointer-events-none",
      )}
    >
      <div className="flex flex-col gap-1 border-b border-primary/20 px-3 py-2 sm:flex-row sm:items-baseline">
        <h2 className="shrink-0 text-sm font-bold uppercase tracking-wide text-primary">
          II. Physical Examination -
        </h2>
        <p className="flex-1 text-xs text-foreground/80">
          Enter the data called for. Check the appropriate box. Under columns A,
          B, C check YES if normal; uncheck if not normal and specify findings.
        </p>
        <SetNormalButton
          onClick={handleSetNormal}
          disabled={disabled}
          className="self-start sm:self-center"
        />
      </div>

      <div className="grid grid-cols-1 bg-muted/20 lg:grid-cols-[0.9fr_1.65fr_1fr_0.82fr_1.2fr]">
        <div className="space-y-2 border-b border-primary/20 p-2 lg:border-r lg:border-b-0">
          <InlineVitalField
            label="Height (cm)"
            value={data.pe_height}
            onChange={(value) => update("pe_height", value)}
            disabled={disabled}
          />
          <InlineVitalField
            label="Weight (kg)"
            value={data.pe_weight}
            onChange={(value) => update("pe_weight", value)}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2 border-b border-primary/20 p-2 lg:border-r lg:border-b-0">
          <InlineVitalField
            label="Blood Pressure Systolic (mm Hg)"
            value={data.pe_bp_systolic}
            onChange={(value) => update("pe_bp_systolic", value)}
            disabled={disabled}
          />
          <InlineVitalField
            label="Blood Pressure Diastolic (mm Hg)"
            value={data.pe_bp_diastolic}
            onChange={(value) => update("pe_bp_diastolic", value)}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2 border-b border-primary/20 p-2 lg:border-r lg:border-b-0">
          <InlineVitalField
            label="Pulse Rate (bpm)"
            value={data.pe_pulse_rate}
            onChange={(value) => update("pe_pulse_rate", value)}
            disabled={disabled}
          />
          <div className="grid grid-cols-[auto_minmax(90px,1fr)] items-center gap-2">
            <span className="text-[11px] font-semibold uppercase text-foreground/80">
              Rhythm:
            </span>
            <FormSelect
              label=""
              value={data.pe_rhythm}
              onChange={(value) => update("pe_rhythm", value)}
              options={["Regular", "Irregular"]}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="space-y-2 border-b border-primary/20 p-2 lg:border-r lg:border-b-0">
          <InlineVitalField
            label="Respiration"
            value={data.pe_respiration}
            onChange={(value) => update("pe_respiration", value)}
            disabled={disabled}
          />
          <InlineVitalField
            label="BMI"
            value={data.pe_bmi}
            onChange={(value) => update("pe_bmi", value)}
            disabled={disabled}
          />
        </div>

        <label className="flex min-h-20 flex-col justify-between gap-2 p-2">
          <span className="text-[11px] font-semibold text-foreground/80">
            Body Temperature:
          </span>
          <Input
            value={data.pe_body_temperature}
            onChange={(event) =>
              update("pe_body_temperature", event.target.value)
            }
            readOnly={disabled}
            tabIndex={disabled ? -1 : undefined}
            className="h-8 border border-primary/20 bg-white px-2 text-xs dark:bg-input/30"
            aria-label="Body Temperature"
          />
        </label>
      </div>
    </div>
  );
}
