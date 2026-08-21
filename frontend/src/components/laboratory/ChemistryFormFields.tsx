"use client";

/**
 * Shared Clinical Chemistry form body used by the parent report and repeat modal.
 */

import { useId } from "react";
import { cn } from "@/lib/utils";
import { ChemRow, ChemRowSimple } from "./chemistry-row-helpers";
import type { ChemistryRepeatTest } from "./repeat-chemistry-types";

export type ChemistryFieldName =
  | "fbs_result_si"
  | "fbs_result_conv"
  | "fbs_high"
  | "bun_result_si"
  | "bun_result_conv"
  | "bun_high"
  | "creatinine_result_si"
  | "creatinine_result_conv"
  | "creatinine_high"
  | "cholesterol_result_si"
  | "cholesterol_result_conv"
  | "cholesterol_high"
  | "triglycerides_result_si"
  | "triglycerides_result_conv"
  | "triglycerides_high"
  | "uric_acid_result_si"
  | "uric_acid_result_conv"
  | "uric_acid_high"
  | "sgot_result_si"
  | "sgot_result_conv"
  | "sgot_high"
  | "sgpt_result_si"
  | "sgpt_result_conv"
  | "sgpt_high"
  | "alk_phos_result_si"
  | "alk_phos_result_conv"
  | "alk_phos_high"
  | "hba1c_result"
  | "hba1c_high";

export type ChemistryFormValues = Pick<
  ChemistryRepeatTest,
  ChemistryFieldName
>;

export interface ChemistryFormFieldsProps {
  /** Chemistry values shared by parent and repeat records. */
  data: ChemistryFormValues;
  /** Date value mapped by the consuming record. */
  resultDate: string;
  /** Optional persisted HbA1c reference; defaults to `4.0-6.0%`. */
  hba1cReference?: string;
  /** Called when the mapped result date changes. */
  onResultDateChange: (value: string) => void;
  /** Called when a chemistry result or HIGH flag changes. */
  onFieldChange: (
    field: ChemistryFieldName,
    value: string | boolean
  ) => void;
  /** Makes all controls read-only. */
  disabled?: boolean;
}

const headerCellClassName =
  "border-r border-primary/20 px-2 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-primary/70 last:border-r-0";

/**
 * Renders Result Date and the complete six-column Clinical Chemistry table.
 */
