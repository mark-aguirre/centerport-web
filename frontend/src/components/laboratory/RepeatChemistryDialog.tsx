"use client";

/**
 * Repeat Test - CLINICAL CHEMISTRY AND SEROLOGY/IMMUNOLOGY popup dialog.
 *
 * Displays a modal form reusing the same table layout as ClinicalChemistrySection,
 * metadata section (Result Date, Laboratory No., Med Tech, Pathologist,
 * Requested By, Remarks), and a "Select Previous Exams" picker in the toolbar.
 *
 * Supports full CRUD via action buttons: New, Edit/Save, Print, Refresh.
 *
 * @see useRepeatChemistryForm — encapsulates data logic and side effects
 * @see ClinicalChemistrySection — reuses same table row pattern
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MedicalPersonnelDialog } from "@/components/common/medical-personnel-dialog";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ChemRow, ChemRowSimple } from "./chemistry-row-helpers";
import { useRepeatChemistryForm } from "./use-repeat-chemistry-form";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RepeatChemistryDialogProps {
  /** Controls dialog visibility. */
  open: boolean;
  /** Callback when dialog open state changes. */
  onOpenChange: (open: boolean) => void;
  /** The parent laboratory report UUID. */
  laboratoryReportId: string | undefined;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RepeatChemistryDialog({
  open,
  onOpenChange,
  laboratoryReportId,
}: RepeatChemistryDialogProps) {
  const {
    data,
    editing,
    saving,
    selectedId,
    disabled,
    previousExams,
    loadingExams,
    updateField,
    loadRepeatTest,
    handleNew,
    handleEdit,
    handleSave,
    handleRefresh,
    personnel,
  } = useRepeatChemistryForm({ open, laboratoryReportId });

  const inputCls = cn(
    "h-7 text-xs bg-white border border-primary/20 rounded px-1 focus:outline-none focus:border-primary dark:bg-input/30",
    disabled && "pointer-events-none bg-muted/30"
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[960px] max-h-[90vh] overflow-hidden p-0 flex flex-col [&>[data-slot=dialog-close-button]]:text-white [&>[data-slot=dialog-close-button]]:opacity-90 [&>[data-slot=dialog-close-button]]:hover:opacity-100 [&>[data-slot=dialog-close-button]]:top-2.5">
          {/* Professional Header Bar */}
          <div className="bg-gradient-to-r from-primary/90 to-primary/70 px-5 py-2 rounded-t-lg shrink-0">
            <DialogHeader>
              <DialogTitle className="text-white text-base font-bold tracking-wide">
                Repeat Test - CLINICAL CHEMISTRY AND SEROLOGY/IMMUNOLOGY
              </DialogTitle>
              <DialogDescription className="sr-only">
                Manage chemistry repeat test results for this laboratory report.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Toolbar: Previous Exams + Record Info + Action Buttons */}
          <div className="px-5 py-2 bg-muted/30 border-b border-primary/10 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-semibold text-primary/70 uppercase tracking-wide shrink-0">
                Previous Exams:
              </label>
              <select
                value={selectedId ?? ""}
                onChange={(e) => {
                  const id = e.target.value;
                  if (id) loadRepeatTest(id);
                }}
                disabled={loadingExams}
                className={cn(
                  "h-8 text-xs bg-white border border-primary/20 rounded-md px-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary dark:bg-input/30 min-w-[240px]",
                  loadingExams && "opacity-50"
                )}
              >
                <option value="">
                  {loadingExams ? "Loading..." : previousExams.length === 0 ? "No previous exams" : "-- Select a record --"}
                </option>
                {previousExams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.result_id} — {exam.result_date}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={handleNew} disabled={saving}>
                New
              </Button>
              {editing ? (
                <Button variant="default" size="sm" onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                  Save
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={handleEdit} disabled={!selectedId}>
                  Edit
                </Button>
              )}
              <Button variant="outline" size="sm" disabled>
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={saving}>
                Refresh
              </Button>
            </div>
          </div>

          <div className="p-5 space-y-4 overflow-y-auto flex-1 min-h-0">
            {/* ============ Chemistry Table ============ */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-primary/80 uppercase tracking-wide">
                Clinical Chemistry and Serology/Immunology
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse border border-primary/20">
                  <thead>
                    <tr className="border-b border-primary/20">
                      <th rowSpan={2} className="text-left py-1.5 px-2 text-[10px] font-bold text-primary/80 uppercase tracking-wide border-r border-primary/20 w-28">
                        Examination
                      </th>
                      <th colSpan={2} className="text-center py-1 px-2 text-[10px] font-bold text-primary/80 uppercase tracking-wide border-r border-primary/20">
                        Reference Range
                      </th>
                      <th colSpan={3} className="text-center py-1 px-2 text-[10px] font-bold text-primary/80 uppercase tracking-wide">
                        Result
                      </th>
                    </tr>
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
                    <ChemRow label="FBS:" siUnit="mmol/L" convUnit="mg/dL" resultSi={data.fbs_result_si} onResultSiChange={(v) => updateField("fbs_result_si", v)} resultConv={data.fbs_result_conv} onResultConvChange={(v) => updateField("fbs_result_conv", v)} high={data.fbs_high} onHighChange={(v) => updateField("fbs_high", v)} resultSiUnit="mmol/l" resultConvUnit="mg/dl" disabled={disabled} />
                    <ChemRow label="BUN:" siUnit="mmol/L" convUnit="mg/dL" resultSi={data.bun_result_si} onResultSiChange={(v) => updateField("bun_result_si", v)} resultConv={data.bun_result_conv} onResultConvChange={(v) => updateField("bun_result_conv", v)} high={data.bun_high} onHighChange={(v) => updateField("bun_high", v)} resultSiUnit="mmol/l" resultConvUnit="mg/dl" disabled={disabled} />
                    <ChemRow label="CREATININE:" siUnit="mmol/L" convUnit="mg/dL" resultSi={data.creatinine_result_si} onResultSiChange={(v) => updateField("creatinine_result_si", v)} resultConv={data.creatinine_result_conv} onResultConvChange={(v) => updateField("creatinine_result_conv", v)} high={data.creatinine_high} onHighChange={(v) => updateField("creatinine_high", v)} resultSiUnit="mmol/l" resultConvUnit="mg/dl" disabled={disabled} />
                    <ChemRow label="CHOLESTEROL:" siUnit="mmol/L" convUnit="mg/dL" resultSi={data.cholesterol_result_si} onResultSiChange={(v) => updateField("cholesterol_result_si", v)} resultConv={data.cholesterol_result_conv} onResultConvChange={(v) => updateField("cholesterol_result_conv", v)} high={data.cholesterol_high} onHighChange={(v) => updateField("cholesterol_high", v)} resultSiUnit="mmol/l" resultConvUnit="mg/dl" disabled={disabled} />
                    <ChemRow label="TRIGLYCERIDES:" siUnit="mmol/L" convUnit="mg/dL" resultSi={data.triglycerides_result_si} onResultSiChange={(v) => updateField("triglycerides_result_si", v)} resultConv={data.triglycerides_result_conv} onResultConvChange={(v) => updateField("triglycerides_result_conv", v)} high={data.triglycerides_high} onHighChange={(v) => updateField("triglycerides_high", v)} resultSiUnit="mmol/l" resultConvUnit="mg/dl" disabled={disabled} />
                    <ChemRow label="URIC ACID:" siUnit="mmol/L" convUnit="mg/dL" resultSi={data.uric_acid_result_si} onResultSiChange={(v) => updateField("uric_acid_result_si", v)} resultConv={data.uric_acid_result_conv} onResultConvChange={(v) => updateField("uric_acid_result_conv", v)} high={data.uric_acid_high} onHighChange={(v) => updateField("uric_acid_high", v)} resultSiUnit="mmol/l" resultConvUnit="mg/dl" disabled={disabled} />
                    <ChemRowSimple label="SGOT:" siUnit="IU/L" resultSi={data.sgot_result_si} onResultSiChange={(v) => updateField("sgot_result_si", v)} resultConv={data.sgot_result_conv} onResultConvChange={(v) => updateField("sgot_result_conv", v)} high={data.sgot_high} onHighChange={(v) => updateField("sgot_high", v)} resultSiUnit="IU/L" resultConvUnit="IU/L" disabled={disabled} />
                    <ChemRowSimple label="SGPT:" siUnit="IU/L" resultSi={data.sgpt_result_si} onResultSiChange={(v) => updateField("sgpt_result_si", v)} resultConv={data.sgpt_result_conv} onResultConvChange={(v) => updateField("sgpt_result_conv", v)} high={data.sgpt_high} onHighChange={(v) => updateField("sgpt_high", v)} resultSiUnit="IU/L" resultConvUnit="IU/L" disabled={disabled} />
                    <ChemRowSimple label="ALK. PHOS:" siUnit="IU/L" resultSi={data.alk_phos_result_si} onResultSiChange={(v) => updateField("alk_phos_result_si", v)} resultConv={data.alk_phos_result_conv} onResultConvChange={(v) => updateField("alk_phos_result_conv", v)} high={data.alk_phos_high} onHighChange={(v) => updateField("alk_phos_high", v)} resultSiUnit="IU/L" resultConvUnit="IU/L" disabled={disabled} />
                    {/* HbA1c */}
                    <tr className="border-t border-primary/20">
                      <td className="py-1.5 px-2 text-[11px] font-medium border-r border-primary/20">HbA1c</td>
                      <td className="py-1.5 px-1 text-center border-r border-primary/20">
                        <span className="text-[9px] text-muted-foreground">4.0-6.0 %</span>
                      </td>
                      <td className="py-1.5 px-1 text-center border-r border-primary/20"></td>
                      <td className="py-1.5 px-1 border-r border-primary/20">
                        <div className="flex items-center gap-1">
                          <input type="text" value={data.hba1c_result} onChange={(e) => updateField("hba1c_result", e.target.value)} readOnly={disabled} className={cn("h-6 w-full text-xs bg-white border border-primary/20 rounded px-1 text-center focus:outline-none focus:border-primary dark:bg-input/30", disabled && "pointer-events-none")} />
                          <span className="text-[9px] text-muted-foreground shrink-0">%</span>
                        </div>
                      </td>
                      <td className="py-1.5 px-1 text-center border-r border-primary/20">
                        <input type="checkbox" checked={data.hba1c_high} onChange={(e) => updateField("hba1c_high", e.target.checked)} disabled={disabled} className="h-4 w-4 accent-destructive" />
                      </td>
                      <td className="py-1.5 px-1 text-center">
                        <span className="text-[9px] text-muted-foreground">%</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Serology/Immunology Section */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-3">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-semibold text-primary/60 uppercase w-[90px] text-right pr-1 shrink-0">RPR:</label>
                  <select value={data.rpr} onChange={(e) => updateField("rpr", e.target.value)} disabled={disabled} className={cn(inputCls, "w-[140px]")}>
                    <option value=""></option>
                    <option value="Non-Reactive">Non-Reactive</option>
                    <option value="Reactive">Reactive</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-semibold text-primary/60 uppercase w-[100px] text-right pr-1 shrink-0">WIDAL TEST:</label>
                  <select value={data.widal_test} onChange={(e) => updateField("widal_test", e.target.value)} disabled={disabled} className={cn(inputCls, "w-[140px]")}>
                    <option value=""></option>
                    <option value="Negative">Negative</option>
                    <option value="Positive">Positive</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-semibold text-primary/60 uppercase w-[90px] text-right pr-1 shrink-0">HBsAG:</label>
                  <select value={data.hbsag} onChange={(e) => updateField("hbsag", e.target.value)} disabled={disabled} className={cn(inputCls, "w-[140px]")}>
                    <option value=""></option>
                    <option value="Non-Reactive">Non-Reactive</option>
                    <option value="Reactive">Reactive</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-semibold text-primary/60 uppercase w-[100px] text-right pr-1 shrink-0">MALARIAL SMEAR:</label>
                  <select value={data.malarial_smear} onChange={(e) => updateField("malarial_smear", e.target.value)} disabled={disabled} className={cn(inputCls, "w-[140px]")}>
                    <option value=""></option>
                    <option value="Negative">Negative</option>
                    <option value="Positive">Positive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ============ Metadata Section ============ */}
            <div className="border-t border-primary/10 pt-3 space-y-2">
              {/* Row 1: Result Date + Laboratory No */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <label className="text-[10px] font-semibold text-primary/60 uppercase w-[80px] text-right pr-1">Result Date:</label>
                  <input type="date" value={data.result_date} onChange={(e) => updateField("result_date", e.target.value)} readOnly={disabled} className={cn(inputCls, "w-[130px]")} />
                </div>
                <div className="flex items-center gap-1">
                  <label className="text-[10px] font-semibold text-primary/60 uppercase">Laboratory No.:</label>
                  <input type="text" value={data.laboratory_no} onChange={(e) => updateField("laboratory_no", e.target.value)} readOnly={disabled} className={cn(inputCls, "w-[80px]")} />
                </div>
              </div>

              {/* Row 2: Med. Tech + License No */}
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-primary/60 uppercase w-[80px] text-right pr-1 shrink-0">Med. Tech.:</label>
                <input type="text" value={data.med_tech} readOnly className={cn(inputCls, "flex-1 pointer-events-none bg-muted/30")} />
                <label className="text-[10px] font-semibold text-primary/60 uppercase shrink-0">License No.:</label>
                <input type="text" value={data.med_tech_license_no} readOnly className={cn(inputCls, "w-[80px] pointer-events-none bg-muted/30")} />
                <Button type="button" variant="outline" size="icon-xs" disabled={disabled} onClick={() => personnel.openDialog("med_tech")} aria-label="Search medical technologist">
                  ...
                </Button>
              </div>

              {/* Row 3: Pathologist + License No */}
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-primary/60 uppercase w-[80px] text-right pr-1 shrink-0">Pathologist:</label>
                <input type="text" value={data.pathologist} readOnly className={cn(inputCls, "flex-1 pointer-events-none bg-muted/30")} />
                <label className="text-[10px] font-semibold text-primary/60 uppercase shrink-0">License No.:</label>
                <input type="text" value={data.pathologist_license_no} readOnly className={cn(inputCls, "w-[80px] pointer-events-none bg-muted/30")} />
                <Button type="button" variant="outline" size="icon-xs" disabled={disabled} onClick={() => personnel.openDialog("pathologist")} aria-label="Search pathologist">
                  ...
                </Button>
              </div>

              {/* Row 4: Requested By */}
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-primary/60 uppercase w-[80px] text-right pr-1 shrink-0">Requested By:</label>
                <input type="text" value={data.requested_by} onChange={(e) => updateField("requested_by", e.target.value)} readOnly={disabled} className={cn(inputCls, "flex-1")} />
              </div>

              {/* Row 5: Remarks */}
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-primary/60 uppercase w-[80px] text-right pr-1 shrink-0">Remarks:</label>
                <input type="text" value={data.remarks} onChange={(e) => updateField("remarks", e.target.value)} readOnly={disabled} className={cn(inputCls, "flex-1")} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Medical Personnel Search Dialog */}
      <MedicalPersonnelDialog
        open={personnel.dialogOpen}
        onOpenChange={personnel.setDialogOpen}
        onSelect={personnel.handleSelect}
      />
    </>
  );
}


