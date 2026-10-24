"use client";

import { Check, Maximize2, Minimize2, PanelLeft, Rows3, Rows4 } from "lucide-react";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useLayout } from "@/components/layout-provider";
import { useTheme, type AppTheme } from "@/components/theme-provider";

const THEMES: { id: AppTheme; label: string; swatch: string }[] = [
  { id: "clinic", label: "Clinic", swatch: "#1a74d4" },
  { id: "sand", label: "Sand", swatch: "#b08968" },
  { id: "ocean", label: "Ocean", swatch: "#1e3a5f" },
];

/**
 * Display preferences rendered as dropdown-menu items.
 *
 * Groups the appearance controls — colour theme, content width, navigation
 * density, and the sidebar/top-bar switch — so the top navigation can keep a
 * single Settings entry instead of a row of loose icon buttons.
 *
 * Must be rendered inside a `DropdownMenuContent`.
 */
export function DisplaySettingsItems() {
  const { theme, setTheme } = useTheme();
  const {
    fullWidth,
    toggleFullWidth,
    toolbarCompact,
    toggleToolbarCompact,
    setNavMode,
  } = useLayout();

  return (
    <>
      <DropdownMenuSeparator />
      {/* Each label must live inside a DropdownMenuGroup: the underlying Base
          UI part is Menu.GroupLabel, which throws when rendered without a
          Menu.Group ancestor. */}
      <DropdownMenuGroup>
        <DropdownMenuLabel className="text-[11px] font-semibold tracking-wider uppercase">
          Theme
        </DropdownMenuLabel>
        {THEMES.map((entry) => (
          <DropdownMenuItem
            key={entry.id}
            onClick={() => setTheme(entry.id)}
            className="cursor-pointer gap-2"
          >
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 rounded-full border border-border"
              style={{ backgroundColor: entry.swatch }}
            />
            <span>{entry.label}</span>
            {theme === entry.id && <Check className="ml-auto h-3.5 w-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>

      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel className="text-[11px] font-semibold tracking-wider uppercase">
          Layout
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={toggleFullWidth}
          className="cursor-pointer gap-2"
        >
          {fullWidth ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
          <span>{fullWidth ? "Constrained width" : "Full width"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={toggleToolbarCompact}
          className="cursor-pointer gap-2"
        >
          {toolbarCompact ? (
            <Rows3 className="h-4 w-4" />
          ) : (
            <Rows4 className="h-4 w-4" />
          )}
          <span>{toolbarCompact ? "Show menu labels" : "Hide menu labels"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setNavMode("sidebar")}
          className="cursor-pointer gap-2"
        >
          <PanelLeft className="h-4 w-4" />
          <span>Sidebar menu</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  );
}
