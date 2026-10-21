"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { useImmunologyForm } from "@/hooks/use-immunology-form";
import type { ImmunologyReport } from "@/components/immunology/types";

import { ReportMenu } from "@/components/immunology/ReportMenu";
import PatientInformationSection from "@/components/immunology/PatientInformationSection";
import ImmunologyTestSection from "@/components/immunology/ImmunologyTestSection";

/** Ordered list of section components rendered on the immunology form page. */
const SECTIONS: SectionEntry<ImmunologyReport>[] = [
  { component: PatientInformationSection, key: "patient-info" },
  { component: ImmunologyTestSection, key: "immunology-test" },
];

/** Immunology Report page with full CRUD form. */
export default function ImmunologyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <ImmunologyFormContent />
    </Suspense>
  );
}

function ImmunologyFormContent() {
  const form = useImmunologyForm();

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
