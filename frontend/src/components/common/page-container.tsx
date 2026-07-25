import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /** When true, content fills the full width of the main area. */
  fullWidth?: boolean;
}

/**
 * Standard page content wrapper with responsive padding.
 *
 * Provides consistent spacing and overflow handling for all page-level
 * content. By default constrains content to 80% width centered in the
 * viewport. Pass `fullWidth` to fill the entire available area.
 */
export function PageContainer({ children, className, fullWidth }: PageContainerProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-auto",
        "p-6 md:p-8",
        !fullWidth && "mx-auto w-full max-w-5xl",
        className
      )}
    >
      {children}
    </div>
  );
}
