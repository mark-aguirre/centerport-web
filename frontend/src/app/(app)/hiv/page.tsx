"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { useHivForm } from "@/hooks/use-hiv-form";
import type { HivReport } from "@/components/hiv/types";

import { ReportMenu } from "@/components/hiv/ReportMenu";
import PatientInformationSection from "@/components/hiv/PatientInformationSection";
import HivScreenTestSection from "@/components/hiv/HivScreenTestSection";

/** Ordered list of section components rendered on the HIV form page. */
const SECTIONS: SectionEntry<HivReport>[] = [
  { component: PatientInformationSection, key: "patient-info" },
  { component: HivScreenTestSection, key: "hiv-screen-test" },
];

/** HIV Report page with full CRUD form. */
export default function HivPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <HivFormContent />
    </Suspense>
  );
}

function HivFormContent() {
  const form = useHivForm();

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
