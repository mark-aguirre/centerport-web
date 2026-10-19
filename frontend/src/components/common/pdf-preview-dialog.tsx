"use client";

import { useEffect, useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { printPdfBlob } from "@/lib/print-pdf";
import { extractPdfPage, getPdfPageCount } from "@/lib/pdf-pages";

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

/** Sentinel for "print the whole document" in the page selector. */
const ALL_PAGES = "all" as const;

/** Selected page: a zero-based page index, or {@link ALL_PAGES}. */
type PageSelection = typeof ALL_PAGES | number;

/**
 * Modal that previews a generated PDF and lets the user print it.
 *
 * The PDF is rendered in a visible `<iframe>` pointed at an object URL, so the
 * browser's built-in PDF viewer supplies native zoom, scroll, and page
 * navigation controls — no third-party viewer or custom zoom UI required.
 *
 * For multi-page reports, a page selector (All / Page 1 / Page 2 / …) lets the
 * user preview and print a single page: selecting a page slices it out of the
 * source blob with {@link extractPdfPage}, previews just that page, and prints
 * only it. The object URL is derived from whichever blob is currently shown and
 * revoked on change/unmount, so no blob memory leaks across previews.
 *
 * Printing hands the shown blob to {@link printPdfBlob}, which loads it into a
 * hidden iframe and opens the browser print dialog.
 *
 * @see printPdfBlob — the underlying print path
 * @see extractPdfPage — slices a single page out of the source PDF
 */
export function PdfPreviewDialog({
  open,
  onClose,
  blob,
  title = "Print Preview",
}: PdfPreviewDialogProps) {
  const [pageCount, setPageCount] = useState(0);
  const [selection, setSelection] = useState<PageSelection>(ALL_PAGES);
  // The blob currently shown/printed: the full document for ALL_PAGES, or a
  // one-page slice when a specific page is selected.
  const [shownBlob, setShownBlob] = useState<Blob | null>(null);
  const [slicing, setSlicing] = useState(false);

  // Reset selection and read the page count whenever a new source blob arrives.
  useEffect(() => {
    setSelection(ALL_PAGES);
    setShownBlob(blob);
    setPageCount(0);
    if (!blob) return;

    let cancelled = false;
    getPdfPageCount(blob)
      .then((count) => {
        if (!cancelled) setPageCount(count);
      })
      .catch(() => {
        // If we can't read the page count, fall back to whole-document printing.
        if (!cancelled) setPageCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [blob]);

  // Produce the blob to show/print for the current selection.
  useEffect(() => {
    if (!blob) return;

    if (selection === ALL_PAGES) {
      setShownBlob(blob);
      return;
    }

    let cancelled = false;
    setSlicing(true);
    extractPdfPage(blob, selection)
      .then((pageBlob) => {
        if (!cancelled) setShownBlob(pageBlob);
      })
      .catch((error) => {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : "Failed to extract page";
        toast.error(message);
        // Fall back to the full document so the preview stays usable.
        setSelection(ALL_PAGES);
        setShownBlob(blob);
      })
      .finally(() => {
        if (!cancelled) setSlicing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [blob, selection]);

  // Derive the object URL from the shown blob so it stays in sync without a
  // setState-in-effect cascade; a matching effect revokes it on change/unmount.
  const objectUrl = useMemo(
    () => (shownBlob ? URL.createObjectURL(shownBlob) : null),
    [shownBlob],
  );

  useEffect(() => {
    if (!objectUrl) return;
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const handlePrint = () => {
    if (shownBlob) void printPdfBlob(shownBlob);
  };

  const showPageSelector = pageCount > 1;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="flex h-[90vh] w-[70vw] max-w-none flex-col gap-3 p-4 sm:max-w-none">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {showPageSelector && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Pages to print:
            </span>
            <Button
              type="button"
              size="sm"
              variant={selection === ALL_PAGES ? "default" : "outline"}
              onClick={() => setSelection(ALL_PAGES)}
              disabled={slicing}
            >
              All
            </Button>
            {Array.from({ length: pageCount }, (_, index) => (
              <Button
                key={index}
                type="button"
                size="sm"
                variant={selection === index ? "default" : "outline"}
                onClick={() => setSelection(index)}
                disabled={slicing}
                className={cn(selection === index && "pointer-events-none")}
              >
                {`Page ${index + 1}`}
              </Button>
            ))}
          </div>
        )}

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-md border bg-muted">
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
          {slicing && (
            <div
              role="status"
              aria-live="polite"
              className="absolute inset-0 flex items-center justify-center bg-background/60 text-sm text-muted-foreground"
            >
              Preparing page…
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint} disabled={!shownBlob || slicing} className="gap-2">
            <Printer className="h-4 w-4" />
            {showPageSelector
              ? selection === ALL_PAGES
                ? "Print all"
                : `Print page ${selection + 1}`
              : "Print"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
