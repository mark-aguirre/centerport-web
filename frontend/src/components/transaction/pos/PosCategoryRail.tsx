"use client";

import { Activity, ClipboardList, Coins, ReceiptText, ShoppingCart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { POS_MOTTO, posArt } from "@/components/transaction/pos/pos-theme";
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
 * A deep clinical-green column pinned to the left edge (below the POS header)
 * with the workspace views (New Sale, Transactions, Receivable, Item Listing).
 * The active view sits on a brighter green tile. Product filtering is handled by
 * the search field, so no category buttons are shown.
 *
 * A leaf watermark fades up from the bottom of the column and the clinic motto
 * closes it out, which keeps the long empty stretch below the four buttons from
 * reading as dead space. Both are decorative and drop out when collapsed.
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
        "relative flex h-full shrink-0 flex-col overflow-hidden bg-gradient-to-b from-[#0d4238] via-[#0a352c] to-[#06251f] transition-[width] duration-200 ease-out",
        collapsed ? "w-16" : "w-52"
      )}
    >
      {/* Leaf watermark, anchored to the bottom of the column. Very low opacity
          so the button labels keep full contrast over it. */}
      {!collapsed && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-cover bg-bottom bg-no-repeat opacity-[0.07] mix-blend-screen"
          style={{ backgroundImage: posArt("leaves") }}
        />
      )}

      <div
        className={cn(
          "relative flex flex-col gap-2 overflow-y-auto overflow-x-hidden p-2",
          collapsed ? "items-center" : "items-stretch"
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
                  ? "bg-gradient-to-r from-[#13865a] to-[#0f6f4a] text-white shadow-md shadow-black/20"
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

      {/* Motto footer. Decorative, so it is hidden from assistive tech and from
          the collapsed rail where there is no room for it. */}
      {!collapsed && (
        <div
          aria-hidden="true"
          className="relative mt-auto flex flex-col items-center gap-2 px-3 pb-7 pt-6"
        >
          <Activity className="h-7 w-7 text-white/45" strokeWidth={1.5} />
          <p className="flex flex-col items-center text-center text-xs leading-relaxed text-white/55">
            {POS_MOTTO.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
