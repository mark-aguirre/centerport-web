"use client";

import { Suspense, useMemo } from "react";
import { Loader2 } from "lucide-react";

import { PatientRailCard } from "@/components/common/patient-rail-card";
import { SectionNav, type SectionNavItem } from "@/components/common/section-nav";
import {
  SEABASE_SECTIONS,
  seabaseAnchorId,
} from "@/components/medical/seabase-section-config";
import { useMedicalForm } from "@/hooks/use-medical-form";
import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ReportMenu } from "@/components/medical/ReportMenu";
import type { MedicalExam } from "@/components/medical/types";

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

/**
 * Section groups rendered in the content column.
 *
 * Each entry is one anchored group from {@link SEABASE_SECTIONS}, so the
 * left-rail navigator and the content column stay in sync from one source.
 */
const SECTIONS: SectionEntry<MedicalExam>[] = SEABASE_SECTIONS.map(
  ({ key, component }) => ({ key, component })
);

/**
 * Seabase Medical Examination form content with full CRUD button behavior.
 *
 * Laid out like the patient profile page: a sticky section navigator on the
 * left and the form's section cards on the right. Clicking an entry jumps to
 * that part of the long PEME form, and the entry for the section currently in
 * view stays highlighted.
 */
function SeabaseFormContent() {
  // Seabase shares its selected patient only with Panama; see
  // PATIENT_AWARE_ROUTES. The standalone Medical page omits this flag.
  const form = useMedicalForm({ shareSelectedPatient: true });

  const navItems = useMemo<SectionNavItem[]>(
    () => SEABASE_SECTIONS.map(({ key, label, icon }) => ({ key, label, icon })),
    []
  );

  const { data } = form;
  const patientName = [data.last_name, data.first_name]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <FormPage
        form={form}
        sections={SECTIONS}
        getBusinessId={(record) => record?.exam_id}
        editGuard={(data) => !!data.last_name}
        navRail={
          /* Patient summary above the section navigator. The rail sits outside
             the scrolling column, so nothing here needs `sticky` — hence
             SectionNav's own sticky positioning is cancelled with `static`. */
          <div className="space-y-3">
            <PatientRailCard
              photoUrl={data.photo_url}
              name={patientName}
              recordId={form.existingRecord?.exam_id}
              gender={data.gender}
              age={data.age}
              nationality={data.nationality}
              religion={data.religion}
            />
            <SectionNav
              items={navItems}
              anchorId={seabaseAnchorId}
              ariaLabel="Medical examination sections"
              className="static"
            />
          </div>
        }
        printMenu={
          <ReportMenu
            examId={form.existingRecord?.id}
            data={form.existingRecord ?? form.data}
          />
        }
      />

      <ConfirmDialog
        open={form.panamaConfirmOpen}
        title="Update Panama record?"
        message={form.panamaConfirmMessage}
        confirmLabel="Yes, update both"
        cancelLabel="No, Seabase only"
        busy={form.panamaSyncing}
        onConfirm={form.confirmPanamaSync}
        onCancel={form.declinePanamaSync}
      />
    </>
  );
}

/**
 * Seabase (Seafarer's Medical Examination) page.
 *
 * Wraps the form content in a Suspense boundary to handle the
 * `useSearchParams` hook requirement in Next.js App Router.
 */
export default function SeabasePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <SeabaseFormContent />
    </Suspense>
  );
}
