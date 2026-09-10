"use client";

import { Suspense } from "react";
import { AlertCircle, Loader2, UserSearch } from "lucide-react";

import { PageContainer } from "@/components/common/page-container";
import { SectionReveal } from "@/components/common/section-reveal";
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
   * Extract the record's UUID (used by RecordSelector for `selectedId`).
   * Defaults to reading `(record as any).id`.
   */
  getRecordId?: (record: T) => string | undefined;

  /**
   * Extract the created date from a record (used by toolbar metadata).
   * Defaults to reading `(record as any).created_date`.
   */
  getCreatedDate?: (record: T) => string | undefined;

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
   * DOM element ID where CRUD actions are rendered on large screens.
   * Defaults to "app-header-actions" (the slot in AppHeader).
   * Set to undefined/empty string to keep actions inline in the toolbar.
   */
  actionsPortalId?: string;

  /**
   * Optional custom metadata slot (e.g. PemeSelector for landbase).
   * When provided, overrides the default RecordSelector.
   */
  metadataSlot?: React.ReactNode;

  /**
   * Optional dropdown menu content for the toolbar Print button.
   *
   * When provided, the Print button becomes a dropdown trigger rendering this
   * content (e.g. a list of report types). See {@link FormToolbarProps.printMenu}.
   */
  printMenu?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

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
  getRecordId: getRecordIdProp,
  getCreatedDate: getCreatedDateProp,
  editGuard,
  preSections,
  actionsPortalId = "app-header-actions",
  metadataSlot,
  printMenu,
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
    needsPatientSelection,
    profileRecords,
    handleSelectRecord,
  } = form;

  /** Alias kept for potential future pre-new logic (e.g. search focus). */
  const onNew = handleNew;

  // Safe accessor defaults
  const getRecordId = getRecordIdProp ?? ((r: T) => (r as Record<string, unknown>).id as string | undefined);
  const getCreatedDate = getCreatedDateProp ?? ((r: T) => (r as Record<string, unknown>).created_date as string | undefined);

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
        selectedId={existingRecord ? getRecordId(existingRecord) : undefined}
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
          createdDate: existingRecord ? getCreatedDate(existingRecord) : undefined,
          createdLabel: "Created",
        }}
        metadataSlot={resolvedMetadataSlot}
        actionsPortalId={actionsPortalId}
        onSave={handleSave}
        onCancel={handleCancel}
        onEdit={canEdit ? handleEdit : undefined}
        onNew={onNew}
        onPrint={handlePrint}
        printMenu={printMenu}
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

      {needsPatientSelection ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <UserSearch className="h-10 w-10 text-primary/40" />
          <p className="text-sm font-medium text-foreground/70">
            Search and select a patient to continue
          </p>
          <p className="text-xs text-muted-foreground">
            Use the search bar above to find a seafarer by name
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {preSections}

          {sections.map(({ component: Section, key }, index) => (
            <SectionReveal key={key} index={preSections ? index + 1 : index}>
              <Section data={data} onChange={setData} disabled={!editing} />
            </SectionReveal>
          ))}
        </div>
      )}
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
        getRecordId={config.getRecordId}
        getCreatedDate={config.getCreatedDate}
        editGuard={config.editGuard}
        preSections={config.preSections}
        actionsPortalId={config.actionsPortalId}
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
