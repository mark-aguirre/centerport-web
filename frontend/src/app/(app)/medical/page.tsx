"use client";

import { Suspense, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import PersonalInfoSection from "@/components/medical/PersonalInfoSection";
import PhysicalExaminationSection from "@/components/medical/PhysicalExaminationSection";
import { useMedicalForm } from "@/hooks/use-medical-form";
import { PageContainer } from "@/components/common/page-container";
import { FormToolbar } from "@/components/common/form-toolbar";
import type { MedicalSectionProps } from "@/components/medical/types";

/**
 * Registry entry for a form section rendered on the Medical Examination page.
 *
 * Each entry maps a React component to a unique key used for animation
 * staggering and React reconciliation.
 */
interface SectionEntry {
  /** The form section component to render */
  component: React.ComponentType<MedicalSectionProps>;
  /** Unique key for React reconciliation and animation stagger */
  key: string;
}

/**
 * Ordered list of form sections rendered on the Medical Examination page.
 *
 * Add new sections here to include them in the form. Order determines
 * visual sequence and animation stagger timing.
 */
const SECTIONS: SectionEntry[] = [
  { component: PersonalInfoSection, key: "personal" },
  { component: PhysicalExaminationSection, key: "physical-exam" },
];

/**
 * Medical Examination form content with data loading and save logic.
 *
 * Uses `useMedicalForm` hook for state management and localStorage
 * persistence. Renders animated section cards with CRUD actions in
 * the top toolbar (save, new, print).
 *
 * @see useMedicalForm — manages form state, loading, and save
 * @see PersonalInfoSection — personal info fields
 * @see PhysicalExaminationSection — physical exam orchestrator
 */
function MedicalFormContent() {
  const router = useRouter();
  const { data, setData, loading, saving, isEditing, existingRecord, handleSave } =
    useMedicalForm();

  const handleNew = useCallback(() => router.push("/medical"), [router]);
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
          recordId: existingRecord?.exam_id,
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
 * Medical Examination page.
 *
 * Wraps the form content in a Suspense boundary to handle the
 * `useSearchParams` hook requirement in Next.js App Router.
 * Displays a spinner fallback while the client component hydrates.
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
