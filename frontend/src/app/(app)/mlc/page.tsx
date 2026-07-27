"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import PersonalInfoSection from "@/components/common/personal-info-section";
import type { RowConfig } from "@/components/common/personal-info-section";
import SeafarerDetailsSection from "@/components/mlc/SeafarerDetailsSection";
import CertificateDetailsSection from "@/components/mlc/CertificateDetailsSection";
import DeclarationSection from "@/components/mlc/DeclarationSection";
import FinalRecommendationSection from "@/components/mlc/FinalRecommendationSection";
import { useMlcForm } from "@/hooks/use-mlc-form";
import { FormPage, type SectionEntry } from "@/components/common/form-page";
import type { MlcRecord, MlcSectionProps } from "@/components/mlc/types";

// ---------------------------------------------------------------------------
// Personal info configuration (always read-only from profile)
// ---------------------------------------------------------------------------

/** MLC personal info row layout */
const MLC_PERSONAL_ROWS: RowConfig[] = [
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

/** Grid overrides for rows that need custom proportions */
const MLC_GRID_OVERRIDES: Record<number, string> = {
  3: "grid-cols-[3fr_2fr]",
  4: "grid-cols-[3fr_2fr]",
};

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

/** MLC-specific sections (personal info rendered separately) */
const SECTIONS: SectionEntry<MlcRecord>[] = [
  { component: SeafarerDetailsSection as React.ComponentType<MlcSectionProps>, key: "seafarer-details" },
  { component: CertificateDetailsSection, key: "certificate-details" },
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
        rows={MLC_PERSONAL_ROWS}
        gridOverrides={MLC_GRID_OVERRIDES}
        disabled={true}
      />
    </motion.div>
  );

  return (
    <FormPage
      form={form}
      sections={SECTIONS}
      getBusinessId={(record) => record?.mlc_id}
      editGuard={(data) => !!data.last_name}
      preSections={preSections}
    />
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
