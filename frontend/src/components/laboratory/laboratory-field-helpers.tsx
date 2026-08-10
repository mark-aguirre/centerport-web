"use client";

/**
 * Shared inline form field components for laboratory section layouts.
 *
 * Used by UrinalysisSection and FecalysisSection to render consistent
 * inline label + input/select rows. Extracted to eliminate cross-file
 * duplication of identical sub-components.
 */

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// InlineSelect
// ---------------------------------------------------------------------------

export interface InlineSelectProps {
  /** Field label displayed to the left of the select. */
  label: string;
  /** Current selected value. */
  value: string;
  /** Callback fired when selection changes. */
  onChange: (v: string) => void;
  /** Available options (first empty string renders as "Select..."). */
  options: string[];
  /** When true, the field is non-interactive. */
  disabled?: boolean;
  /** Label width class override (default: "w-24"). */
  labelWidth?: string;
}

/**
 * Inline select with label on the left and dropdown on the right (same row).
 *
 * Renders a compact horizontal layout suitable for dense form sections.
 */
export function InlineSelect({
  label,
  value,
  onChange,
  options,
  disabled,
  labelWidth = "w-24",
}: InlineSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        className={cn(
          "text-[10px] font-semibold text-primary/60 uppercase tracking-wider shrink-0",
          labelWidth
        )}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "h-7 flex-1 text-xs bg-white border border-primary/20 rounded px-2 focus:outline-none focus:border-primary dark:bg-input/30",
          disabled && "pointer-events-none opacity-70"
        )}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt || "Select..."}
          </option>
        ))}
      </select>
    </div>
  );
}

// ---------------------------------------------------------------------------
// InlineField
// ---------------------------------------------------------------------------

export interface InlineFieldProps {
  /** Field label displayed to the left of the input. */
  label: string;
  /** Current input value. */
  value: string;
  /** Callback fired when input value changes. */
  onChange: (v: string) => void;
  /** When true, the field is non-interactive. */
  disabled?: boolean;
  /** Label width class override (default: "w-24"). */
  labelWidth?: string;
}

/**
 * Inline text input with label on the left and input on the right (same row).
 *
 * Renders a compact horizontal layout suitable for dense form sections.
 */
export function InlineField({
  label,
  value,
  onChange,
  disabled,
  labelWidth = "w-24",
}: InlineFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        className={cn(
          "text-[10px] font-semibold text-primary/60 uppercase tracking-wider shrink-0",
          labelWidth
        )}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={disabled}
        className={cn(
          "h-7 flex-1 text-xs bg-white border border-primary/20 rounded px-2 focus:outline-none focus:border-primary dark:bg-input/30",
          disabled && "pointer-events-none"
        )}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// InlineSelectWithUnit
// ---------------------------------------------------------------------------

export interface InlineSelectWithUnitProps {
  /** Field label displayed to the left of the select. */
  label: string;
  /** Current selected value. */
  value: string;
  /** Callback fired when selection changes. */
  onChange: (v: string) => void;
  /** Available options (first empty string renders as "Select..."). */
  options: string[];
  /** Unit suffix displayed after the select (e.g. "/HPF"). */
  unit: string;
  /** When true, the field is non-interactive. */
  disabled?: boolean;
  /** Label width class override (default: "w-28"). */
  labelWidth?: string;
}

/**
 * Inline select with a trailing unit label (e.g. "/HPF").
 *
 * Same layout as `InlineSelect` but appends a unit suffix after the dropdown.
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
  return (
    <div className="flex items-center gap-2">
      <label
        className={cn(
          "text-[10px] font-semibold text-primary/60 uppercase tracking-wider shrink-0",
          labelWidth
        )}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "h-7 flex-1 text-xs bg-white border border-primary/20 rounded px-2 focus:outline-none focus:border-primary dark:bg-input/30",
          disabled && "pointer-events-none opacity-70"
        )}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt || "Select..."}
          </option>
        ))}
      </select>
      <span className="text-[10px] text-muted-foreground shrink-0">{unit}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// InlineFieldWithUnit
// ---------------------------------------------------------------------------

export interface InlineFieldWithUnitProps {
  /** Field label displayed to the left of the input. */
  label: string;
  /** Current input value. */
  value: string;
  /** Callback fired when input value changes. */
  onChange: (v: string) => void;
  /** Unit suffix displayed after the input (e.g. "/LPF"). */
  unit: string;
  /** When true, the field is non-interactive. */
  disabled?: boolean;
  /** Label width class override (default: "w-28"). */
  labelWidth?: string;
}

/**
 * Inline text input with a trailing unit label (e.g. "/LPF").
 *
 * Same layout as `InlineField` but appends a unit suffix after the input.
 */
export function InlineFieldWithUnit({
  label,
  value,
  onChange,
  unit,
  disabled,
  labelWidth = "w-28",
}: InlineFieldWithUnitProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        className={cn(
          "text-[10px] font-semibold text-primary/60 uppercase tracking-wider shrink-0",
          labelWidth
        )}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={disabled}
        className={cn(
          "h-7 flex-1 text-xs bg-white border border-primary/20 rounded px-2 focus:outline-none focus:border-primary dark:bg-input/30",
          disabled && "pointer-events-none"
        )}
      />
      <span className="text-[10px] text-muted-foreground shrink-0">{unit}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LabFieldWithUnit (right-aligned label variant)
// ---------------------------------------------------------------------------

export interface LabFieldWithUnitProps {
  /** Field label displayed right-aligned to the left of the input. */
  label: string;
  /** Current input value. */
  value: string;
  /** Callback fired when input value changes. */
  onChange: (v: string) => void;
  /** Unit suffix displayed after the input (e.g. "/HPF", "/LPF"). */
  unit: string;
  /** When true, the field is non-interactive. */
  disabled?: boolean;
}

/**
 * Input field with a trailing unit label and right-aligned label text.
 *
 * Renders as a horizontal row: right-aligned label, fixed-width input, unit suffix.
 * Used by Urinalysis microscopic, crystals, and cast sub-sections.
 */
export function LabFieldWithUnit({ label, unit, value, onChange, disabled }: LabFieldWithUnitProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider flex-1 shrink-0 text-right">
        {label}:
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={disabled}
        className={cn(
          "h-7 w-24 text-xs bg-white border border-primary/20 rounded px-2 focus:outline-none focus:border-primary dark:bg-input/30",
          disabled && "pointer-events-none"
        )}
      />
      <span className="text-[10px] text-muted-foreground shrink-0 w-7">{unit}</span>
    </div>
  );
}
