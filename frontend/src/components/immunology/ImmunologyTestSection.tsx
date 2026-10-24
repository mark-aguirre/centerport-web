"use client";

/**
 * Immunology / Serology test section for an immunology report.
 *
 * Mirrors the reference form's three-column layout
 * (TEST | REFERENCE VALUES | RESULT) across two groups:
 *  - TUMOR MARKER: PSA (fixed reference) and a free-text "Other" test.
 *  - IMMUNOLOGY TEST: HBsAg, RPR, Anti-HBS as Non Reactive / Reactive
 *    radio rows, with a Cut Off input and a free-text result line for Anti-HBS.
 */

import { FlaskConical } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { ImmunologyReport, ImmunologySectionProps } from "./types";

/** Reactive-state options shared by the immunology radio rows. */
const REACTIVITY_OPTIONS = ["Non Reactive", "Reactive"] as const;

/** Scroll-anchor id for one of this card's test groups. */
export function immunologyGroupAnchorId(key: string): string {
  return `immunology-group-${key}`;
}

/**
 * The card's test groups, in order.
 *
 * Exported so the page's left-rail navigator can jump to them without
 * keeping a second copy of the labels.
 */
export const IMMUNOLOGY_GROUPS = [
  { key: "tumor-marker", label: "Tumor Marker" },
  { key: "immunology-test", label: "Immunology Test" },
] as const;

