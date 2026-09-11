"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import PersonalInfoSection from "@/components/psychology/PersonalInfoSection";
import ExaminationDetailsSection from "@/components/psychology/ExaminationDetailsSection";
import IntellectualLevelSection from "@/components/psychology/IntellectualLevelSection";
import PersonalityTraitsSection from "@/components/psychology/PersonalityTraitsSection";
import ConclusionSection from "@/components/psychology/ConclusionSection";
import { usePsychologyForm } from "@/hooks/use-psychology-form";
import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { ReportMenu } from "@/components/psychology/ReportMenu";
import type { PsychologyRecord, PsychologySectionProps } from "@/components/psychology/types";

/**
 * Ordered list of form sections rendered on the Psychology Evaluation page.
 *
 * Matches the standard psychological evaluation form layout:
 * - Patient Information (read-only, from profile)
 * - Examination Details (date, psychometrician, psychologist, tests used)
 * - I. Intellectual Level (radio classification)
 * - II. Personality Traits and Characteristics (1-7 rating grid)
 * - III. Conclusion/Remarks (recommendation radio + notes)
 */
const SECTIONS: SectionEntry<PsychologyRecord>[] = [
  { component: PersonalInfoSection as React.ComponentType<PsychologySectionProps>, key: "personal" },
  { component: ExaminationDetailsSection, key: "examination-details" },
  { component: IntellectualLevelSection, key: "intellectual-level" },
  { component: PersonalityTraitsSection, key: "personality-traits" },
  { component: ConclusionSection, key: "conclusion" },
];

/**
 * Psychology evaluation form content with full CRUD toolbar.
 */
function PsychologyFormContent() {
  const form = usePsychologyForm();

  return (
    <FormPage
      form={form}
      sections={SECTIONS}
      getBusinessId={(record) => record?.eval_id}
      editGuard={(data) => !!data.last_name}
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
