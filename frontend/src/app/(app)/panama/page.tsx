"use client";

import { Suspense, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { PatientRailCard } from "@/components/common/patient-rail-card";
import { SectionNav, type SectionNavItem } from "@/components/common/section-nav";
import { usePatientPhoto } from "@/hooks/use-patient-photo";
import GeneralInfoSection from "@/components/panama/GeneralInfoSection";
import PersonalDeclarationSection from "@/components/panama/PersonalDeclarationSection";
import StatementSection from "@/components/panama/StatementSection";
import MedicalExaminationSection from "@/components/panama/MedicalExaminationSection";
import DiagnosticTestsSection from "@/components/panama/DiagnosticTestsSection";
import FitnessAssessmentSection from "@/components/panama/FitnessAssessmentSection";
import { usePanamaForm } from "@/hooks/use-panama-form";
import { FormPage } from "@/components/common/form-page";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ReportMenu } from "@/components/panama/ReportMenu";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SectionReveal } from "@/components/common/section-reveal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PanamaCertificate, PanamaSectionProps } from "@/components/panama/types";

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

const TABS = [
  { value: "general",     label: "General & Declaration", sub: "General info and items 1–8" },
  { value: "declaration", label: "Personal Declaration",  sub: "Medical history and conditions" },
  { value: "medication",  label: "Medication & Covid",    sub: "Q45, comments and Covid-19" },
  { value: "statement",   label: "Statement",             sub: "Certification and clinical data" },
  { value: "examination", label: "Medical Examination",   sub: "Sight, hearing and exploration" },
  { value: "diagnostics", label: "Diagnostic Tests",      sub: "Laboratory tests up to alcohol" },
  { value: "fitness",     label: "Fitness Assessment",    sub: "Other tests and fitness" },
  { value: "certificate", label: "Certificate",           sub: "Restrictions, dates and physician" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

// ---------------------------------------------------------------------------
// Panama tabs body (passed as preSections to FormPage)
// ---------------------------------------------------------------------------

interface PanamaTabsBodyProps {
  data: PanamaCertificate;
  onChange: (data: PanamaCertificate) => void;
  editing: boolean;
  activeTab: TabValue;
}

/**
 * Body of the Panama form — the eight steps of the paper certificate.
 *
 * The step list lives in the page's left rail (see `SectionNav` in
 * `PanamaFormContent`), so this renders the tab panels only, with no tab
 * strip of its own.
 */
function PanamaTabsBody({
  data,
  onChange,
  editing,
  activeTab,
}: PanamaTabsBodyProps) {
  const disabled = !editing;
  const sectionProps: PanamaSectionProps = { data, onChange, disabled };

  return (
    <Tabs value={activeTab} className="w-full">
      {/* Tab 1 — General Information + partial Personal Declaration (items 1–8 and 22–29) */}
      <TabsContent value="general" keepMounted={false}>
        <div className="space-y-3">
          <SectionReveal index={0}>
            <GeneralInfoSection {...sectionProps} />
          </SectionReveal>
          <SectionReveal index={1}>
            <PersonalDeclarationSection
              {...sectionProps}
              col1Slice={[1, 8]}
              col2Slice={[22, 29]}
            />
          </SectionReveal>
        </div>
      </TabsContent>

      {/* Tab 2 — Personal Declaration: items 9–21 (col 1) and 30–41 (col 2), plus details and questions 37–44 */}
      <TabsContent value="declaration" keepMounted={false}>
        <SectionReveal index={0}>
          <PersonalDeclarationSection
            {...sectionProps}
            col1Slice={[9, 21]}
            col2Slice={[30, 41]}
            showUpTo44
          />
        </SectionReveal>
      </TabsContent>

      {/* Tab 3 — Medication, Comments & Covid (Q45 + comments + Covid-19 section) */}
      <TabsContent value="medication" keepMounted={false}>
        <SectionReveal index={0}>
          <PersonalDeclarationSection
            {...sectionProps}
            declarationRestOnly
          />
        </SectionReveal>
      </TabsContent>

      {/* Tab 4 — Statement (III) + Medical Examination Clinical Data (IV-i) */}
      <TabsContent value="statement" keepMounted={false}>
        <div className="space-y-3">
          <SectionReveal index={0}>
            <StatementSection {...sectionProps} />
          </SectionReveal>
          <SectionReveal index={1}>
            <MedicalExaminationSection {...sectionProps} clinicalDataOnly />
          </SectionReveal>
        </div>
      </TabsContent>

      {/* Tab 5 — Medical Examination: Sight, Hearing, Physical Exploration (IV ii–iv) */}
      <TabsContent value="examination" keepMounted={false}>
        <SectionReveal index={0}>
          <MedicalExaminationSection {...sectionProps} skipClinicalData />
        </SectionReveal>
      </TabsContent>

      {/* Tab 6 — Diagnostic Tests up to *Alcohol */}
      <TabsContent value="diagnostics" keepMounted={false}>
        <SectionReveal index={0}>
          <DiagnosticTestsSection {...sectionProps} upToAlcohol />
        </SectionReveal>
      </TabsContent>

      {/* Tab 7 — remaining Diagnostic Tests (Other test + VI) + Fitness Assessment up to "Without restrictions" row */}
      <TabsContent value="fitness" keepMounted={false}>
        <div className="space-y-3">
          <SectionReveal index={0}>
            <DiagnosticTestsSection {...sectionProps} otherTestsOnly />
          </SectionReveal>
          <SectionReveal index={1}>
            <FitnessAssessmentSection {...sectionProps} upToWithoutRestrictions />
          </SectionReveal>
        </div>
      </TabsContent>

      {/* Tab 8 — Certificate: restrictions details, certificate dates, physician */}
      <TabsContent value="certificate" keepMounted={false}>
        <SectionReveal index={0}>
          <FitnessAssessmentSection {...sectionProps} restrictionsRestOnly />
        </SectionReveal>
      </TabsContent>
    </Tabs>
  );
}

// ---------------------------------------------------------------------------
// Tab step navigator (Back / Next through the 8 tabs) — rendered in the
// toolbar's metadata slot so it sits beside the search bar.
// ---------------------------------------------------------------------------

function TabStepNavigator({
  activeTab,
  onTabChange,
}: {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}) {
  const index = TABS.findIndex((t) => t.value === activeTab);
  const atStart = index <= 0;
  const atEnd = index >= TABS.length - 1;

  const goTo = (targetIndex: number) => {
    const target = TABS[targetIndex];
    if (target) onTabChange(target.value);
  };

  return (
    <div className="flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-1 py-0.5 shadow-sm">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 cursor-pointer text-primary hover:bg-primary/10 disabled:opacity-40"
        onClick={() => goTo(index - 1)}
        disabled={atStart}
        aria-label="Previous step"
        title="Previous step"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="min-w-[6rem] px-1 text-center text-xs font-bold tracking-wide text-primary">
        Page ({index + 1} of {TABS.length})
      </span>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 cursor-pointer text-primary hover:bg-primary/10 disabled:opacity-40"
        onClick={() => goTo(index + 1)}
        disabled={atEnd}
        aria-label="Next step"
        title="Next step"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Panama form content
// ---------------------------------------------------------------------------

/**
 * Panama Medical Certificate form content with full CRUD toolbar and tabs.
 */
function PanamaFormContent() {
  const form = usePanamaForm();
  const [activeTab, setActiveTab] = useState<TabValue>("general");

  // The rail shows the paper form's page numbers (1–8) rather than icons, the
  // way the old stepper's circled numbers did.
  const navItems = useMemo<SectionNavItem[]>(
    () => TABS.map(({ value, label }, index) => ({
      key: value,
      label,
      step: index + 1,
    })),
    []
  );

  const { data } = form;

  // The Panama record stores only the seafarer's profile UUID, so the rail
  // card's photo comes from the profile rather than the certificate.
  const patientPhoto = usePatientPhoto(data.seafarer_profile_id);

  return (
    <>
      <FormPage
        form={form}
        sections={[]}
        getBusinessId={(record) => record?.panama_id}
        editGuard={(record) => !!record.full_name}
        printMenu={<ReportMenu data={form.existingRecord ?? form.data} />}
        metadataSlot={
          <TabStepNavigator activeTab={activeTab} onTabChange={setActiveTab} />
        }
        navRail={
          /* Patient summary above the step navigator. The steps are mutually
             exclusive tabs rather than anchors in one scrolling column, so
             SectionNav runs in controlled mode and switches the active tab. */
          <div className="space-y-3">
            <PatientRailCard
              photoUrl={patientPhoto}
              name={data.full_name}
              recordId={form.existingRecord?.panama_id}
              gender={data.sex}
            />
            <SectionNav
              items={navItems}
              ariaLabel="Certificate steps"
              activeKey={activeTab}
              onSelect={(key) => setActiveTab(key as TabValue)}
              className="static"
            />
          </div>
        }
        preSections={
          <PanamaTabsBody
            data={form.data}
            onChange={form.setData}
            editing={form.editing}
            activeTab={activeTab}
          />
        }
      />

      <ConfirmDialog
        open={form.seabaseConfirmOpen}
        title="Update Seabase record?"
        message={form.seabaseConfirmMessage}
        confirmLabel="Yes, update both"
        cancelLabel="No, Panama only"
        busy={form.seabaseSyncing}
        onConfirm={form.confirmSeabaseSync}
        onCancel={form.declineSeabaseSync}
      />
    </>
  );
}

/**
 * Panama Medical Certificate page route component.
 *
 * Wraps the form content in a Suspense boundary required by
 * Next.js App Router for components that use `useSearchParams`.
 */
export default function PanamaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <PanamaFormContent />
    </Suspense>
  );
}
