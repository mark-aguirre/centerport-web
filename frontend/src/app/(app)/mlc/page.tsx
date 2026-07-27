"use client";

import { Suspense } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import PersonalInfoSection from "@/components/common/personal-info-section";
import type { RowConfig } from "@/components/common/personal-info-section";
import SeafarerDetailsSection from "@/components/mlc/SeafarerDetailsSection";
import CertificateDetailsSection from "@/components/mlc/CertificateDetailsSection";
import DeclarationSection from "@/components/mlc/DeclarationSection";
import FinalRecommendationSection from "@/components/mlc/FinalRecommendationSection";
import { useMlcForm } from "@/hooks/use-mlc-form";
import { PageContainer } from "@/components/common/page-container";
import { FormToolbar } from "@/components/common/form-toolbar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SearchResultItem } from "@/components/common/form-toolbar";
import type { MlcSectionProps } from "@/components/mlc/types";

/** MLC personal info row layout */
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

/**
 * Registry entry mapping a section component to its stable key.
 */
interface SectionEntry {
  component: React.ComponentType<MlcSectionProps>;
  key: string;
}

/**
 * Ordered list of form sections rendered on the MLC page.
 * Personal info is rendered separately (always read-only from profile).
 */
const SECTIONS: SectionEntry[] = [
  { component: SeafarerDetailsSection, key: "seafarer-details" },
  { component: CertificateDetailsSection, key: "certificate-details" },
  { component: DeclarationSection, key: "declaration" },
  { component: FinalRecommendationSection, key: "recommendation" },
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
 * MLC Health Certificate form content with full CRUD toolbar.
 *
 * Orchestrates the form layout: toolbar at top, validation alert,
 * and all medical form sections rendered as animated cards.
 *
 * State management:
 * - Uses `useMlcForm` for CRUD operations, mode transitions,
 *   and seafarer profile search integration
 * - Sections receive shared props (data, onChange, disabled) and
 *   handle their own field-level updates
 */
function MlcFormContent() {
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
  } = useMlcForm();

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
          recordId: existingRecord?.mlc_id,
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
        {/* Personal Info — always read-only (data comes from profile) */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <PersonalInfoSection
            data={data}
            onChange={setData}
            rows={MLC_PERSONAL_ROWS}
            gridOverrides={MLC_GRID_OVERRIDES}
            disabled={true}
          />
        </motion.div>

        {/* MLC-specific sections */}
        {SECTIONS.map(({ component: Section, key }, index) => (
          <motion.div
            key={key}
            custom={index + 1}
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
