"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PdfPreviewDialog } from "@/components/common/pdf-preview-dialog";

/**
 * A single report option shown in the print dropdown.
 */
export interface ReportMenuOption {
  /** Stable identifier; also passed to {@link ReportPrintMenuProps.onGenerate}. */
  slug: string;
  /** Menu item label shown to the user. */
  label: string;
  /** Short description shown under the label. */
  description: string;
  /** When `true`, the item is disabled (e.g. no record loaded). */
  disabled?: boolean;
}

export interface ReportPrintMenuProps {
  /** Report options to list, in display order. */
  options: readonly ReportMenuOption[];
  /**
   * Produces the report for the chosen slug.
   *
   * Return a `Blob` to open it in the zoomable preview dialog, or `null` when
   * the report was handled elsewhere (e.g. a backend download) and no preview
   * is needed. Throwing surfaces the message as an error toast.
   */
  onGenerate: (slug: string) => Promise<Blob | null>;
  /** Disable every item and suppress interaction (e.g. no record loaded). */
  disabled?: boolean;
  /** Optional hint shown when `disabled` is true and no record is loaded. */
  emptyHint?: string;
  /** Heading shown at the top of the dropdown. */
  heading?: string;
}

/**
 * Reusable dropdown content + loading overlay + PDF preview for report printing.
 *
 * Designed to be passed as the `printMenu` prop of `FormPage`/`FormToolbar`:
 * the toolbar Print button becomes the dropdown trigger and renders this
 * content. Selecting an item calls {@link ReportPrintMenuProps.onGenerate};
 * while it runs, a centered loading overlay is shown. If a `Blob` is returned it
 * opens in a zoomable {@link PdfPreviewDialog} from which the user can print.
 *
 * Each module supplies its own options and `onGenerate` (which builds the
 * PrintIO payload and fetches the PDF), so the dropdown/overlay/preview flow is
 * shared rather than duplicated per module.
 *
 * @see PdfPreviewDialog — the zoomable preview shown after generation
 */
export function ReportPrintMenu({
  options,
  onGenerate,
  disabled = false,
  emptyHint,
  heading = "Print Report",
}: ReportPrintMenuProps) {
  const [generating, setGenerating] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("Print Preview");
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);

  const handleGenerate = async (option: ReportMenuOption) => {
    setGenerating(option.slug);
    try {
      const blob = await onGenerate(option.slug);
      if (blob) {
        setPreviewTitle(option.label);
        setPreviewBlob(blob);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate report";
      toast.error(message);
    } finally {
      setGenerating(null);
    }
  };

  return (
    <>
      <DropdownMenuContent align="end" className="w-72">
        <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
          {heading}
        </div>
        <DropdownMenuSeparator />
        {options.map((option) => {
          const itemDisabled = disabled || generating !== null || option.disabled;
          return (
            <DropdownMenuItem
              key={option.slug}
              disabled={itemDisabled}
              onClick={() => handleGenerate(option)}
              className="gap-3 py-2"
            >
              {generating === option.slug ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
              ) : (
                <FileText className="h-4 w-4 shrink-0 text-primary" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
        {disabled && emptyHint && (
          <p className="px-2 py-1.5 text-xs text-destructive">{emptyHint}</p>
        )}
      </DropdownMenuContent>

      {generating !== null && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
        >
          <div className="flex flex-col items-center gap-3 rounded-lg bg-background px-6 py-5 shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              Generating report…
            </span>
          </div>
        </div>
      )}

      <PdfPreviewDialog
        open={previewBlob !== null}
        onClose={() => setPreviewBlob(null)}
        blob={previewBlob}
        title={previewTitle}
      />
    </>
  );
}
