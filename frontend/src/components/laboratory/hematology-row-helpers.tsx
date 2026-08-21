"use client";

/**
 * Shared row sub-components for hematology form layouts.
 *
 * Used by both the main hematology section and the repeat-test dialog so
 * result, unit, and reference-value columns remain aligned.
 */

import { useId } from "react";
import { cn } from "@/lib/utils";

type HematologyRowLayout = "standard" | "compact";

const HEMA_GRID = {
  standard:
    "grid-cols-[6.75rem_4.5rem_3.5rem_minmax(5rem,1fr)] gap-x-2",
  compact:
    "grid-cols-[5rem_4rem_3.25rem_minmax(4.5rem,1fr)] gap-x-1.5",
} satisfies Record<HematologyRowLayout, string>;

const DIFF_GRID = {
  standard:
    "grid-cols-[7.5rem_3.75rem_1.25rem_minmax(3rem,1fr)] gap-x-2",
  compact:
    "grid-cols-[5rem_3.25rem_1.25rem_minmax(2.5rem,1fr)] gap-x-1.5",
} satisfies Record<HematologyRowLayout, string>;

const rowLabelClassName =
  "text-[11px] font-semibold text-primary/70 uppercase tracking-wide text-right leading-tight";
const inputClassName =
  "h-7 w-full rounded border border-primary/20 bg-white px-2 text-xs transition-colors focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30";
const supportingTextClassName =
  "text-[11px] leading-tight text-foreground/70";

function resolveLayout(
  layout: HematologyRowLayout | undefined,
  legacyWidthOverride: string | undefined
): HematologyRowLayout {
  return layout ?? (legacyWidthOverride ? "compact" : "standard");
}

export interface HemaRowProps {
  /** Row label, for example `HEMOGLOBIN:`. */
  label: string;
  /** Current field value. */
  value: string;
  /** Called when the result value changes. */
  onValueChange: (value: string) => void;
  /** Unit shown beside the result. */
  unit: string;
  /** Persisted reference range or a unit-only fallback. */
  normalRange?: string;
  /** Makes the result non-interactive while retaining its visual value. */
  disabled?: boolean;
  /** Controls standard page or compact dialog spacing. */
  layout?: HematologyRowLayout;
  /** @deprecated Use `layout="compact"`; retained for repeat-dialog compatibility. */
  labelWidth?: string;
  /** @deprecated Use `layout="compact"`; retained for repeat-dialog compatibility. */
  inputWidth?: string;
}

/**
 * Renders one complete-blood-count result row with aligned unit and reference
 * value columns.
 */
export function HemaRow({
  label,
  value,
  onValueChange,
  unit,
  normalRange,
  disabled,
  layout,
  labelWidth,
  inputWidth,
}: HemaRowProps) {
  const inputId = useId();
  const resolvedLayout = resolveLayout(layout, labelWidth ?? inputWidth);

  return (
    <div className={cn("grid min-w-0 items-center", HEMA_GRID[resolvedLayout])}>
      <label htmlFor={inputId} className={rowLabelClassName}>
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        value={value ?? ""}
        onChange={(event) => onValueChange(event.target.value)}
        readOnly={disabled}
        className={cn(inputClassName, disabled && "pointer-events-none bg-muted/30")}
      />
      <span className={supportingTextClassName}>{unit}</span>
      <span className={cn(supportingTextClassName, "min-w-0 break-words")}>
        {normalRange ?? ""}
      </span>
    </div>
  );
}

/**
 * Renders the reference-value heading aligned with the CBC reference column.
 */
export function HemaNormalValuesHeader({
  layout = "standard",
}: {
  layout?: HematologyRowLayout;
}) {
  return (
    <div className={cn("grid items-end", HEMA_GRID[layout])} aria-hidden="true">
      <span className="col-start-4 text-[11px] font-semibold text-primary">
        Normal Values
      </span>
    </div>
  );
}

export interface DiffRowProps {
  /** Row label, for example `LYMPHOCYTES:`. */
  label: string;
  /** Current field value. */
  value: string;
  /** Called when the result value changes. */
  onValueChange: (value: string) => void;
  /** Persisted reference range or a percent-only fallback. */
  normalRange?: string;
  /** Makes the result non-interactive while retaining its visual value. */
  disabled?: boolean;
  /** Hides the result unit for exceptional free-text fields. */
  hideTrailingUnit?: boolean;
  /** Controls standard page or compact dialog spacing. */
  layout?: HematologyRowLayout;
  /** @deprecated Use `layout="compact"`; retained for repeat-dialog compatibility. */
  labelWidth?: string;
  /** @deprecated Use `layout="compact"`; retained for repeat-dialog compatibility. */
  inputWidth?: string;
}

/**
 * Renders one differential-count result row with aligned percent and
 * reference-value columns.
 */
export function DiffRow({
  label,
  value,
  onValueChange,
  normalRange,
  disabled,
  hideTrailingUnit,
  layout,
  labelWidth,
  inputWidth,
}: DiffRowProps) {
  const inputId = useId();
  const resolvedLayout = resolveLayout(layout, labelWidth ?? inputWidth);

  return (
    <div className={cn("grid min-w-0 items-center", DIFF_GRID[resolvedLayout])}>
      <label htmlFor={inputId} className={rowLabelClassName}>
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        value={value ?? ""}
        onChange={(event) => onValueChange(event.target.value)}
        readOnly={disabled}
        className={cn(inputClassName, disabled && "pointer-events-none bg-muted/30")}
      />
      <span className={supportingTextClassName}>
        {hideTrailingUnit ? "" : "%"}
      </span>
      <span className={supportingTextClassName}>{normalRange ?? ""}</span>
    </div>
  );
}

/**
 * Renders the reference-value heading aligned with a differential-count
 * reference column.
 */
export function DiffNormalValuesHeader({
  layout = "standard",
}: {
  layout?: HematologyRowLayout;
}) {
  return (
    <div className={cn("grid items-end", DIFF_GRID[layout])} aria-hidden="true">
      <span className="col-start-4 text-[11px] font-semibold text-primary">
        Normal Values
      </span>
    </div>
  );
}
