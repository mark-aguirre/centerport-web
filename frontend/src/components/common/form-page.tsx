"use client";

import { Suspense } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { PageContainer } from "@/components/common/page-container";
import { FormToolbar } from "@/components/common/form-toolbar";
import { RecordSelector } from "@/components/common/record-selector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SearchResultItem } from "@/components/common/form-toolbar";
import type { UseEntityFormResult } from "@/hooks/use-entity-form";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Configuration for a single section rendered on the form page.
 */
export interface SectionEntry<T> {
  /** React component that renders this section */
  component: React.ComponentType<{
    data: T;
    onChange: (data: T) => void;
    disabled?: boolean;
  }>;
  /** Stable key for React reconciliation */
  key: string;
}

/**
 * Props for the generic FormPage component.
 *
 * @typeParam T - The entity record type (e.g. MedicalExam, LandbasePeme)
 */
export interface FormPageProps<T> {
  /** The form hook result (from useEntityForm or a wrapper) */
  form: UseEntityFormResult<T>;

  /** Ordered list of section components to render */
  sections: SectionEntry<T>[];

  /**
   * Extract the business ID for display in the toolbar metadata badge.
   * Returns undefined to hide the badge (e.g. when record selector is shown).
   */
  getBusinessId?: (record: T | null) => string | undefined;

  /**
   * Whether the Edit button should be enabled.
   * Defaults to checking if form.existingRecord is not null.
   */
  editGuard?: (data: T) => boolean;

  /**
   * Optional slot rendered before the main sections array.
   * Useful for pages that need a custom section (e.g. MLC personal info
   * that is always disabled regardless of edit mode).
   */
  preSections?: React.ReactNode;

  /**
   * Optional custom metadata slot (e.g. PemeSelector for landbase).
   * When provided, overrides the default RecordSelector.
   */
  metadataSlot?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

/** Staggered fade-in animation for section cards on initial mount. */
const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.06, duration: 0.25 },
  }),
};

/** Loading spinner rendered during Suspense fallback and initial load. */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// FormPageContent (inner component, requires hooks)
// ---------------------------------------------------------------------------

/**
 * Inner form page content that renders the toolbar, alert, and sections.
 *
 * Separated from the outer Suspense wrapper so hooks can be called.
 */
function FormPageContent<T>({
  form,
  sections,
  getBusinessId,
  editGuard,
  preSections,
  metadataSlot,
}: FormPageProps<T>) {
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
    profileRecords,
    handleSelectRecord,
  } = form;

  if (loading) {
    return <LoadingSpinner />;
  }

  // Determine if Edit should be enabled
  const canEdit = editGuard ? editGuard(data) : !!existingRecord;

  // Determine the record ID badge
  const recordId = getBusinessId
    ? (profileRecords.length < 2 ? getBusinessId(existingRecord) : undefined)
    : undefined;

  // Record selector (default or custom)
  const resolvedMetadataSlot = metadataSlot ?? (
    profileRecords.length >= 2 ? (
      <RecordSelector
        items={profileRecords}
        selectedId={existingRecord ? (existingRecord as Record<string, unknown>).id as string : undefined}
        onSelect={handleSelectRecord}
        disabled={editing}
      />
    ) : undefined
  );

  return (
    <PageContainer>
      <FormToolbar
        editing={editing}
        saving={saving}
        isExistingRecord={isExistingRecord}
        metadata={{
          recordId,
          createdDate: existingRecord ? (existingRecord as Record<string, unknown>).created_date as string : undefined,
          createdLabel: "Created",
        }}
        metadataSlot={resolvedMetadataSlot}
        onSave={handleSave}
        onCancel={handleCancel}
        onEdit={canEdit ? handleEdit : undefined}
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
        {preSections}

        {sections.map(({ component: Section, key }, index) => (
          <motion.div
            key={key}
            custom={preSections ? index + 1 : index}
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

// ---------------------------------------------------------------------------
// FormPage (public, wraps in Suspense)
// ---------------------------------------------------------------------------

/**
 * Generic form page component with Suspense boundary.
 *
 * Wraps form content in the required Suspense boundary for Next.js App
 * Router components that use `useSearchParams`. Renders a loading spinner
 * as the fallback.
 *
 * Usage:
 * ```tsx
 * export default function LandbasePage() {
 *   const form = useLandbaseForm();
 *   return <FormPage form={form} sections={SECTIONS} getBusinessId={...} />;
 * }
 * ```
 *
 * Note: Since the hook must be called inside the Suspense boundary,
 * pages should use `FormPageWithHook` or wrap `FormPageContent` in their
 * own Suspense boundary. See `createFormPage` for a convenience factory.
 */
export function FormPage<T>(props: FormPageProps<T>) {
  return <FormPageContent {...props} />;
}

/**
 * Factory that creates a complete form page route component.
 *
 * Returns a default-exported page component that:
 * 1. Wraps in a Suspense boundary (required by useSearchParams)
 * 2. Calls the provided hook
 * 3. Renders FormPageContent with all config
 *
 * @param useFormHook - The form hook to call (e.g. useLandbaseForm)
 * @param config - Static page configuration (sections, getBusinessId, etc.)
 * @returns A React component suitable for use as a Next.js page
 *
 * @example
 * ```tsx
 * // app/(app)/landbase/page.tsx
 * export default createFormPage(useLandbaseForm, {
 *   sections: LANDBASE_SECTIONS,
 *   getBusinessId: (r) => r?.peme_id,
 * });
 * ```
 */
export function createFormPage<T>(
  useFormHook: () => UseEntityFormResult<T>,
  config: Omit<FormPageProps<T>, "form"> & {
    /** Optional transform applied to the hook result before passing to FormPage */
    transformForm?: (form: UseEntityFormResult<T>) => FormPageProps<T>["form"];
    /** Optional function to compute metadataSlot from form state */
    renderMetadataSlot?: (form: UseEntityFormResult<T>, editing: boolean) => React.ReactNode;
  }
): React.ComponentType {
  function FormContent() {
    const rawForm = useFormHook();
    const form = config.transformForm ? config.transformForm(rawForm) : rawForm;

    const metadataSlot = config.renderMetadataSlot
      ? config.renderMetadataSlot(rawForm, rawForm.editing)
      : config.metadataSlot;

    return (
      <FormPageContent
        form={form}
        sections={config.sections}
        getBusinessId={config.getBusinessId}
        editGuard={config.editGuard}
        preSections={config.preSections}
        metadataSlot={metadataSlot}
      />
    );
  }

  function Page() {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <FormContent />
      </Suspense>
    );
  }

  return Page;
}
