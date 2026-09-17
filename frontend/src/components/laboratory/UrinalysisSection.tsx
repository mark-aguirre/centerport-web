"use client";

/**
 * Urinalysis section for a Laboratory Report.
 *
 * The field body is shared with Repeat Urinalysis so both forms retain the same
 * date, grouped layout, options, fields, and units.
 */

import { useState } from "react";
import { Beaker, Loader2, Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { PdfPreviewDialog } from "@/components/common/pdf-preview-dialog";
import { fetchPrintPdf } from "@/lib/print-request";
import { RepeatUrinalysisDialog } from "./RepeatUrinalysisDialog";
import { buildUrinalysisPayload } from "./printPayload";
import type { LaboratorySectionProps } from "./types";
import { UrinalysisFormFields } from "./UrinalysisFormFields";
import { createFieldUpdater } from "./utils";

/**
 * Displays and edits the Urinalysis portion of a laboratory report.
 */
export default function UrinalysisSection({
  data,
  onChange,
  disabled,
}: LaboratorySectionProps) {
  const updateField = createFieldUpdater(data, onChange);
  const [repeatDialogOpen, setRepeatDialogOpen] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const hasPersistedReport = Boolean(data.id);

  const handlePrint = async () => {
    setPrinting(true);
    try {
      const blob = await fetchPrintPdf(
        "laboratory-urinalysis",
        buildUrinalysisPayload(data),
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

  return (
    <div className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
      <SectionHeader
        title="Urinalysis"
        icon={Beaker}
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
              Repeat Urinalysis
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasPersistedReport || printing}
              onClick={handlePrint}
              className="cursor-pointer"
            >
              {printing ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Printer aria-hidden="true" />
              )}
              Print
            </Button>
          </div>
        }
      />

      <RepeatUrinalysisDialog
        open={repeatDialogOpen}
        onOpenChange={setRepeatDialogOpen}
        laboratoryReportId={data.id}
        header={{
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          age: data.age,
          gender: data.gender,
          address: data.address,
          position: data.position,
          employer: data.employer,
        }}
      />

      <PdfPreviewDialog
        open={previewBlob !== null}
        onClose={() => setPreviewBlob(null)}
        blob={previewBlob}
        title="Urinalysis Report"
      />

      <UrinalysisFormFields
        data={data}
        resultDate={data.urinalysis_result_date}
        onResultDateChange={(value) =>
          updateField("urinalysis_result_date", value)
        }
        onFieldChange={(field, value) => updateField(field, value)}
        disabled={disabled}
      />
    </div>
  );
}
