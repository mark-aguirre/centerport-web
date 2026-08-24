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
import type { MlcRecord } from "@/components/mlc/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/** Resolve a photo URL — prepends the API base if it's a relative path. */
function resolvePhotoUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

/**
 * Fetches an image from a URL and returns it as a base64 data URL.
 * Returns empty string if the fetch fails or the URL is empty.
 */
async function fetchPhotoAsBase64(url: string | undefined): Promise<string> {
  const resolved = resolvePhotoUrl(url);
  if (!resolved) return "";

  try {
    const response = await fetch(resolved);
    if (!response.ok) return "";

    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(blob);
    });
  } catch {
    return "";
  }
}

interface PrintDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Callback when the dialog should close. */
  onClose: () => void;
  /** Current MLC form data to submit for PDF generation. */
  data: MlcRecord | null;
}

/**
 * Builds the PrintIO payload from the current MLC form data.
 *
 * Maps frontend field names to the PrintIO template variable names.
 * Fetches the photo and converts it to base64 for inline embedding.
 */
async function buildPrintPayload(data: MlcRecord): Promise<Record<string, string>> {
  const lastName = data.last_name ?? "";
  const firstName = data.first_name ?? "";
  const middleName = data.middle_name ?? "";
  const fullname = [lastName, firstName, middleName].filter(Boolean).join(", ");

  const photoBase64 = await fetchPhotoAsBase64(data.photo_url);

  return {
    fullname,
    last_name: lastName,
    first_name: firstName,
    middle_name: middleName,
    age: data.age ?? "",
    birthdate: data.date_of_birth ?? "",
    place_of_birth: data.place_of_birth ?? "",
    country: "",
    nationality: data.nationality ?? "",
    gender: data.gender ?? "",
    marital_status: data.civil_status ?? "",
    religion: data.religion ?? "",
    address: data.address ?? "",
    passport_no: data.passport_no ?? "",
    position_deck: data.position ?? "",
    position_engine: "",
    position_steward: "",
    position_other: "",
    shipping_company: data.shipping_company ?? "",
    sirb_no: data.sirb_no ?? "",
    id_documents_checked: data.id_documents_checked ?? "",
    hearing_meets_standards: data.hearing_meets_standards ?? "",
    unaided_hearing_satisfactory: data.unaided_hearing_satisfactory ?? "",
    visual_acuity_meets_standards: data.visual_acuity_meets_standards ?? "",
    colour_vision_meets_standards: data.colour_vision_meets_standards ?? "",
    visual_aids: Array.isArray(data.visual_aids) ? data.visual_aids.join(", ") : "",
    fit_for_lookout: data.fit_for_lookout ?? "",
    date_colour_vision_test: data.date_colour_vision_test ?? "",
    no_limitations: data.no_limitations ?? "",
    applicant_condition_risk: data.applicant_condition_risk ?? "",
    photo_url: photoBase64,
    fitness_determination: data.fitness_determination ?? "",
    date_of_fitness: data.date_of_fitness ?? "",
    medical_director: data.medical_director ?? "",
    examining_physician: data.examining_physician ?? "",
    limitations_details: data.limitations_details ?? "",
    date_initial_peme: data.date_initial_peme ?? "",
    valid_until_date: data.valid_until_date ?? "",
    medical_certification_no: data.medical_certification_no ?? "",
  };
}

/**
 * Dialog that generates an MLC certificate PDF via PrintIO.
 *
 * When the user clicks the generate button, it sends the current form data
 * to the Next.js API route which proxies to PrintIO, then opens the
 * resulting PDF in a new browser tab for print preview.
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
      const payload = await buildPrintPayload(data);

      const response = await fetch("/api/print/mlc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = "Failed to generate report";
        try {
          const errorBody = await response.json();
          if (errorBody.message) message = errorBody.message;
        } catch {
          // Ignore parse errors
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Open PDF in new tab for print preview
      const newTab = window.open(blobUrl, "_blank");
      if (!newTab) {
        // Fallback: trigger download if popup was blocked
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "mlc-certificate.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Clean up blob URL after a delay
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Print Report</DialogTitle>
          <DialogDescription>
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
