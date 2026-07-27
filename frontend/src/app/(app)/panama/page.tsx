"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import GeneralInfoSection from "@/components/panama/GeneralInfoSection";
import PersonalDeclarationSection from "@/components/panama/PersonalDeclarationSection";
import StatementSection from "@/components/panama/StatementSection";
import MedicalExaminationSection from "@/components/panama/MedicalExaminationSection";
import DiagnosticTestsSection from "@/components/panama/DiagnosticTestsSection";
import FitnessAssessmentSection from "@/components/panama/FitnessAssessmentSection";
import { usePanamaForm } from "@/hooks/use-panama-form";
import { FormPage, type SectionEntry } from "@/components/common/form-page";
import type { PanamaCertificate, PanamaSectionProps } from "@/components/panama/types";

/**
 * Ordered list of form sections rendered on the Panama certificate page.
 */
const SECTIONS: SectionEntry<PanamaCertificate>[] = [
  { component: GeneralInfoSection as React.ComponentType<PanamaSectionProps>, key: "general-info" },
  { component: PersonalDeclarationSection, key: "personal-declaration" },
  { component: StatementSection, key: "statement" },
  { component: MedicalExaminationSection, key: "medical-examination" },
  { component: DiagnosticTestsSection, key: "diagnostic-tests" },
  { component: FitnessAssessmentSection, key: "fitness-assessment" },
];

/**
 * Panama Medical Certificate form content with full CRUD toolbar.
 */
function PanamaFormContent() {
  const form = usePanamaForm();

  return (
    <FormPage
      form={form}
      sections={SECTIONS}
      getBusinessId={(record) => record?.panama_id}
      editGuard={(data) => !!data.full_name}
    />
  );
}

/**
 * Panama Medical Certificate page route component.
 *
 * Wraps the form content in a Suspense boundary required by
 * Next.js App Router for components that use `useSearchParams`.
 */
export default function PanamaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <PanamaFormContent />
    </Suspense>
  );
}
