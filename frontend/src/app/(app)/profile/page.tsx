"use client";

import { Suspense, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { FormToolbar } from "@/components/common/form-toolbar";
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
 * Profile form content with data loading and save logic.
 *
 * Uses `useProfileForm` hook for state management. Renders animated
 * section cards with CRUD actions in the top toolbar.
 *
 * @see useProfileForm — state and persistence logic
 */
function ProfileFormContent() {
  const router = useRouter();
  const { data, setData, loading, saving, isEditing, existingRecord, handleSave } =
    useProfileForm();
  const [editing, setEditing] = useState(!isEditing);

  const handleEdit = useCallback(() => setEditing(true), []);
  const handleCancel = useCallback(() => setEditing(false), []);
  const handleNew = useCallback(() => router.push("/profile"), [router]);
  const handlePrint = useCallback(() => window.print(), []);

  const onSave = useCallback(async () => {
    await handleSave();
    setEditing(false);
  }, [handleSave]);

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
        isExistingRecord={isEditing}
        metadata={{
          recordId: existingRecord?.profile_id,
          createdDate: existingRecord?.created_date,
          updatedDate: existingRecord?.updated_date,
        }}
        onSave={onSave}
        onCancel={handleCancel}
        onEdit={handleEdit}
        onNew={handleNew}
        onPrint={handlePrint}
      />

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
 * Seafarer profile create/edit page.
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
