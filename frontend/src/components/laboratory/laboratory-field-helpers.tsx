"use client";

/**
 * Shared compact field controls for laboratory section layouts.
 */

import { useId, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Titled card wrapping one group of laboratory fields.
 *
 * Icon chip, group name, and a one-line description of what the group covers,
 * so a long result form stays scannable. Shared by the result sections and
 * their repeat dialogs.
 */
export function LabGroupCard({
  title,
  subtitle,
  icon: Icon,
  className,
  bodyClassName,
  children,
}: {
  /** Group name. */
  title: string;
  /** One-line description of what the group covers. */
  subtitle: string;
  /** Leading icon shown in the chip. */
  icon: LucideIcon;
  /** Extra classes for the card element. */
  className?: string;
  /** Extra classes for the body wrapper, e.g. `"p-0"` for a full-bleed table. */
  bodyClassName?: string;
  /** The group's fields. */
  children: ReactNode;
}) {
  return (
    <fieldset
      className={cn(
        "min-w-0 overflow-hidden rounded-lg border border-primary/15 bg-card shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-primary/10 bg-muted/20 px-3 py-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold leading-tight text-foreground">
            {title}
          </h4>
          <p className="text-[11px] leading-tight text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>
      <div className={cn("p-3", bodyClassName)}>{children}</div>
    </fieldset>
  );
}

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

export interface InlineSelectWithOtherProps {
  /** Field label displayed to the left of the select. */
  label: string;
  /** Current value. May be one of `options` or a free-text custom value. */
  value: string;
  /** Called when the effective value changes. */
  onChange: (value: string) => void;
  /**
   * Available options; an empty string renders as `Select...`. The `"Other"`
   * sentinel is appended automatically and should not be included here.
   */
  options: string[];
  /** Makes the control non-interactive. */
  disabled?: boolean;
  /** Label width class override. */
  labelWidth?: string;
  /** Placeholder for the free-text input shown when `Other` is selected. */
  otherPlaceholder?: string;
}

/** Sentinel option label that reveals the free-text input. */
const OTHER_OPTION = "Other";

/**
 * Renders a labelled select with an `Other` choice that reveals a free-text
 * input on the same row.
 *
 * The committed `value` is the single source of truth: a value that is not one
 * of `options` (and is non-empty) is treated as a custom entry, so the select
 * shows `Other` and the input holds that text. This keeps the stored field a
 * plain string with no extra flag to persist.
 */
export function InlineSelectWithOther({
  label,
  value,
  onChange,
  options,
  disabled,
  labelWidth = "w-24",
  otherPlaceholder = "Specify color",
}: InlineSelectWithOtherProps) {
  const fieldId = useId();
  const inputId = useId();
  // A non-empty value outside the known options is a custom ("Other") entry.
  const valueIsCustom = value !== "" && !options.includes(value);
  // Keep "Other" selected after the user picks it, even while the custom text
  // is still empty (empty text alone would otherwise look like a known value).
  const [otherSelected, setOtherSelected] = useState(valueIsCustom);
  const isOther = valueIsCustom || otherSelected;
  const selectValue = isOther ? OTHER_OPTION : value;

  return (
    <div className={fieldRowClassName}>
      <label htmlFor={fieldId} className={cn(fieldLabelClassName, labelWidth)}>
        {label}
      </label>
      <select
        id={fieldId}
        value={selectValue}
        onChange={(event) => {
          const next = event.target.value;
          if (next === OTHER_OPTION) {
            // Reveal the free-text input and clear any prior known value.
            setOtherSelected(true);
            onChange("");
            return;
          }
          // A real option was chosen: leave "Other" mode and commit it.
          setOtherSelected(false);
          onChange(next);
        }}
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
        <option value={OTHER_OPTION}>{OTHER_OPTION}</option>
      </select>
      {isOther && (
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          readOnly={disabled}
          placeholder={otherPlaceholder}
          aria-label={`${label} (other)`}
          autoFocus={!disabled}
          className={cn(
            fieldControlClassName,
            disabled && "pointer-events-none bg-muted/30"
          )}
        />
      )}
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

export interface LabSelectWithUnitProps {
  /** Right-aligned field label. */
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
}

/**
 * Renders a right-aligned laboratory label, fixed result select, and unit.
 *
 * Layout mirrors {@link LabFieldWithUnit} so grouped result rows stay aligned
 * whether a value is free-text or picked from a constrained list.
 */
export function LabSelectWithUnit({
  label,
  value,
  onChange,
  options,
  unit,
  disabled,
}: LabSelectWithUnitProps) {
  const fieldId = useId();

  return (
    <div className={fieldRowClassName}>
      <label
        htmlFor={fieldId}
        className={cn(fieldLabelClassName, "min-w-0 flex-1 text-right")}
      >
        {label}:
      </label>
      <select
        id={fieldId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={cn(
          fieldControlClassName,
          "w-32 flex-none cursor-pointer disabled:cursor-not-allowed",
          disabled && "bg-muted/30 opacity-70"
        )}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option || "Select..."}
          </option>
        ))}
      </select>
      <span className={cn(unitClassName, "w-8")}>{unit}</span>
    </div>
  );
}
