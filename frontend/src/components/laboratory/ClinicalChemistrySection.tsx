"use client";

/**
 * Clinical Chemistry and Serology/Immunology section for a laboratory report.
 *
 * The field body is shared with Repeat Chemistry so both forms retain the same
 * result date, columns, units, rows, and HIGH controls.
 */

import { useState } from "react";
import { FlaskConical, Loader2, Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { PdfPreviewDialog } from "@/components/common/pdf-preview-dialog";
import { fetchPrintPdf } from "@/lib/print-request";
import { ChemistryFormFields } from "./ChemistryFormFields";
import { RepeatChemistryDialog } from "./RepeatChemistryDialog";
import { buildChemistryPayload } from "./printPayload";
import type { LaboratorySectionProps } from "./types";
import { createFieldUpdater } from "./utils";

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
  const [printing, setPrinting] = useState(false);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const hasPersistedReport = Boolean(data.id);

  const handlePrint = async () => {
    setPrinting(true);
    try {
      const blob = await fetchPrintPdf(
        "laboratory-chemistry",
        buildChemistryPayload(data),
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
        title="Clinical Chemistry and Serology/Immunology"
        icon={FlaskConical}
        banner
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

      <RepeatChemistryDialog
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
        title="Chemistry Report"
      />

      <ChemistryFormFields
        data={data}
        reference={{
          fbs_si: data.fbs_si,
          fbs_conv: data.fbs_conv,
          bun_si: data.bun_si,
          bun_conv: data.bun_conv,
          creatinine_si: data.creatinine_si,
          creatinine_conv: data.creatinine_conv,
          cholesterol_si: data.cholesterol_si,
          cholesterol_conv: data.cholesterol_conv,
          triglycerides_si: data.triglycerides_si,
          triglycerides_conv: data.triglycerides_conv,
          uric_acid_si: data.uric_acid_si,
          uric_acid_conv: data.uric_acid_conv,
          sgot_si: data.sgot_si,
          sgpt_si: data.sgpt_si,
          alk_phos_si: data.alk_phos_si,
        }}
        resultDate={data.chemistry_result_date}
        hba1cReference={data.hba1c_normal}
        onResultDateChange={(value) =>
          updateField("chemistry_result_date", value)
        }
        onFieldChange={(field, value) => updateField(field, value)}
        disabled={disabled}
      />
    </div>
  );
}
