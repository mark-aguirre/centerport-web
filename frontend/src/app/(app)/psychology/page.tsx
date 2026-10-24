"use client";

import { Suspense, useMemo } from "react";
import { Loader2 } from "lucide-react";

import { PatientRailCard } from "@/components/common/patient-rail-card";
import { SectionNav, type SectionNavItem } from "@/components/common/section-nav";
import {
  PSYCHOLOGY_SECTIONS,
  psychologyAnchorId,
} from "@/components/psychology/section-config";
import { usePatientPhoto } from "@/hooks/use-patient-photo";
import { usePsychologyForm } from "@/hooks/use-psychology-form";
import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { ReportMenu } from "@/components/psychology/ReportMenu";
import type { PsychologyRecord } from "@/components/psychology/types";

/**
 * Ordered list of form sections rendered on the Psychology Evaluation page.
 *
 * Derived from {@link PSYCHOLOGY_SECTIONS} so the left-rail navigator and the
 * content column stay in sync from one source.
 */
const SECTIONS: SectionEntry<PsychologyRecord>[] = PSYCHOLOGY_SECTIONS.map(
  ({ key, component }) => ({ key, component })
);

/**
 * Psychology evaluation form content with full CRUD toolbar.
 *
 * Two-column layout like the other module pages: patient summary and section
 * navigator fixed in the left rail, the evaluation cards scrolling on the
 * right. Patient Information gets no navigator entry — it is the first card in
 * the column and always visible.
 */
function PsychologyFormContent() {
  const form = usePsychologyForm();

  const navItems = useMemo<SectionNavItem[]>(
    () =>
      PSYCHOLOGY_SECTIONS.filter((section) => section.key !== "personal").map(
        ({ key, label, icon }) => ({ key, label, icon })
      ),
    []
  );

  const { data } = form;

  // The evaluation stores only the seafarer's profile UUID, so the rail card's
  // photo comes from the profile rather than the record.
  const patientPhoto = usePatientPhoto(data.seafarer_profile_id);

  const patientName = [data.last_name, data.first_name]
    .filter(Boolean)
    .join(", ");

  return (
    <FormPage
      form={form}
      sections={SECTIONS}
      getBusinessId={(record) => record?.eval_id}
      editGuard={(record) => !!record.last_name}
      navRail={
        /* Patient summary above the section navigator. The rail sits outside
           the scrolling column, so nothing here needs `sticky` — hence
           SectionNav's own sticky positioning is cancelled with `static`. */
        <div className="space-y-3">
          <PatientRailCard
            photoUrl={patientPhoto}
            name={patientName}
            recordId={form.existingRecord?.eval_id}
            gender={data.gender}
            age={data.age}
          />
          <SectionNav
            items={navItems}
            anchorId={psychologyAnchorId}
            ariaLabel="Evaluation sections"
            className="static"
          />
        </div>
      }
      printMenu={<ReportMenu data={form.existingRecord ?? form.data} />}
    />
  );
}

/**
 * Psychology Evaluation page route component.
 *
 * Wraps the form content in a Suspense boundary required by
 * Next.js App Router for components that use `useSearchParams`.
 */
export default function PsychologyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <PsychologyFormContent />
    </Suspense>
  );
}
