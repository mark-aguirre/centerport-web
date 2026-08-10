"use client";

/**
 * Repeat Test - URINALYSIS popup dialog.
 *
 * Reuses the same layout as UrinalysisSection: two-column with
 * Macroscopic + Chemical on the left, Microscopic + Crystals + Cast on the right.
 *
 * @see useRepeatUrinalysisForm
 * @see UrinalysisSection
 */

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MedicalPersonnelDialog } from "@/components/common/medical-personnel-dialog";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { InlineSelect, InlineField, LabFieldWithUnit } from "./laboratory-field-helpers";
import { useRepeatUrinalysisForm } from "./use-repeat-urinalysis-form";

const COLOR_OPTIONS = ["", "Yellow", "Dark Yellow", "Light Yellow", "Amber", "Red", "Orange", "Brown"];
const TRANSPARENCY_OPTIONS = ["", "Clear", "Slightly Hazy", "Hazy", "Turbid"];
const CHEMICAL_OPTIONS = ["", "Negative", "Trace", "+1", "+2", "+3", "+4"];

interface RepeatUrinalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  laboratoryReportId: string | undefined;
}

export function RepeatUrinalysisDialog({ open, onOpenChange, laboratoryReportId }: RepeatUrinalysisDialogProps) {
  const {
    data, editing, saving, selectedId, disabled,
    previousExams, loadingExams,
    updateField, loadRepeatTest,
    handleNew, handleEdit, handleSave, handleRefresh,
    personnel,
  } = useRepeatUrinalysisForm({ open, laboratoryReportId });

  const inputCls = cn(
    "h-7 text-xs bg-white border border-primary/20 rounded px-1 focus:outline-none focus:border-primary dark:bg-input/30",
    disabled && "pointer-events-none bg-muted/30"
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[960px] max-h-[90vh] overflow-hidden p-0 flex flex-col [&>[data-slot=dialog-close-button]]:text-white [&>[data-slot=dialog-close-button]]:opacity-90 [&>[data-slot=dialog-close-button]]:hover:opacity-100 [&>[data-slot=dialog-close-button]]:top-2.5">
          <div className="bg-gradient-to-r from-primary/90 to-primary/70 px-5 py-2 rounded-t-lg shrink-0">
            <DialogHeader>
              <DialogTitle className="text-white text-base font-bold tracking-wide">
                Repeat Test - URINALYSIS
              </DialogTitle>
              <DialogDescription className="sr-only">
                Manage urinalysis repeat test results for this laboratory report.
              </DialogDescription>
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
            <div className="grid grid-cols-[1fr_auto] gap-8">
              {/* Left Column: Macroscopic + Chemical */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-[11px] font-bold text-primary/80 uppercase tracking-wide mb-2">Macroscopic</h3>
                  <div className="space-y-1.5">
                    <InlineSelect label="Color" value={data.urine_color} onChange={(v) => updateField("urine_color", v)} options={COLOR_OPTIONS} disabled={disabled} />
                    <InlineSelect label="Transparency" value={data.urine_transparency} onChange={(v) => updateField("urine_transparency", v)} options={TRANSPARENCY_OPTIONS} disabled={disabled} />
                  </div>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-primary/80 uppercase tracking-wide mb-2">Chemical</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                    <InlineSelect label="Leucocytes" value={data.urine_leucocytes} onChange={(v) => updateField("urine_leucocytes", v)} options={CHEMICAL_OPTIONS} disabled={disabled} />
                    <InlineField label="Spec. Gravity" value={data.urine_specific_gravity} onChange={(v) => updateField("urine_specific_gravity", v)} disabled={disabled} />
                    <InlineSelect label="Nitrite" value={data.urine_nitrite} onChange={(v) => updateField("urine_nitrite", v)} options={CHEMICAL_OPTIONS} disabled={disabled} />
                    <InlineSelect label="Ketone" value={data.urine_ketone} onChange={(v) => updateField("urine_ketone", v)} options={CHEMICAL_OPTIONS} disabled={disabled} />
                    <InlineSelect label="Urobilinogen" value={data.urine_urobilinogen} onChange={(v) => updateField("urine_urobilinogen", v)} options={CHEMICAL_OPTIONS} disabled={disabled} />
                    <InlineSelect label="Bilirubin" value={data.urine_bilirubin} onChange={(v) => updateField("urine_bilirubin", v)} options={CHEMICAL_OPTIONS} disabled={disabled} />
                    <InlineSelect label="Protein" value={data.urine_protein} onChange={(v) => updateField("urine_protein", v)} options={CHEMICAL_OPTIONS} disabled={disabled} />
                    <InlineSelect label="Glucose" value={data.urine_glucose} onChange={(v) => updateField("urine_glucose", v)} options={CHEMICAL_OPTIONS} disabled={disabled} />
                    <InlineField label="pH" value={data.urine_ph} onChange={(v) => updateField("urine_ph", v)} disabled={disabled} />
                    <InlineField label="Others" value={data.urine_others} onChange={(v) => updateField("urine_others", v)} disabled={disabled} />
                    <InlineSelect label="Blood" value={data.urine_blood} onChange={(v) => updateField("urine_blood", v)} options={CHEMICAL_OPTIONS} disabled={disabled} />
                  </div>
                </div>
              </div>

              {/* Right Column: Microscopic + Crystals + Cast */}
              <div className="space-y-4 w-80">
                <div>
                  <h3 className="text-[11px] font-bold text-primary/80 uppercase tracking-wide mb-2">Microscopic</h3>
                  <div className="space-y-1.5">
                    <LabFieldWithUnit label="Red Blood Cells" unit="/HPF" value={data.urine_rbc} onChange={(v) => updateField("urine_rbc", v)} disabled={disabled} />
                    <LabFieldWithUnit label="White Blood Cells" unit="/HPF" value={data.urine_wbc} onChange={(v) => updateField("urine_wbc", v)} disabled={disabled} />
                    <LabFieldWithUnit label="Amorphous Urates" unit="/LPF" value={data.urine_amorphous_urates} onChange={(v) => updateField("urine_amorphous_urates", v)} disabled={disabled} />
                    <LabFieldWithUnit label="Amorphous Phosphate" unit="/LPF" value={data.urine_amorphous_phosphate} onChange={(v) => updateField("urine_amorphous_phosphate", v)} disabled={disabled} />
                    <LabFieldWithUnit label="Epithelial Cells" unit="/LPF" value={data.urine_epithelial_cells} onChange={(v) => updateField("urine_epithelial_cells", v)} disabled={disabled} />
                    <LabFieldWithUnit label="Mucus Threads" unit="/LPF" value={data.urine_mucus_threads} onChange={(v) => updateField("urine_mucus_threads", v)} disabled={disabled} />
                    <LabFieldWithUnit label="Others" unit="/LPF" value={data.urine_microscopic_others} onChange={(v) => updateField("urine_microscopic_others", v)} disabled={disabled} />
                  </div>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-primary/80 uppercase tracking-wide mb-2">Crystals</h3>
                  <div className="space-y-1.5">
                    <LabFieldWithUnit label="Uric Acid" unit="/LPF" value={data.urine_uric_acid} onChange={(v) => updateField("urine_uric_acid", v)} disabled={disabled} />
                    <LabFieldWithUnit label="Calcium Oxalate" unit="/LPF" value={data.urine_calcium_oxalate} onChange={(v) => updateField("urine_calcium_oxalate", v)} disabled={disabled} />
                    <LabFieldWithUnit label="Others" unit="/LPF" value={data.urine_crystals_others} onChange={(v) => updateField("urine_crystals_others", v)} disabled={disabled} />
                  </div>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-primary/80 uppercase tracking-wide mb-2">Cast</h3>
                  <div className="space-y-1.5">
                    <LabFieldWithUnit label="Fine Granular" unit="/LPF" value={data.urine_fine_granular} onChange={(v) => updateField("urine_fine_granular", v)} disabled={disabled} />
                    <LabFieldWithUnit label="Coarse Granular" unit="/LPF" value={data.urine_coarse_granular} onChange={(v) => updateField("urine_coarse_granular", v)} disabled={disabled} />
                    <LabFieldWithUnit label="Others" unit="/LPF" value={data.urine_cast_others} onChange={(v) => updateField("urine_cast_others", v)} disabled={disabled} />
                  </div>
                </div>
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


