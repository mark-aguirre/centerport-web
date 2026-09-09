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
import { api } from "@/lib/api";
import { requestPrint } from "@/lib/print-request";
import { buildReportPayload, type ReportSlug } from "@/components/medical/printPayload";
import type { MedicalExam } from "@/components/medical/types";

/**
 * A seabase report the user can generate from the print dialog.
 *
 * Reports are produced by one of two engines:
 * - `"printio"` — the client builds a flat payload and posts it to the matching
 *   Next.js print route, which proxies to PrintIO (needs the full record).
 * - `"backend"` — the backend JasperReports service renders the PDF from the
 *   persisted record (needs the record id).
 */
interface ReportOption {
  /** Route slug (PrintIO) or backend report slug. */
  slug: string;
  /** Button label shown to the user. */
  label: string;
  /** Short description shown under the label. */
  description: string;
  /** Which rendering engine produces this report. */
  engine: "printio" | "backend";
}

/** Available seabase report types, in display order. */
const REPORT_OPTIONS: readonly ReportOption[] = [
  {
    slug: "seabase-summary",
    label: "Summary Report",
    description: "Results and recommendation overview",
    engine: "printio",
  },
  {
    slug: "seabase-detailed",
    label: "Detailed Report",
    description: "Complete medical examination with all sections",
    engine: "backend",
  },
  {
    slug: "seabase-mlc",
    label: "MLC Certificate",
    description: "Maritime Labour Convention medical certificate",
    engine: "printio",
  },
  {
    slug: "seabase-mer",
    label: "MER Form",
    description: "Medical Examination Report",
    engine: "backend",
  },
] as const;

interface PrintDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Callback when the dialog should close. */
  onClose: () => void;
  /** UUID of the current medical exam record (used by backend reports). */
  examId: string | undefined;
  /** Current medical exam record, used to build the PrintIO payload. */
  data: MedicalExam | null;
}

/**
 * Dialog that lets the user choose which seabase report to generate.
 *
 * The MLC certificate is generated via PrintIO: the client builds a flat payload
 * from the current record (see `buildSeabaseMlcPayload`), posts it to the
 * Next.js print route, and opens the browser print dialog for the returned PDF.
 * The remaining reports are rendered by the backend JasperReports service.
 *
 * Props:
 * - `data` — the current medical exam record; a loaded record (with `last_name`)
 *   is required before the MLC certificate can be generated
 * - `examId` — the persisted record id, required for backend reports
 *
 * @see buildSeabaseMlcPayload — builds the PrintIO payload for the MLC certificate
 */
export function PrintDialog({ open, onClose, examId, data }: PrintDialogProps) {
  const [generating, setGenerating] = useState<string | null>(null);

  const generateReport = async (option: ReportOption) => {
    if (option.engine === "printio") {
      if (!data || !data.last_name) {
        toast.error("No record loaded. Please select or save a record first.");
        return;
      }
      const slug = option.slug as ReportSlug;
      const payload = await buildReportPayload(slug, data);
      await requestPrint(slug, payload);
      onClose();
      return;
    }

    if (!examId) {
      toast.error("No record loaded. Please select or save a record first.");
      return;
    }
    await api.entities.MedicalExam.generateReport(examId, option.slug);
    onClose();
  };

  const handleGenerate = async (option: ReportOption) => {
    setGenerating(option.slug);
    try {
      await generateReport(option);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate report";
      toast.error(message);
    } finally {
      setGenerating(null);
    }
  };

  const hasRecord = !!examId || !!data?.last_name;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Print Report</DialogTitle>
          <DialogDescription>
            Select which report to generate for this medical examination record.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          {REPORT_OPTIONS.map((option) => {
            const disabled =
              generating !== null ||
              (option.engine === "printio" ? !data?.last_name : !examId);
            return (
              <Button
                key={option.slug}
                variant="outline"
                className="h-auto justify-start gap-3 px-4 py-3 text-left"
                disabled={disabled}
                onClick={() => handleGenerate(option)}
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
