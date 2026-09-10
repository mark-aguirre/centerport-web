"use client";

import { fetchPrintPdf } from "@/lib/print-request";
import {
  ReportPrintMenu,
  type ReportMenuOption,
} from "@/components/common/report-print-menu";
import { buildPanamaPayload } from "@/components/panama/printPayload";
import type { PanamaCertificate } from "@/components/panama/types";

/** Panama reports offered by the print dropdown. */
const REPORT_OPTIONS: readonly ReportMenuOption[] = [
  {
    slug: "panama",
    label: "Panama Certificate",
    description: "Panama Maritime Authority medical certificate",
  },
] as const;

interface ReportMenuProps {
  /** Current Panama certificate form data, used to build the PrintIO payload. */
  data: PanamaCertificate | null;
}

/**
 * Panama print dropdown content for the toolbar Print button.
 *
 * Supplies the Panama certificate option to the shared {@link ReportPrintMenu}
 * and implements `onGenerate`: builds the PrintIO payload and returns the PDF
 * blob, which the shared menu opens in a zoomable preview.
 *
 * @see buildPanamaPayload — builds the PrintIO payload from the record
 */
export function ReportMenu({ data }: ReportMenuProps) {
  const hasRecord = !!data?.full_name;

  const onGenerate = async (): Promise<Blob | null> => {
    if (!data || !data.full_name) {
      throw new Error("No record loaded. Please select or save a record first.");
    }
    return fetchPrintPdf("panama", buildPanamaPayload(data));
  };

  return (
    <ReportPrintMenu
      options={REPORT_OPTIONS}
      onGenerate={onGenerate}
      disabled={!hasRecord}
      emptyHint="No record loaded. Search for a patient or save a new record to enable printing."
    />
  );
}
