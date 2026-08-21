"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { LandbaseSectionProps } from "./types";
import { createFieldUpdater } from "./utils";

/**
 * Paper-form remarks and restriction row for the Landbase PEME form.
 *
 * The combined remarks value is persisted in the existing `remarks` field.
 */
export default function RemarksSection({
  data,
  onChange,
  disabled,
}: LandbaseSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm",
        disabled && "pointer-events-none",
      )}
    >
      <div className="grid grid-cols-1 gap-2 px-3 py-2 sm:grid-cols-[215px_minmax(0,1fr)] sm:items-center">
        <label
          htmlFor="landbase-remarks-restriction"
          className="text-sm font-bold uppercase tracking-wide text-primary"
        >
          IV. Remarks/Restriction:
        </label>
        <Input
          id="landbase-remarks-restriction"
          value={data.remarks ?? ""}
          onChange={(event) => updateField("remarks", event.target.value)}
          readOnly={disabled}
          tabIndex={disabled ? -1 : undefined}
          placeholder="Enter remarks or restrictions..."
          className="h-8 border border-primary/20 bg-white px-2 text-xs focus-visible:border-primary dark:bg-input/30"
        />
      </div>
    </div>
  );
}
