"use client";

import { fetchPrintPdf } from "@/lib/print-request";
import {
  ReportPrintMenu,
  type ReportMenuOption,
} from "@/components/common/report-print-menu";
import { buildMlcPayload } from "@/components/mlc/printPayload";
import type { MlcRecord } from "@/components/mlc/types";

/** MLC reports offered by the print dropdown. */
const REPORT_OPTIONS: readonly ReportMenuOption[] = [
  {
    slug: "mlc",
    label: "MLC Certificate",
    description: "Maritime Labour Convention medical certificate",
  },
] as const;

interface ReportMenuProps {
  /** Current MLC form data, used to build the PrintIO payload. */
  data: MlcRecord | null;
}

/**
 * MLC print dropdown content for the toolbar Print button.
 *
 * Supplies the MLC certificate option to the shared {@link ReportPrintMenu} and
 * implements `onGenerate`: builds the PrintIO payload and returns the PDF blob,
 * which the shared menu opens in a zoomable preview.
 *
 * @see buildMlcPayload — builds the PrintIO payload from the record
 */
export function ReportMenu({ data }: ReportMenuProps) {
  const hasRecord = !!data?.last_name;

  const onGenerate = async (): Promise<Blob | null> => {
    if (!data || !data.last_name) {
      throw new Error("No record loaded. Please select or save a record first.");
    }
    return fetchPrintPdf("mlc", await buildMlcPayload(data));
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