export function ChemistryFormFields({
  data,
  resultDate,
  hba1cReference,
  onResultDateChange,
  onFieldChange,
  disabled,
}: ChemistryFormFieldsProps) {
  const resultDateId = useId();
  const hba1cReferenceText = hba1cReference?.trim() || "4.0-6.0%";

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

      <div className="overflow-x-auto rounded-md border border-primary/20">
        <table className="w-full min-w-[860px] table-fixed border-collapse text-xs">
          <caption className="sr-only">
            Clinical chemistry reference units and examination results
          </caption>
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[17%]" />
            <col className="w-[18%]" />
            <col className="w-[20%]" />
            <col className="w-[8%]" />
            <col className="w-[19%]" />
          </colgroup>
          <thead className="bg-muted/25">
            <tr className="border-b border-primary/20">
              <th
                rowSpan={2}
                scope="col"
                className={cn(headerCellClassName, "text-left align-middle")}
              >
                Examination
              </th>
              <th colSpan={2} scope="colgroup" className={headerCellClassName}>
                Reference Range
              </th>
              <th colSpan={3} scope="colgroup" className={headerCellClassName}>
                Result
              </th>
            </tr>
            <tr className="border-b border-primary/20">
              <th scope="col" className={headerCellClassName}>
                S.I. Unit
              </th>
              <th scope="col" className={headerCellClassName}>
                Conventional Unit
              </th>
              <th scope="col" className={headerCellClassName}>
                S.I. Unit
              </th>
              <th
                scope="col"
                className={cn(headerCellClassName, "text-destructive")}
              >
                High?
              </th>
              <th scope="col" className={headerCellClassName}>
                Conventional Unit
              </th>
            </tr>
          </thead>
          <tbody>
            <ChemRow
              label="FBS:"
              siUnit="mmol/L"
              convUnit="mg/dL"
              resultSi={data.fbs_result_si}
              onResultSiChange={(value) => onFieldChange("fbs_result_si", value)}
              resultConv={data.fbs_result_conv}
              onResultConvChange={(value) =>
                onFieldChange("fbs_result_conv", value)
              }
              high={data.fbs_high}
              onHighChange={(value) => onFieldChange("fbs_high", value)}
              resultSiUnit="mmol/L"
              resultConvUnit="mg/dL"
              disabled={disabled}
            />
            <ChemRow
              label="BUN:"
              siUnit="mmol/L"
              convUnit="mg/dL"
              resultSi={data.bun_result_si}
              onResultSiChange={(value) => onFieldChange("bun_result_si", value)}
              resultConv={data.bun_result_conv}
              onResultConvChange={(value) =>
                onFieldChange("bun_result_conv", value)
              }
              high={data.bun_high}
              onHighChange={(value) => onFieldChange("bun_high", value)}
              resultSiUnit="mmol/L"
              resultConvUnit="mg/dL"
              disabled={disabled}
            />
            <ChemRow
              label="Creatinine:"
              siUnit="mmol/L"
              convUnit="mg/dL"
              resultSi={data.creatinine_result_si}
              onResultSiChange={(value) =>
                onFieldChange("creatinine_result_si", value)
              }
              resultConv={data.creatinine_result_conv}
              onResultConvChange={(value) =>
                onFieldChange("creatinine_result_conv", value)
              }
              high={data.creatinine_high}
              onHighChange={(value) => onFieldChange("creatinine_high", value)}
              resultSiUnit="mmol/L"
              resultConvUnit="mg/dL"
              disabled={disabled}
            />
            <ChemRow
              label="Cholesterol:"
              siUnit="mmol/L"
              convUnit="mg/dL"
              resultSi={data.cholesterol_result_si}
              onResultSiChange={(value) =>
                onFieldChange("cholesterol_result_si", value)
              }
              resultConv={data.cholesterol_result_conv}
              onResultConvChange={(value) =>
                onFieldChange("cholesterol_result_conv", value)
              }
              high={data.cholesterol_high}
              onHighChange={(value) => onFieldChange("cholesterol_high", value)}
              resultSiUnit="mmol/L"
              resultConvUnit="mg/dL"
              disabled={disabled}
            />
            <ChemRow
              label="Triglycerides:"
              siUnit="mmol/L"
              convUnit="mg/dL"
              resultSi={data.triglycerides_result_si}
              onResultSiChange={(value) =>
                onFieldChange("triglycerides_result_si", value)
              }
              resultConv={data.triglycerides_result_conv}
              onResultConvChange={(value) =>
                onFieldChange("triglycerides_result_conv", value)
              }
              high={data.triglycerides_high}
              onHighChange={(value) =>
                onFieldChange("triglycerides_high", value)
              }
              resultSiUnit="mmol/L"
              resultConvUnit="mg/dL"
              disabled={disabled}
            />
            <ChemRow
              label="Uric Acid:"
              siUnit="mmol/L"
              convUnit="mg/dL"
              resultSi={data.uric_acid_result_si}
              onResultSiChange={(value) =>
                onFieldChange("uric_acid_result_si", value)
              }
              resultConv={data.uric_acid_result_conv}
              onResultConvChange={(value) =>
                onFieldChange("uric_acid_result_conv", value)
              }
              high={data.uric_acid_high}
              onHighChange={(value) => onFieldChange("uric_acid_high", value)}
              resultSiUnit="mmol/L"
              resultConvUnit="mg/dL"
              disabled={disabled}
            />
            <ChemRowSimple
              label="SGOT:"
              siUnit="IU/L"
              resultSi={data.sgot_result_si}
              onResultSiChange={(value) => onFieldChange("sgot_result_si", value)}
              resultConv={data.sgot_result_conv}
              onResultConvChange={(value) =>
                onFieldChange("sgot_result_conv", value)
              }
              high={data.sgot_high}
              onHighChange={(value) => onFieldChange("sgot_high", value)}
              resultSiUnit="IU/L"
              resultConvUnit="IU/L"
              disabled={disabled}
            />
            <ChemRowSimple
              label="SGPT:"
              siUnit="IU/L"
              resultSi={data.sgpt_result_si}
              onResultSiChange={(value) => onFieldChange("sgpt_result_si", value)}
              resultConv={data.sgpt_result_conv}
              onResultConvChange={(value) =>
                onFieldChange("sgpt_result_conv", value)
              }
              high={data.sgpt_high}
              onHighChange={(value) => onFieldChange("sgpt_high", value)}
              resultSiUnit="IU/L"
              resultConvUnit="IU/L"
              disabled={disabled}
            />
            <ChemRowSimple
              label="Alk. Phos:"
              siUnit="IU/L"
              resultSi={data.alk_phos_result_si}
              onResultSiChange={(value) =>
                onFieldChange("alk_phos_result_si", value)
              }
              resultConv={data.alk_phos_result_conv}
              onResultConvChange={(value) =>
                onFieldChange("alk_phos_result_conv", value)
              }
              high={data.alk_phos_high}
              onHighChange={(value) => onFieldChange("alk_phos_high", value)}
              resultSiUnit="IU/L"
              resultConvUnit="IU/L"
              disabled={disabled}
            />
            <tr className="border-t border-primary/15 transition-colors hover:bg-muted/20">
              <th
                scope="row"
                className="border-r border-primary/15 px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-primary/70"
              >
                HbA1c:
              </th>
              <td className="border-r border-primary/15 px-2 py-1.5 text-center text-[11px] text-foreground/70">
                {hba1cReferenceText}
              </td>
              <td className="border-r border-primary/15 px-2 py-1.5" />
              <td className="border-r border-primary/15 px-2 py-1.5">
                <div className="flex min-w-0 items-center gap-2">
                  <input
                    type="text"
                    value={data.hba1c_result}
                    onChange={(event) =>
                      onFieldChange("hba1c_result", event.target.value)
                    }
                    readOnly={disabled}
                    aria-label="HbA1c S.I. result"
                    className={cn(
                      "h-7 min-w-0 w-full rounded border border-primary/20 bg-white px-2 text-center text-xs transition-colors focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30",
                      disabled && "pointer-events-none bg-muted/30"
                    )}
                  />
                  <span className="shrink-0 text-[11px] text-foreground/70">%</span>
                </div>
              </td>
              <td className="border-r border-primary/15 px-2 py-1.5 text-center">
                <input
                  type="checkbox"
                  checked={data.hba1c_high}
                  onChange={(event) =>
                    onFieldChange("hba1c_high", event.target.checked)
                  }
                  disabled={disabled}
                  aria-label="HbA1c high result"
                  className="h-4 w-4 cursor-pointer accent-destructive disabled:cursor-not-allowed"
                />
              </td>
              <td className="px-2 py-1.5 text-[11px] text-foreground/70">%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
