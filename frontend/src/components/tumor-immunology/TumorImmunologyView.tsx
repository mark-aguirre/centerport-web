"use client";

import { Loader2, Pencil, Save, TestTube, X } from "lucide-react";

import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSingleRecordForm } from "@/hooks/use-single-record-form";
import { api } from "@/lib/api";
import {
  EMPTY_TUMOR_IMMUNOLOGY,
  type TumorImmunology,
} from "@/components/tumor-immunology/types";

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
    <div className="grid grid-cols-[150px_1fr_auto] items-center gap-2">
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
      <span className="min-w-[40px] text-[11px] text-muted-foreground">
        {unit ?? ""}
      </span>
    </div>
  );
}

/** Group sub-heading (Tumor Marker / Immunological Test), matching the form. */
function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-primary/80 pt-2 pb-0.5">
      {children}
    </p>
  );
}

/**
 * Tumor / Immunological default values — a single editable reference-values
 * form ("FORM LAB 33") rendered directly in the tab (no list, search, or
 * dialog).
 *
 * Loads the one persisted record (or empty defaults for first-time use), shows
 * it read-only, and toggles into an editable state via Edit. Saving creates the
 * record the first time and updates it thereafter.
 */
export function TumorImmunologyView() {
  const form = useSingleRecordForm<TumorImmunology>({
    api: api.entities.TumorImmunology,
    empty: EMPTY_TUMOR_IMMUNOLOGY,
    label: "tumor/immunology values",
  });

  const { data, updateField, loading, saving, editing, edit, cancel, save } = form;
  const disabled = !editing;

  const set = <K extends keyof TumorImmunology>(field: K) => (value: string) =>
    updateField(field, value as TumorImmunology[K]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        {editing ? (
          <>
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
          </>
        ) : (
          <Button size="sm" className="cursor-pointer" onClick={edit}>
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}
      </div>

      <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
        <SectionHeader
          title="Form Lab 33 — Reference Values"
          icon={TestTube}
          subtitle="Tumor Marker & Immunological Test (S.I. Unit)"
        />

        <div className="max-w-xl space-y-1">
          {/* Column heading */}
          <div className="grid grid-cols-[150px_1fr_auto] items-center gap-2 pb-1">
            <span />
            <span className="text-[11px] font-bold text-primary/70 uppercase tracking-wider text-center">
              S.I. Unit
            </span>
            <span className="min-w-[40px]" />
          </div>

          {/* Tumor Marker */}
          <GroupHeading>Tumor Marker</GroupHeading>
          <ValueRow label="PSA" value={data.psa} unit="ML" disabled={disabled} onChange={set("psa")} />
          <ValueRow label="AFP" value={data.afp} unit="ML" disabled={disabled} onChange={set("afp")} />
          <ValueRow label="Others" value={data.tumor_others} unit="ML" disabled={disabled} onChange={set("tumor_others")} />

          {/* Immunological Test */}
          <GroupHeading>Immunological Test</GroupHeading>
          <ValueRow label="Anti-HBS" value={data.anti_hbs} disabled={disabled} onChange={set("anti_hbs")} />
          <ValueRow label="Anti-HBC Total" value={data.anti_hbc_total} disabled={disabled} onChange={set("anti_hbc_total")} />
          <ValueRow label="Anti-HCV" value={data.anti_hcv} disabled={disabled} onChange={set("anti_hcv")} />
          <ValueRow label="HBsAg" value={data.hbsag} disabled={disabled} onChange={set("hbsag")} />
          <ValueRow label="" value={data.immuno_extra} disabled={disabled} onChange={set("immuno_extra")} />
          <ValueRow label="Others" value={data.immuno_others} disabled={disabled} onChange={set("immuno_others")} />
        </div>
      </div>
    </div>
  );
}
