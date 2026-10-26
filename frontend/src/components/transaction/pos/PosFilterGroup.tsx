"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Control styling shared by the POS filter inputs (text, date, select trigger).
 *
 * Exported so a `SelectTrigger` can be given the same box as a plain input and
 * the two sit level in a filter row.
 */
export const POS_FILTER_CONTROL =
  "h-11 w-full rounded-lg border border-[#0f4435]/15 bg-white px-3 text-sm text-[#0f4435] transition-colors hover:border-[#118a57]/40 focus-visible:border-[#118a57] focus-visible:ring-2 focus-visible:ring-[#118a57]/20";

/**
 * A search input in the POS style: the same box as {@link POS_FILTER_CONTROL}
 * with room on the left for an in-field magnifier, matching the client search
 * on the New Sale hero.
 */
export const POS_SEARCH_CONTROL =
  "h-11 w-full rounded-lg border border-[#0f4435]/15 bg-white pl-10 pr-3 text-sm text-[#0f4435] shadow-sm transition-colors hover:border-[#118a57]/40 focus-visible:border-[#118a57] focus-visible:ring-2 focus-visible:ring-[#118a57]/20";

/** Positioning for the icon drawn inside a {@link POS_SEARCH_CONTROL} field. */
export const POS_SEARCH_ICON =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0f4435]/40";

interface PosFilterGroupProps {
  /**
   * Icon naming the filter, drawn beside the label. Omit it for a field that
   * carries its own icon inside the control, such as a search box.
   */
  icon?: LucideIcon;
  /** Filter label, shown above the control. */
  label: string;
  /** The control itself. */
  children: ReactNode;
  /** Extra classes for the wrapper. */
  className?: string;
}

/**
 * One labeled filter in the POS filter bar.
 *
 * Pairs a label with its control, optionally prefixed by an icon. Each group
 * sits on a faint panel so the row reads as distinct fields rather than a run of
 * boxes, and so every control lines up on the same baseline regardless of
 * whether its label carries an icon.
 */
export function PosFilterGroup({
  icon: Icon,
  label,
  children,
  className,
}: PosFilterGroupProps) {
  return (
    <div
      className={cn(
        "space-y-1.5 rounded-xl border border-[#0f4435]/8 bg-[#f8fbfa] p-3",
        className
      )}
    >
      <p className="flex items-center gap-2 text-sm font-bold text-[#0f4435]">
        {Icon && <Icon aria-hidden="true" className="h-5 w-5 text-[#0f4435]/45" />}
        {label}
      </p>
      {children}
    </div>
  );
}
