"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLayout } from "@/components/layout-provider";

/**
 * Toggle button that switches between full-width and constrained page layout.
 *
 * Shows Maximize2 icon when in constrained mode, Minimize2 when full-width.
 * Persists the preference via the LayoutProvider context.
 */
export function FullWidthToggle() {
  const { fullWidth, toggleFullWidth } = useLayout();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullWidth}
            aria-label={fullWidth ? "Switch to constrained width" : "Switch to full width"}
            className="h-8 w-8"
          >
            {fullWidth ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        }
      />
      <TooltipContent>
        {fullWidth ? "Constrained width" : "Full width"}
      </TooltipContent>
    </Tooltip>
  );
}
