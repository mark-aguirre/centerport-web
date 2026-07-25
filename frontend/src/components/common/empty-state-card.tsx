import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateCardProps {
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Placeholder card for modules not yet implemented.
 *
 * Displays a centered message inside a dashed-border card. Accepts
 * optional `children` for additional content like action buttons.
 */
export function EmptyStateCard({
  message = "Coming Soon",
  className,
  children,
}: EmptyStateCardProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
        <p className="text-muted-foreground text-lg font-medium">{message}</p>
        {children}
      </CardContent>
    </Card>
  );
}