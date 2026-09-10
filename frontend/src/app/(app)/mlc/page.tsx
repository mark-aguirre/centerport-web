"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import PersonalInfoSection, {
  STANDARD_PERSONAL_INFO_ROWS,
} from "@/components/common/personal-info-section";
import { SectionReveal } from "@/components/common/section-reveal";
import DeclarationSection from "@/components/mlc/DeclarationSection";
import FinalRecommendationSection from "@/components/mlc/FinalRecommendationSection";
import { useMlcForm } from "@/hooks/use-mlc-form";
import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { ReportMenu } from "@/components/mlc/ReportMenu";
import type { MlcRecord } from "@/components/mlc/types";

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

/** Sections shown on the authorized physician declaration form. */
const SECTIONS: SectionEntry<MlcRecord>[] = [
  { component: DeclarationSection, key: "declaration" },
  { component: FinalRecommendationSection, key: "recommendation" },
];

/**
 * MLC Health Certificate form content.
 *
 * Renders a personal info section (always disabled) before the
 * standard MLC form sections.
 */
function MlcFormContent() {
  const form = useMlcForm();

  // Personal info section is always read-only (data from profile)
  const preSections = (
    <SectionReveal index={0}>
      <PersonalInfoSection
        data={form.data}
        onChange={form.setData}
        rows={STANDARD_PERSONAL_INFO_ROWS}
        subtitle="From the selected seafarer profile"
        disabled
      />
    </SectionReveal>
  );

  return (
    <FormPage
      form={form}
      sections={SECTIONS}
      getBusinessId={(record) => record?.mlc_id}
      editGuard={(data) => !!data.last_name}
      preSections={preSections}
      printMenu={<ReportMenu data={form.existingRecord ?? form.data} />}
    />
  );
}

/**
 * MLC (Maritime Labour Convention) Health Certificate page.
 *
 * Wraps the form content in a Suspense boundary required by
 * Next.js App Router for components that use `useSearchParams`.
 */
export default function MlcPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <MlcFormContent />
    </Suspense>
  );
}
