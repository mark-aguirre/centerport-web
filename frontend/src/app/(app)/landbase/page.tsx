"use client";

import { Suspense, useMemo } from "react";
import { Loader2 } from "lucide-react";

import { PatientRailCard } from "@/components/common/patient-rail-card";
import { SectionNav, type SectionNavItem } from "@/components/common/section-nav";
import {
  LANDBASE_SECTIONS,
  landbaseAnchorId,
} from "@/components/landbase/section-config";
import { useLandbaseForm } from "@/hooks/use-landbase-form";
import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { PemeSelector } from "@/components/landbase/PemeSelector";
import { ReportMenu } from "@/components/landbase/ReportMenu";
import type { LandbasePeme } from "@/components/landbase/types";

/**
 * Ordered list of form sections rendered on the Landbase PEME page.
 *
 * Derived from {@link LANDBASE_SECTIONS} so the left-rail navigator and the
 * content column stay in sync from one source.
 */
const SECTIONS: SectionEntry<LandbasePeme>[] = LANDBASE_SECTIONS.map(
  ({ key, component }) => ({ key, component })
);

/**
 * Landbase PEME form content with full CRUD toolbar and print dialog.
 *
 * Two-column layout like the Sea-Base page: patient summary and section
 * navigator fixed in the left rail, the form's section cards scrolling on the
 * right.
 */
function LandbaseFormContent() {
  const form = useLandbaseForm();

  const navItems = useMemo<SectionNavItem[]>(
    () => LANDBASE_SECTIONS.map(({ key, label, icon }) => ({ key, label, icon })),
    []
  );

  const { data } = form;
  const patientName = [data.last_name, data.first_name]
    .filter(Boolean)
    .join(", ");

  const metadataSlot = form.profilePemes.length >= 2 ? (
    <PemeSelector
      items={form.profilePemes}
      selectedId={form.existingRecord?.id}
      onSelect={form.handleSelectPeme}
      disabled={form.editing}
    />
  ) : undefined;

  return (
    <FormPage
      form={form}
      sections={SECTIONS}
      getBusinessId={(record) => record?.peme_id}
      editGuard={(record) => !!record.last_name}
      metadataSlot={metadataSlot}
      navRail={
        /* Patient summary above the section navigator. The rail sits outside
           the scrolling column, so nothing here needs `sticky` — hence
           SectionNav's own sticky positioning is cancelled with `static`. */
        <div className="space-y-3">
          <PatientRailCard
            photoUrl={data.photo_url}
            name={patientName}
            recordId={form.existingRecord?.peme_id}
            gender={data.gender}
            age={data.age}
            nationality={data.nationality}
            religion={data.religion}
          />
          <SectionNav
            items={navItems}
            anchorId={landbaseAnchorId}
            ariaLabel="PEME sections"
            className="static"
          />
        </div>
      }
      printMenu={
        <ReportMenu
          pemeId={form.existingRecord?.id}
          data={form.existingRecord ?? form.data}
        />
      }
    />
  );
}

/**
 * Landbase PEME page route component.
 *
 * Wraps the form content in a Suspense boundary required by
 * Next.js App Router for components that use `useSearchParams`.
 */
export default function LandbasePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <LandbaseFormContent />
    </Suspense>
  );
}
