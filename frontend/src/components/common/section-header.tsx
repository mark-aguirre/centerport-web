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
  /** Optional subtitle rendered as muted italic text */
  subtitle?: string;
  /** Optional action slot rendered on the right side of the header (e.g. "Set Normal" button) */
  action?: React.ReactNode;
}

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
  subtitle,
  action,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 mb-3 pb-2 border-b border-primary/20",
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4 text-primary" />}
      <div className="flex items-baseline gap-2 flex-1">
        <h2 className="text-xs font-bold text-primary uppercase tracking-widest">
          {title}
        </h2>
        {subtitle && (
          <span className="text-[10px] text-muted-foreground italic">
            {subtitle}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}
