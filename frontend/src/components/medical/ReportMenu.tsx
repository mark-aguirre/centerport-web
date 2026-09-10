"use client";

import { api } from "@/lib/api";
import { fetchPrintPdf } from "@/lib/print-request";
import {
  ReportPrintMenu,
  type ReportMenuOption,
} from "@/components/common/report-print-menu";
import { buildReportPayload, type ReportSlug } from "@/components/medical/printPayload";
import type { MedicalExam } from "@/components/medical/types";

/**
 * A seabase report option, tagged with the engine that renders it.
 *
 * - `"printio"` — the client builds a flat payload and posts it to the matching
 *   Next.js print route, which proxies to PrintIO (needs the full record).
 * - `"backend"` — the backend JasperReports service renders the PDF from the
 *   persisted record (needs the record id).
 */
interface SeabaseReport extends ReportMenuOption {
  engine: "printio" | "backend";
}

/** Available seabase report types, in display order. */
const REPORT_OPTIONS: readonly SeabaseReport[] = [
  {
    slug: "seabase-summary",
    label: "Summary Report",
    description: "Results and recommendation overview",
    engine: "printio",
  },
  {
    slug: "seabase-detailed",
    label: "Detailed Report",
    description: "Complete medical examination with all sections",
    engine: "printio",
  },
  {
    slug: "seabase-mlc",
    label: "MLC Certificate",
    description: "Maritime Labour Convention medical certificate",
    engine: "printio",
  },
  {
    slug: "seabase-mer",
    label: "MER Form",
    description: "Medical Examination Report",
    engine: "printio",
  },
] as const;

interface ReportMenuProps {
  /** UUID of the current medical exam record (used by backend reports). */
  examId: string | undefined;
  /** Current medical exam record, used to build the PrintIO payload. */
  data: MedicalExam | null;
}

/**
 * Seabase print dropdown content for the toolbar Print button.
 *
 * Supplies the seabase report options to the shared {@link ReportPrintMenu} and
 * implements `onGenerate`: PrintIO reports build a payload and return the PDF
 * blob (previewed), while backend reports trigger the JasperReports download and
 * return `null`.
 *
 * @see buildReportPayload — builds the PrintIO payload per report slug
 */
export function ReportMenu({ examId, data }: ReportMenuProps) {
  const hasRecord = !!data?.last_name;

  const options: ReportMenuOption[] = REPORT_OPTIONS.map((option) => ({
    ...option,
    disabled: option.engine === "printio" ? !hasRecord : !examId,
  }));

  const onGenerate = async (slug: string): Promise<Blob | null> => {
    const option = REPORT_OPTIONS.find((o) => o.slug === slug);
    if (!option) return null;

    if (option.engine === "printio") {
      if (!data || !data.last_name) {
        throw new Error("No record loaded. Please select or save a record first.");
      }
      const payload = await buildReportPayload(slug as ReportSlug, data);
      return fetchPrintPdf(slug, payload);
    }

    if (!examId) {
      throw new Error("No record loaded. Please select or save a record first.");
    }
    await api.entities.MedicalExam.generateReport(examId, slug);
    return null;
  };

  return (
    <ReportPrintMenu
      options={options}
      onGenerate={onGenerate}
      disabled={!hasRecord && !examId}
      emptyHint="No record loaded. Search for a patient or save a new record to enable printing."
    />
  );
}
