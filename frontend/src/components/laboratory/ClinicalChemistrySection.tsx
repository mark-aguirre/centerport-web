"use client";

/**
 * Clinical Chemistry and Serology/Immunology section for a laboratory report.
 *
 * Follows the supplied reference table while retaining the existing persisted
 * S.I., conventional, and manual HIGH result fields.
 */

import { useState } from "react";
import { FlaskConical, Printer, RotateCcw } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChemRow, ChemRowSimple } from "./chemistry-row-helpers";
import { RepeatChemistryDialog } from "./RepeatChemistryDialog";
import type { LaboratorySectionProps } from "./types";
import { createFieldUpdater } from "./utils";

const headerCellClassName =
  "border-r border-primary/20 px-2 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-primary/70 last:border-r-0";

/**
 * Displays and edits the clinical chemistry portion of a laboratory report.
 */
export default function ClinicalChemistrySection({
  data,
  onChange,
  disabled,
}: LaboratorySectionProps) {
  const updateField = createFieldUpdater(data, onChange);
  const [repeatDialogOpen, setRepeatDialogOpen] = useState(false);
  const hasPersistedReport = Boolean(data.id);
  const hba1cReference = data.hba1c_normal.trim() || "4.0-6.0%";

  return (
    <div className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
      <SectionHeader
        title="Clinical Chemistry and Serology/Immunology"
        icon={FlaskConical}
        action={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasPersistedReport}
              onClick={() => setRepeatDialogOpen(true)}
              className="cursor-pointer"
            >
              <RotateCcw aria-hidden="true" />
              Repeat Chemistry
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasPersistedReport}
              onClick={() => window.print()}
              className="cursor-pointer"
            >
              <Printer aria-hidden="true" />
              Print
            </Button>
          </div>
        }
      />

      <RepeatChemistryDialog
        open={repeatDialogOpen}
        onOpenChange={setRepeatDialogOpen}
        laboratoryReportId={data.id}
      />

      <div className="mb-4 flex items-center gap-3">
        <label
          htmlFor="chemistry-result-date"
          className="text-[11px] font-bold uppercase tracking-wide text-primary/70"
        >
          Result Date:
        </label>
        <input
          id="chemistry-result-date"
          type="date"
          value={data.chemistry_result_date}
          onChange={(event) =>
            updateField("chemistry_result_date", event.target.value)
          }
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
              onResultSiChange={(value) => updateField("fbs_result_si", value)}
              resultConv={data.fbs_result_conv}
              onResultConvChange={(value) => updateField("fbs_result_conv", value)}
              high={data.fbs_high}
              onHighChange={(value) => updateField("fbs_high", value)}
              resultSiUnit="mmol/L"
              resultConvUnit="mg/dL"
              disabled={disabled}
            />
            <ChemRow
              label="BUN:"
              siUnit="mmol/L"
              convUnit="mg/dL"
              resultSi={data.bun_result_si}
              onResultSiChange={(value) => updateField("bun_result_si", value)}
              resultConv={data.bun_result_conv}
              onResultConvChange={(value) => updateField("bun_result_conv", value)}
              high={data.bun_high}
              onHighChange={(value) => updateField("bun_high", value)}
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
                updateField("creatinine_result_si", value)
              }
              resultConv={data.creatinine_result_conv}
              onResultConvChange={(value) =>
                updateField("creatinine_result_conv", value)
              }
              high={data.creatinine_high}
              onHighChange={(value) => updateField("creatinine_high", value)}
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
                updateField("cholesterol_result_si", value)
              }
              resultConv={data.cholesterol_result_conv}
              onResultConvChange={(value) =>
                updateField("cholesterol_result_conv", value)
              }
              high={data.cholesterol_high}
              onHighChange={(value) => updateField("cholesterol_high", value)}
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
                updateField("triglycerides_result_si", value)
              }
              resultConv={data.triglycerides_result_conv}
              onResultConvChange={(value) =>
                updateField("triglycerides_result_conv", value)
              }
              high={data.triglycerides_high}
              onHighChange={(value) => updateField("triglycerides_high", value)}
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
                updateField("uric_acid_result_si", value)
              }
              resultConv={data.uric_acid_result_conv}
              onResultConvChange={(value) =>
                updateField("uric_acid_result_conv", value)
              }
              high={data.uric_acid_high}
              onHighChange={(value) => updateField("uric_acid_high", value)}
              resultSiUnit="mmol/L"
              resultConvUnit="mg/dL"
              disabled={disabled}
            />
            <ChemRowSimple
              label="SGOT:"
              siUnit="IU/L"
              resultSi={data.sgot_result_si}
              onResultSiChange={(value) => updateField("sgot_result_si", value)}
              resultConv={data.sgot_result_conv}
              onResultConvChange={(value) => updateField("sgot_result_conv", value)}
              high={data.sgot_high}
              onHighChange={(value) => updateField("sgot_high", value)}
              resultSiUnit="IU/L"
              resultConvUnit="IU/L"
              disabled={disabled}
            />
            <ChemRowSimple
              label="SGPT:"
              siUnit="IU/L"
              resultSi={data.sgpt_result_si}
              onResultSiChange={(value) => updateField("sgpt_result_si", value)}
              resultConv={data.sgpt_result_conv}
              onResultConvChange={(value) => updateField("sgpt_result_conv", value)}
              high={data.sgpt_high}
              onHighChange={(value) => updateField("sgpt_high", value)}
              resultSiUnit="IU/L"
              resultConvUnit="IU/L"
              disabled={disabled}
            />
            <ChemRowSimple
              label="Alk. Phos:"
              siUnit="IU/L"
              resultSi={data.alk_phos_result_si}
              onResultSiChange={(value) =>
                updateField("alk_phos_result_si", value)
              }
              resultConv={data.alk_phos_result_conv}
              onResultConvChange={(value) =>
                updateField("alk_phos_result_conv", value)
              }
              high={data.alk_phos_high}
              onHighChange={(value) => updateField("alk_phos_high", value)}
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
                {hba1cReference}
              </td>
              <td className="border-r border-primary/15 px-2 py-1.5" />
              <td className="border-r border-primary/15 px-2 py-1.5">
                <div className="flex min-w-0 items-center gap-2">
                  <input
                    type="text"
                    value={data.hba1c_result}
                    onChange={(event) =>
                      updateField("hba1c_result", event.target.value)
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
                    updateField("hba1c_high", event.target.checked)
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
    </div>
  );
}
