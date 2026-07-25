import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
}

/**
 * Page heading with optional subtitle.
 *
 * Renders a consistent h1 + description pattern used at the top of
 * every page. The description is displayed as muted helper text.
 */
export function PageTitle({ title, description, className }: PageTitleProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      )}
    </div>
  );
}