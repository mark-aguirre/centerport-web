"use client";

import { Loader2, Pencil, Save, SlidersHorizontal, X } from "lucide-react";

import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSingleRecordForm } from "@/hooks/use-single-record-form";
import { api } from "@/lib/api";
import {
  EMPTY_DEFAULT_VALUES,
  type DefaultValues,
} from "@/components/default-values/types";

/** A single labeled value row: LABEL : [ input ] unit */
function ValueRow({
  label,
  value,
  unit,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  unit?: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr_auto] items-center gap-2">
      <Label className="text-[11px] font-semibold text-foreground/80 uppercase tracking-wide">
        {label}
      </Label>
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        readOnly={disabled}
        tabIndex={disabled ? -1 : undefined}
        className={`h-7 text-xs bg-white border border-primary/30 rounded-md px-2 shadow-sm focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30 ${
          disabled ? "pointer-events-none opacity-90" : ""
        }`}
      />
      <span className="min-w-[72px] text-[11px] text-muted-foreground">
        {unit ?? ""}
      </span>
    </div>
  );
}

/** Column heading shown above each group of values, matching the report form. */
function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-primary/70 text-center pb-1">
      {children}
    </p>
  );
}

/**
 * Hematology default values — a single editable reference-values form rendered
 * directly in the tab (no list, search, or dialog).
 *
 * Loads the one persisted record (or the seeded defaults for first-time use),
 * shows it read-only, and toggles into an editable state via Edit. Saving
 * creates the record the first time and updates it thereafter.
 */
export function DefaultValuesView() {
  const form = useSingleRecordForm<DefaultValues>({
    api: api.entities.DefaultValues,
    empty: EMPTY_DEFAULT_VALUES,
    label: "hematology values",
  });

  const { data, updateField, loading, saving, editing, edit, cancel, save } = form;
  const disabled = !editing;

  const set = <K extends keyof DefaultValues>(field: K) => (value: string) =>
    updateField(field, value as DefaultValues[K]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const headerActions = editing ? (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={cancel}
        disabled={saving}
      >
        <X className="w-4 h-4 mr-1" />
        Cancel
      </Button>
      <Button size="sm" className="cursor-pointer" onClick={save} disabled={saving}>
        {saving ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <Save className="w-4 h-4 mr-1" />
        )}
        Save
      </Button>
    </div>
  ) : (
    <Button size="sm" className="cursor-pointer" onClick={edit}>
      <Pencil className="w-4 h-4 mr-1" />
      Edit
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
        <SectionHeader
          title="Laboratory Report (Hematology)"
          icon={SlidersHorizontal}
          subtitle="Normal / reference values"
          banner
          action={headerActions}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left column — primary values with units */}
          <div className="space-y-2">
            <ColumnHeading>Normal Values</ColumnHeading>
            <ValueRow label="Hemoglobin" value={data.hemoglobin} unit="gm/dl" disabled={disabled} onChange={set("hemoglobin")} />
            <ValueRow label="Hematocrit" value={data.hematocrit} unit="vol%" disabled={disabled} onChange={set("hematocrit")} />
            <ValueRow label="RBC Count" value={data.rbc_count} unit="/cumm" disabled={disabled} onChange={set("rbc_count")} />
            <ValueRow label="WBC Count" value={data.wbc_count} unit="/cumm" disabled={disabled} onChange={set("wbc_count")} />
            <ValueRow label="Platelet" value={data.platelet} unit="/cumm" disabled={disabled} onChange={set("platelet")} />
            <ValueRow label="Blood Type" value={data.blood_type} disabled={disabled} onChange={set("blood_type")} />
            <ValueRow label="ESR" value={data.esr_male} unit="mm/hr (Male)" disabled={disabled} onChange={set("esr_male")} />
            <ValueRow label="" value={data.esr_female} unit="mm/hr (Female)" disabled={disabled} onChange={set("esr_female")} />
          </div>

          {/* Middle column — differential count (%) */}
          <div className="space-y-2">
            <ColumnHeading>Normal Values</ColumnHeading>
            <ValueRow label="Lymphocytes" value={data.lymphocytes} unit="%" disabled={disabled} onChange={set("lymphocytes")} />
            <ValueRow label="Segmenters" value={data.segmenters} unit="%" disabled={disabled} onChange={set("segmenters")} />
            <ValueRow label="Eosinophils" value={data.eosinophils} unit="%" disabled={disabled} onChange={set("eosinophils")} />
            <ValueRow label="Monocytes" value={data.monocytes} unit="%" disabled={disabled} onChange={set("monocytes")} />
            <ValueRow label="Myelocytes" value={data.myelocytes} unit="%" disabled={disabled} onChange={set("myelocytes")} />
            <ValueRow label="Juveniles" value={data.juveniles} unit="%" disabled={disabled} onChange={set("juveniles")} />
          </div>

          {/* Right column — additional differential (%) */}
          <div className="space-y-2">
            <ColumnHeading>Normal Values</ColumnHeading>
            <ValueRow label="Stab Cells" value={data.stab_cells} unit="%" disabled={disabled} onChange={set("stab_cells")} />
            <ValueRow label="Basophils" value={data.basophils} unit="%" disabled={disabled} onChange={set("basophils")} />
            <ValueRow label="Others" value={data.others} unit="%" disabled={disabled} onChange={set("others")} />
          </div>
        </div>
      </div>
    </div>
  );
}
