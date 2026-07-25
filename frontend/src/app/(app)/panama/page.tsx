"use client";

import { Suspense, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import GeneralInfoSection from "@/components/panama/GeneralInfoSection";
import PersonalDeclarationSection from "@/components/panama/PersonalDeclarationSection";
import StatementSection from "@/components/panama/StatementSection";
import MedicalExaminationSection from "@/components/panama/MedicalExaminationSection";
import DiagnosticTestsSection from "@/components/panama/DiagnosticTestsSection";
import FitnessAssessmentSection from "@/components/panama/FitnessAssessmentSection";
import { usePanamaForm } from "@/hooks/use-panama-form";
import { PageContainer } from "@/components/common/page-container";
import { FormToolbar } from "@/components/common/form-toolbar";
import type { PanamaSectionProps } from "@/components/panama/types";

type SectionEntry = {
  component: React.ComponentType<PanamaSectionProps>;
  key: string;
};

const SECTIONS: SectionEntry[] = [
  { component: GeneralInfoSection, key: "general-info" },
  { component: PersonalDeclarationSection, key: "personal-declaration" },
  { component: StatementSection, key: "statement" },
  { component: MedicalExaminationSection, key: "medical-examination" },
  { component: DiagnosticTestsSection, key: "diagnostic-tests" },
  { component: FitnessAssessmentSection, key: "fitness-assessment" },
];

/**
 * Panama Medical Certificate form content with data loading and save logic.
 *
 * Uses `usePanamaForm` hook for state management. Renders animated
 * section cards with CRUD actions in the top toolbar.
 */
function PanamaFormContent() {
  const router = useRouter();
  const { data, setData, loading, saving, isEditing, existingRecord, handleSave } =
    usePanamaForm();

  const handleNew = useCallback(() => router.push("/panama"), [router]);
  const handlePrint = useCallback(() => window.print(), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PageContainer className="max-w-7xl">
      
      <FormToolbar
        editing={true}
        saving={saving}
        isExistingRecord={isEditing}
        metadata={{
          recordId: existingRecord?.panama_id,
          createdDate: existingRecord?.created_date,
          createdLabel: "Created",
        }}
        onSave={handleSave}
        onNew={handleNew}
        onPrint={handlePrint}
      />

      {/* Section Cards */}
      <div className="space-y-3">
        {SECTIONS.map(({ component: Section, key }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.25 }}
          >
            <Section data={data} onChange={setData} />
          </motion.div>
        ))}
      </div>
    </PageContainer>
  );
}

/**
 * Panama Medical Certificate page.
 *
 * Wraps the form content in a Suspense boundary to handle the
 * `useSearchParams` hook requirement in Next.js App Router.
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
