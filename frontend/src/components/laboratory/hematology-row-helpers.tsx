"use client";

/**
 * Shared row sub-components for hematology form layouts.
 *
 * Used by both `HematologySection` (main form) and `RepeatHematologyDialog`
 * (popup form) to render consistent CBC and Differential Count rows.
 * Extracted to eliminate duplication between the two consumers.
 */

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// HemaRow
// ---------------------------------------------------------------------------

export interface HemaRowProps {
  /** Row label (e.g. "HEMOGLOBIN:"). */
  label: string;
  /** Current field value. */
  value: string;
  /** Callback fired when value changes. */
  onValueChange: (v: string) => void;
  /** Unit suffix displayed after the input (e.g. "gm/dl"). */
  unit: string;
  /** Normal range text displayed at the end (e.g. "12.0 - 16.0 gm/dl"). */
  normalRange?: string;
  /** When true, the field is non-interactive. */
  disabled?: boolean;
  /** Label width class override (default: "w-[88px]"). */
  labelWidth?: string;
  /** Input width class override (default: "w-[72px]"). */
  inputWidth?: string;
}

/**
 * CBC row: label | [result input] | unit | normal range text.
 *
 * Renders a horizontal row for Complete Blood Count values with an
 * inline result input, unit suffix, and optional reference range.
 */
export function HemaRow({
  label,
  value,
  onValueChange,
  unit,
  normalRange,
  disabled,
  labelWidth = "w-[88px]",
  inputWidth = "w-[72px]",
}: HemaRowProps) {
  const inputCls = cn(
    "h-7 text-xs bg-white border border-primary/20 rounded px-1 focus:outline-none focus:border-primary dark:bg-input/30",
    inputWidth,
    disabled && "pointer-events-none"
  );

  return (
    <div className="flex items-center gap-1.5">
      <label
        className={cn(
          "text-[10px] font-semibold text-primary/60 uppercase tracking-wider shrink-0 text-right pr-1",
          labelWidth
        )}
      >
        {label}
      </label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onValueChange(e.target.value)}
        readOnly={disabled}
        className={inputCls}
      />
      <span className="text-[9px] text-muted-foreground w-9 shrink-0 ml-1">{unit}</span>
      {normalRange && (
        <span className="text-[9px] text-muted-foreground ml-2 italic">{normalRange}</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DiffRow
// ---------------------------------------------------------------------------

export interface DiffRowProps {
  /** Row label (e.g. "LYMPHOCYTES:"). */
  label: string;
  /** Current field value. */
  value: string;
  /** Callback fired when value changes. */
  onValueChange: (v: string) => void;
  /** Normal range text displayed at the end (e.g. "20-40%"). */
  normalRange?: string;
  /** When true, the field is non-interactive. */
  disabled?: boolean;
  /** When true, hides the trailing "%" unit. */
  hideTrailingUnit?: boolean;
  /** Label width class override (default: "w-[88px]"). */
  labelWidth?: string;
  /** Input width class override (default: "w-[60px]"). */
  inputWidth?: string;
}

/**
 * Differential Count row: label | [result input] | % | normal range text.
 *
 * Renders a horizontal row for differential count values with an
 * inline result input, optional "%" suffix, and optional reference range.
 */
export function DiffRow({
  label,
  value,
  onValueChange,
  normalRange,
  disabled,
  hideTrailingUnit,
  labelWidth = "w-[88px]",
  inputWidth = "w-[60px]",
}: DiffRowProps) {
  const inputCls = cn(
    "h-7 text-xs bg-white border border-primary/20 rounded px-1 focus:outline-none focus:border-primary dark:bg-input/30",
    inputWidth,
    disabled && "pointer-events-none"
  );

  return (
    <div className="flex items-center gap-1.5">
      <label
        className={cn(
          "text-[10px] font-semibold text-primary/60 uppercase tracking-wider shrink-0 text-right pr-1",
          labelWidth
        )}
      >
        {label}
      </label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onValueChange(e.target.value)}
        readOnly={disabled}
        className={inputCls}
      />
      {!hideTrailingUnit && (
        <span className="text-[9px] text-muted-foreground ml-1 w-3 shrink-0">%</span>
      )}
      {normalRange && (
        <span className="text-[9px] text-muted-foreground ml-2 italic">{normalRange}</span>
      )}
    </div>
  );
}
