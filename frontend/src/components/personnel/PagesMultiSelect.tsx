"use client";

import { useMemo } from "react";
import { ChevronsUpDown, Loader2 } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ALL_MODULES, moduleLabel } from "@/lib/personnel";
import type { PersonnelModuleCode } from "@/lib/api";

interface PagesMultiSelectProps {
  /** Currently selected page codes. */
  value: PersonnelModuleCode[];
  /** Called with the next selection whenever a page is toggled. */
  onChange: (next: PersonnelModuleCode[]) => void;
  /** Disables the trigger (e.g. while a save is in flight). */
  disabled?: boolean;
  /** Shows a spinner next to the trigger while persisting. */
  saving?: boolean;
  /** Trigger width class; defaults to a compact table-cell width. */
  className?: string;
}

/**
 * Multi-select picker for the pages/modules a person is assigned to.
 *
 * Renders the current selection as compact badges inside a popover trigger;
 * opening it reveals a checkbox list of every page from {@link ALL_MODULES}.
 * Toggling a page calls {@link PagesMultiSelectProps.onChange} with the next
 * selection so the caller can persist immediately (table cell) or stage it in
 * form state (create/edit dialog).
 *
 * This is the person-centric "which pages does this person serve on?"
 * assignment and is intentionally independent of the module -> role default
 * signatory matrix.
 */
export function PagesMultiSelect({
  value,
  onChange,
  disabled = false,
  saving = false,
  className,
}: PagesMultiSelectProps) {
  const selected = useMemo(() => new Set(value), [value]);

  const toggle = (code: PersonnelModuleCode) => {
    // Preserve ALL_MODULES ordering so the stored selection is stable.
    const next = ALL_MODULES.filter((m) =>
      m === code ? !selected.has(m) : selected.has(m)
    );
    onChange(next);
  };

  return (
    <Popover>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex min-h-8 w-full items-center justify-between gap-2 rounded-md border border-primary/30 bg-white px-2 py-1 text-left text-xs shadow-sm transition-colors hover:border-primary/50 focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
          className
        )}
      >
        <span className="flex flex-1 flex-wrap items-center gap-1">
          {value.length === 0 ? (
            <span className="text-muted-foreground italic">No pages</span>
          ) : (
            value.map((code) => (
              <Badge key={code} variant="secondary" className="font-normal">
                {moduleLabel(code)}
              </Badge>
            ))
          )}
        </span>
        {saving ? (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-primary" />
        ) : (
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1.5">
        <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary/60">
          Assigned pages
        </p>
        <div className="space-y-0.5">
          {ALL_MODULES.map((code) => {
            const checked = selected.has(code);
            return (
              <label
                key={code}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-primary/5"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggle(code)}
                />
                <span className="text-foreground/80">{moduleLabel(code)}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
