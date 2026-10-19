"use client";

import { Expand, Shrink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLayout } from "@/components/layout-provider";

/**
 * Toggle button that switches the quick-access toolbar (TopNav Row 2) between
 * its normal size and a compact mode, echoing the "hide ribbon" / compact
 * ribbon feature of Office / Windows.
 *
 * In compact mode the toolbar stays fully visible but its icons shrink to
 * roughly half size and the text labels are hidden, reclaiming vertical space
 * without removing any navigation. Nothing is unmounted.
 *
 * Shows a Shrink icon while the toolbar is at normal size (tap to compact) and
 * an Expand icon while compact (tap to restore). Persists the preference via
 * the LayoutProvider context. Only rendered inside TopNav, so it is naturally
 * absent in sidebar navigation mode.
 */
export function ToolbarCompactToggle() {
  const { toolbarCompact, toggleToolbarCompact } = useLayout();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleToolbarCompact}
            aria-label={toolbarCompact ? "Expand toolbar" : "Compact toolbar"}
            aria-pressed={toolbarCompact}
            className="h-8 w-8"
          >
            {toolbarCompact ? (
              <Expand className="h-4 w-4" />
            ) : (
              <Shrink className="h-4 w-4" />
            )}
          </Button>
        }
      />
      <TooltipContent>
        {toolbarCompact ? "Expand toolbar" : "Compact toolbar"}
      </TooltipContent>
    </Tooltip>
  );
}
