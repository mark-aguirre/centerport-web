"use client";

/**
 * Shared Hematology form body used by both the parent report and repeat modal.
 */

import { useId } from "react";
import { cn } from "@/lib/utils";
import {
  DiffNormalValuesHeader,
  DiffRow,
  HemaNormalValuesHeader,
  HemaRow,
} from "./hematology-row-helpers";
import type { HematologyRepeatTest } from "./repeat-hematology-types";

export type HematologyFieldName =
  | "hemoglobin"
  | "hemoglobin_normal_min"
  | "hemoglobin_normal_max"
  | "hematocrit"
  | "hematocrit_normal_min"
  | "hematocrit_normal_max"
  | "rbc_count"
  | "rbc_count_normal_min"
  | "rbc_count_normal_max"
  | "wbc_count"
  | "wbc_count_normal_min"
  | "wbc_count_normal_max"
  | "platelet"
  | "platelet_normal_min"
  | "platelet_normal_max"
  | "blood_type"
  | "esr"
  | "esr_normal_male"
  | "esr_normal_female"
  | "lymphocytes"
  | "lymphocytes_normal_min"
  | "lymphocytes_normal_max"
  | "segmenters"
  | "eosinophils"
  | "monocytes"
  | "myelocytes"
  | "juveniles"
  | "stab_cells"
  | "stab_cells_normal_min"
  | "stab_cells_normal_max"
  | "basophils"
  | "others_diff";

export type HematologyFormValues = Pick<
  HematologyRepeatTest,
  HematologyFieldName
>;

export interface HematologyFormFieldsProps {
  /** Hematology values shared by parent and repeat records. */
  data: HematologyFormValues;
  /** Date value mapped by the consuming record. */
  resultDate: string;
  /** Called when the mapped result date changes. */
  onResultDateChange: (value: string) => void;
  /** Called when any shared Hematology field changes. */
  onFieldChange: (field: HematologyFieldName, value: string) => void;
  /** Makes all controls read-only. */
  disabled?: boolean;
}

function formatReferenceRange(min: string, max: string, unit: string): string {
  const minimum = min.trim();
  const maximum = max.trim();

  if (minimum && maximum) return `${minimum} - ${maximum} ${unit}`;
  if (minimum || maximum) return `${minimum || maximum} ${unit}`;
  return unit;
}

function formatEsrReference(male: string, female: string): string {
  const maleReference = male.trim();
  const femaleReference = female.trim();

  return [
    `${maleReference ? `${maleReference} ` : ""}mm/hr (Male)`,
    `${femaleReference ? `${femaleReference} ` : ""}mm/hr (Female)`,
  ].join(" / ");
}

/**
 * Renders the complete parent Hematology field layout, including Result Date,
 * three equal desktop columns, and all Normal Values headings.
 */
