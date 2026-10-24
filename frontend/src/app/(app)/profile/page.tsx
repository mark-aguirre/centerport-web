"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { FormToolbar } from "@/components/common/form-toolbar";
import { SectionReveal } from "@/components/common/section-reveal";
import { ProfileHero } from "@/components/profile/profile-hero";
import { ProfileNav } from "@/components/profile/profile-nav";
import { CollapsibleSection } from "@/components/profile/collapsible-section";
import { PROFILE_SECTIONS } from "@/components/profile/section-config";
import { useProfileForm } from "@/hooks/use-profile-form";
import { PageContainer } from "@/components/common/page-container";

/**
 * Patient form content with full CRUD button behavior.
 *
 * Uses `useProfileForm` hook for state management including
 * New/Edit/Save/Cancel/Print actions and view/edit mode transitions.
 *
 * Layout mirrors the patient profile mock: a summary hero header (photo,
 * name, status pills, quick-info chips) on top, a sticky section navigator
 * on the left, and the color-themed, collapsible form sections on the right.
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

  const setPhoto = (url: string) => setData({ ...data, photo_url: url });

  return (
    <PageContainer className="overflow-visible">
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
        hideSearchInNewMode
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

      <SectionReveal index={0}>
        <ProfileHero data={data} onPhotoChange={setPhoto} disabled={!editing} />
      </SectionReveal>

      <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-start">
        {/* Left rail: section navigator (sticky on large screens). */}
        <aside className="lg:w-56 lg:shrink-0">
          <ProfileNav />
        </aside>

        {/* Right column: collapsible form sections. On large screens this
            column scrolls on its own (the hero and left nav stay put), with
            the scrollbar hidden via `scrollbar-hide`. The height is bounded to
            the viewport minus the chrome above it (app header + hero + page
            padding). */}
        <div className="min-w-0 flex-1 space-y-3 lg:max-h-[calc(100vh-19rem)] lg:overflow-y-auto lg:pr-1 scrollbar-hide">
          {PROFILE_SECTIONS.map((section, index) => {
            const Body = section.component;
            return (
              <SectionReveal key={section.key} index={index + 1}>
                <CollapsibleSection
                  section={section}
                  defaultOpen={section.key === "personal"}
                >
                  <Body data={data} onChange={setData} disabled={!editing} />
                </CollapsibleSection>
              </SectionReveal>
            );
          })}
        </div>
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
