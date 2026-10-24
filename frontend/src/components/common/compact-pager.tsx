"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/** How many numbered buttons the strip shows at most. */
const WINDOW_SIZE = 5;

interface CompactPagerProps {
  /** Current page, zero-based. */
  page: number;
  /** Total number of pages. A value below 2 renders nothing. */
  totalPages: number;
  /** Called with the requested zero-based page. */
  onPageChange: (page: number) => void;
  /** Greys the whole strip out, e.g. while a page is in flight. */
  disabled?: boolean;
  className?: string;
}

/**
 * Builds the window of page numbers to show.
 *
 * Keeps the current page centred once there are more pages than buttons, and
 * clamps at both ends so the strip never shows an out-of-range number or
 * shrinks below {@link WINDOW_SIZE} entries when the pages exist to fill it.
 *
 * @returns zero-based page indices, ascending
 */
function pageWindow(page: number, totalPages: number): number[] {
  const count = Math.min(WINDOW_SIZE, totalPages);
  const half = Math.floor(count / 2);
  const start = Math.max(0, Math.min(page - half, totalPages - count));
  return Array.from({ length: count }, (_, i) => start + i);
}

/**
 * Small numbered pager used by the panels on the visit page.
 *
 * Deliberately not the `ui/pagination` primitive: that one renders anchors with
 * "Previous"/"Next" word labels for full-page navigation, while these panels
 * page client state inside a card footer and only have room for icon buttons.
 *
 * Renders nothing for a single page — a pager that cannot move is just noise.
 */
export function CompactPager({
  page,
  totalPages,
  onPageChange,
  disabled,
  className,
}: CompactPagerProps) {
  if (totalPages < 2) return null;

  const buttonBase =
    "flex h-7 min-w-7 items-center justify-center rounded-md border border-border px-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-1", className)}
    >
      <button
        type="button"
        aria-label="Previous page"
        className={cn(buttonBase, "text-foreground/70 hover:bg-muted")}
        disabled={disabled || page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>

      {pageWindow(page, totalPages).map((index) => {
        const current = index === page;
        return (
          <button
            key={index}
            type="button"
            aria-label={`Page ${index + 1}`}
            aria-current={current ? "page" : undefined}
            className={cn(
              buttonBase,
              current
                ? "border-primary bg-primary font-semibold text-primary-foreground"
                : "text-foreground/70 hover:bg-muted"
            )}
            disabled={disabled}
            onClick={() => onPageChange(index)}
          >
            {index + 1}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Next page"
        className={cn(buttonBase, "text-foreground/70 hover:bg-muted")}
        disabled={disabled || page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </nav>
  );
}
