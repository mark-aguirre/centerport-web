"use client";

import { fetchPrintPdf } from "@/lib/print-request";
import {
  ReportPrintMenu,
  type ReportMenuOption,
} from "@/components/common/report-print-menu";
import type { LandbasePeme } from "@/components/landbase/types";
import { buildReportPayload, type ReportSlug } from "@/components/landbase/printPayloads";

/** Landbase reports offered by the print dropdown, in display order. */
const REPORT_OPTIONS: readonly ReportMenuOption[] = [
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

interface ReportMenuProps {
  /** UUID of the current PEME record. Null when no record is loaded. */
  pemeId: string | undefined;
  /** Current PEME form data, used to build the PrintIO payload. */
  data: LandbasePeme | null;
}

/**
 * Landbase print dropdown content for the toolbar Print button.
 *
 * Supplies the landbase report options to the shared {@link ReportPrintMenu} and
 * implements `onGenerate`: each report builds a PrintIO payload and returns the
 * PDF blob, which the shared menu opens in a zoomable preview.
 *
 * @see buildReportPayload — builds the PrintIO payload per report slug
 */
export function ReportMenu({ pemeId, data }: ReportMenuProps) {
  const hasRecord = !!pemeId || !!data?.last_name;

  const onGenerate = async (slug: string): Promise<Blob | null> => {
    if (!data || !data.last_name) {
      throw new Error("No PEME record loaded. Please select or save a record first.");
    }
    const payload = await buildReportPayload(slug as ReportSlug, data);
    return fetchPrintPdf(slug, payload);
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
