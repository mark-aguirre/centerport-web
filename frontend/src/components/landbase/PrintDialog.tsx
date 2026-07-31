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

/** Available landbase report types with their backend slugs and display labels. */
const REPORT_OPTIONS = [
  { slug: "landbase-detailed", label: "Detailed Report", description: "Complete PEME with all sections" },
  { slug: "landbase-mer-1", label: "MER Form 1", description: "Medical Examination Report — basic labs" },
  { slug: "landbase-mer-2", label: "MER Form 2", description: "Medical Examination Report — additional exams" },
  { slug: "landbase-mlc", label: "MLC Certificate", description: "Maritime Labour Convention medical certificate" },
  { slug: "landbase-summary", label: "Summary Report", description: "Results and recommendation overview" },
] as const;

interface PrintDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Callback when the dialog should close. */
  onClose: () => void;
  /** UUID of the current PEME record. Null when no record is loaded. */
  pemeId: string | undefined;
}

/**
 * Dialog that lets the user choose which landbase report to generate.
 *
 * Displays the 5 available report types as clickable cards. On click,
 * calls the backend to generate the PDF and opens it in a new tab.
 */
export function PrintDialog({ open, onClose, pemeId }: PrintDialogProps) {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = async (slug: string) => {
    if (!pemeId) {
      toast.error("No PEME record loaded. Please select or save a record first.");
      return;
    }

    setGenerating(slug);
    try {
      await api.entities.LandbasePeme.generateReport(pemeId, slug);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate report";
      toast.error(message);
    } finally {
      setGenerating(null);
    }
  };

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
          {REPORT_OPTIONS.map((option) => (
            <Button
              key={option.slug}
              variant="outline"
              className="h-auto justify-start gap-3 px-4 py-3 text-left"
              disabled={generating !== null || !pemeId}
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
          ))}
        </div>

        {!pemeId && (
          <p className="text-xs text-destructive">
            No record loaded. Search for a patient or save a new record to enable printing.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
