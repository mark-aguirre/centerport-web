"use client";

import { Suspense, useMemo } from "react";
import { Activity, FlaskConical, Loader2 } from "lucide-react";

import { FormPage, type SectionEntry } from "@/components/common/form-page";
import { PatientRailCard } from "@/components/common/patient-rail-card";
import { SectionNav, type SectionNavItem } from "@/components/common/section-nav";
import { usePatientPhoto } from "@/hooks/use-patient-photo";
import { useImmunologyForm } from "@/hooks/use-immunology-form";
import type { ImmunologyReport } from "@/components/immunology/types";

import { ReportMenu } from "@/components/immunology/ReportMenu";
import PatientInformationSection from "@/components/immunology/PatientInformationSection";
import ImmunologyTestSection, {
  IMMUNOLOGY_GROUPS,
  immunologyGroupAnchorId,
} from "@/components/immunology/ImmunologyTestSection";

/** Ordered list of section components rendered on the immunology form page. */
const SECTIONS: SectionEntry<ImmunologyReport>[] = [
  { component: PatientInformationSection, key: "patient-info" },
  { component: ImmunologyTestSection, key: "immunology-test" },
];

/** Icon per test group, keyed by the group's anchor key. */
const GROUP_ICONS: Record<string, typeof FlaskConical> = {
  "tumor-marker": Activity,
  "immunology-test": FlaskConical,
};

/** Immunology Report page with full CRUD form. */
export default function ImmunologyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <ImmunologyFormContent />
    </Suspense>
  );
}

/**
 * Immunology report form content.
 *
 * Two-column layout like the other module pages: patient summary and
 * navigator fixed in the left rail, the report cards scrolling on the right.
 * The navigator lists the test groups inside the Immunology / Serology card —
 * Patient Information is the first card in the column and always visible, so
 * it gets no entry of its own.
 */
function ImmunologyFormContent() {
  const form = useImmunologyForm();

  const navItems = useMemo<SectionNavItem[]>(
    () =>
      IMMUNOLOGY_GROUPS.map(({ key, label }) => ({
        key,
        label,
        icon: GROUP_ICONS[key],
      })),
    []
  );

  const { data } = form;

  // The immunology report stores only the seafarer's profile UUID, so the
  // rail card's photo comes from the profile rather than the report.
  const patientPhoto = usePatientPhoto(data.seafarer_profile_id);

  const patientName = [data.last_name, data.first_name]
    .filter(Boolean)
    .join(", ");

  return (
    <FormPage
      form={form}
      sections={SECTIONS}
      getBusinessId={(record) => record?.report_id}
      editGuard={(record) => !!record.last_name}
      navRail={
        /* Patient summary above the navigator. The rail sits outside the
           scrolling column, so nothing here needs `sticky` — hence
           SectionNav's own sticky positioning is cancelled with `static`. */
        <div className="space-y-3">
          <PatientRailCard
            photoUrl={patientPhoto}
            name={patientName}
            recordId={form.existingRecord?.report_id}
            gender={data.gender}
            age={data.age}
          />
          <SectionNav
            items={navItems}
            anchorId={immunologyGroupAnchorId}
            ariaLabel="Immunology report sections"
            className="static"
          />
        </div>
      }
      printMenu={<ReportMenu data={form.existingRecord ?? form.data} />}
    />
  );
}
