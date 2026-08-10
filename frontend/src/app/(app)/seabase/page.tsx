"use client";

import { Suspense, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import PersonalInfoSection from "@/components/common/personal-info-section";
import type { RowConfig } from "@/components/common/personal-info-section";
import PhysicalExaminationSection from "@/components/medical/PhysicalExaminationSection";
import { useMedicalForm } from "@/hooks/use-medical-form";
import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { PrintDialog } from "@/components/medical/PrintDialog";
import type { MedicalExam, MedicalSectionProps } from "@/components/medical/types";

// ---------------------------------------------------------------------------
// Personal info configuration (same layout as MLC page)
// ---------------------------------------------------------------------------

const SEABASE_PERSONAL_ROWS: RowConfig[] = [
  [
    { field: "last_name", label: "Last Name", required: true },
    { field: "first_name", label: "First Name", required: true },
    { field: "middle_name", label: "Middle Name" },
  ],
  [
    { field: "place_of_birth", label: "Place of Birth" },
    { field: "passport_no", label: "Passport No." },
    { field: "religion", label: "Religion" },
  ],
  [
    { field: "nationality", label: "Nationality" },
    { field: "gender", label: "Gender", options: ["Male", "Female"] },
    { field: "civil_status", label: "Civil Status", options: ["Single", "Married", "Widowed", "Separated"] },
  ],
  [
    { field: "address", label: "Address" },
    { field: "contact_no", label: "Contact No." },
  ],
  [
    { field: "employer", label: "Employer" },
    { field: "position", label: "Position" },
  ],
];

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

const SECTIONS: SectionEntry<MedicalExam>[] = [
  { component: PhysicalExaminationSection, key: "physical-exam" },
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
 * Seabase Medical Examination form content with full CRUD button behavior.
 */
function SeabaseFormContent() {
  const form = useMedicalForm();
  const [printDialogOpen, setPrintDialogOpen] = useState(false);

  const handlePrint = useCallback(() => {
    setPrintDialogOpen(true);
  }, []);

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
        rows={SEABASE_PERSONAL_ROWS}
        disabled={true}
      />
    </motion.div>
  );

  return (
    <>
      <FormPage
        form={{ ...form, handlePrint }}
        sections={SECTIONS}
        getBusinessId={(record) => record?.exam_id}
        editGuard={(data) => !!data.last_name}
        preSections={preSections}
      />
      <PrintDialog
        open={printDialogOpen}
        onClose={() => setPrintDialogOpen(false)}
        examId={form.existingRecord?.id}
      />
    </>
  );
}

/**
 * Seabase (Seafarer's Medical Examination) page.
 *
 * Wraps the form content in a Suspense boundary to handle the
 * `useSearchParams` hook requirement in Next.js App Router.
 */
export default function SeabasePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <SeabaseFormContent />
    </Suspense>
  );
}
