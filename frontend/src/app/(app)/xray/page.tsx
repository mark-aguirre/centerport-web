"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { PatientRailCard } from "@/components/common/patient-rail-card";
import { usePatientPhoto } from "@/hooks/use-patient-photo";
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

/**
 * X-Ray report form content.
 *
 * Two-column layout like the other module pages: the patient summary fixed in
 * the left rail, the report cards scrolling on the right. There is no section
 * navigator — the report is patient information plus a single result card.
 */
function XrayFormContent() {
  const form = useXrayForm();

  const { data } = form;

  // The record carries the photo for saved reports; fall back to the linked
  // profile when it does not (older records predate the field being filled).
  const fallbackPhoto = usePatientPhoto(
    data.photo_url ? undefined : data.seafarer_profile_id
  );

  const patientName = [data.last_name, data.first_name]
    .filter(Boolean)
    .join(", ");

  return (
    <FormPage
      form={form}
      sections={SECTIONS}
      getBusinessId={(record) => record?.report_id}
      editGuard={(record) => !!record.last_name}
      navRail={
        <PatientRailCard
          photoUrl={data.photo_url || fallbackPhoto}
          name={patientName}
          recordId={form.existingRecord?.report_id}
          gender={data.gender}
          age={data.age}
        />
      }
    />
  );
}
