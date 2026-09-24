"use client";

import { ClipboardList, Coins, ReceiptText, ShoppingCart, X } from "lucide-react";
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
  /** Called when the user clicks the Close button to leave the POS workspace. */
  onClose: () => void;
}

/**
 * Full-height vertical action rail for the POS workspace.
 *
 * A dark navy column pinned to the left edge (below the POS header) with the
 * workspace views (New Sale, Transactions, Receivable, Item Listing) and a
 * Close button pinned to the bottom that leaves the POS workspace. Each button
 * is an icon only; the name is shown as a tooltip on hover/focus. The active
 * view is highlighted. Product filtering is handled by the search field, so no
 * category buttons are shown.
 */
export function PosCategoryRail({
  view,
  onSelectView,
  onClose,
}: PosCategoryRailProps) {
  return (
    <div
      className="flex h-full w-16 shrink-0 flex-col items-center gap-2 overflow-y-auto bg-[#0d2b45] p-2"
      role="toolbar"
      aria-label="Point of sale actions"
    >
      {VIEW_BUTTONS.map(({ view: v, label, icon: Icon }) => {
        const isActive = view === v;
        return (
          <Tooltip key={v}>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-label={label}
                  onClick={() => onSelectView(v)}
                  className={cn(
                    "flex h-12 w-full cursor-pointer items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </button>
              }
            />
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        );
      })}

      {/* Close — leaves the POS workspace. Pinned to the bottom of the rail. */}
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={onClose}
              aria-label="Close point of sale"
              className="mt-auto flex h-12 w-full cursor-pointer items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-rose-500/90 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          }
        />
        <TooltipContent side="right">Close</TooltipContent>
      </Tooltip>
    </div>
  );
}
