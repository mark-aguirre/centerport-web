"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { useLaboratoryForm } from "@/hooks/use-laboratory-form";
import type { LaboratoryReport } from "@/components/laboratory/types";

import { ReportMenu } from "@/components/laboratory/ReportMenu";
import PatientInformationSection from "@/components/laboratory/PatientInformationSection";
import LaboratoryReportTabs from "@/components/laboratory/LaboratoryReportTabs";

/**
 * Ordered list of section components rendered on the laboratory form page.
 *
 * Patient Information stays at the top; the four laboratory result sections
 * (Hematology, Clinical Chemistry & Serology/Immunology, Urinalysis, and
 * Fecalysis) are grouped into a tabbed interface below it.
 */
const SECTIONS: SectionEntry<LaboratoryReport>[] = [
  { component: PatientInformationSection, key: "patient-info" },
  { component: LaboratoryReportTabs, key: "laboratory-report-tabs" },
];

/** Laboratory Report page with full CRUD form. */
export default function LaboratoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <LaboratoryFormContent />
    </Suspense>
  );
}

function LaboratoryFormContent() {
  const form = useLaboratoryForm();

  return (
    <FormPage
      form={form}
      sections={SECTIONS}
      getBusinessId={(record) => record?.report_id}
      editGuard={(data) => !!data.last_name}
      printMenu={<ReportMenu data={form.existingRecord ?? form.data} />}
    />
  );
}
