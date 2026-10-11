"use client";

import { Suspense, useState } from "react";
import { Loader2 } from "lucide-react";

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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SectionReveal } from "@/components/common/section-reveal";
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
  onTabChange: (tab: TabValue) => void;
}

function PanamaTabsBody({
  data,
  onChange,
  editing,
  activeTab,
  onTabChange,
}: PanamaTabsBodyProps) {
  const disabled = !editing;
  const sectionProps: PanamaSectionProps = { data, onChange, disabled };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onTabChange(v as TabValue)}
      className="w-full"
    >
      {/* Stepper-style tab nav — single line, compact and readable */}
      <TabsList className="mb-5 flex h-auto w-full items-stretch gap-1 border-b border-border bg-transparent p-0">
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.value;
          const isPast   = TABS.findIndex((t) => t.value === activeTab) > index;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              title={tab.sub}
              className={[
                "relative flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 px-2 py-3 text-center transition-colors",
                "focus-visible:ring-2 focus-visible:ring-[#0a5fc0]/50",
                "data-[state=active]:bg-[#0a5fc0]/10 data-[state=active]:shadow-none",
                "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:transition-colors",
                isActive
                  ? "bg-[#0a5fc0]/10 after:bg-[#0a5fc0]"
                  : "after:bg-transparent hover:bg-muted/40",
              ].join(" ")}
            >
              {/* Circle number */}
              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base font-bold transition-colors",
                  isActive
                    ? "bg-[#0a5fc0] text-white shadow-sm"
                    : isPast
                    ? "bg-[#0a5fc0]/15 text-[#0a5fc0]"
                    : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                {index + 1}
              </span>
              {/* Label */}
              <span
                className={[
                  "truncate text-sm font-semibold leading-snug",
                  isActive ? "text-[#0a5fc0]" : isPast ? "text-foreground" : "text-foreground/70",
                ].join(" ")}
              >
                {tab.label}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

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
// Panama form content
// ---------------------------------------------------------------------------

/**
 * Panama Medical Certificate form content with full CRUD toolbar and tabs.
 */
function PanamaFormContent() {
  const form = usePanamaForm();
  const [activeTab, setActiveTab] = useState<TabValue>("general");

  return (
    <>
      <FormPage
        form={form}
        sections={[]}
        getBusinessId={(record) => record?.panama_id}
        editGuard={(data) => !!data.full_name}
        printMenu={<ReportMenu data={form.existingRecord ?? form.data} />}
        preSections={
          <PanamaTabsBody
            data={form.data}
            onChange={form.setData}
            editing={form.editing}
            activeTab={activeTab}
            onTabChange={setActiveTab}
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
