"use client";

/**
 * Hematology section for the Laboratory Report form.
 *
 * Three-column layout matching the reference:
 * - Left: CBC (Hemoglobin, Hematocrit, RBC, WBC, Platelet, Blood Type, ESR)
 * - Middle: Differential Count (Lymphocytes, Segmenters, Eosinophils, Monocytes, Myelocytes, Juveniles)
 * - Right: Stab Cells, Basophils, Others
 *
 * Includes a "Repeat Hematology" button that opens the repeat test dialog
 * (only enabled when the record has been persisted).
 *
 * @see RepeatHematologyDialog — popup for managing repeat hematology tests
 * @see HemaRow — shared CBC row component
 * @see DiffRow — shared Differential Count row component
 */

import { useState } from "react";
import { SectionHeader } from "@/components/common/section-header";
import { Droplets, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import { HemaRow, DiffRow } from "./hematology-row-helpers";
import { RepeatHematologyDialog } from "./RepeatHematologyDialog";
import type { LaboratorySectionProps } from "./types";

export default function HematologySection({
  data,
  onChange,
  disabled,
}: LaboratorySectionProps) {
  const updateField = createFieldUpdater(data, onChange);
  const [repeatDialogOpen, setRepeatDialogOpen] = useState(false);

  return (
    <div className="bg-card rounded-lg p-3 shadow-sm border border-primary/10">
      {/* Header row with Repeat Hematology button */}
      <div className="flex items-center justify-between mb-2">
        <SectionHeader title="Laboratory Report (Hematology)" icon={Droplets} />
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
            Repeat Hematology
          </button>
          <button
            type="button"
            disabled={!data.id}
            onClick={() => window.print()}
            className={cn(
              "text-xs px-3 py-1.5 rounded border border-primary/30 bg-muted hover:bg-primary/10 text-primary/80 font-medium transition-colors inline-flex items-center gap-1",
              !data.id && "opacity-50 pointer-events-none"
            )}
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>

      {/* Repeat Hematology Dialog */}
      <RepeatHematologyDialog
        open={repeatDialogOpen}
        onOpenChange={setRepeatDialogOpen}
        laboratoryReportId={data.id}
      />

      {/* Result Date */}
      <div className="mb-4">
        <div className="w-36">
          <label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">
            Result Date
          </label>
          <input
            type="date"
            value={data.hematology_result_date}
            onChange={(e) => updateField("hematology_result_date", e.target.value)}
            readOnly={disabled}
            className={cn(
              "h-7 w-full text-xs bg-white border border-primary/20 rounded px-2 focus:outline-none focus:border-primary dark:bg-input/30",
              disabled && "pointer-events-none"
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-[auto_auto_auto] gap-x-8 items-start">
        {/* ============ Left Column: CBC ============ */}
        <div>
          <div className="space-y-1">
            <HemaRow
              label="HEMOGLOBIN:"
              value={data.hemoglobin}
              onValueChange={(v) => updateField("hemoglobin", v)}
              unit="gm/dl"
              normalRange={`${data.hemoglobin_normal_min} - ${data.hemoglobin_normal_max} gm/dl`}
              disabled={disabled}
            />
            <HemaRow
              label="HEMATOCRIT:"
              value={data.hematocrit}
              onValueChange={(v) => updateField("hematocrit", v)}
              unit="vol%"
              normalRange={`${data.hematocrit_normal_min} - ${data.hematocrit_normal_max} vol%`}
              disabled={disabled}
            />
            <HemaRow
              label="RBC COUNT:"
              value={data.rbc_count}
              onValueChange={(v) => updateField("rbc_count", v)}
              unit="/cumm"
              normalRange={`${data.rbc_count_normal_min} - ${data.rbc_count_normal_max} m/cumm`}
              disabled={disabled}
            />
            <HemaRow
              label="WBC COUNT:"
              value={data.wbc_count}
              onValueChange={(v) => updateField("wbc_count", v)}
              unit="/cumm"
              normalRange={`${data.wbc_count_normal_min} - ${data.wbc_count_normal_max} /cumm`}
              disabled={disabled}
            />
            <HemaRow
              label="PLATELET:"
              value={data.platelet}
              onValueChange={(v) => updateField("platelet", v)}
              unit="/cumm"
              normalRange={`${data.platelet_normal_min} - ${data.platelet_normal_max} /cumm`}
              disabled={disabled}
            />

            {/* Blood Type */}
            <div className="flex items-center">
              <label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider w-[88px] shrink-0 text-right pr-1">
                Blood Type:
              </label>
              <input
                type="text"
                value={data.blood_type}
                onChange={(e) => updateField("blood_type", e.target.value)}
                readOnly={disabled}
                className={cn(
                  "h-7 w-[72px] text-xs bg-white border border-primary/20 rounded px-1 focus:outline-none focus:border-primary dark:bg-input/30",
                  disabled && "pointer-events-none"
                )}
              />
            </div>

            {/* ESR */}
            <div className="flex items-center gap-1">
              <label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider w-[88px] shrink-0 text-right pr-1">
                ESR:
              </label>
              <input
                type="text"
                value={data.esr}
                onChange={(e) => updateField("esr", e.target.value)}
                readOnly={disabled}
                className={cn(
                  "h-7 w-[72px] text-xs bg-white border border-primary/20 rounded px-1 focus:outline-none focus:border-primary dark:bg-input/30",
                  disabled && "pointer-events-none"
                )}
              />
              <span className="text-[9px] text-muted-foreground">mm/hr</span>
              <span className="text-[9px] text-muted-foreground ml-1">mm/hr(MALE)/mm/hr(FEMALE)</span>
            </div>
          </div>
        </div>

        {/* ============ Middle Column: Differential Count ============ */}
        <div>
          <h3 className="text-[11px] font-bold text-primary/80 uppercase tracking-wide mb-1.5 text-center">
            Differential Count:
          </h3>

          <div className="space-y-1">
            <DiffRow
              label="LYMPHOCYTES:"
              value={data.lymphocytes}
              onValueChange={(v) => updateField("lymphocytes", v)}
              normalRange={data.lymphocytes_normal_min && data.lymphocytes_normal_max ? `${data.lymphocytes_normal_min}-${data.lymphocytes_normal_max}%` : undefined}
              disabled={disabled}
            />
            <DiffRow
              label="SEGMENTERS:"
              value={data.segmenters}
              onValueChange={(v) => updateField("segmenters", v)}
              disabled={disabled}
            />
            <DiffRow
              label="EOSINOPHILS:"
              value={data.eosinophils}
              onValueChange={(v) => updateField("eosinophils", v)}
              disabled={disabled}
            />
            <DiffRow
              label="MONOCYTES:"
              value={data.monocytes}
              onValueChange={(v) => updateField("monocytes", v)}
              disabled={disabled}
            />
            <DiffRow
              label="MYELOCYTES:"
              value={data.myelocytes}
              onValueChange={(v) => updateField("myelocytes", v)}
              disabled={disabled}
            />
            <DiffRow
              label="JUVENILES:"
              value={data.juveniles}
              onValueChange={(v) => updateField("juveniles", v)}
              disabled={disabled}
            />
          </div>
        </div>

        {/* ============ Right Column: Stab Cells, Basophils, Others ============ */}
        <div>
          <div className="mb-1.5">
            <span className="text-[10px] font-semibold text-primary/60 italic">&nbsp;</span>
          </div>

          <div className="space-y-1">
            <DiffRow
              label="STAB CELLS:"
              value={data.stab_cells}
              onValueChange={(v) => updateField("stab_cells", v)}
              normalRange={data.stab_cells_normal_min && data.stab_cells_normal_max ? `${data.stab_cells_normal_min}-${data.stab_cells_normal_max}%` : undefined}
              disabled={disabled}
            />
            <DiffRow
              label="BASOPHILS:"
              value={data.basophils}
              onValueChange={(v) => updateField("basophils", v)}
              disabled={disabled}
            />
            <DiffRow
              label="OTHERS:"
              value={data.others_diff}
              onValueChange={(v) => updateField("others_diff", v)}
              disabled={disabled}
              hideTrailingUnit
            />
          </div>
        </div>
      </div>
    </div>
  );
}
