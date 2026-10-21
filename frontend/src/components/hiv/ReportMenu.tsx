"use client";

import { fetchPrintPdf } from "@/lib/print-request";
import {
  ReportPrintMenu,
  type ReportMenuOption,
} from "@/components/common/report-print-menu";
import { buildHivPayload } from "@/components/hiv/printPayload";
import type { HivReport } from "@/components/hiv/types";

/** Reports offered by the HIV print dropdown. */
const REPORT_OPTIONS: readonly ReportMenuOption[] = [
  {
    slug: "hiv",
    label: "HIV Report",
    description: "HIV-1 screening test used and reactive result",
  },
] as const;

interface ReportMenuProps {
  /** Current HIV Report form data, used to build the PrintIO payload. */
  data: HivReport | null;
}

/**
 * HIV print dropdown content for the toolbar Print button.
 *
 * Supplies the HIV report option to the shared {@link ReportPrintMenu} and
 * implements `onGenerate`: builds the PrintIO payload from the current record
 * and returns the PDF blob, which the shared menu opens in a zoomable preview.
 *
 * @see buildHivPayload — builds the PrintIO payload from the record
 */
export function ReportMenu({ data }: ReportMenuProps) {
  const hasRecord = !!data?.last_name;

  const onGenerate = async (slug: string): Promise<Blob | null> => {
    if (!data || !data.last_name) {
      throw new Error("No record loaded. Please select or save a record first.");
    }
    return fetchPrintPdf(slug, await buildHivPayload(data));
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
