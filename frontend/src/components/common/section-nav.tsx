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
  /** Leading icon. */
  icon: LucideIcon;
}

interface SectionNavProps {
  /** Ordered entries, one per anchored section on the page. */
  items: SectionNavItem[];
  /**
   * Maps an item key to the DOM id of its section, e.g.
   * `(key) => `seabase-section-${key}``.
   */
  anchorId: (key: string) => string;
  /** Accessible name for the nav landmark (e.g. "Medical examination sections"). */
  ariaLabel: string;
  /** Optional heading rendered above the entries (e.g. the module name). */
  title?: string;
  /** Extra classes for the nav element. */
  className?: string;
}

/**
 * Sticky left-rail navigator for the anchored sections of a long form page.
 *
 * Lists every section with its icon, highlights the one currently scrolled
 * into view, and smooth-scrolls to a section when its entry is clicked. The
 * active entry is tracked with an IntersectionObserver so the highlight
 * follows the scroll position without wiring scroll math by hand.
 *
 * The page owns the anchors: each section must render an element whose id is
 * `anchorId(key)` (give it `scroll-mt-16` so the sticky app header does not
 * cover the heading after a jump).
 *
 * @example
 * ```tsx
 * <aside className="lg:w-56 lg:shrink-0">
 *   <SectionNav
 *     items={SEABASE_SECTIONS}
 *     anchorId={seabaseAnchorId}
 *     ariaLabel="Medical examination sections"
 *     title="Medical Examination"
 *   />
 * </aside>
 * ```
 */
export function SectionNav({
  items,
  anchorId,
  ariaLabel,
  title,
  className,
}: SectionNavProps) {
  const [active, setActive] = useState(items[0]?.key ?? "");

  useEffect(() => {
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
        if (key) setActive(key);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items, anchorId]);

  const handleClick = (key: string) => {
    const el = document.getElementById(anchorId(key));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(key);
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
      {items.map(({ key, label, icon: Icon }) => {
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
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
