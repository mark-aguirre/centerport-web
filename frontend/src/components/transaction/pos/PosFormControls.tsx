"use client";

/**
 * Form controls for the POS dialogs.
 *
 * Counter-scale versions of the shared `FormField` / `Textarea` pairs: a
 * readable label over a tall control with a leading icon that names the field at
 * a glance. Kept local to the POS zone rather than folded into the shared
 * components, whose compact styling the module forms depend on.
 *
 * The label and control classes are exported so other controls — a
 * `FormAutocomplete`, a `SelectTrigger` — can be dropped into a POS dialog and
 * sit flush with these.
 */

import type { LucideIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * Default label styling: sentence case and full-strength ink, unlike the tiny
 * uppercase labels the shared `FormField` uses in the dense module forms.
 */
export const POS_FIELD_LABEL = "text-sm font-bold text-[#0f4435]";

/**
 * Uppercase label variant, for dialogs whose fields are scanned as a list of
 * named slots rather than read as a sentence.
 */
export const POS_FIELD_LABEL_UPPER =
  "text-xs font-bold uppercase tracking-[0.08em] text-[#0f4435]";

/** Control styling: a tall, softly tinted box with room for the leading icon. */
export const POS_FIELD_INPUT =
  "h-12 w-full rounded-lg border border-[#0f4435]/15 bg-[#fafcfb] pl-11 pr-3 text-sm text-[#0f4435] transition-colors hover:border-[#118a57]/40 focus-visible:border-[#118a57] focus-visible:ring-2 focus-visible:ring-[#118a57]/20";

/** Positioning for a field's leading icon. */
export const POS_FIELD_ICON =
  "pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0f4435]/35";

/**
 * Leading-icon positioning for a multi-line control, where the icon pins to the
 * first line instead of centring on the box.
 */
export const POS_FIELD_ICON_TOP =
  "pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-[#0f4435]/35";

interface PosFieldBaseProps {
  /** Field label shown above the control. */
  label: string;
  /** Icon drawn inside the control's left edge. */
  icon: LucideIcon;
  /** Current value. */
  value: string | number | undefined;
  /** Fired on every keystroke. */
  onChange: (value: string) => void;
  /** Placeholder shown while empty. */
  placeholder?: string;
  /** Adds a red asterisk to the label. */
  required?: boolean;
  /** Replaces the default label classes when provided. */
  labelClassName?: string;
  /** Extra classes for the wrapper. */
  className?: string;
}

interface PosFormFieldProps extends PosFieldBaseProps {
  /** HTML input type (default `"text"`). */
  type?: string;
}

/** Labeled single-line text input for the POS dialogs. */
export function PosFormField({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  labelClassName,
  className,
}: PosFormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className={labelClassName ?? POS_FIELD_LABEL}>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Icon className={POS_FIELD_ICON} aria-hidden="true" />
        <Input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={POS_FIELD_INPUT}
        />
      </div>
    </div>
  );
}

interface PosFormTextareaProps extends PosFieldBaseProps {
  /** Visible rows (default 3). */
  rows?: number;
}

/**
 * Labeled multi-line input for the POS dialogs.
 *
 * The text-area twin of {@link PosFormField}: same label and box, with the
 * leading icon pinned to the first line. Left resizable, since a long item
 * description is easier to check with the field stretched.
 */
export function PosFormTextarea({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  rows = 3,
  required,
  labelClassName,
  className,
}: PosFormTextareaProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className={labelClassName ?? POS_FIELD_LABEL}>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Icon className={POS_FIELD_ICON_TOP} aria-hidden="true" />
        <Textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={cn(
            POS_FIELD_INPUT,
            "h-auto min-h-24 py-3 leading-relaxed"
          )}
        />
      </div>
    </div>
  );
}
