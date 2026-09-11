"use client";

import { fetchPrintPdf } from "@/lib/print-request";
import {
  ReportPrintMenu,
  type ReportMenuOption,
} from "@/components/common/report-print-menu";
import type { PsychologyRecord } from "@/components/psychology/types";
import { buildPsychologyPayload } from "@/components/psychology/printPayload";

/** Psychology reports offered by the print dropdown, in display order. */
const REPORT_OPTIONS: readonly ReportMenuOption[] = [
  {
    slug: "psychology",
    label: "Psychological Evaluation",
    description: "Intellectual level, personality traits, and conclusion",
  },
] as const;

interface ReportMenuProps {
  /** Current psychology form data, used to build the PrintIO payload. */
  data: PsychologyRecord | null;
}

/**
 * Psychology print dropdown content for the toolbar Print button.
 *
 * Supplies the psychology report option to the shared {@link ReportPrintMenu}
 * and implements `onGenerate`: builds the PrintIO payload from the current
 * record and returns the PDF blob, which the shared menu opens in a zoomable
 * preview.
 *
 * @see buildPsychologyPayload — builds the PrintIO payload
 */
export function ReportMenu({ data }: ReportMenuProps) {
  const hasRecord = !!data?.last_name;

  const onGenerate = async (slug: string): Promise<Blob | null> => {
    if (!data || !data.last_name) {
      throw new Error("No evaluation record loaded. Please select or save a record first.");
    }
    const payload = buildPsychologyPayload(data);
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
