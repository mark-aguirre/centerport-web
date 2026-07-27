"use client";

import { Suspense } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SearchResultItem } from "@/components/common/form-toolbar";
import type { LandbaseSectionProps } from "@/components/landbase/types";

/**
 * Registry entry mapping a section component to its stable key.
 * Used to render sections in order with proper React keys.
 */
interface SectionEntry {
  component: React.ComponentType<LandbaseSectionProps>;
  key: string;
}

/**
 * Ordered list of form sections rendered on the Landbase PEME page.
 *
 * Each entry is a section component that receives the shared
 * `LandbaseSectionProps` (data, onChange, disabled). Adding or
 * reordering sections only requires changing this array.
 */
const SECTIONS: SectionEntry[] = [
  { component: PersonalInfoSection, key: "personal" },
  { component: PastMedicalHistorySection, key: "medical-history" },
  { component: QuestionnaireSection, key: "questionnaire" },
  { component: AncillaryExaminationsSection, key: "ancillary" },
  { component: RemarksSection, key: "remarks" },
  { component: ResultsSection, key: "results" },
  { component: RecommendationSection, key: "recommendation" },
];

/** Staggered fade-in animation for section cards on initial mount. */
const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.06, duration: 0.25 },
  }),
};

/**
 * Landbase PEME form content with full CRUD toolbar.
 *
 * Orchestrates the form layout: toolbar at top, validation alert,
 * and all medical form sections rendered as animated cards.
 *
 * State management:
 * - Uses `useLandbaseForm` for CRUD operations, mode transitions,
 *   and seafarer profile search integration
 * - Sections receive shared props (data, onChange, disabled) and
 *   handle their own field-level updates
 *
 * @see useLandbaseForm — form state machine and API interaction
 * @see FormToolbar — CRUD buttons and search input
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
    searchResults,
    searchLoading,
    handleSearch,
    handleSelectResult,
    saveAlert,
  } = useLandbaseForm();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PageContainer>
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
        onEdit={data.last_name ? handleEdit : undefined}
        onNew={handleNew}
        onPrint={handlePrint}
        onSearch={handleSearch}
        searchResults={searchResults}
        searchLoading={searchLoading}
        onSelectResult={handleSelectResult as (result: SearchResultItem) => void}
      />

      {saveAlert && (
        <Alert variant="destructive" className="mt-3">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{saveAlert}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {SECTIONS.map(({ component: Section, key }, index) => (
          <motion.div
            key={key}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <Section data={data} onChange={setData} disabled={!editing} />
          </motion.div>
        ))}
      </div>
    </PageContainer>
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
