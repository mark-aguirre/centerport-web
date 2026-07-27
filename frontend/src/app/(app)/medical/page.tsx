"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import PersonalInfoSection from "@/components/medical/PersonalInfoSection";
import PhysicalExaminationSection from "@/components/medical/PhysicalExaminationSection";
import { useMedicalForm } from "@/hooks/use-medical-form";
import { FormPage, type SectionEntry } from "@/components/common/form-page";
import type { MedicalExam, MedicalSectionProps } from "@/components/medical/types";

/**
 * Ordered list of form sections rendered on the Medical Examination page.
 */
const SECTIONS: SectionEntry<MedicalExam>[] = [
  { component: PersonalInfoSection as React.ComponentType<MedicalSectionProps>, key: "personal" },
  { component: PhysicalExaminationSection, key: "physical-exam" },
];

/**
 * Medical Examination form content with full CRUD button behavior.
 */
function MedicalFormContent() {
  const form = useMedicalForm();

  return (
    <FormPage
      form={form}
      sections={SECTIONS}
      getBusinessId={(record) => record?.exam_id}
      editGuard={(data) => !!data.last_name}
    />
  );
}

/**
 * Medical Examination page.
 *
 * Wraps the form content in a Suspense boundary to handle the
 * `useSearchParams` hook requirement in Next.js App Router.
 */
export default function MedicalPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <MedicalFormContent />
    </Suspense>
  );
}
