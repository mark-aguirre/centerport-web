"use client";

/**
 * Shared Fecalysis form body used by the parent report and repeat modal.
 */

import { useId } from "react";
import { cn } from "@/lib/utils";
import {
  InlineFieldWithUnit,
  InlineSelect,
  InlineSelectWithUnit,
} from "./laboratory-field-helpers";
import type { FecalysisRepeatTest } from "./repeat-fecalysis-types";

export type FecalysisFieldName =
  | "fecal_color"
  | "fecal_consistency"
  | "fecal_rbc"
  | "fecal_wbc"
  | "fecal_others"
  | "fecal_ova_parasite"
  | "fecal_amoeba"
  | "fecal_occult_blood";

export type FecalysisFormValues = Pick<
  FecalysisRepeatTest,
  FecalysisFieldName
>;

export interface FecalysisFormFieldsProps {
  /** Fecalysis values shared by parent and repeat records. */
  data: FecalysisFormValues;
  /** Date value mapped by the consuming record. */
  resultDate: string;
  /** Called when the mapped result date changes. */
  onResultDateChange: (value: string) => void;
  /** Called when a shared Fecalysis field changes. */
  onFieldChange: (field: FecalysisFieldName, value: string) => void;
  /** Makes all controls read-only. */
  disabled?: boolean;
}

const COLOR_OPTIONS = [
  "",
  "Brown",
  "Dark Brown",
  "Light Brown",
  "Yellow",
  "Green",
  "Black",
  "Red",
];
const CONSISTENCY_OPTIONS = [
  "",
  "Formed",
  "Semi-Formed",
  "Soft",
  "Watery",
  "Loose",
  "Mucoid",
];
const QUANTITY_OPTIONS = ["", "None", "None Found"];
const OVA_PARASITE_OPTIONS = ["", "NOPS", "None Found"];
const AMOEBA_OPTIONS = ["", "None", "None Found"];

/**
 * Renders Result Date and the complete Fecalysis form using the parent layout.
 */
export function FecalysisFormFields({
  data,
  resultDate,
  onResultDateChange,
  onFieldChange,
  disabled,
}: FecalysisFormFieldsProps) {
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

      <div className="max-w-2xl space-y-2">
        <InlineSelect
          label="Color"
          labelWidth="w-36"
          value={data.fecal_color}
          onChange={(value) => onFieldChange("fecal_color", value)}
          options={COLOR_OPTIONS}
          disabled={disabled}
        />
        <InlineSelect
          label="Consistency"
          labelWidth="w-36"
          value={data.fecal_consistency}
          onChange={(value) => onFieldChange("fecal_consistency", value)}
          options={CONSISTENCY_OPTIONS}
          disabled={disabled}
        />
      </div>

      <div className="mt-3 grid gap-x-10 gap-y-2 lg:grid-cols-2">
        <div className="min-w-0 space-y-2">
          <InlineSelectWithUnit
            label="Red Blood Cells"
            labelWidth="w-36"
            value={data.fecal_rbc}
            onChange={(value) => onFieldChange("fecal_rbc", value)}
            options={QUANTITY_OPTIONS}
            unit="/HPF"
            disabled={disabled}
          />
          <InlineSelectWithUnit
            label="White Blood Cells"
            labelWidth="w-36"
            value={data.fecal_wbc}
            onChange={(value) => onFieldChange("fecal_wbc", value)}
            options={QUANTITY_OPTIONS}
            unit="/HPF"
            disabled={disabled}
          />
          <InlineFieldWithUnit
            label="Others"
            labelWidth="w-36"
            value={data.fecal_others}
            onChange={(value) => onFieldChange("fecal_others", value)}
            unit=""
            disabled={disabled}
          />
        </div>

        <div className="min-w-0 space-y-2">
          <InlineSelectWithUnit
            label="Ova or Parasite"
            labelWidth="w-36"
            value={data.fecal_ova_parasite}
            onChange={(value) => onFieldChange("fecal_ova_parasite", value)}
            options={OVA_PARASITE_OPTIONS}
            unit="/LPF"
            disabled={disabled}
          />
          <InlineSelectWithUnit
            label="Amoeba"
            labelWidth="w-36"
            value={data.fecal_amoeba}
            onChange={(value) => onFieldChange("fecal_amoeba", value)}
            options={AMOEBA_OPTIONS}
            unit="/LPF"
            disabled={disabled}
          />
          <InlineFieldWithUnit
            label="Occult Blood Test"
            labelWidth="w-36"
            value={data.fecal_occult_blood}
            onChange={(value) => onFieldChange("fecal_occult_blood", value)}
            unit=""
            disabled={disabled}
          />
        </div>
      </div>
    </>
  );
}
