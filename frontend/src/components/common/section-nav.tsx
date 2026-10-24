"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** One entry in a {@link SectionNav} rail. */
export interface SectionNavItem {
  /** Stable key, paired with the matching section's scroll anchor. */
  key: string;
  /** Label shown in the rail (keep it short — the rail is narrow). */
  label: string;
  /** Leading icon. Ignored when `step` is set. */
  icon?: LucideIcon;
  /**
   * Step number shown in a leading badge instead of the icon, for forms whose
   * sections are numbered pages of a paper form (e.g. the Panama steps).
   */
  step?: number;
}

interface SectionNavProps {
  /** Ordered entries, one per section (or step) on the page. */
  items: SectionNavItem[];
  /**
   * Maps an item key to the DOM id of its section, e.g.
   * `(key) => `seabase-section-${key}``. Required in scroll mode; ignored
   * when `onSelect` is given.
   */
  anchorId?: (key: string) => string;
  /** Accessible name for the nav landmark (e.g. "Medical examination sections"). */
  ariaLabel: string;
  /** Optional heading rendered above the entries (e.g. the module name). */
  title?: string;
  /** Extra classes for the nav element. */
  className?: string;
  /**
   * Controlled mode — the key of the entry to highlight. Pair with
   * {@link SectionNavProps.onSelect}.
   */
  activeKey?: string;
  /**
   * Controlled mode — called with the clicked entry's key instead of
   * scrolling to an anchor. Provide this for pages whose sections are
   * mutually exclusive steps (e.g. the Panama tabs) rather than one long
   * scrolling column. When set, the scroll-spy observer is skipped.
   */
  onSelect?: (key: string) => void;
}

/**
 * Left-rail navigator for the sections of a long form page.
 *
 * Works in two modes:
 *
 * - **Scroll mode** (default, pass `anchorId`): lists every section, smooth-
 *   scrolls to it on click, and highlights the one currently scrolled into
 *   view via an IntersectionObserver. The page owns the anchors — each section
 *   must render an element whose id is `anchorId(key)`, with a small
 *   `scroll-mt-*` so the heading is not flush against the column edge.
 * - **Controlled mode** (pass `activeKey` + `onSelect`): the page decides which
 *   entry is active, for sections that are mutually exclusive steps rather
 *   than one scrolling column. The observer is skipped.
 *
 * @example
 * ```tsx
 * <SectionNav
 *   items={SEABASE_SECTIONS}
 *   anchorId={seabaseAnchorId}
 *   ariaLabel="Medical examination sections"
 * />
 * ```
 */
export function SectionNav({
  items,
  anchorId,
  ariaLabel,
  title,
  className,
  activeKey,
  onSelect,
}: SectionNavProps) {
  const [scrollActive, setScrollActive] = useState(items[0]?.key ?? "");
  const active = onSelect ? activeKey ?? "" : scrollActive;

  useEffect(() => {
    // Controlled mode: the page tracks the active entry, nothing to observe.
    if (onSelect || !anchorId) return;

    // Anchor id -> item key, so the observer never has to parse the id.
    const keyByAnchor = new Map(items.map((item) => [anchorId(item.key), item.key]));

    const elements = [...keyByAnchor.keys()]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const key = visible[0] ? keyByAnchor.get(visible[0].target.id) : undefined;
        if (key) setScrollActive(key);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items, anchorId, onSelect]);

  const handleClick = (key: string) => {
    if (onSelect) {
      onSelect(key);
      return;
    }
    const el = anchorId ? document.getElementById(anchorId(key)) : null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setScrollActive(key);
    }
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "sticky top-16 space-y-1 rounded-xl border border-border bg-card p-2 shadow-sm",
        className
      )}
    >
      {title && (
        <p className="px-3 pb-1 pt-1 text-[11px] font-bold uppercase tracking-widest text-foreground/60">
          {title}
        </p>
      )}
      {items.map(({ key, label, icon: Icon, step }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            onClick={() => handleClick(key)}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/70 hover:bg-primary/5 hover:text-foreground"
            )}
          >
            {step !== undefined ? (
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                  isActive
                    ? "bg-primary-foreground/25 text-primary-foreground"
                    : "bg-primary/10 text-primary"
                )}
              >
                {step}
              </span>
            ) : (
              Icon && <Icon className="h-4 w-4 shrink-0" />
            )}
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
