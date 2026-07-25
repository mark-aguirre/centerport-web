import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatItemProps {
  label: string;
  value: string;
  icon: LucideIcon;
  subtext?: string;
}

/**
 * Compact inline stat used in the status strip.
 * No cards, no shadows — just information density.
 */
export function StatItem({ label, value, icon: Icon, subtext }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-semibold tabular-nums">{value}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
        {subtext && (
          <span className="text-xs text-muted-foreground/70">· {subtext}</span>
        )}
      </div>
    </div>
  );
}

interface StatusStripProps {
  items: StatItemProps[];
  className?: string;
}

/**
 * Horizontal status strip — dense, cockpit-style readout of key numbers.
 * Replaces the generic card grid with something intentional.
 */
export function StatusStrip({ items, className }: StatusStripProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-8 gap-y-1 px-1",
        className
      )}
    >
      {items.map((item) => (
        <StatItem key={item.label} {...item} />
      ))}
    </div>
  );
}
