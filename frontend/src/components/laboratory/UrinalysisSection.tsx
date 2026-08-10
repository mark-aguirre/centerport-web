"use client";

/**
 * Urinalysis section for the Laboratory Report form.
 *
 * Layout mirrors the reference: two-column design with Macroscopic + Chemical
 * on the left, and Microscopic + Crystals + Cast on the right.
 * A "Repeat Urinalysis" button sits at the top-right of the header row.
 *
 * @see LaboratorySectionProps — shared section component contract
 */

import { useState } from "react";
import { SectionHeader } from "@/components/common/section-header";
import { Beaker, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import { InlineSelect, InlineField, LabFieldWithUnit } from "./laboratory-field-helpers";
import { RepeatUrinalysisDialog } from "./RepeatUrinalysisDialog";
import type { LaboratorySectionProps } from "./types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Urine color options. */
const COLOR_OPTIONS = ["", "Yellow", "Dark Yellow", "Light Yellow", "Amber", "Red", "Orange", "Brown"];

/** Urine transparency options. */
const TRANSPARENCY_OPTIONS = ["", "Clear", "Slightly Hazy", "Hazy", "Turbid"];

/** Chemical test options. */
const CHEMICAL_OPTIONS = ["", "Negative", "Trace", "+1", "+2", "+3", "+4"];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function UrinalysisSection({
  data,
  onChange,
  disabled,
}: LaboratorySectionProps) {
  const updateField = createFieldUpdater(data, onChange);
  const [repeatDialogOpen, setRepeatDialogOpen] = useState(false);

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      {/* Header row with Repeat Urinalysis button */}
      <div className="flex items-center justify-between mb-2">
        <SectionHeader title="Urinalysis" icon={Beaker} />
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
            Repeat Urinalysis
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

      {/* Repeat Urinalysis Dialog */}
      <RepeatUrinalysisDialog
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
            value={data.urinalysis_result_date}
            onChange={(e) => updateField("urinalysis_result_date", e.target.value)}
            readOnly={disabled}
            className={cn(
              "h-7 w-full text-xs bg-white border border-primary/20 rounded px-2 focus:outline-none focus:border-primary dark:bg-input/30",
              disabled && "pointer-events-none"
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-8">
        {/* ============ Left Column: Macroscopic + Chemical ============ */}
        <div className="space-y-4">
          {/* Macroscopic */}
          <div>
            <h3 className="text-[11px] font-bold text-primary/80 uppercase tracking-wide mb-2">
              Macroscopic
            </h3>
            <div className="space-y-1.5">
              <InlineSelect
                label="Color"
                value={data.urine_color}
                onChange={(v) => updateField("urine_color", v)}
                options={COLOR_OPTIONS}
                disabled={disabled}
              />
              <InlineSelect
                label="Transparency"
                value={data.urine_transparency}
                onChange={(v) => updateField("urine_transparency", v)}
                options={TRANSPARENCY_OPTIONS}
                disabled={disabled}
              />
            </div>
          </div>

          {/* Chemical */}
          <div>
            <h3 className="text-[11px] font-bold text-primary/80 uppercase tracking-wide mb-2">
              Chemical
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              <InlineSelect
                label="Leucocytes"
                value={data.urine_leucocytes}
                onChange={(v) => updateField("urine_leucocytes", v)}
                options={CHEMICAL_OPTIONS}
                disabled={disabled}
              />
              <InlineField
                label="Spec. Gravity"
                value={data.urine_specific_gravity}
                onChange={(v) => updateField("urine_specific_gravity", v)}
                disabled={disabled}
              />
              <InlineSelect
                label="Nitrite"
                value={data.urine_nitrite}
                onChange={(v) => updateField("urine_nitrite", v)}
                options={CHEMICAL_OPTIONS}
                disabled={disabled}
              />
              <InlineSelect
                label="Ketone"
                value={data.urine_ketone}
                onChange={(v) => updateField("urine_ketone", v)}
                options={CHEMICAL_OPTIONS}
                disabled={disabled}
              />
              <InlineSelect
                label="Urobilinogen"
                value={data.urine_urobilinogen}
                onChange={(v) => updateField("urine_urobilinogen", v)}
                options={CHEMICAL_OPTIONS}
                disabled={disabled}
              />
              <InlineSelect
                label="Bilirubin"
                value={data.urine_bilirubin}
                onChange={(v) => updateField("urine_bilirubin", v)}
                options={CHEMICAL_OPTIONS}
                disabled={disabled}
              />
              <InlineSelect
                label="Protein"
                value={data.urine_protein}
                onChange={(v) => updateField("urine_protein", v)}
                options={CHEMICAL_OPTIONS}
                disabled={disabled}
              />
              <InlineSelect
                label="Glucose"
                value={data.urine_glucose}
                onChange={(v) => updateField("urine_glucose", v)}
                options={CHEMICAL_OPTIONS}
                disabled={disabled}
              />
              <InlineField
                label="pH"
                value={data.urine_ph}
                onChange={(v) => updateField("urine_ph", v)}
                disabled={disabled}
              />
              <InlineField
                label="Others"
                value={data.urine_others}
                onChange={(v) => updateField("urine_others", v)}
                disabled={disabled}
              />
              <InlineSelect
                label="Blood"
                value={data.urine_blood}
                onChange={(v) => updateField("urine_blood", v)}
                options={CHEMICAL_OPTIONS}
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {/* ============ Right Column: Microscopic + Crystals + Cast ============ */}
        <div className="space-y-4 w-80">
          {/* Microscopic */}
          <div>
            <h3 className="text-[11px] font-bold text-primary/80 uppercase tracking-wide mb-2">
              Microscopic
            </h3>
            <div className="space-y-1.5">
              <LabFieldWithUnit
                label="Red Blood Cells"
                unit="/HPF"
                value={data.urine_rbc}
                onChange={(v) => updateField("urine_rbc", v)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="White Blood Cells"
                unit="/HPF"
                value={data.urine_wbc}
                onChange={(v) => updateField("urine_wbc", v)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Amorphous Urates"
                unit="/LPF"
                value={data.urine_amorphous_urates}
                onChange={(v) => updateField("urine_amorphous_urates", v)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Amorphous Phosphate"
                unit="/LPF"
                value={data.urine_amorphous_phosphate}
                onChange={(v) => updateField("urine_amorphous_phosphate", v)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Epithelial Cells"
                unit="/LPF"
                value={data.urine_epithelial_cells}
                onChange={(v) => updateField("urine_epithelial_cells", v)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Mucus Threads"
                unit="/LPF"
                value={data.urine_mucus_threads}
                onChange={(v) => updateField("urine_mucus_threads", v)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Others"
                unit="/LPF"
                value={data.urine_microscopic_others}
                onChange={(v) => updateField("urine_microscopic_others", v)}
                disabled={disabled}
              />
            </div>
          </div>

          {/* Crystals */}
          <div>
            <h3 className="text-[11px] font-bold text-primary/80 uppercase tracking-wide mb-2">
              Crystals
            </h3>
            <div className="space-y-1.5">
              <LabFieldWithUnit
                label="Uric Acid"
                unit="/LPF"
                value={data.urine_uric_acid}
                onChange={(v) => updateField("urine_uric_acid", v)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Calcium Oxalate"
                unit="/LPF"
                value={data.urine_calcium_oxalate}
                onChange={(v) => updateField("urine_calcium_oxalate", v)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Others"
                unit="/LPF"
                value={data.urine_crystals_others}
                onChange={(v) => updateField("urine_crystals_others", v)}
                disabled={disabled}
              />
            </div>
          </div>

          {/* Cast */}
          <div>
            <h3 className="text-[11px] font-bold text-primary/80 uppercase tracking-wide mb-2">
              Cast
            </h3>
            <div className="space-y-1.5">
              <LabFieldWithUnit
                label="Fine Granular"
                unit="/LPF"
                value={data.urine_fine_granular}
                onChange={(v) => updateField("urine_fine_granular", v)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Coarse Granular"
                unit="/LPF"
                value={data.urine_coarse_granular}
                onChange={(v) => updateField("urine_coarse_granular", v)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Others"
                unit="/LPF"
                value={data.urine_cast_others}
                onChange={(v) => updateField("urine_cast_others", v)}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


