"use client";

/**
 * Shared compact field controls for laboratory section layouts.
 */

import { useId } from "react";
import { cn } from "@/lib/utils";

const fieldRowClassName = "flex min-w-0 items-center gap-2";
const fieldLabelClassName =
  "shrink-0 text-[11px] font-semibold uppercase tracking-wide text-primary/70";
const fieldControlClassName =
  "h-7 min-w-0 flex-1 rounded border border-primary/20 bg-white px-2 text-xs transition-colors focus:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 dark:bg-input/30";
const unitClassName = "w-8 shrink-0 text-[11px] text-foreground/70";

export interface InlineSelectProps {
  /** Field label displayed to the left of the select. */
  label: string;
  /** Current selected value. */
  value: string;
  /** Called when the selected value changes. */
  onChange: (value: string) => void;
  /** Available options; an empty string renders as `Select...`. */
  options: string[];
  /** Makes the control non-interactive. */
  disabled?: boolean;
  /** Label width class override. */
  labelWidth?: string;
}

/**
 * Renders a compact labelled select on one row.
 */
export function InlineSelect({
  label,
  value,
  onChange,
  options,
  disabled,
  labelWidth = "w-24",
}: InlineSelectProps) {
  const fieldId = useId();

  return (
    <div className={fieldRowClassName}>
      <label htmlFor={fieldId} className={cn(fieldLabelClassName, labelWidth)}>
        {label}
      </label>
      <select
        id={fieldId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={cn(
          fieldControlClassName,
          "cursor-pointer disabled:cursor-not-allowed",
          disabled && "bg-muted/30 opacity-70"
        )}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option || "Select..."}
          </option>
        ))}
      </select>
    </div>
  );
}

export interface InlineFieldProps {
  /** Field label displayed to the left of the input. */
  label: string;
  /** Current input value. */
  value: string;
  /** Called when the input value changes. */
  onChange: (value: string) => void;
  /** Makes the control non-interactive. */
  disabled?: boolean;
  /** Label width class override. */
  labelWidth?: string;
}

/**
 * Renders a compact labelled text input on one row.
 */
export function InlineField({
  label,
  value,
  onChange,
  disabled,
  labelWidth = "w-24",
}: InlineFieldProps) {
  const fieldId = useId();

  return (
    <div className={fieldRowClassName}>
      <label htmlFor={fieldId} className={cn(fieldLabelClassName, labelWidth)}>
        {label}
      </label>
      <input
        id={fieldId}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        readOnly={disabled}
        className={cn(
          fieldControlClassName,
          disabled && "pointer-events-none bg-muted/30"
        )}
      />
    </div>
  );
}

export interface InlineSelectWithUnitProps {
  /** Field label displayed to the left of the select. */
  label: string;
  /** Current selected value. */
  value: string;
  /** Called when the selected value changes. */
  onChange: (value: string) => void;
  /** Available options; an empty string renders as `Select...`. */
  options: string[];
  /** Unit suffix displayed after the select. */
  unit: string;
  /** Makes the control non-interactive. */
  disabled?: boolean;
  /** Label width class override. */
  labelWidth?: string;
}

/**
 * Renders a compact labelled select with a trailing unit.
 */
export function InlineSelectWithUnit({
  label,
  value,
  onChange,
  options,
  unit,
  disabled,
  labelWidth = "w-28",
}: InlineSelectWithUnitProps) {
  const fieldId = useId();

  return (
    <div className={fieldRowClassName}>
      <label htmlFor={fieldId} className={cn(fieldLabelClassName, labelWidth)}>
        {label}
      </label>
      <select
        id={fieldId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={cn(
          fieldControlClassName,
          "cursor-pointer disabled:cursor-not-allowed",
          disabled && "bg-muted/30 opacity-70"
        )}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option || "Select..."}
          </option>
        ))}
      </select>
      <span className={unitClassName}>{unit}</span>
    </div>
  );
}

export interface InlineFieldWithUnitProps {
  /** Field label displayed to the left of the input. */
  label: string;
  /** Current input value. */
  value: string;
  /** Called when the input value changes. */
  onChange: (value: string) => void;
  /** Unit suffix displayed after the input. */
  unit: string;
  /** Makes the control non-interactive. */
  disabled?: boolean;
  /** Label width class override. */
  labelWidth?: string;
}

/**
 * Renders a compact labelled text input with a trailing unit.
 */
export function InlineFieldWithUnit({
  label,
  value,
  onChange,
  unit,
  disabled,
  labelWidth = "w-28",
}: InlineFieldWithUnitProps) {
  const fieldId = useId();

  return (
    <div className={fieldRowClassName}>
      <label htmlFor={fieldId} className={cn(fieldLabelClassName, labelWidth)}>
        {label}
      </label>
      <input
        id={fieldId}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        readOnly={disabled}
        className={cn(
          fieldControlClassName,
          disabled && "pointer-events-none bg-muted/30"
        )}
      />
      <span className={unitClassName}>{unit}</span>
    </div>
  );
}

export interface LabFieldWithUnitProps {
  /** Right-aligned field label. */
  label: string;
  /** Current input value. */
  value: string;
  /** Called when the input value changes. */
  onChange: (value: string) => void;
  /** Unit suffix displayed after the input. */
  unit: string;
  /** Makes the control non-interactive. */
  disabled?: boolean;
}

/**
 * Renders a right-aligned laboratory label, fixed result input, and unit.
 */
export function LabFieldWithUnit({
  label,
  unit,
  value,
  onChange,
  disabled,
}: LabFieldWithUnitProps) {
  const fieldId = useId();

  return (
    <div className={fieldRowClassName}>
      <label
        htmlFor={fieldId}
        className={cn(fieldLabelClassName, "min-w-0 flex-1 text-right")}
      >
        {label}:
      </label>
      <input
        id={fieldId}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        readOnly={disabled}
        className={cn(
          fieldControlClassName,
          "w-32 flex-none",
          disabled && "pointer-events-none bg-muted/30"
        )}
      />
      <span className={cn(unitClassName, "w-8")}>{unit}</span>
    </div>
  );
}
