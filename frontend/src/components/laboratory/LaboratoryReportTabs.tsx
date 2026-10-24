"use client";

/**
 * Tabbed container for the four laboratory report result sections.
 *
 * Groups Hematology, Clinical Chemistry & Serology/Immunology, Urinalysis, and
 * Fecalysis into a single tabbed interface so they share the vertical space
 * below the Patient Information section instead of stacking.
 */

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import HematologySection from "./HematologySection";
import ClinicalChemistrySection from "./ClinicalChemistrySection";
import UrinalysisSection from "./UrinalysisSection";
import FecalysisSection from "./FecalysisSection";
import type { LaboratorySectionProps } from "./types";

/**
 * The four result panels, in order.
 *
 * Exported so the page's left-rail navigator can list the same panels with
 * the same labels instead of keeping a second copy.
 */
export const LABORATORY_TABS = [
  { value: "hematology", label: "Hematology" },
  {
    value: "chemistry",
    label: "Clinical Chemistry",
  },
  { value: "urinalysis", label: "Urinalysis" },
  { value: "fecalysis", label: "Fecalysis" },
] as const;

/** Full tab-strip labels (longer than the rail's). */
const TAB_STRIP_LABELS: Record<string, string> = {
  hematology: "Laboratory Report (Hematology)",
  chemistry: "Clinical Chemistry and Serology/Immunology",
  urinalysis: "Urinalysis",
  fecalysis: "Fecalysis",
};

interface LaboratoryReportTabsProps extends LaboratorySectionProps {
  /**
   * Controlled active panel. When provided the tab strip is hidden — the
   * caller (the page's left-rail navigator) owns panel switching.
   */
  activeTab?: string;
}

/**
 * Renders the laboratory result sections as tabs. Each section still receives
 * the full form `data`, `onChange`, and `disabled` props unchanged.
 */
export default function LaboratoryReportTabs({
  data,
  onChange,
  disabled,
  activeTab: controlledTab,
}: LaboratoryReportTabsProps) {
  const [internalTab, setInternalTab] = useState<string>(
    LABORATORY_TABS[0].value
  );
  const controlled = controlledTab !== undefined;
  const activeTab = controlled ? controlledTab : internalTab;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (!controlled) setInternalTab(value as string);
      }}
    >
      {!controlled && (
        <TabsList className="h-auto flex-wrap gap-1">
          {LABORATORY_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {TAB_STRIP_LABELS[tab.value]}
            </TabsTrigger>
          ))}
        </TabsList>
      )}

      <TabsContent value="hematology">
        <HematologySection data={data} onChange={onChange} disabled={disabled} />
      </TabsContent>

      <TabsContent value="chemistry">
        <ClinicalChemistrySection
          data={data}
          onChange={onChange}
          disabled={disabled}
        />
      </TabsContent>

      <TabsContent value="urinalysis">
        <UrinalysisSection data={data} onChange={onChange} disabled={disabled} />
      </TabsContent>

      <TabsContent value="fecalysis">
        <FecalysisSection data={data} onChange={onChange} disabled={disabled} />
      </TabsContent>
    </Tabs>
  );
}
