"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import PersonalInfoSection from "@/components/landbase/PersonalInfoSection";
import PastMedicalHistorySection from "@/components/landbase/PastMedicalHistorySection";
import QuestionnaireSection from "@/components/landbase/QuestionnaireSection";
import AncillaryExaminationsSection from "@/components/landbase/AncillaryExaminationsSection";
import RemarksSection from "@/components/landbase/RemarksSection";
import ResultsSection from "@/components/landbase/ResultsSection";
import RecommendationSection from "@/components/landbase/RecommendationSection";
import { useLandbaseForm } from "@/hooks/use-landbase-form";
import { PageContainer } from "@/components/common/page-container";
import { FormToolbar } from "@/components/common/form-toolbar";
import type { LandbaseSectionProps } from "@/components/landbase/types";

type SectionEntry = {
  component: React.ComponentType<LandbaseSectionProps>;
  key: string;
};

const SECTIONS: SectionEntry[] = [
  { component: PersonalInfoSection, key: "personal" },
  { component: PastMedicalHistorySection, key: "medical-history" },
  { component: QuestionnaireSection, key: "questionnaire" },
  { component: AncillaryExaminationsSection, key: "ancillary" },
  { component: RemarksSection, key: "remarks" },
  { component: ResultsSection, key: "results" },
  { component: RecommendationSection, key: "recommendation" },
];

/**
 * Landbase PEME form content with full CRUD button behavior.
 *
 * Uses `useLandbaseForm` hook for state management including
 * New/Edit/Save/Cancel/Print actions and view/edit mode transitions.
 * Renders animated section cards with fields disabled in view mode.
 */
function LandbaseFormContent() {
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
  } = useLandbaseForm();

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
          recordId: existingRecord?.peme_id,
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
 * Landbase PEME page.
 *
 * Wraps the form content in a Suspense boundary to handle the
 * `useSearchParams` hook requirement in Next.js App Router.
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
