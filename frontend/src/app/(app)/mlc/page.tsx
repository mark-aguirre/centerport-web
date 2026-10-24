"use client";

import { Suspense, useMemo } from "react";
import { Loader2 } from "lucide-react";

import { PatientRailCard } from "@/components/common/patient-rail-card";
import { SectionNav, type SectionNavItem } from "@/components/common/section-nav";
import { MLC_SECTIONS, mlcAnchorId } from "@/components/mlc/section-config";
import { useMlcForm } from "@/hooks/use-mlc-form";
import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { ReportMenu } from "@/components/mlc/ReportMenu";
import type { MlcRecord } from "@/components/mlc/types";

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

/**
 * Sections shown on the authorized physician declaration form.
 *
 * Derived from {@link MLC_SECTIONS} so the left-rail navigator and the content
 * column stay in sync from one source.
 */
const SECTIONS: SectionEntry<MlcRecord>[] = MLC_SECTIONS.map(
  ({ key, component }) => ({ key, component })
);

/**
 * MLC Health Certificate form content.
 *
 * Two-column layout like the Sea-Base and Land-Base pages: patient summary
 * and section navigator fixed in the left rail, the form's section cards
 * scrolling on the right. The personal info card stays read-only — it comes
 * from the selected seafarer profile.
 */
function MlcFormContent() {
  const form = useMlcForm();

  const navItems = useMemo<SectionNavItem[]>(
    () => MLC_SECTIONS.map(({ key, label, icon }) => ({ key, label, icon })),
    []
  );

  const { data } = form;
  const patientName = [data.last_name, data.first_name]
    .filter(Boolean)
    .join(", ");

  return (
    <FormPage
      form={form}
      sections={SECTIONS}
      getBusinessId={(record) => record?.mlc_id}
      editGuard={(record) => !!record.last_name}
      navRail={
        /* Patient summary above the section navigator. The rail sits outside
           the scrolling column, so nothing here needs `sticky` — hence
           SectionNav's own sticky positioning is cancelled with `static`. */
        <div className="space-y-3">
          <PatientRailCard
            photoUrl={data.photo_url}
            name={patientName}
            recordId={form.existingRecord?.mlc_id}
            gender={data.gender}
            age={data.age}
            nationality={data.nationality}
            religion={data.religion}
          />
          <SectionNav
            items={navItems}
            anchorId={mlcAnchorId}
            ariaLabel="Health certificate sections"
            className="static"
          />
        </div>
      }
      printMenu={<ReportMenu data={form.existingRecord ?? form.data} />}
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
