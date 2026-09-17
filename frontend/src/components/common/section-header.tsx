import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import React from "react";

interface SectionHeaderProps {
  /** Section title displayed in uppercase */
  title: string;
  /** Optional leading icon */
  icon?: LucideIcon;
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for the title h2 element */
  titleClassName?: string;
  /** Optional inline styles for the title h2 element (overrides class-based text-transform) */
  titleStyle?: React.CSSProperties;
  /** Optional subtitle rendered as muted italic text */
  subtitle?: string;
  /** Optional action slot rendered on the right side of the header (e.g. "Set Normal" button) */
  action?: React.ReactNode;
  /**
   * Render the header as a tinted, two-tone banner band that spans the full
   * width of the parent card (instead of the default underline-only style).
   *
   * The band uses a subtle `bg-primary/12` fill with a solid-primary icon chip,
   * keeping the app's two-tone palette. It bleeds to the card edges using
   * negative margins, so it must match the parent card's padding — pass that
   * padding via `bannerInset` (defaults to `"p-4"`).
   */
  banner?: boolean;
  /**
   * Padding of the parent card, used to size the banner's edge bleed so the
   * band aligns with the card corners. Only applies when `banner` is set.
   */
  bannerInset?: "p-3" | "p-4";
}

/** Negative-margin bleed + top-radius per supported card padding. */
const bannerInsetStyles: Record<NonNullable<SectionHeaderProps["bannerInset"]>, string> = {
  "p-3": "-mx-3 -mt-3 px-3 py-2 rounded-t-lg",
  "p-4": "-mx-4 -mt-4 px-4 py-2.5 rounded-t-xl",
};

/**
 * Section divider with icon and title for form cards.
 *
 * Renders an uppercase, tracked heading with an optional leading icon,
 * optional subtitle, and a bottom border separator. Used across profile
 * and landbase form sections for consistent visual hierarchy.
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   title="Personal Information"
 *   icon={User}
 *   subtitle="Fill in all required fields"
 *   action={<button>Set Normal</button>}
 * />
 * ```
 */
export function SectionHeader({
  title,
  icon: Icon,
  className,
  titleClassName,
  titleStyle,
  subtitle,
  action,
  banner,
  bannerInset = "p-4",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        banner
          ? cn(
              "mb-3 bg-primary/12 border-b border-primary/20",
              bannerInsetStyles[bannerInset]
            )
          : "mb-3 pb-2 border-b border-primary/20",
        className
      )}
    >
      {Icon && (
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
            banner
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-primary/10 text-primary ring-1 ring-primary/15"
          )}
        >
          <Icon className="w-3.5 h-3.5" />
        </span>
      )}
      <div className="flex items-baseline gap-2 flex-1">
        <h2 className={cn("text-xs font-bold text-primary uppercase tracking-widest", titleClassName)} style={titleStyle}>
          {title}
        </h2>
        {subtitle && (
          <span className="text-[11px] text-muted-foreground italic">
            {subtitle}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}