export default function ImmunologyTestSection({
  data,
  onChange,
  disabled,
}: ImmunologySectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  const inputClasses = cn(
    "h-7 text-xs bg-white border border-primary/20 rounded px-2",
    "focus:outline-none focus-visible:border-primary dark:bg-input/30",
    disabled && "pointer-events-none opacity-70"
  );

  /** Clears a reactivity radio row back to the unselected state. */
  const clearReactivity = (field: keyof ImmunologyReport) =>
    updateField(field, "");

  return (
    <div className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
      <SectionHeader title="Immunology / Serology" icon={FlaskConical} banner />

      {/* Column headers */}
      <div className="grid grid-cols-[1.3fr_1.4fr_1.6fr] gap-3 items-end px-1 pb-2 border-b border-primary/10">
        <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
          Test
        </span>
        <span className="text-[11px] font-bold text-primary uppercase tracking-wider text-center">
          Reference Values
        </span>
        <span className="text-[11px] font-bold text-primary uppercase tracking-wider text-center">
          Result
        </span>
      </div>

      {/* ---------------- TUMOR MARKER ---------------- */}
      <div id={immunologyGroupAnchorId("tumor-marker")} className="mt-3 scroll-mt-4">
        <h3 className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider mb-2">
          Tumor Marker
        </h3>

        <div className="space-y-2">
          {/* PSA — fixed reference value */}
          <div className="grid grid-cols-[1.3fr_1.4fr_1.6fr] gap-3 items-center">
            <Label className="text-xs text-foreground/80">PSA:</Label>
            <span className="text-xs text-foreground/70 text-center">
              {data.psa_reference || "< 4.0 ng/ml"}
            </span>
            <Input
              value={data.psa_result}
              onChange={(e) => updateField("psa_result", e.target.value)}
              className={inputClasses}
              disabled={disabled}
              aria-label="PSA result"
            />
          </div>

          {/* Other — free-text test name + reference + result */}
          <div className="grid grid-cols-[1.3fr_1.4fr_1.6fr] gap-3 items-center">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-foreground/80 whitespace-nowrap">Other:</Label>
              <Input
                value={data.other_test_name}
                onChange={(e) => updateField("other_test_name", e.target.value)}
                className={cn(inputClasses, "flex-1")}
                disabled={disabled}
                placeholder="Test name"
                aria-label="Other test name"
              />
            </div>
            <Input
              value={data.other_reference}
              onChange={(e) => updateField("other_reference", e.target.value)}
              className={inputClasses}
              disabled={disabled}
              placeholder="Reference"
              aria-label="Other reference value"
            />
            <Input
              value={data.other_result}
              onChange={(e) => updateField("other_result", e.target.value)}
              className={inputClasses}
              disabled={disabled}
              aria-label="Other result"
            />
          </div>
        </div>
      </div>

      {/* ---------------- IMMUNOLOGY TEST ---------------- */}
      <div id={immunologyGroupAnchorId("immunology-test")} className="mt-5 scroll-mt-4">
        <h3 className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider mb-2">
          Immunology Test
        </h3>

        <div className="space-y-2">
          {/* HBsAg */}
          <ReactivityRow
            label="HBsAg:"
            name="immunology_hbsag"
            value={data.hbsag_result}
            onSelect={(v) => updateField("hbsag_result", v)}
            onClear={() => clearReactivity("hbsag_result")}
            disabled={disabled}
          />

          {/* RPR */}
          <ReactivityRow
            label="RPR:"
            name="immunology_rpr"
            value={data.rpr_result}
            onSelect={(v) => updateField("rpr_result", v)}
            onClear={() => clearReactivity("rpr_result")}
            disabled={disabled}
          />

          {/* Anti-HBS — reactivity + Cut Off reference + free-text result line */}
          <div className="grid grid-cols-[1.3fr_1.4fr_1.6fr] gap-3 items-center">
            <Label className="text-xs text-foreground/80">Anti-HBS:</Label>
            <div className="flex items-center justify-center gap-2">
              <Label className="text-[11px] text-foreground/70 whitespace-nowrap">
                Cut Off:
              </Label>
              <Input
                value={data.anti_hbs_cut_off}
                onChange={(e) => updateField("anti_hbs_cut_off", e.target.value)}
                className={cn(inputClasses, "flex-1")}
                disabled={disabled}
                aria-label="Anti-HBS cut off"
              />
            </div>
            <ReactivityChoice
              name="immunology_anti_hbs"
              value={data.anti_hbs_result}
              onSelect={(v) => updateField("anti_hbs_result", v)}
              onClear={() => clearReactivity("anti_hbs_result")}
              disabled={disabled}
            />
          </div>

          {/* Anti-HBS free-text result line (matches the trailing input in the reference) */}
          <div className="grid grid-cols-[1.3fr_1.4fr_1.6fr] gap-3 items-center">
            <span />
            <span />
            <Input
              value={data.anti_hbs_result_line}
              onChange={(e) => updateField("anti_hbs_result_line", e.target.value)}
              className={inputClasses}
              disabled={disabled}
              placeholder="Result"
              aria-label="Anti-HBS result"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ReactivityRowProps {
  label: string;
  name: string;
  value: string;
  onSelect: (value: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

/** A full TEST | (empty reference) | RESULT row with reactivity radios. */
function ReactivityRow({ label, name, value, onSelect, onClear, disabled }: ReactivityRowProps) {
  return (
    <div className="grid grid-cols-[1.3fr_1.4fr_1.6fr] gap-3 items-center">
      <Label className="text-xs text-foreground/80">{label}</Label>
      <span />
      <ReactivityChoice
        name={name}
        value={value}
        onSelect={onSelect}
        onClear={onClear}
        disabled={disabled}
      />
    </div>
  );
}

interface ReactivityChoiceProps {
  name: string;
  value: string;
  onSelect: (value: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

/**
 * The Non Reactive / Reactive radio pair with a clear (X) control, styled as
 * a bordered result cell to match the reference form.
 */
function ReactivityChoice({ name, value, onSelect, onClear, disabled }: ReactivityChoiceProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded border border-primary/20 bg-white px-2 h-7 dark:bg-input/30",
        disabled && "opacity-70"
      )}
      role="radiogroup"
      aria-label={`${name} reactivity`}
    >
      <div className="flex items-center gap-4">
        {REACTIVITY_OPTIONS.map((option) => (
          <label
            key={option}
            className={cn(
              "flex items-center gap-1.5",
              disabled ? "cursor-default" : "cursor-pointer"
            )}
          >
            <input
              type="radio"
              name={name}
              checked={value === option}
              onChange={() => onSelect(option)}
              disabled={disabled}
              className="w-4 h-4 accent-primary"
              aria-label={`${name} - ${option}`}
            />
            <span className="text-xs text-foreground/80">{option}</span>
          </label>
        ))}
      </div>
      {value && !disabled && (
        <button
          type="button"
          onClick={onClear}
          className="text-destructive text-xs font-bold px-1 leading-none cursor-pointer hover:opacity-70"
          aria-label={`Clear ${name}`}
        >
          ✕
        </button>
      )}
    </div>
  );
}
