"use client";

/**
 * Hematology section for the Laboratory Report form.
 *
 * Mirrors the supplied laboratory reference: result date and actions first,
 * CBC values on the left, and a two-column differential count on the right.
 * Existing persisted reference ranges are shown when present; unit-only
 * placeholders are used otherwise so clinical values are never invented.
 */

import { useState } from "react";
import { Droplets, Printer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/common/section-header";
import { cn } from "@/lib/utils";
import {
  DiffNormalValuesHeader,
  DiffRow,
  HemaNormalValuesHeader,
  HemaRow,
} from "./hematology-row-helpers";
import { RepeatHematologyDialog } from "./RepeatHematologyDialog";
import type { LaboratorySectionProps } from "./types";
import { createFieldUpdater } from "./utils";

function formatReferenceRange(min: string, max: string, unit: string): string {
  const minimum = min.trim();
  const maximum = max.trim();

  if (minimum && maximum) return `${minimum} - ${maximum} ${unit}`;
  if (minimum || maximum) return `${minimum || maximum} ${unit}`;
  return unit;
}

function formatEsrReference(male: string, female: string): string {
  const maleReference = male.trim();
  const femaleReference = female.trim();

  return [
    `${maleReference ? `${maleReference} ` : ""}mm/hr (Male)`,
    `${femaleReference ? `${femaleReference} ` : ""}mm/hr (Female)`,
  ].join(" / ");
}

/**
 * Displays and edits the hematology portion of a laboratory report.
 */
export default function HematologySection({
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
        title="Laboratory Report (Hematology)"
        icon={Droplets}
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
              Repeat Hematology
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

      <RepeatHematologyDialog
        open={repeatDialogOpen}
        onOpenChange={setRepeatDialogOpen}
        laboratoryReportId={data.id}
      />

      <div className="mb-5 flex items-center gap-3">
        <label
          htmlFor="hematology-result-date"
          className="text-[11px] font-bold uppercase tracking-wide text-primary/70"
        >
          Result Date:
        </label>
        <input
          id="hematology-result-date"
          type="date"
          value={data.hematology_result_date}
          onChange={(event) =>
            updateField("hematology_result_date", event.target.value)
          }
          readOnly={disabled}
          className={cn(
            "h-8 w-40 rounded-md border border-primary/30 bg-white px-2 text-xs shadow-sm transition-colors hover:border-primary/50 focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30",
            disabled && "pointer-events-none bg-muted/30"
          )}
        />
      </div>

      <div className="grid items-start gap-8 xl:grid-cols-3">
        <section aria-label="Complete blood count" className="min-w-0 space-y-1.5">
          <HemaNormalValuesHeader />
          <HemaRow
            label="Hemoglobin:"
            value={data.hemoglobin}
            onValueChange={(value) => updateField("hemoglobin", value)}
            unit="gm/dl"
            normalRange={formatReferenceRange(
              data.hemoglobin_normal_min,
              data.hemoglobin_normal_max,
              "gm/dl"
            )}
            disabled={disabled}
          />
          <HemaRow
            label="Hematocrit:"
            value={data.hematocrit}
            onValueChange={(value) => updateField("hematocrit", value)}
            unit="vol%"
            normalRange={formatReferenceRange(
              data.hematocrit_normal_min,
              data.hematocrit_normal_max,
              "vol%"
            )}
            disabled={disabled}
          />
          <HemaRow
            label="RBC Count:"
            value={data.rbc_count}
            onValueChange={(value) => updateField("rbc_count", value)}
            unit="/cumm"
            normalRange={formatReferenceRange(
              data.rbc_count_normal_min,
              data.rbc_count_normal_max,
              "m/cumm"
            )}
            disabled={disabled}
          />
          <HemaRow
            label="WBC Count:"
            value={data.wbc_count}
            onValueChange={(value) => updateField("wbc_count", value)}
            unit="/cumm"
            normalRange={formatReferenceRange(
              data.wbc_count_normal_min,
              data.wbc_count_normal_max,
              "/cumm"
            )}
            disabled={disabled}
          />
          <HemaRow
            label="Platelet:"
            value={data.platelet}
            onValueChange={(value) => updateField("platelet", value)}
            unit="/cumm"
            normalRange={formatReferenceRange(
              data.platelet_normal_min,
              data.platelet_normal_max,
              "/cumm"
            )}
            disabled={disabled}
          />
          <HemaRow
            label="Blood Type:"
            value={data.blood_type}
            onValueChange={(value) => updateField("blood_type", value)}
            unit=""
            disabled={disabled}
          />
          <HemaRow
            label="ESR:"
            value={data.esr}
            onValueChange={(value) => updateField("esr", value)}
            unit="mm/hr"
            normalRange={formatEsrReference(
              data.esr_normal_male,
              data.esr_normal_female
            )}
            disabled={disabled}
          />
        </section>

        <section
          aria-labelledby="differential-count-title"
          className="min-w-0 xl:col-span-2"
        >
          <h3
            id="differential-count-title"
            className="mb-2 text-center text-sm font-bold uppercase tracking-widest text-foreground"
          >
            Differential Count:
          </h3>

          <div className="grid items-start gap-6 md:grid-cols-2">
            <div className="min-w-0 space-y-1.5">
              <DiffNormalValuesHeader />
              <DiffRow
                label="Lymphocytes:"
                value={data.lymphocytes}
                onValueChange={(value) => updateField("lymphocytes", value)}
                normalRange={formatReferenceRange(
                  data.lymphocytes_normal_min,
                  data.lymphocytes_normal_max,
                  "%"
                )}
                disabled={disabled}
              />
              <DiffRow
                label="Segmenters:"
                value={data.segmenters}
                onValueChange={(value) => updateField("segmenters", value)}
                normalRange="%"
                disabled={disabled}
              />
              <DiffRow
                label="Eosinophils:"
                value={data.eosinophils}
                onValueChange={(value) => updateField("eosinophils", value)}
                normalRange="%"
                disabled={disabled}
              />
              <DiffRow
                label="Monocytes:"
                value={data.monocytes}
                onValueChange={(value) => updateField("monocytes", value)}
                normalRange="%"
                disabled={disabled}
              />
              <DiffRow
                label="Myelocytes:"
                value={data.myelocytes}
                onValueChange={(value) => updateField("myelocytes", value)}
                normalRange="%"
                disabled={disabled}
              />
              <DiffRow
                label="Juveniles:"
                value={data.juveniles}
                onValueChange={(value) => updateField("juveniles", value)}
                normalRange="%"
                disabled={disabled}
              />
            </div>

            <div className="min-w-0 space-y-1.5">
              <DiffNormalValuesHeader />
              <DiffRow
                label="Stab Cells:"
                value={data.stab_cells}
                onValueChange={(value) => updateField("stab_cells", value)}
                normalRange={formatReferenceRange(
                  data.stab_cells_normal_min,
                  data.stab_cells_normal_max,
                  "%"
                )}
                disabled={disabled}
              />
              <DiffRow
                label="Basophils:"
                value={data.basophils}
                onValueChange={(value) => updateField("basophils", value)}
                normalRange="%"
                disabled={disabled}
              />
              <DiffRow
                label="Others:"
                value={data.others_diff}
                onValueChange={(value) => updateField("others_diff", value)}
                normalRange="%"
                disabled={disabled}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
