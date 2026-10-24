"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { useUltrasoundForm } from "@/hooks/use-ultrasound-form";
import type { UltrasoundReport } from "@/components/ultrasound/types";

import RadiologyPatientInformationSection from "@/components/radiology/PatientInformationSection";
import UltrasoundResultSection from "@/components/ultrasound/UltrasoundResultSection";

/** Ordered list of section components rendered on the Ultrasound form page. */
const SECTIONS: SectionEntry<UltrasoundReport>[] = [
  { component: RadiologyPatientInformationSection, key: "patient-info" },
  { component: UltrasoundResultSection, key: "ultrasound-result" },
];

/** Ultrasound Result page with full CRUD form. */
export default function UltrasoundPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <UltrasoundFormContent />
    </Suspense>
  );
}

function UltrasoundFormContent() {
  const form = useUltrasoundForm();

  return (
    <FormPage
      form={form}
      sections={SECTIONS}
      getBusinessId={(record) => record?.report_id}
      editGuard={(data) => !!data.last_name}
    />
  );
}
