"use client";

/**
 * Repeat Fecalysis dialog using the exact parent Fecalysis form body.
 */

import { useState } from "react";
import { MedicalPersonnelDialog } from "@/components/common/medical-personnel-dialog";
import { PdfPreviewDialog } from "@/components/common/pdf-preview-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchPrintPdf } from "@/lib/print-request";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ChevronDown,
  FileText,
  Loader2,
  Microscope,
  NotebookPen,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { FecalysisFormFields } from "./FecalysisFormFields";
import { useRepeatFecalysisForm } from "./use-repeat-fecalysis-form";
import {
  buildFecalysisRepeatPayload,
  type LaboratoryPrintHeader,
} from "./printPayload";

interface RepeatFecalysisDialogProps {
  /** Controls dialog visibility. */
  open: boolean;
  /** Called when dialog visibility changes. */
  onOpenChange: (open: boolean) => void;
  /** Parent laboratory report UUID. */
  laboratoryReportId: string | undefined;
  /** Patient header from the parent report, used to build the print payload. */
  header: LaboratoryPrintHeader;
}

/**
 * Displays and manages repeat Fecalysis records using the parent form layout.
 */
export function RepeatFecalysisDialog({
  open,
  onOpenChange,
  laboratoryReportId,
  header,
}: RepeatFecalysisDialogProps) {
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
  } = useRepeatFecalysisForm({ open, laboratoryReportId });

  const [printing, setPrinting] = useState(false);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [labInfoOpen, setLabInfoOpen] = useState(false);

  const handlePrint = async () => {
    setPrinting(true);
    try {
      const blob = await fetchPrintPdf(
        "laboratory-fecalysis",
        buildFecalysisRepeatPayload(data, header),
      );
      setPreviewBlob(blob);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate report";
      toast.error(message);
    } finally {
      setPrinting(false);
    }
  };

  const inputClassName = cn(
    "h-7 rounded border border-primary/20 bg-white px-2 text-xs transition-colors focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30",
    disabled && "pointer-events-none bg-muted/30"
  );
  const metadataLabelClassName =
    "shrink-0 text-[11px] font-semibold uppercase tracking-wide text-primary/70";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[92vh] w-[calc(100vw-2rem)] max-w-[1100px] flex-col overflow-hidden p-0 [&>[data-slot=dialog-close-button]]:top-4 [&>[data-slot=dialog-close-button]]:text-foreground/60 [&>[data-slot=dialog-close-button]]:hover:text-foreground">
          {/* Header: soft icon chip, title, and a one-line description of what
              the dialog is for. */}
          <div className="shrink-0 rounded-t-lg border-b border-border bg-card px-5 py-3.5">
            <DialogHeader className="flex-row items-center gap-3 space-y-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Microscope className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <DialogTitle className="truncate text-lg font-semibold text-foreground">
                  Repeat Test - Fecalysis
                </DialogTitle>
                <DialogDescription className="truncate text-xs">
                  Encode the fecalysis results for the selected examination.
                </DialogDescription>
              </div>
            </DialogHeader>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-5 py-3">
            <div className="flex items-center gap-2">
              <label
                htmlFor="repeat-fecalysis-record"
                className="shrink-0 text-sm font-semibold text-foreground"
              >
                Previous Exams
              </label>
              <select
                id="repeat-fecalysis-record"
                value={selectedId ?? ""}
                onChange={(event) => {
                  if (event.target.value) loadRepeatTest(event.target.value);
                }}
                disabled={loadingExams}
                className={cn(
                  "h-10 min-w-[240px] cursor-pointer rounded-md border border-primary/20 bg-white px-2 text-xs shadow-sm focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40 dark:bg-input/30 disabled:cursor-not-allowed",
                  loadingExams && "opacity-50"
                )}
              >
                <option value="">
                  {loadingExams
                    ? "Loading..."
                    : previousExams.length === 0
                      ? "No previous exams"
                      : "-- Select a record --"}
                </option>
                {previousExams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.result_id} — {exam.result_date}
                  </option>
                ))}
              </select>
            </div>

            {/* Full-size actions, matching the patient registration dialog:
                h-10 with a leading icon and a text label. */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleNew}
                disabled={saving}
                className="h-10 cursor-pointer px-5"
              >
                <Plus aria-hidden="true" />
                New
              </Button>
              {editing ? (
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="h-10 cursor-pointer px-5"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Save aria-hidden="true" />
                  )}
                  Save
                </Button>
              ) : (
                <Button
                  onClick={handleEdit}
                  disabled={!selectedId}
                  className="h-10 cursor-pointer px-5"
                >
                  <Pencil aria-hidden="true" />
                  Edit
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handlePrint}
                disabled={!selectedId || editing || printing}
                className="h-10 cursor-pointer px-5"
              >
                {printing ? (
                  <Loader2 className="animate-spin" aria-hidden="true" />
                ) : (
                  <Printer aria-hidden="true" />
                )}
                Print
              </Button>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={saving}
                className="h-10 cursor-pointer px-5"
              >
                <RefreshCw aria-hidden="true" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
            {/* Examination-level fields, above the result groups. */}
            <div className="flex flex-col gap-3 rounded-lg border border-primary/15 bg-muted/20 p-3 lg:flex-row lg:items-center">
              <div className="flex shrink-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <CalendarDays className="h-4 w-4" aria-hidden />
                </span>
                <label
                  htmlFor="repeat-fecalysis-result-date"
                  className="text-sm font-semibold text-foreground"
                >
                  Result Date
                </label>
                <input
                  id="repeat-fecalysis-result-date"
                  type="date"
                  value={data.result_date}
                  onChange={(event) =>
                    updateField("result_date", event.target.value)
                  }
                  readOnly={disabled}
                  className={cn(
                    "h-9 w-44 rounded-md border border-primary/20 bg-white px-2 text-sm shadow-sm focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30",
                    disabled && "pointer-events-none bg-muted/30"
                  )}
                />
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-2.5 lg:border-l lg:border-primary/15 lg:pl-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <NotebookPen className="h-4 w-4" aria-hidden />
                </span>
                <label
                  htmlFor="repeat-fecalysis-remarks"
                  className="shrink-0 text-sm font-semibold leading-tight text-foreground"
                >
                  Examination Notes
                  <span className="block text-[11px] font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </label>
                <input
                  id="repeat-fecalysis-remarks"
                  type="text"
                  value={data.remarks}
                  onChange={(event) => updateField("remarks", event.target.value)}
                  readOnly={disabled}
                  placeholder="Add notes about this examination..."
                  className={cn(
                    "h-9 min-w-0 flex-1 rounded-md border border-primary/20 bg-white px-2 text-sm shadow-sm focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30",
                    disabled && "pointer-events-none bg-muted/30"
                  )}
                />
              </div>
            </div>

            <FecalysisFormFields
              data={data}
              resultDate={data.result_date}
              onResultDateChange={(value) => updateField("result_date", value)}
              onFieldChange={(field, value) => updateField(field, value)}
              disabled={disabled}
              hideResultDate
            />

            {/* Laboratory Information — collapsible, closed by default so the
                results stay the focus. */}
            <section className="overflow-hidden rounded-lg border border-primary/15 bg-card shadow-sm">
              <button
                type="button"
                onClick={() => setLabInfoOpen((value) => !value)}
                aria-expanded={labInfoOpen}
                className="flex w-full cursor-pointer items-center gap-2.5 border-b border-primary/10 bg-muted/20 px-3 py-2 text-left"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold leading-tight text-foreground">
                    Laboratory Information
                  </h4>
                  <p className="text-[11px] leading-tight text-muted-foreground">
                    Details of personnel and reference information
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-foreground/60 transition-transform",
                    labInfoOpen && "rotate-180"
                  )}
                  aria-hidden
                />
              </button>

              <div className={cn("space-y-2 p-3", !labInfoOpen && "hidden")}>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="repeat-fecalysis-laboratory-number"
                  className={cn(metadataLabelClassName, "w-28 text-right")}
                >
                  Laboratory No.:
                </label>
                <input
                  id="repeat-fecalysis-laboratory-number"
                  type="text"
                  value={data.laboratory_no}
                  onChange={(event) =>
                    updateField("laboratory_no", event.target.value)
                  }
                  readOnly={disabled}
                  className={cn(inputClassName, "w-32")}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className={cn(metadataLabelClassName, "w-28 text-right")}>
                  Med. Tech.:
                </label>
                <input
                  type="text"
                  value={data.med_tech}
                  readOnly
                  aria-label="Medical technologist"
                  className={cn(
                    inputClassName,
                    "min-w-0 flex-1 pointer-events-none bg-muted/30"
                  )}
                />
                <label className={metadataLabelClassName}>License No.:</label>
                <input
                  type="text"
                  value={data.med_tech_license_no}
                  readOnly
                  aria-label="Medical technologist license number"
                  className={cn(
                    inputClassName,
                    "w-28 pointer-events-none bg-muted/30"
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={disabled}
                  onClick={() => personnel.openDialog("med_tech")}
                  aria-label="Search medical technologist"
                  className="cursor-pointer"
                >
                  ...
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <label className={cn(metadataLabelClassName, "w-28 text-right")}>
                  Pathologist:
                </label>
                <input
                  type="text"
                  value={data.pathologist}
                  readOnly
                  aria-label="Pathologist"
                  className={cn(
                    inputClassName,
                    "min-w-0 flex-1 pointer-events-none bg-muted/30"
                  )}
                />
                <label className={metadataLabelClassName}>License No.:</label>
                <input
                  type="text"
                  value={data.pathologist_license_no}
                  readOnly
                  aria-label="Pathologist license number"
                  className={cn(
                    inputClassName,
                    "w-28 pointer-events-none bg-muted/30"
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={disabled}
                  onClick={() => personnel.openDialog("pathologist")}
                  aria-label="Search pathologist"
                  className="cursor-pointer"
                >
                  ...
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="repeat-fecalysis-requested-by"
                  className={cn(metadataLabelClassName, "w-28 text-right")}
                >
                  Requested By:
                </label>
                <input
                  id="repeat-fecalysis-requested-by"
                  type="text"
                  value={data.requested_by}
                  onChange={(event) =>
                    updateField("requested_by", event.target.value)
                  }
                  readOnly={disabled}
                  className={cn(inputClassName, "min-w-0 flex-1")}
                />
              </div>

              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      <MedicalPersonnelDialog
        open={personnel.dialogOpen}
        onOpenChange={personnel.setDialogOpen}
        onSelect={personnel.handleSelect}
        title={
          personnel.target === "med_tech"
            ? "Select Medical Technologist"
            : "Select Pathologist"
        }
        role={personnel.target === "med_tech" ? "MED_TECH" : "PATHOLOGIST"}
      />

      <PdfPreviewDialog
        open={previewBlob !== null}
        onClose={() => setPreviewBlob(null)}
        blob={previewBlob}
        title="Fecalysis Repeat Report"
      />
    </>
  );
}
