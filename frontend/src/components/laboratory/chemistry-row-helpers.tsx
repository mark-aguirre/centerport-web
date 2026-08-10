"use client";

/**
 * Shared row sub-components for clinical chemistry table layouts.
 *
 * Used by both `ClinicalChemistrySection` (main form) and
 * `RepeatChemistryDialog` (popup form) to render consistent table rows.
 * Extracted to eliminate duplication between the two consumers.
 */

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// ChemRow
// ---------------------------------------------------------------------------

export interface ChemRowProps {
  /** Row label (e.g. "FBS:"). */
  label: string;
  /** S.I. unit reference text (e.g. "mmol/L"). */
  siUnit: string;
  /** Conventional unit reference text (e.g. "mg/dL"). */
  convUnit: string;
  /** Current S.I. result value. */
  resultSi: string;
  /** Callback fired when S.I. result changes. */
  onResultSiChange: (v: string) => void;
  /** Current conventional result value. */
  resultConv: string;
  /** Callback fired when conventional result changes. */
  onResultConvChange: (v: string) => void;
  /** Whether the result is flagged as high. */
  high: boolean;
  /** Callback fired when HIGH checkbox changes. */
  onHighChange: (v: boolean) => void;
  /** Unit suffix for the S.I. result input (e.g. "mmol/l"). */
  resultSiUnit: string;
  /** Unit suffix for the conventional result input (e.g. "mg/dl"). */
  resultConvUnit: string;
  /** When true, all inputs are non-interactive. */
  disabled?: boolean;
}

/**
 * Table row for chemistry tests with full reference range columns.
 *
 * Columns: Examination | S.I. Unit (ref) | Conv Unit (ref) | Result S.I. | HIGH? | Result Conv
 */
export function ChemRow({
  label,
  siUnit,
  convUnit,
  resultSi,
  onResultSiChange,
  resultConv,
  onResultConvChange,
  high,
  onHighChange,
  resultSiUnit,
  resultConvUnit,
  disabled,
}: ChemRowProps) {
  const inputCls = cn(
    "h-6 w-full text-xs bg-white border border-primary/20 rounded px-1 text-center focus:outline-none focus:border-primary dark:bg-input/30",
    disabled && "pointer-events-none"
  );

  return (
    <tr className="border-t border-primary/20">
      <td className="py-1.5 px-2 text-[11px] font-medium border-r border-primary/20">
        {label}
      </td>
      <td className="py-1.5 px-1 text-center border-r border-primary/20">
        <span className="text-[9px] text-muted-foreground">{siUnit}</span>
      </td>
      <td className="py-1.5 px-1 text-center border-r border-primary/20">
        <span className="text-[9px] text-muted-foreground">{convUnit}</span>
      </td>
      <td className="py-1.5 px-1 border-r border-primary/20">
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={resultSi}
            onChange={(e) => onResultSiChange(e.target.value)}
            readOnly={disabled}
            className={inputCls}
          />
          <span className="text-[9px] text-muted-foreground shrink-0">{resultSiUnit}</span>
        </div>
      </td>
      <td className="py-1.5 px-1 text-center border-r border-primary/20">
        <input
          type="checkbox"
          checked={high}
          onChange={(e) => onHighChange(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 accent-destructive"
        />
      </td>
      <td className="py-1.5 px-1">
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={resultConv}
            onChange={(e) => onResultConvChange(e.target.value)}
            readOnly={disabled}
            className={inputCls}
          />
          <span className="text-[9px] text-muted-foreground shrink-0">{resultConvUnit}</span>
        </div>
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// ChemRowSimple
// ---------------------------------------------------------------------------

export interface ChemRowSimpleProps {
  /** Row label (e.g. "SGOT:"). */
  label: string;
  /** S.I. unit reference text (e.g. "IU/L"). */
  siUnit: string;
  /** Current S.I. result value. */
  resultSi: string;
  /** Callback fired when S.I. result changes. */
  onResultSiChange: (v: string) => void;
  /** Current conventional result value. */
  resultConv: string;
  /** Callback fired when conventional result changes. */
  onResultConvChange: (v: string) => void;
  /** Whether the result is flagged as high. */
  high: boolean;
  /** Callback fired when HIGH checkbox changes. */
  onHighChange: (v: boolean) => void;
  /** Unit suffix for the S.I. result input (e.g. "IU/L"). */
  resultSiUnit: string;
  /** Unit suffix for the conventional result input (e.g. "IU/L"). */
  resultConvUnit: string;
  /** When true, all inputs are non-interactive. */
  disabled?: boolean;
}

/**
 * Table row for chemistry tests without conventional reference range.
 *
 * Used for SGOT, SGPT, ALK. PHOS — shows S.I. unit label in reference column,
 * empty conventional reference column.
 */
export function ChemRowSimple({
  label,
  siUnit,
  resultSi,
  onResultSiChange,
  resultConv,
  onResultConvChange,
  high,
  onHighChange,
  resultSiUnit,
  resultConvUnit,
  disabled,
}: ChemRowSimpleProps) {
  const inputCls = cn(
    "h-6 w-full text-xs bg-white border border-primary/20 rounded px-1 text-center focus:outline-none focus:border-primary dark:bg-input/30",
    disabled && "pointer-events-none"
  );

  return (
    <tr className="border-t border-primary/20">
      <td className="py-1.5 px-2 text-[11px] font-medium border-r border-primary/20">
        {label}
      </td>
      <td className="py-1.5 px-1 text-center border-r border-primary/20">
        <span className="text-[9px] text-muted-foreground">{siUnit}</span>
      </td>
      <td className="py-1.5 px-1 border-r border-primary/20">
      </td>
      <td className="py-1.5 px-1 border-r border-primary/20">
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={resultSi}
            onChange={(e) => onResultSiChange(e.target.value)}
            readOnly={disabled}
            className={inputCls}
          />
          <span className="text-[9px] text-muted-foreground shrink-0">{resultSiUnit}</span>
        </div>
      </td>
      <td className="py-1.5 px-1 text-center border-r border-primary/20">
        <input
          type="checkbox"
          checked={high}
          onChange={(e) => onHighChange(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 accent-destructive"
        />
      </td>
      <td className="py-1.5 px-1">
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={resultConv}
            onChange={(e) => onResultConvChange(e.target.value)}
            readOnly={disabled}
            className={inputCls}
          />
          <span className="text-[9px] text-muted-foreground shrink-0">{resultConvUnit}</span>
        </div>
      </td>
    </tr>
  );
}
