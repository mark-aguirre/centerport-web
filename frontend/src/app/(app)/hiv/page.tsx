"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { PatientRailCard } from "@/components/common/patient-rail-card";
import { usePatientPhoto } from "@/hooks/use-patient-photo";
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

/**
 * HIV report form content.
 *
 * Two-column layout like the other module pages: the patient summary fixed in
 * the left rail, the report cards scrolling on the right. There is no section
 * navigator here — the report is two cards, and the screen test is a single
 * short block, so there is nothing to jump between.
 */
function HivFormContent() {
  const form = useHivForm();

  const { data } = form;

  // The HIV report stores only the seafarer's profile UUID, so the rail
  // card's photo comes from the profile rather than the report.
  const patientPhoto = usePatientPhoto(data.seafarer_profile_id);

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
          photoUrl={patientPhoto}
          name={patientName}
          recordId={form.existingRecord?.report_id}
          gender={data.gender}
          age={data.age}
        />
      }
      printMenu={<ReportMenu data={form.existingRecord ?? form.data} />}
    />
  );
}
