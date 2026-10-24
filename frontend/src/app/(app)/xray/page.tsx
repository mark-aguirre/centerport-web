"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { useXrayForm } from "@/hooks/use-xray-form";
import type { XrayReport } from "@/components/xray/types";

import RadiologyPatientInformationSection from "@/components/radiology/PatientInformationSection";
import XrayResultSection from "@/components/xray/XrayResultSection";

/** Ordered list of section components rendered on the X-Ray form page. */
const SECTIONS: SectionEntry<XrayReport>[] = [
  { component: RadiologyPatientInformationSection, key: "patient-info" },
  { component: XrayResultSection, key: "xray-result" },
];

/** X-Ray Result page with full CRUD form. */
export default function XrayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <XrayFormContent />
    </Suspense>
  );
}

function XrayFormContent() {
  const form = useXrayForm();

  return (
    <FormPage
      form={form}
      sections={SECTIONS}
      getBusinessId={(record) => record?.report_id}
      editGuard={(data) => !!data.last_name}
    />
  );
}
