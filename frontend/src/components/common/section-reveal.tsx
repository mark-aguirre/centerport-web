import { cn } from "@/lib/utils";

interface SectionRevealProps {
  /** Zero-based position used to stagger the mount animation. */
  index: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * Staggered fade-in-and-rise wrapper for form section cards.
 *
 * A CSS-only replacement for the previous framer-motion `motion.div`
 * variant. The stagger delay is driven by the `--section-index` custom
 * property consumed by the `.section-reveal` keyframe in globals.css,
 * so no animation library ships to the client. Honors reduced-motion.
 */
export function SectionReveal({ index, children, className }: SectionRevealProps) {
  return (
    <div
      className={cn("section-reveal", className)}
      style={{ "--section-index": index } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
