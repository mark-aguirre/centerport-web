"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PROFILE_SECTIONS,
  SECTION_NAV_LABELS,
  sectionAnchorId,
} from "./section-config";

/**
 * Sticky left-rail navigation for the profile sections.
 *
 * Lists every section with its icon, highlights the one currently scrolled
 * into view, and smooth-scrolls to a section when its entry is clicked. The
 * active section is tracked with an IntersectionObserver so the highlight
 * follows the user's scroll position without wiring scroll math by hand.
 */
export function ProfileNav() {
  const [active, setActive] = useState(PROFILE_SECTIONS[0]?.key ?? "");

  useEffect(() => {
    const ids = PROFILE_SECTIONS.map((s) => sectionAnchorId(s.key));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const key = visible[0].target.id.replace("profile-section-", "");
          setActive(key);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleClick = (key: string) => {
    const el = document.getElementById(sectionAnchorId(key));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(key);
    }
  };

  return (
    <nav
      aria-label="Profile sections"
      className="sticky top-16 space-y-1 rounded-xl border border-border bg-card p-2 shadow-sm"
    >
      {PROFILE_SECTIONS.map(({ key, icon: Icon }) => {
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
            <span className="truncate">{SECTION_NAV_LABELS[key] ?? key}</span>
          </button>
        );
      })}
    </nav>
  );
}
