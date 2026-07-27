"use client";

import { Suspense } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

import PersonalInfoSection from "@/components/medical/PersonalInfoSection";
import PhysicalExaminationSection from "@/components/medical/PhysicalExaminationSection";

import { useMedicalForm } from "@/hooks/use-medical-form";
import { PageContainer } from "@/components/common/page-container";
import { FormToolbar } from "@/components/common/form-toolbar";
import type { MedicalSectionProps } from "@/components/medical/types";
import type { SearchResultItem } from "@/components/common/form-toolbar";

/**
 * Registry entry for a form section rendered on the Medical Examination page.
 */
interface SectionEntry {
  component: React.ComponentType<MedicalSectionProps>;
  key: string;
}

/**
 * Ordered list of form sections rendered on the Medical Examination page.
 */
const SECTIONS: SectionEntry[] = [
  { component: PersonalInfoSection, key: "personal" },
  { component: PhysicalExaminationSection, key: "physical-exam" },
];

/**
 * Medical Examination form content with full CRUD button behavior.
 *
 * Uses `useMedicalForm` hook for state management including
 * New/Edit/Save/Cancel/Print actions and view/edit mode transitions.
 * Renders animated section cards with fields disabled in view mode.
 */
function MedicalFormContent() {
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
  } = useMedicalForm();

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
          recordId: existingRecord?.exam_id,
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
