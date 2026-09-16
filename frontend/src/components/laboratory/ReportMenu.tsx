"use client";

import { fetchPrintPdf } from "@/lib/print-request";
import {
  ReportPrintMenu,
  type ReportMenuOption,
} from "@/components/common/report-print-menu";
import {
  buildLaboratoryPayload,
  buildLab08Payload,
  buildHematologyPayload,
  buildChemistryPayload,
  buildUrinalysisPayload,
  buildFecalysisPayload,
} from "@/components/laboratory/printPayload";
import type { LaboratoryReport } from "@/components/laboratory/types";

/** Laboratory reports offered by the print dropdown. */
const REPORT_OPTIONS: readonly ReportMenuOption[] = [
  {
    slug: "laboratory",
    label: "Laboratory Report (Lab-06)",
    description: "Lab-06 hematology, urinalysis, and fecalysis results",
  },
  {
    slug: "laboratory-08",
    label: "Laboratory Report (Lab-08)",
    description: "Lab-08 hematology, chemistry, urinalysis, and fecalysis results",
  },
  {
    slug: "laboratory-hematology",
    label: "Hematology Report",
    description: "Hematology CBC and differential count results",
  },
  {
    slug: "laboratory-chemistry",
    label: "Chemistry Report",
    description: "Clinical chemistry and serology/immunology results",
  },
  {
    slug: "laboratory-urinalysis",
    label: "Urinalysis Report",
    description: "Urinalysis macroscopic, chemical, microscopic, and cast results",
  },
  {
    slug: "laboratory-fecalysis",
    label: "Fecalysis Report",
    description: "Fecalysis macroscopic and microscopic stool examination results",
  },
] as const;

interface ReportMenuProps {
  /** Current Laboratory Report form data, used to build the PrintIO payload. */
  data: LaboratoryReport | null;
}

/**
 * Laboratory print dropdown content for the toolbar Print button.
 *
 * Supplies the Lab-06 report option to the shared {@link ReportPrintMenu} and
 * implements `onGenerate`: builds the PrintIO payload from the current record
 * and returns the PDF blob, which the shared menu opens in a zoomable preview.
 *
 * @see buildLaboratoryPayload — builds the PrintIO payload from the record
 */
export function ReportMenu({ data }: ReportMenuProps) {
  const hasRecord = !!data?.last_name;

  const onGenerate = async (slug: string): Promise<Blob | null> => {
    if (!data || !data.last_name) {
      throw new Error("No record loaded. Please select or save a record first.");
    }
    if (slug === "laboratory-08") {
      return fetchPrintPdf("laboratory-08", buildLab08Payload(data));
    }
    if (slug === "laboratory-hematology") {
      return fetchPrintPdf("laboratory-hematology", buildHematologyPayload(data));
    }
    if (slug === "laboratory-chemistry") {
      return fetchPrintPdf("laboratory-chemistry", buildChemistryPayload(data));
    }
    if (slug === "laboratory-urinalysis") {
      return fetchPrintPdf("laboratory-urinalysis", buildUrinalysisPayload(data));
    }
    if (slug === "laboratory-fecalysis") {
      return fetchPrintPdf("laboratory-fecalysis", buildFecalysisPayload(data));
    }
    return fetchPrintPdf("laboratory", buildLaboratoryPayload(data));
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
