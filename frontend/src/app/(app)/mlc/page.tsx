"use client";

import { Suspense, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import PersonalInfoSection, {
  STANDARD_PERSONAL_INFO_ROWS,
} from "@/components/common/personal-info-section";
import DeclarationSection from "@/components/mlc/DeclarationSection";
import FinalRecommendationSection from "@/components/mlc/FinalRecommendationSection";
import { useMlcForm } from "@/hooks/use-mlc-form";
import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { PrintDialog } from "@/components/mlc/PrintDialog";
import type { MlcRecord } from "@/components/mlc/types";

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

/** Sections shown on the authorized physician declaration form. */
const SECTIONS: SectionEntry<MlcRecord>[] = [
  { component: DeclarationSection, key: "declaration" },
  { component: FinalRecommendationSection, key: "recommendation" },
];

/** Staggered fade-in animation variant */
const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.06, duration: 0.25 },
  }),
};

/**
 * MLC Health Certificate form content.
 *
 * Renders a personal info section (always disabled) before the
 * standard MLC form sections.
 */
function MlcFormContent() {
  const form = useMlcForm();
  const [printDialogOpen, setPrintDialogOpen] = useState(false);

  const handlePrint = useCallback(() => {
    setPrintDialogOpen(true);
  }, []);

  // Personal info section is always read-only (data from profile)
  const preSections = (
    <motion.div
      custom={0}
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <PersonalInfoSection
        data={form.data}
        onChange={form.setData}
        rows={STANDARD_PERSONAL_INFO_ROWS}
        subtitle="From the selected seafarer profile"
        disabled
      />
    </motion.div>
  );

  return (
    <>
      <FormPage
        form={{ ...form, handlePrint }}
        sections={SECTIONS}
        getBusinessId={(record) => record?.mlc_id}
        editGuard={(data) => !!data.last_name}
        preSections={preSections}
      />
      <PrintDialog
        open={printDialogOpen}
        onClose={() => setPrintDialogOpen(false)}
        data={form.existingRecord ?? form.data}
      />
    </>
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
