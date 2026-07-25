"use client";

import { Suspense, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import PersonalInfoSection from "@/components/common/personal-info-section";
import type { RowConfig } from "@/components/common/personal-info-section";
import DeclarationSection from "@/components/mlc/DeclarationSection";
import FinalRecommendationSection from "@/components/mlc/FinalRecommendationSection";
import { useMlcForm } from "@/hooks/use-mlc-form";
import { PageContainer } from "@/components/common/page-container";
import { FormToolbar } from "@/components/common/form-toolbar";
import type { MlcSectionProps } from "@/components/mlc/types";

/** MLC personal info row layout — same as landbase */
const MLC_PERSONAL_ROWS: RowConfig[] = [
  // Row 1: Name
  [
    { field: "last_name", label: "Last Name", required: true },
    { field: "first_name", label: "First Name", required: true },
    { field: "middle_name", label: "Middle Name" },
  ],
  // Row 2: Place of Birth, Passport No, Religion
  [
    { field: "place_of_birth", label: "Place of Birth" },
    { field: "passport_no", label: "Passport No." },
    { field: "religion", label: "Religion" },
  ],
  // Row 3: Nationality, Gender, Civil Status
  [
    { field: "nationality", label: "Nationality" },
    { field: "gender", label: "Gender", options: ["Male", "Female"] },
    { field: "civil_status", label: "Civil Status", options: ["Single", "Married", "Widowed", "Separated"] },
  ],
  // Row 4: Address, Contact No
  [
    { field: "address", label: "Address" },
    { field: "contact_no", label: "Contact No." },
  ],
  // Row 5: Employer, Position
  [
    { field: "employer", label: "Employer" },
    { field: "position", label: "Position" },
  ],
];

/** Grid overrides for rows that need custom proportions */
const MLC_GRID_OVERRIDES: Record<number, string> = {
  3: "grid-cols-[3fr_2fr]", // Address, Contact No
  4: "grid-cols-[3fr_2fr]", // Employer, Position
};

type SectionEntry = {
  component: React.ComponentType<MlcSectionProps>;
  key: string;
};

const SECTIONS: SectionEntry[] = [
  { component: DeclarationSection, key: "declaration" },
  { component: FinalRecommendationSection, key: "recommendation" },
];

/**
 * MLC Health Certificate form content with data loading and save logic.
 *
 * Uses `useMlcForm` hook for state management. Renders animated
 * section cards with CRUD actions in the top toolbar.
 */
function MlcFormContent() {
  const router = useRouter();
  const { data, setData, loading, saving, isEditing, existingRecord, handleSave } =
    useMlcForm();

  const handleNew = useCallback(() => router.push("/mlc"), [router]);
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
          recordId: existingRecord?.mlc_id,
          createdDate: existingRecord?.created_date,
          createdLabel: "Created",
        }}
        onSave={handleSave}
        onNew={handleNew}
        onPrint={handlePrint}
      />

      {/* Section Cards */}
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.25 }}
        >
          <PersonalInfoSection
            data={data}
            onChange={setData}
            rows={MLC_PERSONAL_ROWS}
            gridOverrides={MLC_GRID_OVERRIDES}
          />
        </motion.div>
        {SECTIONS.map(({ component: Section, key }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 1) * 0.06, duration: 0.25 }}
          >
            <Section data={data} onChange={setData} />
          </motion.div>
        ))}
      </div>
    </PageContainer>
  );
}

/**
 * MLC (Maritime Labour Convention) Health Certificate page.
 *
 * Wraps the form content in a Suspense boundary to handle the
 * `useSearchParams` hook requirement in Next.js App Router.
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
