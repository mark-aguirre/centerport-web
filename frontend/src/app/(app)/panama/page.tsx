"use client";

import { Suspense } from "react";
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
 * Panama Medical Certificate form content with full CRUD button behavior.
 *
 * Uses `usePanamaForm` hook for state management including
 * New/Edit/Save/Cancel/Print actions and view/edit mode transitions.
 * Renders animated section cards with fields disabled in view mode.
 */
function PanamaFormContent() {
  const {
    data,
    setData,
    loading,
    saving,
    editing,
    isExistingRecord,
    existingRecord,
    handleNew,
    handleEdit,
    handleCancel,
    handleSave,
    handlePrint,
  } = usePanamaForm();

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
        editing={editing}
        saving={saving}
        isExistingRecord={isExistingRecord}
        metadata={{
          recordId: existingRecord?.panama_id,
          createdDate: existingRecord?.created_date,
          createdLabel: "Created",
        }}
        onSave={handleSave}
        onCancel={handleCancel}
        onEdit={handleEdit}
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
            <Section data={data} onChange={setData} disabled={!editing} />
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
