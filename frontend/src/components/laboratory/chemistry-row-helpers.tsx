"use client";

/**
 * Shared row components for the main and repeat clinical chemistry tables.
 */

import { cn } from "@/lib/utils";

const cellClassName = "border-r border-primary/15 px-2 py-1.5 last:border-r-0";
const referenceTextClassName = "text-[11px] text-foreground/70";
const resultInputClassName =
  "h-7 min-w-0 w-full rounded border border-primary/20 bg-white px-2 text-center text-xs transition-colors focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30";

export interface ChemRowProps {
  /** Examination label, for example `FBS:`. */
  label: string;
  /** S.I. reference unit. */
  siUnit: string;
  /** Conventional reference unit. */
  convUnit: string;
  /** Current S.I. result value. */
  resultSi: string;
  /** Called when the S.I. result changes. */
  onResultSiChange: (value: string) => void;
  /** Current conventional result value. */
  resultConv: string;
  /** Called when the conventional result changes. */
  onResultConvChange: (value: string) => void;
  /** Whether the result is marked high. */
  high: boolean;
  /** Called when the HIGH checkbox changes. */
  onHighChange: (value: boolean) => void;
  /** Unit shown beside the S.I. result. */
  resultSiUnit: string;
  /** Unit shown beside the conventional result. */
  resultConvUnit: string;
  /** Makes all result controls non-interactive. */
  disabled?: boolean;
}

interface ChemistryResultCellProps {
  label: string;
  value: string;
  unit: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function ChemistryResultCell({
  label,
  value,
  unit,
  onChange,
  disabled,
}: ChemistryResultCellProps) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        readOnly={disabled}
        aria-label={label}
        className={cn(
          resultInputClassName,
          disabled && "pointer-events-none bg-muted/30"
        )}
      />
      <span className="shrink-0 text-[11px] text-foreground/70">{unit}</span>
    </div>
  );
}

function HighResultCheckbox({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      disabled={disabled}
      aria-label={`${label} high result`}
      className="h-4 w-4 cursor-pointer accent-destructive disabled:cursor-not-allowed"
    />
  );
}

/**
 * Renders a six-column chemistry row with S.I. and conventional references and
 * results.
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
  return (
    <tr className="border-t border-primary/15 transition-colors hover:bg-muted/20">
      <th
        scope="row"
        className={cn(
          cellClassName,
          "text-left text-[11px] font-semibold uppercase tracking-wide text-primary/70"
        )}
      >
        {label}
      </th>
      <td className={cn(cellClassName, "text-center")}>
        <span className={referenceTextClassName}>{siUnit}</span>
      </td>
      <td className={cn(cellClassName, "text-center")}>
        <span className={referenceTextClassName}>{convUnit}</span>
      </td>
      <td className={cellClassName}>
        <ChemistryResultCell
          label={`${label} S.I. result`}
          value={resultSi}
          unit={resultSiUnit}
          onChange={onResultSiChange}
          disabled={disabled}
        />
      </td>
      <td className={cn(cellClassName, "text-center")}>
        <HighResultCheckbox
          label={label}
          checked={high}
          onChange={onHighChange}
          disabled={disabled}
        />
      </td>
      <td className={cellClassName}>
        <ChemistryResultCell
          label={`${label} conventional result`}
          value={resultConv}
          unit={resultConvUnit}
          onChange={onResultConvChange}
          disabled={disabled}
        />
      </td>
    </tr>
  );
}

export interface ChemRowSimpleProps {
  /** Examination label, for example `SGOT:`. */
  label: string;
  /** S.I. reference unit. */
  siUnit: string;
  /** Current S.I. result value. */
  resultSi: string;
  /** Called when the S.I. result changes. */
  onResultSiChange: (value: string) => void;
  /** Current conventional result value. */
  resultConv: string;
  /** Called when the conventional result changes. */
  onResultConvChange: (value: string) => void;
  /** Whether the result is marked high. */
  high: boolean;
  /** Called when the HIGH checkbox changes. */
  onHighChange: (value: boolean) => void;
  /** Unit shown beside the S.I. result. */
  resultSiUnit: string;
  /** Unit shown beside the conventional result. */
  resultConvUnit: string;
  /** Makes all result controls non-interactive. */
  disabled?: boolean;
}

/**
 * Renders a chemistry row whose conventional reference cell is intentionally
 * blank, as used by SGOT, SGPT, and alkaline phosphatase.
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
  return (
    <tr className="border-t border-primary/15 transition-colors hover:bg-muted/20">
      <th
        scope="row"
        className={cn(
          cellClassName,
          "text-left text-[11px] font-semibold uppercase tracking-wide text-primary/70"
        )}
      >
        {label}
      </th>
      <td className={cn(cellClassName, "text-center")}>
        <span className={referenceTextClassName}>{siUnit}</span>
      </td>
      <td className={cellClassName} aria-label="No conventional reference" />
      <td className={cellClassName}>
        <ChemistryResultCell
          label={`${label} S.I. result`}
          value={resultSi}
          unit={resultSiUnit}
          onChange={onResultSiChange}
          disabled={disabled}
        />
      </td>
      <td className={cn(cellClassName, "text-center")}>
        <HighResultCheckbox
          label={label}
          checked={high}
          onChange={onHighChange}
          disabled={disabled}
        />
      </td>
      <td className={cellClassName}>
        <ChemistryResultCell
          label={`${label} conventional result`}
          value={resultConv}
          unit={resultConvUnit}
          onChange={onResultConvChange}
          disabled={disabled}
        />
      </td>
    </tr>
  );
}
