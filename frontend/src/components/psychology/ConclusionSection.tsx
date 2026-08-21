"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FileCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { PsychologySectionProps } from "./types";

/** Conclusion/recommendation options matching the form. */
const CONCLUSION_OPTIONS = [
  {
    value: "Recommended",
    label: "RECOMMENDED/No significant personality problems noted at the time evaluation.",
  },
  {
    value: "For Further Evaluation",
    label: "FOR FURTHER EVALUATION:",
  },
  {
    value: "Not Recommended",
    label: "NOT RECOMMENDED:",
  },
];

/**
 * Section III: Conclusion/Remarks for the Psychological Evaluation form.
 *
 * Displays radio buttons for the final psychological fitness determination
 * and a free-text remarks area for additional notes.
 */
export default function ConclusionSection({
  data,
  onChange,
  disabled,
}: PsychologySectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="III. Conclusion / Remarks" icon={FileCheck} />

      {/* Conclusion radio options */}
      <div
        className="space-y-2 mb-4"
        role="radiogroup"
        aria-label="Conclusion"
        aria-disabled={disabled}
      >
        {CONCLUSION_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              "flex items-start gap-2.5 px-3 py-2 rounded-md transition-colors",
              data.conclusion === opt.value
                ? "bg-primary/5 border border-primary/20"
                : !disabled && "hover:bg-muted/30",
              disabled ? "pointer-events-none" : "cursor-pointer"
            )}
          >
            <input
              type="radio"
              name="conclusion"
              checked={data.conclusion === opt.value}
              onChange={() => {
                if (!disabled) updateField("conclusion", opt.value);
              }}
              className="w-4 h-4 accent-primary mt-0.5 shrink-0"
              tabIndex={disabled ? -1 : undefined}
              aria-disabled={disabled}
              aria-label={opt.label}
            />
            <span className="text-xs text-foreground/80">{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Remarks */}
      <div className="space-y-1">
        <Label className="text-[11px] font-semibold text-foreground/70">Remarks</Label>
        <Textarea
          value={data.remarks}
          onChange={(e) => updateField("remarks", e.target.value)}
          className={cn(
            "min-h-[80px] text-sm bg-white border border-primary/20 rounded-md px-3 py-2",
            "focus:outline-none focus-visible:border-primary dark:bg-input/30 resize-none",
            disabled && "pointer-events-none"
          )}
          placeholder="Enter additional remarks..."
          readOnly={disabled}
          tabIndex={disabled ? -1 : undefined}
        />
      </div>
    </div>
  );
}
