"use client";

/**
 * Urinalysis section for a Laboratory Report.
 *
 * Follows the supplied reference with Macroscopic and Chemical groups on the
 * left and Microscopic, Crystals, and Cast groups on the right.
 */

import { useState, type ReactNode } from "react";
import { Beaker, Printer, RotateCcw } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  InlineField,
  InlineSelect,
  LabFieldWithUnit,
} from "./laboratory-field-helpers";
import { RepeatUrinalysisDialog } from "./RepeatUrinalysisDialog";
import type { LaboratorySectionProps } from "./types";
import { createFieldUpdater } from "./utils";

const COLOR_OPTIONS = [
  "",
  "Yellow",
  "Dark Yellow",
  "Light Yellow",
  "Amber",
  "Red",
  "Orange",
  "Brown",
];
const TRANSPARENCY_OPTIONS = [
  "",
  "Clear",
  "Slightly Hazy",
  "Hazy",
  "Turbid",
];
const CHEMICAL_OPTIONS = ["", "Negative", "Trace", "+1", "+2", "+3", "+4"];

function UrinalysisGroup({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <fieldset
      className={cn(
        "min-w-0 rounded-md border border-primary/15 bg-muted/5 px-3 pb-3",
        className
      )}
    >
      <legend className="px-1 text-xs font-bold uppercase tracking-widest text-primary">
        {title}
      </legend>
      <div className="mt-1">{children}</div>
    </fieldset>
  );
}

/**
 * Displays and edits the Urinalysis portion of a laboratory report.
 */
