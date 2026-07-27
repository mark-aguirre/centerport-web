"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import PersonalInfoSection from "@/components/landbase/PersonalInfoSection";
import PastMedicalHistorySection from "@/components/landbase/PastMedicalHistorySection";
import QuestionnaireSection from "@/components/landbase/QuestionnaireSection";
import AncillaryExaminationsSection from "@/components/landbase/AncillaryExaminationsSection";
import RemarksSection from "@/components/landbase/RemarksSection";
import ResultsSection from "@/components/landbase/ResultsSection";
import RecommendationSection from "@/components/landbase/RecommendationSection";
import { useLandbaseForm } from "@/hooks/use-landbase-form";
import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { PemeSelector } from "@/components/landbase/PemeSelector";
import type { LandbasePeme, LandbaseSectionProps } from "@/components/landbase/types";

/**
 * Ordered list of form sections rendered on the Landbase PEME page.
 */
const SECTIONS: SectionEntry<LandbasePeme>[] = [
  { component: PersonalInfoSection as React.ComponentType<LandbaseSectionProps>, key: "personal" },
  { component: PastMedicalHistorySection, key: "medical-history" },
  { component: QuestionnaireSection, key: "questionnaire" },
  { component: AncillaryExaminationsSection, key: "ancillary" },
  { component: RemarksSection, key: "remarks" },
  { component: ResultsSection, key: "results" },
  { component: RecommendationSection, key: "recommendation" },
];

/**
 * Landbase PEME form content with full CRUD toolbar.
 */
function LandbaseFormContent() {
  const form = useLandbaseForm();

  const metadataSlot = form.profilePemes.length >= 2 ? (
    <PemeSelector
      items={form.profilePemes}
      selectedId={form.existingRecord?.id}
      onSelect={form.handleSelectPeme}
      disabled={form.editing}
    />
  ) : undefined;

  return (
    <FormPage
      form={form}
      sections={SECTIONS}
      getBusinessId={(record) => record?.peme_id}
      editGuard={(data) => !!data.last_name}
      metadataSlot={metadataSlot}
    />
  );
}

/**
 * Landbase PEME page route component.
 *
 * Wraps the form content in a Suspense boundary required by
 * Next.js App Router for components that use `useSearchParams`.
 */
export default function LandbasePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <LandbaseFormContent />
    </Suspense>
  );
}
