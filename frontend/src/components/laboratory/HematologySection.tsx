"use client";

/**
 * Hematology section for the Laboratory Report form.
 *
 * The field body is shared with Repeat Hematology so both forms always retain
 * the same result date, field order, ranges, units, and equal-column layout.
 */

import { useState } from "react";
import { Droplets, Loader2, Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/common/section-header";
import { PdfPreviewDialog } from "@/components/common/pdf-preview-dialog";
import { fetchPrintPdf } from "@/lib/print-request";
import { HematologyFormFields } from "./HematologyFormFields";
import { RepeatHematologyDialog } from "./RepeatHematologyDialog";
import { buildHematologyPayload } from "./printPayload";
import type { LaboratorySectionProps } from "./types";
import { createFieldUpdater } from "./utils";

/**
 * Displays and edits the hematology portion of a laboratory report.
 */
export default function HematologySection({
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
        "laboratory-hematology",
        buildHematologyPayload(data),
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
        title="Laboratory Report (Hematology)"
        icon={Droplets}
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
              Repeat Hematology
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

      <RepeatHematologyDialog
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
        title="Hematology Report"
      />

      <HematologyFormFields
        data={data}
        resultDate={data.hematology_result_date}
        onResultDateChange={(value) =>
          updateField("hematology_result_date", value)
        }
        onFieldChange={(field, value) => updateField(field, value)}
        disabled={disabled}
      />
    </div>
  );
}
