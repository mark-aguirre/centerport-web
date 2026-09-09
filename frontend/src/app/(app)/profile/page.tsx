"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { FormToolbar } from "@/components/common/form-toolbar";
import { SectionReveal } from "@/components/common/section-reveal";
import PersonalInfoSection from "@/components/profile/PersonalInfoSection";
import EmploymentSection from "@/components/profile/EmploymentSection";
import FamilyDataSection from "@/components/profile/FamilyDataSection";
import EducationSection from "@/components/profile/EducationSection";
import WorkExperienceSection from "@/components/profile/WorkExperienceSection";
import { useProfileForm } from "@/hooks/use-profile-form";
import { PageContainer } from "@/components/common/page-container";
import type { ProfileSectionProps } from "@/components/profile/types";

type SectionEntry = {
  component: React.ComponentType<ProfileSectionProps>;
  key: string;
};

const SECTIONS: SectionEntry[] = [
  { component: PersonalInfoSection, key: "personal" },
  { component: EmploymentSection, key: "employment" },
  { component: FamilyDataSection, key: "family" },
  { component: EducationSection, key: "education" },
  { component: WorkExperienceSection, key: "work" },
];

/**
 * Patient form content with full CRUD button behavior.
 *
 * Uses `useProfileForm` hook for state management including
 * New/Edit/Save/Cancel/Print actions and view/edit mode transitions.
 * Renders animated section cards with fields disabled in view mode.
 *
 * @see useProfileForm — state, persistence, and CRUD logic
 */
function ProfileFormContent() {
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
  } = useProfileForm();

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
        actionsPortalId="app-header-actions"
        metadata={{
          recordId: existingRecord?.profile_id,
          createdDate: existingRecord?.created_date,
          updatedDate: existingRecord?.updated_date,
        }}
        onSave={handleSave}
        onCancel={handleCancel}
        onEdit={handleEdit}
        onNew={handleNew}
        onPrint={handlePrint}
        onSearch={handleSearch}
        searchResults={searchResults}
        searchLoading={searchLoading}
        onSelectResult={handleSelectResult as (result: import("@/components/common/form-toolbar").SearchResultItem) => void}
      />

      <div className="space-y-3">
        {SECTIONS.map(({ component: Section, key }, index) => (
          <SectionReveal key={key} index={index}>
            <Section data={data} onChange={setData} disabled={!editing} />
          </SectionReveal>
        ))}
      </div>
    </PageContainer>
  );
}

/**
 * Patient information create/edit page.
 *
 * Wraps the form content in a Suspense boundary to handle the
 * `useSearchParams` hook requirement in Next.js App Router.
 */
export default function ProfileFormPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <ProfileFormContent />
    </Suspense>
  );
}
