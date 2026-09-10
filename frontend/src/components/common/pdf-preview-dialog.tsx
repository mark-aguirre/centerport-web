"use client";

import { useEffect, useMemo } from "react";
import { Printer } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { printPdfBlob } from "@/lib/print-pdf";

interface PdfPreviewDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Callback when the dialog should close. */
  onClose: () => void;
  /** The PDF to preview; `null` renders nothing (e.g. before generation). */
  blob: Blob | null;
  /** Dialog title. */
  title?: string;
}

/**
 * Modal that previews a generated PDF and lets the user print it.
 *
 * The PDF is rendered in a visible `<iframe>` pointed at an object URL, so the
 * browser's built-in PDF viewer supplies native zoom, scroll, and page
 * navigation controls — no third-party viewer or custom zoom UI required.
 *
 * The object URL is created when a `blob` is provided and revoked when the blob
 * changes or the component unmounts, so no blob memory is leaked across
 * previews.
 *
 * Printing hands the same blob to {@link printPdfBlob}, which loads it into a
 * hidden iframe and opens the browser print dialog.
 *
 * @see printPdfBlob — the underlying print path
 */
export function PdfPreviewDialog({
  open,
  onClose,
  blob,
  title = "Print Preview",
}: PdfPreviewDialogProps) {
  // Derive the object URL from the blob so it stays in sync without a
  // setState-in-effect cascade; a matching effect revokes it on change/unmount.
  const objectUrl = useMemo(
    () => (blob ? URL.createObjectURL(blob) : null),
    [blob],
  );

  useEffect(() => {
    if (!objectUrl) return;
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const handlePrint = () => {
    if (blob) void printPdfBlob(blob);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="flex w-[80vw] max-w-none flex-col gap-3 p-4 sm:max-w-none">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="h-[90vh] overflow-hidden rounded-md border bg-muted">
          {objectUrl ? (
            <iframe
              src={objectUrl}
              title={title}
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No document to preview.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint} disabled={!blob} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
