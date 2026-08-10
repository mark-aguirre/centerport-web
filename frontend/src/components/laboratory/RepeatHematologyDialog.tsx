"use client";

/**
 * Repeat Test - HEMATOLOGY popup dialog.
 *
 * Displays a modal form with all hematology fields (CBC + Differential Count),
 * metadata section (Result Date, Laboratory No., Med Tech, Pathologist,
 * Requested By, Remarks), and a "Select Previous Exams" picker in the toolbar.
 *
 * Supports full CRUD via action buttons: New, Edit/Save, Print, Refresh.
 *
 * State Management:
 * Delegates all form state, CRUD operations, and personnel dialog coordination
 * to the `useRepeatHematologyForm` hook, keeping this component focused on
 * rendering and layout concerns.
 *
 * @see useRepeatHematologyForm — encapsulates data logic and side effects
 * @see HemaRow — shared CBC row component
 * @see DiffRow — shared Differential Count row component
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
import { HemaRow, DiffRow } from "./hematology-row-helpers";
import { useRepeatHematologyForm } from "./use-repeat-hematology-form";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RepeatHematologyDialogProps {
  /** Controls dialog visibility. */
  open: boolean;
  /** Callback when dialog open state changes. */
  onOpenChange: (open: boolean) => void;
  /** The parent laboratory report UUID (required to fetch/save repeat tests). */
  laboratoryReportId: string | undefined;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RepeatHematologyDialog({
  open,
  onOpenChange,
  laboratoryReportId,
}: RepeatHematologyDialogProps) {
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
  } = useRepeatHematologyForm({ open, laboratoryReportId });

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
                Repeat Test - HEMATOLOGY
              </DialogTitle>
              <DialogDescription className="sr-only">
                Manage hematology repeat test results for this laboratory report.
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
            {/* ============ Main Form ============ */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary/80 uppercase tracking-wide">
                Laboratory Report (Hematology)
              </h3>

              {/* Hematology Fields Grid */}
              <div className="grid grid-cols-[auto_auto_auto] gap-x-6 items-start">
                {/* Left Column: CBC */}
                <div>
                  <div className="space-y-1">
                    <HemaRow label="HEMOGLOBIN:" value={data.hemoglobin} onValueChange={(v) => updateField("hemoglobin", v)} unit="gm/dl" normalRange={`${data.hemoglobin_normal_min} - ${data.hemoglobin_normal_max} gm/dl`} disabled={disabled} labelWidth="w-[80px]" inputWidth="w-[64px]" />
                    <HemaRow label="HEMATOCRIT:" value={data.hematocrit} onValueChange={(v) => updateField("hematocrit", v)} unit="vol%" normalRange={`${data.hematocrit_normal_min} - ${data.hematocrit_normal_max} vol%`} disabled={disabled} labelWidth="w-[80px]" inputWidth="w-[64px]" />
                    <HemaRow label="RBC COUNT:" value={data.rbc_count} onValueChange={(v) => updateField("rbc_count", v)} unit="/cumm" normalRange={`${data.rbc_count_normal_min} - ${data.rbc_count_normal_max} m/cumm`} disabled={disabled} labelWidth="w-[80px]" inputWidth="w-[64px]" />
                    <HemaRow label="WBC COUNT:" value={data.wbc_count} onValueChange={(v) => updateField("wbc_count", v)} unit="/cumm" normalRange={`${data.wbc_count_normal_min} - ${data.wbc_count_normal_max} /cumm`} disabled={disabled} labelWidth="w-[80px]" inputWidth="w-[64px]" />
                    <HemaRow label="PLATELET:" value={data.platelet} onValueChange={(v) => updateField("platelet", v)} unit="/cumm" normalRange={`${data.platelet_normal_min} - ${data.platelet_normal_max} /cumm`} disabled={disabled} labelWidth="w-[80px]" inputWidth="w-[64px]" />

                    {/* Blood Type */}
                    <div className="flex items-center">
                      <label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider w-[80px] shrink-0 text-right pr-1">Blood Type:</label>
                      <input type="text" value={data.blood_type} onChange={(e) => updateField("blood_type", e.target.value)} readOnly={disabled} className={cn(inputCls, "w-[48px]")} />
                    </div>

                    {/* ESR */}
                    <div className="flex items-center gap-1">
                      <label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider w-[80px] shrink-0 text-right pr-1">ESR:</label>
                      <input type="text" value={data.esr} onChange={(e) => updateField("esr", e.target.value)} readOnly={disabled} className={cn(inputCls, "w-[48px]")} />
                      <span className="text-[9px] text-muted-foreground">mm/hr</span>
                      <span className="text-[9px] text-muted-foreground ml-1">mm/hr(Male)/mm/hr(Female)</span>
                    </div>
                  </div>
                </div>

                {/* Middle Column: Differential Count */}
                <div>
                  <h4 className="text-[10px] font-bold text-primary/80 uppercase tracking-wide mb-1.5 text-center">
                    Differential Count:
                  </h4>

                  <div className="space-y-1">
                    <DiffRow label="LYMPHOCYTES:" value={data.lymphocytes} onValueChange={(v) => updateField("lymphocytes", v)} normalRange={data.lymphocytes_normal_min && data.lymphocytes_normal_max ? `${data.lymphocytes_normal_min}-${data.lymphocytes_normal_max}%` : undefined} disabled={disabled} labelWidth="w-[80px]" inputWidth="w-[52px]" />
                    <DiffRow label="SEGMENTERS:" value={data.segmenters} onValueChange={(v) => updateField("segmenters", v)} disabled={disabled} labelWidth="w-[80px]" inputWidth="w-[52px]" />
                    <DiffRow label="EOSINOPHILS:" value={data.eosinophils} onValueChange={(v) => updateField("eosinophils", v)} disabled={disabled} labelWidth="w-[80px]" inputWidth="w-[52px]" />
                    <DiffRow label="MONOCYTES:" value={data.monocytes} onValueChange={(v) => updateField("monocytes", v)} disabled={disabled} labelWidth="w-[80px]" inputWidth="w-[52px]" />
                    <DiffRow label="MYELOCYTES:" value={data.myelocytes} onValueChange={(v) => updateField("myelocytes", v)} disabled={disabled} labelWidth="w-[80px]" inputWidth="w-[52px]" />
                    <DiffRow label="JUVENILES:" value={data.juveniles} onValueChange={(v) => updateField("juveniles", v)} disabled={disabled} labelWidth="w-[80px]" inputWidth="w-[52px]" />
                  </div>
                </div>

                {/* Right Column: Stab Cells, Basophils, Others */}
                <div>
                  <div className="mb-1.5">
                    <span className="text-[10px] font-semibold text-primary/60 italic">&nbsp;</span>
                  </div>

                  <div className="space-y-1">
                    <DiffRow label="STAB CELLS:" value={data.stab_cells} onValueChange={(v) => updateField("stab_cells", v)} normalRange={data.stab_cells_normal_min && data.stab_cells_normal_max ? `${data.stab_cells_normal_min}-${data.stab_cells_normal_max}%` : undefined} disabled={disabled} labelWidth="w-[80px]" inputWidth="w-[52px]" />
                    <DiffRow label="BASOPHILS:" value={data.basophils} onValueChange={(v) => updateField("basophils", v)} disabled={disabled} labelWidth="w-[80px]" inputWidth="w-[52px]" />
                    <DiffRow label="OTHERS:" value={data.others_diff} onValueChange={(v) => updateField("others_diff", v)} disabled={disabled} hideTrailingUnit labelWidth="w-[80px]" inputWidth="w-[52px]" />
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
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    disabled={disabled}
                    onClick={() => personnel.openDialog("med_tech")}
                    aria-label="Search medical technologist"
                  >
                    ...
                  </Button>
                </div>

                {/* Row 3: Pathologist + License No */}
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-semibold text-primary/60 uppercase w-[80px] text-right pr-1 shrink-0">Pathologist:</label>
                  <input type="text" value={data.pathologist} readOnly className={cn(inputCls, "flex-1 pointer-events-none bg-muted/30")} />
                  <label className="text-[10px] font-semibold text-primary/60 uppercase shrink-0">License No.:</label>
                  <input type="text" value={data.pathologist_license_no} readOnly className={cn(inputCls, "w-[80px] pointer-events-none bg-muted/30")} />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    disabled={disabled}
                    onClick={() => personnel.openDialog("pathologist")}
                    aria-label="Search pathologist"
                  >
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Medical Personnel Search Dialog */}
      <MedicalPersonnelDialog
        open={personnel.dialogOpen}
        onOpenChange={personnel.setDialogOpen}
        onSelect={personnel.handleSelect}
        title={personnel.target === "med_tech" ? "Select Medical Technologist" : "Select Pathologist"}
      />
    </>
  );
}
