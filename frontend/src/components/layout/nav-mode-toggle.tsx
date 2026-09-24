"use client";

import { PanelLeft, PanelTop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLayout } from "@/components/layout-provider";

/**
 * Toggle button that switches between the vertical sidebar and the classic
 * horizontal top menu bar.
 *
 * Shows a PanelTop icon while in sidebar mode (tap to switch to the top menu)
 * and a PanelLeft icon while in top-menu mode (tap to switch back to the
 * sidebar). Persists the choice via the LayoutProvider context.
 */
export function NavModeToggle() {
  const { navMode, toggleNavMode } = useLayout();
  const isTopbar = navMode === "topbar";

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleNavMode}
            aria-label={isTopbar ? "Switch to sidebar menu" : "Switch to top menu bar"}
            className="h-8 w-8"
          >
            {isTopbar ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelTop className="h-4 w-4" />
            )}
          </Button>
        }
      />
      <TooltipContent>
        {isTopbar ? "Sidebar menu" : "Top menu bar"}
      </TooltipContent>
    </Tooltip>
  );
}
