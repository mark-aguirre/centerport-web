"use client";

/**
 * Shared Urinalysis form body used by the parent report and repeat modal.
 */

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  InlineField,
  InlineSelect,
  LabFieldWithUnit,
} from "./laboratory-field-helpers";
import type { UrinalysisRepeatTest } from "./repeat-urinalysis-types";

export type UrinalysisFieldName =
  | "urine_color"
  | "urine_transparency"
  | "urine_leucocytes"
  | "urine_nitrite"
  | "urine_urobilinogen"
  | "urine_protein"
  | "urine_ph"
  | "urine_blood"
  | "urine_specific_gravity"
  | "urine_ketone"
  | "urine_bilirubin"
  | "urine_glucose"
  | "urine_others"
  | "urine_rbc"
  | "urine_wbc"
  | "urine_amorphous_urates"
  | "urine_amorphous_phosphate"
  | "urine_epithelial_cells"
  | "urine_mucus_threads"
  | "urine_microscopic_others"
  | "urine_uric_acid"
  | "urine_calcium_oxalate"
  | "urine_crystals_others"
  | "urine_fine_granular"
  | "urine_coarse_granular"
  | "urine_cast_others";

export type UrinalysisFormValues = Pick<
  UrinalysisRepeatTest,
  UrinalysisFieldName
>;

export interface UrinalysisFormFieldsProps {
  /** Urinalysis values shared by parent and repeat records. */
  data: UrinalysisFormValues;
  /** Date value mapped by the consuming record. */
  resultDate: string;
  /** Called when the mapped result date changes. */
  onResultDateChange: (value: string) => void;
  /** Called when a shared Urinalysis field changes. */
  onFieldChange: (field: UrinalysisFieldName, value: string) => void;
  /** Makes all controls read-only. */
  disabled?: boolean;
}

const COLOR_OPTIONS = [
  "",
  "Yellow",
  "Dark Yellow",
  "Light Yellow",
  "Amber",
  "Red",
  "Orange",
  "Brown",
];
const TRANSPARENCY_OPTIONS = [
  "",
  "Clear",
  "Slightly Hazy",
  "Hazy",
  "Turbid",
];
const CHEMICAL_OPTIONS = ["", "Negative", "Trace", "+1", "+2", "+3", "+4"];

function UrinalysisGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="min-w-0 rounded-md border border-primary/15 bg-muted/5 px-3 pb-3">
      <legend className="px-1 text-xs font-bold uppercase tracking-widest text-primary">
        {title}
      </legend>
      <div className="mt-1">{children}</div>
    </fieldset>
  );
}

/**
 * Renders Result Date and the complete grouped Urinalysis form.
 */
