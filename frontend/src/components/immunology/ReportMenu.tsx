"use client";

import { fetchPrintPdf } from "@/lib/print-request";
import {
  ReportPrintMenu,
  type ReportMenuOption,
} from "@/components/common/report-print-menu";
import { buildImmunologyPayload } from "@/components/immunology/printPayload";
import type { ImmunologyReport } from "@/components/immunology/types";

/** Reports offered by the immunology print dropdown. */
const REPORT_OPTIONS: readonly ReportMenuOption[] = [
  {
    slug: "immunology",
    label: "Immunology Report",
    description: "Tumor marker (PSA) and serology (HBsAg, RPR, Anti-HBS) results",
  },
] as const;

interface ReportMenuProps {
  /** Current Immunology Report form data, used to build the PrintIO payload. */
  data: ImmunologyReport | null;
}

/**
 * Immunology print dropdown content for the toolbar Print button.
 *
 * Supplies the immunology report option to the shared {@link ReportPrintMenu}
 * and implements `onGenerate`: builds the PrintIO payload from the current
 * record and returns the PDF blob, which the shared menu opens in a zoomable
 * preview.
 *
 * @see buildImmunologyPayload — builds the PrintIO payload from the record
 */
export function ReportMenu({ data }: ReportMenuProps) {
  const hasRecord = !!data?.last_name;

  const onGenerate = async (slug: string): Promise<Blob | null> => {
    if (!data || !data.last_name) {
      throw new Error("No record loaded. Please select or save a record first.");
    }
    return fetchPrintPdf(slug, buildImmunologyPayload(data));
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
