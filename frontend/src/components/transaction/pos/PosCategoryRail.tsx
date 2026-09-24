"use client";

import { ClipboardList, Coins, ReceiptText, ShoppingCart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/** The selectable content views in the POS workspace. */
export type PosView = "pos" | "transactions" | "receivable" | "listing";

interface PosViewButton {
  view: PosView;
  label: string;
  icon: LucideIcon;
}

/** Rail view buttons, in display order. */
const VIEW_BUTTONS: PosViewButton[] = [
  { view: "pos", label: "New Sale", icon: ShoppingCart },
  { view: "transactions", label: "Transactions", icon: ReceiptText },
  { view: "receivable", label: "Receivable", icon: Coins },
  { view: "listing", label: "Item Listing", icon: ClipboardList },
];

interface PosCategoryRailProps {
  /** The currently active content view. */
  view: PosView;
  /** Called when the user selects a view. */
  onSelectView: (view: PosView) => void;
  /**
   * When true the rail shows icons only (narrow). When false it expands to
   * show each button's text label beside its icon. Defaults to false.
   *
   * The `/sale` page collapses the rail once a client is selected, freeing
   * horizontal space for the product grid and cart, and expands it while the
   * operator is still choosing a client.
   */
  collapsed?: boolean;
}

/**
 * Full-height vertical action rail for the POS workspace.
 *
 * A dark navy column pinned to the left edge (below the POS header) with the
 * workspace views (New Sale, Transactions, Receivable, Item Listing). The active
 * view is highlighted. Product filtering is handled by the search field, so no
 * category buttons are shown.
 *
 * The rail has two widths, driven by `collapsed`:
 * - Expanded: each button shows its icon and text label side by side.
 * - Collapsed: icon only, with the label surfaced as a tooltip on hover/focus.
 */
export function PosCategoryRail({
  view,
  onSelectView,
  collapsed = false,
}: PosCategoryRailProps) {
  return (
    <div
      className={cn(
        "flex h-full shrink-0 flex-col gap-2 overflow-y-auto overflow-x-hidden bg-[#0d2b45] p-2 transition-[width] duration-200 ease-out",
        collapsed ? "w-16 items-center" : "w-52 items-stretch"
      )}
      role="toolbar"
      aria-label="Point of sale actions"
    >
      {VIEW_BUTTONS.map(({ view: v, label, icon: Icon }) => {
        const isActive = view === v;
        const button = (
          <button
            type="button"
            aria-pressed={isActive}
            aria-label={label}
            onClick={() => onSelectView(v)}
            className={cn(
              "flex h-12 w-full cursor-pointer items-center rounded-lg transition-colors",
              collapsed ? "justify-center" : "gap-3 px-3",
              isActive
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon className="h-6 w-6 shrink-0" />
            {!collapsed && (
              <span className="truncate text-sm font-medium">{label}</span>
            )}
          </button>
        );

        // Only surface the tooltip when collapsed — the label is already
        // visible in the expanded rail.
        return collapsed ? (
          <Tooltip key={v}>
            <TooltipTrigger render={button} />
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        ) : (
          <div key={v}>{button}</div>
        );
      })}
    </div>
  );
}
