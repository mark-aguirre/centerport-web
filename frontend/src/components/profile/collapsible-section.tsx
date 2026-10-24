"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { sectionAnchorId, type ProfileSectionDef } from "./section-config";

interface CollapsibleSectionProps {
  /** Section definition supplying title and icon. */
  section: ProfileSectionDef;
  /** Whether the section starts expanded. Defaults to `true`. */
  defaultOpen?: boolean;
  /** Section body (the form fields). */
  children: React.ReactNode;
}

/**
 * Collapsible card that wraps a profile form section.
 *
 * The header band matches the visit page's section headers: a tinted
 * `bg-primary/12` band with a solid-primary icon chip and an uppercase,
 * tracked title (the same treatment the shared `SectionHeader banner`
 * renders). The whole band is a button that folds the body, with a chevron
 * standing in for the action slot.
 *
 * The outer element carries a scroll-anchor id (`profile-section-<key>`) so
 * the sidebar nav can jump to it; `scroll-mt-16` keeps the band clear of the
 * sticky app header when scrolled into view.
 */
export function CollapsibleSection({
  section,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const { title, icon: Icon } = section;

  return (
    <section
      id={sectionAnchorId(section.key)}
      className="scroll-mt-16 overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 border-b border-primary/20 bg-primary/12 px-4 py-2.5 text-left"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <h2 className="flex-1 text-xs font-bold uppercase tracking-widest text-primary">
          {title}
        </h2>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-primary transition-transform",
            !open && "-rotate-90"
          )}
        />
      </button>
      {open && <div className="p-4">{children}</div>}
    </section>
  );
}
