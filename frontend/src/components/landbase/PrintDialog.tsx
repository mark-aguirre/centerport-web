"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { requestPrint } from "@/lib/print-request";
import type { LandbasePeme } from "@/components/landbase/types";
import { buildReportPayload, type ReportSlug } from "@/components/landbase/printPayloads";

/**
 * A landbase report the user can generate from the print dialog.
 *
 * All current reports are generated via PrintIO: the client builds a flat
 * payload and posts it to the matching Next.js print route.
 */
interface ReportOption {
  /** Route slug and payload-builder discriminator. */
  slug: ReportSlug;
  /** Button label shown to the user. */
  label: string;
  /** Short description shown under the label. */
  description: string;
}

/** Landbase reports offered by the print dialog, in display order. */
const REPORT_OPTIONS: readonly ReportOption[] = [
  {
    slug: "landbase-mlc",
    label: "MLC Certificate",
    description: "Maritime Labour Convention medical certificate",
  },
  {
    slug: "landbase-summary",
    label: "Summary Report",
    description: "Results and recommendation overview",
  },
  {
    slug: "landbase-detailed",
    label: "Detailed Report",
    description: "Complete PEME with all sections",
  },
  {
    slug: "landbase-mer",
    label: "MER Form",
    description: "Medical Examination Report",
  },
] as const;

interface PrintDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Callback when the dialog should close. */
  onClose: () => void;
  /** UUID of the current PEME record. Null when no record is loaded. */
  pemeId: string | undefined;
  /** Current PEME form data, used to build the PrintIO payload. */
  data: LandbasePeme | null;
}

/**
 * Dialog that lets the user choose which landbase report to generate.
 *
 * Each report is generated via PrintIO: the client builds a flat payload from
 * the current record (see `buildReportPayload`), posts it to the Next.js print
 * route, and opens the browser print dialog for the returned PDF.
 *
 * Props:
 * - `data` — the current PEME record; a loaded record (with `last_name`) is
 *   required before any report can be generated
 * - `pemeId` — used only to reflect whether a record is loaded in the UI
 *
 * @see buildReportPayload — builds the PrintIO payload per report slug
 * @see printPdfBlob — opens the browser print dialog for the returned PDF
 */
export function PrintDialog({ open, onClose, pemeId, data }: PrintDialogProps) {
  const [generating, setGenerating] = useState<ReportSlug | null>(null);

  const generateReport = async (slug: ReportSlug) => {
    if (!data || !data.last_name) {
      toast.error("No PEME record loaded. Please select or save a record first.");
      return;
    }

    const payload = await buildReportPayload(slug, data);
    await requestPrint(slug, payload);
    onClose();
  };

  const handleGenerate = async (slug: ReportSlug) => {
    setGenerating(slug);
    try {
      await generateReport(slug);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate report";
      toast.error(message);
    } finally {
      setGenerating(null);
    }
  };

  const hasRecord = !!pemeId || !!data?.last_name;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Print Report</DialogTitle>
          <DialogDescription>
            Select which report to generate for this PEME record.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          {REPORT_OPTIONS.map((option) => {
            const disabled = generating !== null || !data?.last_name;
            return (
              <Button
                key={option.slug}
                variant="outline"
                className="h-auto justify-start gap-3 px-4 py-3 text-left"
                disabled={disabled}
                onClick={() => handleGenerate(option.slug)}
              >
                {generating === option.slug ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                ) : (
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </div>
              </Button>
            );
          })}
        </div>

        {!hasRecord && (
          <p className="text-xs text-destructive">
            No record loaded. Search for a patient or save a new record to enable printing.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