export default function UrinalysisSection({
  data,
  onChange,
  disabled,
}: LaboratorySectionProps) {
  const updateField = createFieldUpdater(data, onChange);
  const [repeatDialogOpen, setRepeatDialogOpen] = useState(false);
  const hasPersistedReport = Boolean(data.id);

  return (
    <div className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
      <SectionHeader
        title="Urinalysis"
        icon={Beaker}
        action={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasPersistedReport}
              onClick={() => setRepeatDialogOpen(true)}
              className="cursor-pointer"
            >
              <RotateCcw aria-hidden="true" />
              Repeat Urinalysis
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasPersistedReport}
              onClick={() => window.print()}
              className="cursor-pointer"
            >
              <Printer aria-hidden="true" />
              Print
            </Button>
          </div>
        }
      />

      <RepeatUrinalysisDialog
        open={repeatDialogOpen}
        onOpenChange={setRepeatDialogOpen}
        laboratoryReportId={data.id}
      />

      <div className="mb-4 flex items-center gap-3">
        <label
          htmlFor="urinalysis-result-date"
          className="text-[11px] font-bold uppercase tracking-wide text-primary/70"
        >
          Result Date:
        </label>
        <input
          id="urinalysis-result-date"
          type="date"
          value={data.urinalysis_result_date}
          onChange={(event) =>
            updateField("urinalysis_result_date", event.target.value)
          }
          readOnly={disabled}
          className={cn(
            "h-8 w-40 rounded-md border border-primary/30 bg-white px-2 text-xs shadow-sm transition-colors hover:border-primary/50 focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30",
            disabled && "pointer-events-none bg-muted/30"
          )}
        />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(22rem,2fr)]">
        <div className="min-w-0 space-y-4">
          <UrinalysisGroup title="Macroscopic">
            <div className="max-w-xl space-y-2">
              <InlineSelect
                label="Color"
                labelWidth="w-32"
                value={data.urine_color}
                onChange={(value) => updateField("urine_color", value)}
                options={COLOR_OPTIONS}
                disabled={disabled}
              />
              <InlineSelect
                label="Transparency"
                labelWidth="w-32"
                value={data.urine_transparency}
                onChange={(value) => updateField("urine_transparency", value)}
                options={TRANSPARENCY_OPTIONS}
                disabled={disabled}
              />
            </div>
          </UrinalysisGroup>

          <UrinalysisGroup title="Chemical">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <InlineSelect
                  label="Leucocytes"
                  value={data.urine_leucocytes}
                  onChange={(value) => updateField("urine_leucocytes", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
                <InlineSelect
                  label="Nitrite"
                  value={data.urine_nitrite}
                  onChange={(value) => updateField("urine_nitrite", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
                <InlineSelect
                  label="Urobilinogen"
                  value={data.urine_urobilinogen}
                  onChange={(value) => updateField("urine_urobilinogen", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
                <InlineSelect
                  label="Protein"
                  value={data.urine_protein}
                  onChange={(value) => updateField("urine_protein", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
                <InlineField
                  label="pH"
                  value={data.urine_ph}
                  onChange={(value) => updateField("urine_ph", value)}
                  disabled={disabled}
                />
                <InlineSelect
                  label="Blood"
                  value={data.urine_blood}
                  onChange={(value) => updateField("urine_blood", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
              </div>

              <div className="min-w-0 space-y-2">
                <InlineField
                  label="Spec. Gravity"
                  value={data.urine_specific_gravity}
                  onChange={(value) =>
                    updateField("urine_specific_gravity", value)
                  }
                  disabled={disabled}
                />
                <InlineSelect
                  label="Ketone"
                  value={data.urine_ketone}
                  onChange={(value) => updateField("urine_ketone", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
                <InlineSelect
                  label="Bilirubin"
                  value={data.urine_bilirubin}
                  onChange={(value) => updateField("urine_bilirubin", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
                <InlineSelect
                  label="Glucose"
                  value={data.urine_glucose}
                  onChange={(value) => updateField("urine_glucose", value)}
                  options={CHEMICAL_OPTIONS}
                  disabled={disabled}
                />
                <InlineField
                  label="Others"
                  value={data.urine_others}
                  onChange={(value) => updateField("urine_others", value)}
                  disabled={disabled}
                />
              </div>
            </div>
          </UrinalysisGroup>
        </div>

        <div className="min-w-0 space-y-4">
          <UrinalysisGroup title="Microscopic">
            <div className="space-y-2">
              <LabFieldWithUnit
                label="Red Blood Cells"
                unit="/HPF"
                value={data.urine_rbc}
                onChange={(value) => updateField("urine_rbc", value)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="White Blood Cells"
                unit="/HPF"
                value={data.urine_wbc}
                onChange={(value) => updateField("urine_wbc", value)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Amorphous Urates"
                unit="/LPF"
                value={data.urine_amorphous_urates}
                onChange={(value) =>
                  updateField("urine_amorphous_urates", value)
                }
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Amorphous Phosphate"
                unit="/LPF"
                value={data.urine_amorphous_phosphate}
                onChange={(value) =>
                  updateField("urine_amorphous_phosphate", value)
                }
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Epithelial Cells"
                unit="/LPF"
                value={data.urine_epithelial_cells}
                onChange={(value) =>
                  updateField("urine_epithelial_cells", value)
                }
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Mucus Threads"
                unit="/LPF"
                value={data.urine_mucus_threads}
                onChange={(value) => updateField("urine_mucus_threads", value)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Others"
                unit="/LPF"
                value={data.urine_microscopic_others}
                onChange={(value) =>
                  updateField("urine_microscopic_others", value)
                }
                disabled={disabled}
              />
            </div>
          </UrinalysisGroup>

          <UrinalysisGroup title="Crystals">
            <div className="space-y-2">
              <LabFieldWithUnit
                label="Uric Acid"
                unit="/LPF"
                value={data.urine_uric_acid}
                onChange={(value) => updateField("urine_uric_acid", value)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Calcium Oxalate"
                unit="/LPF"
                value={data.urine_calcium_oxalate}
                onChange={(value) => updateField("urine_calcium_oxalate", value)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Others"
                unit="/LPF"
                value={data.urine_crystals_others}
                onChange={(value) =>
                  updateField("urine_crystals_others", value)
                }
                disabled={disabled}
              />
            </div>
          </UrinalysisGroup>

          <UrinalysisGroup title="Cast">
            <div className="space-y-2">
              <LabFieldWithUnit
                label="Fine Granular"
                unit="/LPF"
                value={data.urine_fine_granular}
                onChange={(value) => updateField("urine_fine_granular", value)}
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Coarse Granular"
                unit="/LPF"
                value={data.urine_coarse_granular}
                onChange={(value) =>
                  updateField("urine_coarse_granular", value)
                }
                disabled={disabled}
              />
              <LabFieldWithUnit
                label="Others"
                unit="/LPF"
                value={data.urine_cast_others}
                onChange={(value) => updateField("urine_cast_others", value)}
                disabled={disabled}
              />
            </div>
          </UrinalysisGroup>
        </div>
      </div>
    </div>
  );
}
