"use client";

/**
 * Fecalysis section for the Laboratory Report form.
 *
 * Covers color, consistency, red/white blood cells (with HPF),
 * ova/parasite, amoeba (with LPF), occult blood test, and others.
 *
 * Layout uses the same inline horizontal row approach as the Urinalysis section.
 *
 * @see LaboratorySectionProps — shared section component contract
 */

import { useState } from "react";
import { SectionHeader } from "@/components/common/section-header";
import { Microscope, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import {
  InlineSelect,
  InlineField,
  InlineSelectWithUnit,
} from "./laboratory-field-helpers";
import { RepeatFecalysisDialog } from "./RepeatFecalysisDialog";
import type { LaboratorySectionProps } from "./types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Fecal color options. */
const COLOR_OPTIONS = ["", "Brown", "Dark Brown", "Light Brown", "Yellow", "Green", "Black", "Red"];

/** Fecal consistency options. */
const CONSISTENCY_OPTIONS = ["", "Formed", "Semi-Formed", "Soft", "Watery", "Loose", "Mucoid"];

/** RBC/WBC quantity options. */
const QUANTITY_OPTIONS = ["", "None", "None Found"];

/** Ova or Parasite options. */
const OVA_PARASITE_OPTIONS = ["", "NOPS", "None Found"];

/** Amoeba options. */
const AMOEBA_OPTIONS = ["", "None", "None Found"];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FecalysisSection({
  data,
  onChange,
  disabled,
}: LaboratorySectionProps) {
  const updateField = createFieldUpdater(data, onChange);
  const [repeatDialogOpen, setRepeatDialogOpen] = useState(false);

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      <div className="flex items-center justify-between mb-2">
        <SectionHeader title="Fecalysis" icon={Microscope} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!data.id}
            onClick={() => setRepeatDialogOpen(true)}
            className={cn(
              "text-xs px-3 py-1.5 rounded border border-primary/30 bg-muted hover:bg-primary/10 text-primary/80 font-medium transition-colors",
              !data.id && "opacity-50 pointer-events-none"
            )}
          >
            Repeat Fecalysis
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => window.print()}
            className={cn(
              "text-xs px-3 py-1.5 rounded border border-primary/30 bg-muted hover:bg-primary/10 text-primary/80 font-medium transition-colors inline-flex items-center gap-1",
              disabled && "opacity-50 pointer-events-none"
            )}
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>

      {/* Repeat Fecalysis Dialog */}
      <RepeatFecalysisDialog
        open={repeatDialogOpen}
        onOpenChange={setRepeatDialogOpen}
        laboratoryReportId={data.id}
      />

      {/* Result Date */}
      <div className="mb-3">
        <div className="w-36">
          <label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">
            Result Date
          </label>
          <input
            type="date"
            value={data.fecalysis_result_date}
            onChange={(e) => updateField("fecalysis_result_date", e.target.value)}
            readOnly={disabled}
            className={cn(
              "h-7 w-full text-xs bg-white border border-primary/20 rounded px-2 focus:outline-none focus:border-primary dark:bg-input/30",
              disabled && "pointer-events-none"
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* ============ Left Column ============ */}
        <div className="space-y-1.5">
          <InlineSelect
            label="Color"
            value={data.fecal_color}
            onChange={(v) => updateField("fecal_color", v)}
            options={COLOR_OPTIONS}
            disabled={disabled}
            labelWidth="w-28"
          />
          <InlineSelect
            label="Consistency"
            value={data.fecal_consistency}
            onChange={(v) => updateField("fecal_consistency", v)}
            options={CONSISTENCY_OPTIONS}
            disabled={disabled}
            labelWidth="w-28"
          />
          <InlineSelectWithUnit
            label="Red Blood Cells"
            value={data.fecal_rbc}
            onChange={(v) => updateField("fecal_rbc", v)}
            options={QUANTITY_OPTIONS}
            unit="/HPF"
            disabled={disabled}
          />
          <InlineSelectWithUnit
            label="White Blood Cells"
            value={data.fecal_wbc}
            onChange={(v) => updateField("fecal_wbc", v)}
            options={QUANTITY_OPTIONS}
            unit="/HPF"
            disabled={disabled}
          />
          <InlineField
            label="Others"
            value={data.fecal_others}
            onChange={(v) => updateField("fecal_others", v)}
            disabled={disabled}
            labelWidth="w-28"
          />
        </div>

        {/* ============ Right Column ============ */}
        <div className="space-y-1.5">
          <InlineSelectWithUnit
            label="Ova or Parasite"
            value={data.fecal_ova_parasite}
            onChange={(v) => updateField("fecal_ova_parasite", v)}
            options={OVA_PARASITE_OPTIONS}
            unit="/LPF"
            disabled={disabled}
          />
          <InlineSelectWithUnit
            label="Amoeba"
            value={data.fecal_amoeba}
            onChange={(v) => updateField("fecal_amoeba", v)}
            options={AMOEBA_OPTIONS}
            unit="/LPF"
            disabled={disabled}
          />
          <InlineField
            label="Occult Blood Test"
            value={data.fecal_occult_blood}
            onChange={(v) => updateField("fecal_occult_blood", v)}
            disabled={disabled}
            labelWidth="w-28"
          />
        </div>
      </div>
    </div>
  );
}
