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

const TABS = [
  { value: "hematology", label: "Laboratory Report (Hematology)" },
  {
    value: "chemistry",
    label: "Clinical Chemistry and Serology/Immunology",
  },
  { value: "urinalysis", label: "Urinalysis" },
  { value: "fecalysis", label: "Fecalysis" },
] as const;

/**
 * Renders the laboratory result sections as tabs. Each section still receives
 * the full form `data`, `onChange`, and `disabled` props unchanged.
 */
export default function LaboratoryReportTabs({
  data,
  onChange,
  disabled,
}: LaboratorySectionProps) {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].value);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as string)}
    >
      <TabsList className="h-auto flex-wrap gap-1">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

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
