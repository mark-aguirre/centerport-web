"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { useLaboratoryForm } from "@/hooks/use-laboratory-form";
import type { LaboratoryReport } from "@/components/laboratory/types";

import PatientInformationSection from "@/components/laboratory/PatientInformationSection";
import HematologySection from "@/components/laboratory/HematologySection";
import ClinicalChemistrySection from "@/components/laboratory/ClinicalChemistrySection";
import UrinalysisSection from "@/components/laboratory/UrinalysisSection";
import FecalysisSection from "@/components/laboratory/FecalysisSection";

/** Ordered list of section components rendered on the laboratory form page. */
const SECTIONS: SectionEntry<LaboratoryReport>[] = [
  { component: PatientInformationSection, key: "patient-info" },
  { component: HematologySection, key: "hematology" },
  { component: ClinicalChemistrySection, key: "clinical-chemistry" },
  { component: UrinalysisSection, key: "urinalysis" },
  { component: FecalysisSection, key: "fecalysis" },
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
    />
  );
}
