import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standard page content wrapper with responsive padding.
 *
 * Provides consistent spacing and overflow handling for all page-level
 * content. Content fills the full available width on tablet and desktop
 * screens (md+). On mobile the layout remains unchanged.
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-auto",
        "p-4 md:p-6 lg:p-8",
        "w-full",
        className
      )}
    >
      {children}
    </div>
  );
}
