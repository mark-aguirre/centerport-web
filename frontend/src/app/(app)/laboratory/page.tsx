"use client";

import { Suspense, useCallback, useState } from "react";
import {
  Droplet,
  FlaskConical,
  Loader2,
  Microscope,
  TestTube,
} from "lucide-react";

import { FormPage } from "@/components/common/form-page";
import { PatientRailCard } from "@/components/common/patient-rail-card";
import { SectionReveal } from "@/components/common/section-reveal";
import { SectionNav, type SectionNavItem } from "@/components/common/section-nav";
import { usePatientPhoto } from "@/hooks/use-patient-photo";
import { useLaboratoryForm } from "@/hooks/use-laboratory-form";

import { ReportMenu } from "@/components/laboratory/ReportMenu";
import PatientInformationSection from "@/components/laboratory/PatientInformationSection";
import LaboratoryReportTabs, {
  LABORATORY_TABS,
} from "@/components/laboratory/LaboratoryReportTabs";

// ---------------------------------------------------------------------------
// Left-rail navigation
// ---------------------------------------------------------------------------

/** Scroll-anchor id of the result-panel block. */
const RESULTS_ANCHOR = "laboratory-section-results";

/** Icon per result panel, keyed by the panel's tab value. */
const PANEL_ICONS = {
  hematology: Droplet,
  chemistry: FlaskConical,
  urinalysis: TestTube,
  fecalysis: Microscope,
} as const;

/**
 * Rail entries — one per result panel.
 *
 * Patient Information is deliberately not listed: it is the first card in the
 * column and always visible, so an entry for it would only scroll to the top.
 */
const NAV_ITEMS: SectionNavItem[] = LABORATORY_TABS.map(({ value, label }) => ({
  key: value,
  label,
  icon: PANEL_ICONS[value],
}));

/** Laboratory Report page with full CRUD form. */
export default function LaboratoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <LaboratoryFormContent />
    </Suspense>
  );
}

/**
 * Laboratory report form content.
 *
 * Two-column layout like the other module pages: patient summary and
 * navigator fixed in the left rail, content scrolling on the right. The rail
 * doubles as the result-panel switcher — picking Hematology, Clinical
 * Chemistry, Urinalysis, or Fecalysis selects that panel and scrolls to it,
 * which is why the panels no longer carry their own tab strip.
 */
function LaboratoryFormContent() {
  const form = useLaboratoryForm();
  const [panel, setPanel] = useState<string>(LABORATORY_TABS[0].value);

  const { data } = form;

  // The laboratory report stores only the seafarer's profile UUID, so the
  // rail card's photo comes from the profile rather than the report.
  const patientPhoto = usePatientPhoto(data.seafarer_profile_id);

  const patientName = [data.last_name, data.first_name]
    .filter(Boolean)
    .join(", ");

  const handleNavSelect = useCallback((key: string) => {
    setPanel(key);
    document
      .getElementById(RESULTS_ANCHOR)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Rendered as a node rather than through `sections`, so switching result
  // panels re-renders in place instead of remounting the whole column.
  const content = (
    <div className="space-y-3">
      <SectionReveal index={0}>
        <PatientInformationSection
          data={form.data}
          onChange={form.setData}
          disabled={!form.editing}
        />
      </SectionReveal>
      <SectionReveal index={1}>
        <div id={RESULTS_ANCHOR} className="scroll-mt-4">
          <LaboratoryReportTabs
            data={form.data}
            onChange={form.setData}
            disabled={!form.editing}
            activeTab={panel}
          />
        </div>
      </SectionReveal>
    </div>
  );

  return (
    <FormPage
      form={form}
      sections={[]}
      preSections={content}
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
            items={NAV_ITEMS}
            ariaLabel="Laboratory report panels"
            activeKey={panel}
            onSelect={handleNavSelect}
            className="static"
          />
        </div>
      }
      printMenu={<ReportMenu data={form.existingRecord ?? form.data} />}
    />
  );
}