export function HematologyFormFields({
  data,
  resultDate,
  onResultDateChange,
  onFieldChange,
  disabled,
}: HematologyFormFieldsProps) {
  const resultDateId = useId();

  return (
    <>
      <div className="mb-5 flex items-center gap-3">
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

      <div className="grid items-start gap-8 xl:grid-cols-3">
        <section aria-label="Complete blood count" className="min-w-0 space-y-1.5">
          <HemaNormalValuesHeader />
          <HemaRow
            label="Hemoglobin:"
            value={data.hemoglobin}
            onValueChange={(value) => onFieldChange("hemoglobin", value)}
            unit="gm/dl"
            normalRange={formatReferenceRange(
              data.hemoglobin_normal_min,
              data.hemoglobin_normal_max,
              "gm/dl"
            )}
            disabled={disabled}
          />
          <HemaRow
            label="Hematocrit:"
            value={data.hematocrit}
            onValueChange={(value) => onFieldChange("hematocrit", value)}
            unit="vol%"
            normalRange={formatReferenceRange(
              data.hematocrit_normal_min,
              data.hematocrit_normal_max,
              "vol%"
            )}
            disabled={disabled}
          />
          <HemaRow
            label="RBC Count:"
            value={data.rbc_count}
            onValueChange={(value) => onFieldChange("rbc_count", value)}
            unit="/cumm"
            normalRange={formatReferenceRange(
              data.rbc_count_normal_min,
              data.rbc_count_normal_max,
              "m/cumm"
            )}
            disabled={disabled}
          />
          <HemaRow
            label="WBC Count:"
            value={data.wbc_count}
            onValueChange={(value) => onFieldChange("wbc_count", value)}
            unit="/cumm"
            normalRange={formatReferenceRange(
              data.wbc_count_normal_min,
              data.wbc_count_normal_max,
              "/cumm"
            )}
            disabled={disabled}
          />
          <HemaRow
            label="Platelet:"
            value={data.platelet}
            onValueChange={(value) => onFieldChange("platelet", value)}
            unit="/cumm"
            normalRange={formatReferenceRange(
              data.platelet_normal_min,
              data.platelet_normal_max,
              "/cumm"
            )}
            disabled={disabled}
          />
          <HemaRow
            label="Blood Type:"
            value={data.blood_type}
            onValueChange={(value) => onFieldChange("blood_type", value)}
            unit=""
            disabled={disabled}
          />
          <HemaRow
            label="ESR:"
            value={data.esr}
            onValueChange={(value) => onFieldChange("esr", value)}
            unit="mm/hr"
            normalRange={formatEsrReference(
              data.esr_normal_male,
              data.esr_normal_female
            )}
            disabled={disabled}
          />
        </section>

        <section
          aria-labelledby={`${resultDateId}-differential-count`}
          className="min-w-0 xl:col-span-2"
        >
          <h3
            id={`${resultDateId}-differential-count`}
            className="mb-2 text-center text-sm font-bold uppercase tracking-widest text-foreground"
          >
            Differential Count:
          </h3>

          <div className="grid items-start gap-6 md:grid-cols-2">
            <div className="min-w-0 space-y-1.5">
              <DiffNormalValuesHeader />
              <DiffRow
                label="Lymphocytes:"
                value={data.lymphocytes}
                onValueChange={(value) => onFieldChange("lymphocytes", value)}
                normalRange={formatReferenceRange(
                  data.lymphocytes_normal_min,
                  data.lymphocytes_normal_max,
                  "%"
                )}
                disabled={disabled}
              />
              <DiffRow
                label="Segmenters:"
                value={data.segmenters}
                onValueChange={(value) => onFieldChange("segmenters", value)}
                normalRange="%"
                disabled={disabled}
              />
              <DiffRow
                label="Eosinophils:"
                value={data.eosinophils}
                onValueChange={(value) => onFieldChange("eosinophils", value)}
                normalRange="%"
                disabled={disabled}
              />
              <DiffRow
                label="Monocytes:"
                value={data.monocytes}
                onValueChange={(value) => onFieldChange("monocytes", value)}
                normalRange="%"
                disabled={disabled}
              />
              <DiffRow
                label="Myelocytes:"
                value={data.myelocytes}
                onValueChange={(value) => onFieldChange("myelocytes", value)}
                normalRange="%"
                disabled={disabled}
              />
              <DiffRow
                label="Juveniles:"
                value={data.juveniles}
                onValueChange={(value) => onFieldChange("juveniles", value)}
                normalRange="%"
                disabled={disabled}
              />
            </div>

            <div className="min-w-0 space-y-1.5">
              <DiffNormalValuesHeader />
              <DiffRow
                label="Stab Cells:"
                value={data.stab_cells}
                onValueChange={(value) => onFieldChange("stab_cells", value)}
                normalRange={formatReferenceRange(
                  data.stab_cells_normal_min,
                  data.stab_cells_normal_max,
                  "%"
                )}
                disabled={disabled}
              />
              <DiffRow
                label="Basophils:"
                value={data.basophils}
                onValueChange={(value) => onFieldChange("basophils", value)}
                normalRange="%"
                disabled={disabled}
              />
              <DiffRow
                label="Others:"
                value={data.others_diff}
                onValueChange={(value) => onFieldChange("others_diff", value)}
                normalRange="%"
                disabled={disabled}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
