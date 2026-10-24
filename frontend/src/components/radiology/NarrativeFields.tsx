"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** The two narrative fields every radiology result ends with. */
export interface RadiologyNarrative {
  radiology_findings: string;
  impression: string;
}

interface NarrativeFieldsProps<T extends RadiologyNarrative> {
  data: T;
  onChange: (data: T) => void;
  disabled?: boolean;
}

/**
 * Radiology Findings and Impression textareas, shared by the Ultrasound and
 * X-Ray result forms.
 *
 * Both fields are required on the reference forms, so each label carries a
 * red asterisk. The textareas are tall enough for a multi-paragraph read
 * without resizing.
 *
 * @typeParam T - the concrete record type carrying both narrative fields
 */
export default function RadiologyNarrativeFields<T extends RadiologyNarrative>({
  data,
  onChange,
  disabled,
}: NarrativeFieldsProps<T>) {
  const update = (field: keyof RadiologyNarrative, value: string) =>
    onChange({ ...data, [field]: value });

  const textareaClasses = cn(
    "text-sm bg-white border border-primary/20 rounded-md px-3 py-2 resize-none",
    "focus:outline-none focus-visible:border-primary dark:bg-input/30",
    disabled && "pointer-events-none opacity-70"
  );

  const labelClasses =
    "text-[11px] font-bold text-primary/70 uppercase tracking-wider";

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="radiology-findings" className={labelClasses}>
          Radiology Findings <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="radiology-findings"
          value={data.radiology_findings}
          onChange={(e) => update("radiology_findings", e.target.value)}
          className={cn(textareaClasses, "h-40")}
          disabled={disabled}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="radiology-impression" className={labelClasses}>
          Impression <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="radiology-impression"
          value={data.impression}
          onChange={(e) => update("impression", e.target.value)}
          className={cn(textareaClasses, "h-28")}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
