"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/common/section-header";
import { FlaskConical, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import { ChemRow, ChemRowSimple } from "./chemistry-row-helpers";
import { RepeatChemistryDialog } from "./RepeatChemistryDialog";
import type { LaboratorySectionProps } from "./types";

/**
 * Clinical Chemistry and Serology/Immunology section for the Laboratory Report form.
 *
 * Table-style layout matching the reference:
 * EXAMINATION | REFERENCE RANGE (S.I. Unit | Conventional Unit) | RESULT (S.I. Unit | HIGH? | Conventional Unit)
 * Includes a "Repeat Chemistry" button in the header.
 */
export default function ClinicalChemistrySection({
  data,
  onChange,
  disabled,
}: LaboratorySectionProps) {
  const updateField = createFieldUpdater(data, onChange);
  const [repeatDialogOpen, setRepeatDialogOpen] = useState(false);

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      {/* Header row with Repeat Chemistry button */}
      <div className="flex items-center justify-between mb-2">
        <SectionHeader
          title="Clinical Chemistry and Serology/Immunology"
          icon={FlaskConical}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!data.id}
            onClick={() => setRepeatDialogOpen(true)}
            className={cn(
              "text-xs px-3 py-1.5 rounded border border-primary/30 bg-muted hover:bg-primary/10 text-primary/80 font-medium transition-colors",
              !data.id && "opacity-50 pointer-events-none"
            )}
          >
            Repeat Chemistry
          </button>
          <button
            type="button"
            disabled={!data.id}
            onClick={() => window.print()}
            className={cn(
              "text-xs px-3 py-1.5 rounded border border-primary/30 bg-muted hover:bg-primary/10 text-primary/80 font-medium transition-colors inline-flex items-center gap-1",
              !data.id && "opacity-50 pointer-events-none"
            )}
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>

      {/* Repeat Chemistry Dialog */}
      <RepeatChemistryDialog
        open={repeatDialogOpen}
        onOpenChange={setRepeatDialogOpen}
        laboratoryReportId={data.id}
      />

      {/* Result Date */}
      <div className="mb-3">
        <div className="w-36">
          <label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">
            Result Date
          </label>
          <input
            type="date"
            value={data.chemistry_result_date}
            onChange={(e) => updateField("chemistry_result_date", e.target.value)}
            readOnly={disabled}
            className={cn(
              "h-7 w-full text-xs bg-white border border-primary/20 rounded px-2 focus:outline-none focus:border-primary dark:bg-input/30",
              disabled && "pointer-events-none"
            )}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse border border-primary/20">
          {/* Header Row 1 */}
          <thead>
            <tr className="border-b border-primary/20">
              <th
                rowSpan={2}
                className="text-left py-1.5 px-2 text-[10px] font-bold text-primary/80 uppercase tracking-wide border-r border-primary/20 w-28"
              >
                Examination
              </th>
              <th
                colSpan={2}
                className="text-center py-1 px-2 text-[10px] font-bold text-primary/80 uppercase tracking-wide border-r border-primary/20"
              >
                Reference Range
              </th>
              <th
                colSpan={3}
                className="text-center py-1 px-2 text-[10px] font-bold text-primary/80 uppercase tracking-wide"
              >
                Result
              </th>
            </tr>
            {/* Header Row 2 */}
            <tr className="border-b border-primary/20">
              <th className="text-center py-1 px-2 text-[9px] font-semibold text-primary/60 uppercase border-r border-primary/20 w-24">
                S.I. Unit
              </th>
              <th className="text-center py-1 px-2 text-[9px] font-semibold text-primary/60 uppercase border-r border-primary/20 w-28">
                Conventional Unit
              </th>
              <th className="text-center py-1 px-2 text-[9px] font-semibold text-primary/60 uppercase border-r border-primary/20 w-24">
                S.I. Unit
              </th>
              <th className="text-center py-1 px-2 text-[9px] font-semibold text-primary/60 uppercase border-r border-primary/20 w-12">
                HIGH?
              </th>
              <th className="text-center py-1 px-2 text-[9px] font-semibold text-primary/60 uppercase w-28">
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
              onResultSiChange={(v) => updateField("fbs_result_si", v)}
              resultConv={data.fbs_result_conv}
              onResultConvChange={(v) => updateField("fbs_result_conv", v)}
              high={data.fbs_high}
              onHighChange={(v) => updateField("fbs_high", v)}
              resultSiUnit="mmol/l"
              resultConvUnit="mg/dl"
              disabled={disabled}
            />
            <ChemRow
              label="BUN:"
              siUnit="mmol/L"
              convUnit="mg/dL"
              resultSi={data.bun_result_si}
              onResultSiChange={(v) => updateField("bun_result_si", v)}
              resultConv={data.bun_result_conv}
              onResultConvChange={(v) => updateField("bun_result_conv", v)}
              high={data.bun_high}
              onHighChange={(v) => updateField("bun_high", v)}
              resultSiUnit="mmol/l"
              resultConvUnit="mg/dl"
              disabled={disabled}
            />
            <ChemRow
              label="CREATININE:"
              siUnit="mmol/L"
              convUnit="mg/dL"
              resultSi={data.creatinine_result_si}
              onResultSiChange={(v) => updateField("creatinine_result_si", v)}
              resultConv={data.creatinine_result_conv}
              onResultConvChange={(v) => updateField("creatinine_result_conv", v)}
              high={data.creatinine_high}
              onHighChange={(v) => updateField("creatinine_high", v)}
              resultSiUnit="mmol/l"
              resultConvUnit="mg/dl"
              disabled={disabled}
            />
            <ChemRow
              label="CHOLESTEROL:"
              siUnit="mmol/L"
              convUnit="mg/dL"
              resultSi={data.cholesterol_result_si}
              onResultSiChange={(v) => updateField("cholesterol_result_si", v)}
              resultConv={data.cholesterol_result_conv}
              onResultConvChange={(v) => updateField("cholesterol_result_conv", v)}
              high={data.cholesterol_high}
              onHighChange={(v) => updateField("cholesterol_high", v)}
              resultSiUnit="mmol/l"
              resultConvUnit="mg/dl"
              disabled={disabled}
            />
            <ChemRow
              label="TRIGLYCERIDES:"
              siUnit="mmol/L"
              convUnit="mg/dL"
              resultSi={data.triglycerides_result_si}
              onResultSiChange={(v) => updateField("triglycerides_result_si", v)}
              resultConv={data.triglycerides_result_conv}
              onResultConvChange={(v) => updateField("triglycerides_result_conv", v)}
              high={data.triglycerides_high}
              onHighChange={(v) => updateField("triglycerides_high", v)}
              resultSiUnit="mmol/l"
              resultConvUnit="mg/dl"
              disabled={disabled}
            />
            <ChemRow
              label="URIC ACID:"
              siUnit="mmol/L"
              convUnit="mg/dL"
              resultSi={data.uric_acid_result_si}
              onResultSiChange={(v) => updateField("uric_acid_result_si", v)}
              resultConv={data.uric_acid_result_conv}
              onResultConvChange={(v) => updateField("uric_acid_result_conv", v)}
              high={data.uric_acid_high}
              onHighChange={(v) => updateField("uric_acid_high", v)}
              resultSiUnit="mmol/l"
              resultConvUnit="mg/dl"
              disabled={disabled}
            />
            <ChemRowSimple
              label="SGOT:"
              siUnit="IU/L"
              resultSi={data.sgot_result_si}
              onResultSiChange={(v) => updateField("sgot_result_si", v)}
              resultConv={data.sgot_result_conv}
              onResultConvChange={(v) => updateField("sgot_result_conv", v)}
              high={data.sgot_high}
              onHighChange={(v) => updateField("sgot_high", v)}
              resultSiUnit="IU/L"
              resultConvUnit="IU/L"
              disabled={disabled}
            />
            <ChemRowSimple
              label="SGPT:"
              siUnit="IU/L"
              resultSi={data.sgpt_result_si}
              onResultSiChange={(v) => updateField("sgpt_result_si", v)}
              resultConv={data.sgpt_result_conv}
              onResultConvChange={(v) => updateField("sgpt_result_conv", v)}
              high={data.sgpt_high}
              onHighChange={(v) => updateField("sgpt_high", v)}
              resultSiUnit="IU/L"
              resultConvUnit="IU/L"
              disabled={disabled}
            />
            <ChemRowSimple
              label="ALK. PHOS"
              siUnit="IU/L"
              resultSi={data.alk_phos_result_si}
              onResultSiChange={(v) => updateField("alk_phos_result_si", v)}
              resultConv={data.alk_phos_result_conv}
              onResultConvChange={(v) => updateField("alk_phos_result_conv", v)}
              high={data.alk_phos_high}
              onHighChange={(v) => updateField("alk_phos_high", v)}
              resultSiUnit="IU/L"
              resultConvUnit="IU/L"
              disabled={disabled}
            />
            {/* HbA1c */}
            <tr className="border-t border-primary/20">
              <td className="py-1.5 px-2 text-[11px] font-medium border-r border-primary/20">
                HbA1c
              </td>
              <td className="py-1.5 px-1 text-center border-r border-primary/20">
                <span className="text-[10px] text-muted-foreground">4.0-6.0 %</span>
              </td>
              <td className="py-1.5 px-1 text-center border-r border-primary/20">
              </td>
              <td className="py-1.5 px-1 border-r border-primary/20">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={data.hba1c_result}
                    onChange={(e) => updateField("hba1c_result", e.target.value)}
                    readOnly={disabled}
                    className={cn(
                      "h-6 w-full text-xs bg-white border border-primary/20 rounded px-1 text-center focus:outline-none focus:border-primary dark:bg-input/30",
                      disabled && "pointer-events-none"
                    )}
                  />
                  <span className="text-[9px] text-muted-foreground shrink-0">%</span>
                </div>
              </td>
              <td className="py-1.5 px-1 text-center border-r border-primary/20">
                <input
                  type="checkbox"
                  checked={data.hba1c_high}
                  onChange={(e) => updateField("hba1c_high", e.target.checked)}
                  disabled={disabled}
                  className="h-4 w-4 accent-destructive"
                />
              </td>
              <td className="py-1.5 px-1 text-center">
                <span className="text-[9px] text-muted-foreground">%</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


