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
import { buildMlcPayload } from "@/components/mlc/printPayload";
import type { MlcRecord } from "@/components/mlc/types";

interface PrintDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Callback when the dialog should close. */
  onClose: () => void;
  /** Current MLC form data to submit for PDF generation. */
  data: MlcRecord | null;
}

/**
 * Dialog that generates an MLC certificate PDF via PrintIO.
 *
 * When the user clicks the generate button, it builds a flat payload from the
 * current record (see `buildMlcPayload`), posts it to the Next.js print route
 * which proxies to PrintIO, then loads the returned PDF into a hidden iframe
 * and opens the browser print dialog.
 *
 * Props:
 * - `data` — the current MLC record; a loaded record (with `last_name`) is
 *   required before the certificate can be generated
 *
 * @see buildMlcPayload — builds the PrintIO payload from the record
 * @see printPdfBlob — opens the browser print dialog for the returned PDF
 */
export function PrintDialog({ open, onClose, data }: PrintDialogProps) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!data || !data.last_name) {
      toast.error("No record loaded. Please select or save a record first.");
      return;
    }

    setGenerating(true);
    try {
      await requestPrint("mlc", await buildMlcPayload(data));
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate report";
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md" aria-describedby="print-dialog-description">
        <DialogHeader>
          <DialogTitle>Print Report</DialogTitle>
          <DialogDescription id="print-dialog-description">
            Generate the MLC Health Certificate report for this record.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          <Button
            variant="outline"
            className="h-auto justify-start gap-3 px-4 py-3 text-left"
            disabled={generating || !data?.last_name}
            onClick={handleGenerate}
          >
            {generating ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
            ) : (
              <FileText className="h-4 w-4 shrink-0 text-primary" />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium">MLC Certificate</span>
              <span className="text-xs text-muted-foreground">
                Maritime Labour Convention medical certificate
              </span>
            </div>
          </Button>
        </div>

        {!data?.last_name && (
          <p className="text-xs text-destructive">
            No record loaded. Search for a patient or save a new record to enable printing.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