export function UrinalysisFormFields({
  data,
  resultDate,
  onResultDateChange,
  onFieldChange,
  disabled,
}: UrinalysisFormFieldsProps) {
  const resultDateId = useId();

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <label
          htmlFor={resultDateId}
          className="text-[11px] font-bold uppercase tracking-wide text-primary/70"
        >
          Result Date:
        </label>
        <input
          id={resultDateId}
          type="date"
          value={resultDate}
          onChange={(event) => onResultDateChange(event.target.value)}
          readOnly={disabled}
          className={cn(
            "h-8 w-40 rounded-md border border-primary/30 bg-white px-2 text-xs shadow-sm transition-colors hover:border-primary/50 focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30",
            disabled && "pointer-events-none bg-muted/30"
          )}
        />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(22rem,2fr)]">
        <div className="min-w-0 space-y-4">
          <UrinalysisGroup title="Macroscopic">
            <div className="max-w-xl space-y-2">
              <InlineSelect
                label="Color"
                labelWidth="w-32"
                value={data.urine_color}
                onChange={(value) => onFieldChange("urine_color", value)}
                options={COLOR_OPTIONS}
                disabled={disabled}
              />
              <InlineSelect
                label="Transparency"
                labelWidth="w-32"
                value={data.urine_transparency}
                onChange={(value) => onFieldChange("urine_transparency", value)}
                options={TRANSPARENCY_OPTIONS}
                disabled={disabled}
              />
            </div>
          </UrinalysisGroup>

          <UrinalysisGroup title="Chemical">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <InlineSelect
                  label="Leucocytes"
                  value={data.urine_leucocytes}
                  onChange={(value) => onFieldChange("urine_leucocytes", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
                <InlineSelect
                  label="Nitrite"
                  value={data.urine_nitrite}
                  onChange={(value) => onFieldChange("urine_nitrite", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
                <InlineSelect
                  label="Urobilinogen"
                  value={data.urine_urobilinogen}
                  onChange={(value) =>
                    onFieldChange("urine_urobilinogen", value)
                  }
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
                <InlineSelect
                  label="Protein"
                  value={data.urine_protein}
                  onChange={(value) => onFieldChange("urine_protein", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
                <InlineField
                  label="pH"
                  value={data.urine_ph}
                  onChange={(value) => onFieldChange("urine_ph", value)}
                  disabled={disabled}
                />
                <InlineSelect
                  label="Blood"
                  value={data.urine_blood}
                  onChange={(value) => onFieldChange("urine_blood", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
              </div>

              <div className="min-w-0 space-y-2">
                <InlineField
                  label="Spec. Gravity"
                  value={data.urine_specific_gravity}
                  onChange={(value) =>
                    onFieldChange("urine_specific_gravity", value)
                  }
                  disabled={disabled}
                />
                <InlineSelect
                  label="Ketone"
                  value={data.urine_ketone}
                  onChange={(value) => onFieldChange("urine_ketone", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
                <InlineSelect
                  label="Bilirubin"
                  value={data.urine_bilirubin}
                  onChange={(value) => onFieldChange("urine_bilirubin", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
                <InlineSelect
                  label="Glucose"
                  value={data.urine_glucose}
                  onChange={(value) => onFieldChange("urine_glucose", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
                <InlineField
                  label="Others"
                  value={data.urine_others}
                  onChange={(value) => onFieldChange("urine_others", value)}
                  disabled={disabled}
                />
              </div>
            </div>
          </UrinalysisGroup>
        </div>

        <div className="min-w-0 space-y-4">
          <UrinalysisGroup title="Microscopic">
            <div className="space-y-2">
              <LabFieldWithUnit
                label="Red Blood Cells"
                unit="/HPF"
                value={data.urine_rbc}
                onChange={(value) => onFieldChange("urine_rbc", value)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="White Blood Cells"
                unit="/HPF"
                value={data.urine_wbc}
                onChange={(value) => onFieldChange("urine_wbc", value)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Amorphous Urates"
                unit="/LPF"
                value={data.urine_amorphous_urates}
                onChange={(value) =>
                  onFieldChange("urine_amorphous_urates", value)
                }
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Amorphous Phosphate"
                unit="/LPF"
                value={data.urine_amorphous_phosphate}
                onChange={(value) =>
                  onFieldChange("urine_amorphous_phosphate", value)
                }
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Epithelial Cells"
                unit="/LPF"
                value={data.urine_epithelial_cells}
                onChange={(value) =>
                  onFieldChange("urine_epithelial_cells", value)
                }
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Mucus Threads"
                unit="/LPF"
                value={data.urine_mucus_threads}
                onChange={(value) =>
                  onFieldChange("urine_mucus_threads", value)
                }
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Others"
                unit="/LPF"
                value={data.urine_microscopic_others}
                onChange={(value) =>
                  onFieldChange("urine_microscopic_others", value)
                }
                disabled={disabled}
              />
            </div>
          </UrinalysisGroup>

          <UrinalysisGroup title="Crystals">
            <div className="space-y-2">
              <LabFieldWithUnit
                label="Uric Acid"
                unit="/LPF"
                value={data.urine_uric_acid}
                onChange={(value) => onFieldChange("urine_uric_acid", value)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Calcium Oxalate"
                unit="/LPF"
                value={data.urine_calcium_oxalate}
                onChange={(value) =>
                  onFieldChange("urine_calcium_oxalate", value)
                }
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Others"
                unit="/LPF"
                value={data.urine_crystals_others}
                onChange={(value) =>
                  onFieldChange("urine_crystals_others", value)
                }
                disabled={disabled}
              />
            </div>
          </UrinalysisGroup>

          <UrinalysisGroup title="Cast">
            <div className="space-y-2">
              <LabFieldWithUnit
                label="Fine Granular"
                unit="/LPF"
                value={data.urine_fine_granular}
                onChange={(value) =>
                  onFieldChange("urine_fine_granular", value)
                }
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Coarse Granular"
                unit="/LPF"
                value={data.urine_coarse_granular}
                onChange={(value) =>
                  onFieldChange("urine_coarse_granular", value)
                }
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Others"
                unit="/LPF"
                value={data.urine_cast_others}
                onChange={(value) => onFieldChange("urine_cast_others", value)}
                disabled={disabled}
              />
            </div>
          </UrinalysisGroup>
        </div>
      </div>
    </>
  );
}
