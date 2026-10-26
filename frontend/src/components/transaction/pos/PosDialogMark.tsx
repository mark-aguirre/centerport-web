"use client";

import { Leaf } from "lucide-react";

import { cn } from "@/lib/utils";

interface PosDialogMarkProps {
  /**
   * Extra classes for the wrapper, typically to adjust the right offset so the
   * mark clears a dialog's close button.
   */
  className?: string;
}

/**
 * Clipboard-and-leaves mark for a POS dialog header.
 *
 * A white chart card with a medical cross, flanked by leaves — the same motif as
 * the New Sale empty state, built from primitives rather than an image so it
 * stays crisp and inherits the zone's greens.
 *
 * Purely decorative: hidden from assistive tech, and dropped below `sm` where
 * the dialog's title block needs the full width.
 */
export function PosDialogMark({ className }: PosDialogMarkProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute right-16 top-1/2 hidden h-24 w-32 -translate-y-1/2 sm:block",
        className
      )}
    >
      <Leaf
        className="absolute left-0 top-3 h-12 w-12 -rotate-[25deg] text-[#2f8f6a]/70"
        strokeWidth={1.5}
      />
      <Leaf
        className="absolute right-0 top-6 h-11 w-11 rotate-[35deg] text-[#2f8f6a]/55"
        strokeWidth={1.5}
      />
      <span className="absolute left-1/2 top-1/2 flex h-20 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-[#0f4435]/15 bg-white shadow-sm">
        {/* Cross, drawn as two bars so it keeps its weight at this size. */}
        <span className="relative block h-6 w-6">
          <span className="absolute left-1/2 top-0 h-6 w-2 -translate-x-1/2 rounded-[2px] bg-[#118a57]" />
          <span className="absolute left-0 top-1/2 h-2 w-6 -translate-y-1/2 rounded-[2px] bg-[#118a57]" />
        </span>
        <span className="flex w-8 flex-col gap-1">
          <span className="h-0.5 w-full rounded bg-[#0f4435]/15" />
          <span className="h-0.5 w-5 rounded bg-[#0f4435]/15" />
        </span>
      </span>
    </div>
  );
}
