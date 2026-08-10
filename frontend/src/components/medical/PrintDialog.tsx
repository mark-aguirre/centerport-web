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

/** Available seabase report types with their backend slugs and display labels. */
const REPORT_OPTIONS = [
  { slug: "seabase-summary", label: "Summary Report", description: "Results and recommendation overview" },
  { slug: "seabase-detailed", label: "Detailed Report", description: "Complete medical examination with all sections" },
  { slug: "seabase-mlc", label: "MLC Certificate", description: "Maritime Labour Convention medical certificate" },
  { slug: "seabase-mer", label: "MER Form", description: "Medical Examination Report" },
] as const;

interface PrintDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Callback when the dialog should close. */
  onClose: () => void;
  /** UUID of the current medical exam record. Null when no record is loaded. */
  examId: string | undefined;
}

/**
 * Dialog that lets the user choose which seabase report to generate.
 *
 * Displays the 4 available report types as clickable cards. On click,
 * calls the backend to generate the PDF and opens it in a new tab.
 */
export function PrintDialog({ open, onClose, examId }: PrintDialogProps) {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = async (slug: string) => {
    if (!examId) {
      toast.error("No record loaded. Please select or save a record first.");
      return;
    }

    setGenerating(slug);
    try {
      await api.entities.MedicalExam.generateReport(examId, slug);
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
            Select which report to generate for this medical examination record.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          {REPORT_OPTIONS.map((option) => (
            <Button
              key={option.slug}
              variant="outline"
              className="h-auto justify-start gap-3 px-4 py-3 text-left"
              disabled={generating !== null || !examId}
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

        {!examId && (
          <p className="text-xs text-destructive">
            No record loaded. Search for a patient or save a new record to enable printing.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
