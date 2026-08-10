"use client";

/**
 * Repeat Test - FECALYSIS popup dialog.
 *
 * Reuses the same layout as FecalysisSection: two-column with
 * macroscopic + microscopic fields on the left, ova/parasite + occult blood on the right.
 *
 * @see useRepeatFecalysisForm
 * @see FecalysisSection
 */

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MedicalPersonnelDialog } from "@/components/common/medical-personnel-dialog";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { InlineSelect, InlineField, InlineSelectWithUnit } from "./laboratory-field-helpers";
import { useRepeatFecalysisForm } from "./use-repeat-fecalysis-form";

const COLOR_OPTIONS = ["", "Brown", "Dark Brown", "Light Brown", "Yellow", "Green", "Black", "Red"];
const CONSISTENCY_OPTIONS = ["", "Formed", "Semi-Formed", "Soft", "Watery", "Loose", "Mucoid"];
const QUANTITY_OPTIONS = ["", "None", "None Found"];
const OVA_PARASITE_OPTIONS = ["", "NOPS", "None Found"];
const AMOEBA_OPTIONS = ["", "None", "None Found"];

interface RepeatFecalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  laboratoryReportId: string | undefined;
}

export function RepeatFecalysisDialog({ open, onOpenChange, laboratoryReportId }: RepeatFecalysisDialogProps) {
  const {
    data, editing, saving, selectedId, disabled,
    previousExams, loadingExams,
    updateField, loadRepeatTest,
    handleNew, handleEdit, handleSave, handleRefresh,
    personnel,
  } = useRepeatFecalysisForm({ open, laboratoryReportId });

  const inputCls = cn(
    "h-7 text-xs bg-white border border-primary/20 rounded px-1 focus:outline-none focus:border-primary dark:bg-input/30",
    disabled && "pointer-events-none bg-muted/30"
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[800px] max-h-[90vh] overflow-hidden p-0 flex flex-col [&>[data-slot=dialog-close-button]]:text-white [&>[data-slot=dialog-close-button]]:opacity-90 [&>[data-slot=dialog-close-button]]:hover:opacity-100 [&>[data-slot=dialog-close-button]]:top-2.5">
          <div className="bg-gradient-to-r from-primary/90 to-primary/70 px-5 py-2 rounded-t-lg shrink-0">
            <DialogHeader>
              <DialogTitle className="text-white text-base font-bold tracking-wide">Repeat Test - FECALYSIS</DialogTitle>
              <DialogDescription className="sr-only">Manage fecalysis repeat test results for this laboratory report.</DialogDescription>
            </DialogHeader>
          </div>

          {/* Toolbar */}
          <div className="px-5 py-2 bg-muted/30 border-b border-primary/10 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-semibold text-primary/70 uppercase tracking-wide shrink-0">Previous Exams:</label>
              <select
                value={selectedId ?? ""}
                onChange={(e) => { if (e.target.value) loadRepeatTest(e.target.value); }}
                disabled={loadingExams}
                className={cn("h-8 text-xs bg-white border border-primary/20 rounded-md px-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary dark:bg-input/30 min-w-[240px]", loadingExams && "opacity-50")}
              >
                <option value="">{loadingExams ? "Loading..." : previousExams.length === 0 ? "No previous exams" : "-- Select a record --"}</option>
                {previousExams.map((exam) => (
                  <option key={exam.id} value={exam.id}>{exam.result_id} — {exam.result_date}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={handleNew} disabled={saving}>New</Button>
              {editing ? (
                <Button variant="default" size="sm" onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="h-3 w-3 animate-spin mr-1" />}Save
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={handleEdit} disabled={!selectedId}>Edit</Button>
              )}
              <Button variant="outline" size="sm" disabled>Print</Button>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={saving}>Refresh</Button>
            </div>
          </div>

          <div className="p-5 space-y-4 overflow-y-auto flex-1 min-h-0">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-1.5">
                <InlineSelect label="Color" value={data.fecal_color} onChange={(v) => updateField("fecal_color", v)} options={COLOR_OPTIONS} disabled={disabled} labelWidth="w-28" />
                <InlineSelect label="Consistency" value={data.fecal_consistency} onChange={(v) => updateField("fecal_consistency", v)} options={CONSISTENCY_OPTIONS} disabled={disabled} labelWidth="w-28" />
                <InlineSelectWithUnit label="Red Blood Cells" value={data.fecal_rbc} onChange={(v) => updateField("fecal_rbc", v)} options={QUANTITY_OPTIONS} unit="/HPF" disabled={disabled} />
                <InlineSelectWithUnit label="White Blood Cells" value={data.fecal_wbc} onChange={(v) => updateField("fecal_wbc", v)} options={QUANTITY_OPTIONS} unit="/HPF" disabled={disabled} />
                <InlineField label="Others" value={data.fecal_others} onChange={(v) => updateField("fecal_others", v)} disabled={disabled} labelWidth="w-28" />
              </div>

              {/* Right Column */}
              <div className="space-y-1.5">
                <InlineSelectWithUnit label="Ova or Parasite" value={data.fecal_ova_parasite} onChange={(v) => updateField("fecal_ova_parasite", v)} options={OVA_PARASITE_OPTIONS} unit="/LPF" disabled={disabled} />
                <InlineSelectWithUnit label="Amoeba" value={data.fecal_amoeba} onChange={(v) => updateField("fecal_amoeba", v)} options={AMOEBA_OPTIONS} unit="/LPF" disabled={disabled} />
                <InlineField label="Occult Blood Test" value={data.fecal_occult_blood} onChange={(v) => updateField("fecal_occult_blood", v)} disabled={disabled} labelWidth="w-28" />
              </div>
            </div>

            {/* Metadata Section */}
            <div className="border-t border-primary/10 pt-3 space-y-2">
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
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-primary/60 uppercase w-[80px] text-right pr-1 shrink-0">Med. Tech.:</label>
                <input type="text" value={data.med_tech} readOnly className={cn(inputCls, "flex-1 pointer-events-none bg-muted/30")} />
                <label className="text-[10px] font-semibold text-primary/60 uppercase shrink-0">License No.:</label>
                <input type="text" value={data.med_tech_license_no} readOnly className={cn(inputCls, "w-[80px] pointer-events-none bg-muted/30")} />
                <Button type="button" variant="outline" size="icon-xs" disabled={disabled} onClick={() => personnel.openDialog("med_tech")} aria-label="Search medical technologist">...</Button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-primary/60 uppercase w-[80px] text-right pr-1 shrink-0">Pathologist:</label>
                <input type="text" value={data.pathologist} readOnly className={cn(inputCls, "flex-1 pointer-events-none bg-muted/30")} />
                <label className="text-[10px] font-semibold text-primary/60 uppercase shrink-0">License No.:</label>
                <input type="text" value={data.pathologist_license_no} readOnly className={cn(inputCls, "w-[80px] pointer-events-none bg-muted/30")} />
                <Button type="button" variant="outline" size="icon-xs" disabled={disabled} onClick={() => personnel.openDialog("pathologist")} aria-label="Search pathologist">...</Button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-primary/60 uppercase w-[80px] text-right pr-1 shrink-0">Requested By:</label>
                <input type="text" value={data.requested_by} onChange={(e) => updateField("requested_by", e.target.value)} readOnly={disabled} className={cn(inputCls, "flex-1")} />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-primary/60 uppercase w-[80px] text-right pr-1 shrink-0">Remarks:</label>
                <input type="text" value={data.remarks} onChange={(e) => updateField("remarks", e.target.value)} readOnly={disabled} className={cn(inputCls, "flex-1")} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <MedicalPersonnelDialog open={personnel.dialogOpen} onOpenChange={personnel.setDialogOpen} onSelect={personnel.handleSelect} />
    </>
  );
}
