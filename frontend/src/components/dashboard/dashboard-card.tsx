import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  /** Helper line under the title. */
  subtitle?: string;
  icon: LucideIcon;
  /** Optional "View all" destination shown in the card header. */
  viewAllHref?: string;
  /** Label for the header link. Defaults to "View all". */
  viewAllLabel?: string;
  className?: string;
  /** Extra classes for the body wrapper (e.g. to remove padding for tables). */
  bodyClassName?: string;
  children: React.ReactNode;
}

/**
 * Shared panel shell for the dashboard widgets.
 *
 * Gives every widget the same frame — white surface, soft border, icon-led
 * header, and an optional "View all" link — so the dashboard reads as one
 * surface instead of a collection of differently styled boxes.
 */
export function DashboardCard({
  title,
  subtitle,
  icon: Icon,
  viewAllHref,
  viewAllLabel = "View all",
  className,
  bodyClassName,
  children,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-2.5 px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="truncate text-[11px] text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
          >
            {viewAllLabel}
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      <div className={cn("flex-1", bodyClassName ?? "px-4 pb-4")}>
        {children}
      </div>
    </section>
  );
}
