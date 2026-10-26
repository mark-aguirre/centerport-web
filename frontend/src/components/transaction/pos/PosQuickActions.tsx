"use client";

import { Package, ReceiptText, UserPlus, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** One quick-action tile: what it looks like and which handler it runs. */
interface QuickAction {
  /** Stable key, also the handler name on {@link PosQuickActionsProps}. */
  action: "newSale" | "outPatient" | "transactions" | "items";
  label: string;
  description: string;
  icon: LucideIcon;
  /** Card surface + border. */
  card: string;
  /** Icon chip surface. */
  chip: string;
  /** Icon colour. */
  tint: string;
}

/**
 * The four tiles, in display order.
 *
 * Declared at module scope so the icon components are never created during
 * render (`react-hooks/static-components`), and so each tile's colour set lives
 * next to its label rather than being derived in the markup.
 */
const QUICK_ACTIONS: QuickAction[] = [
  {
    action: "newSale",
    label: "New Sale",
    description: "Start a new transaction",
    icon: UserRound,
    card: "border-[#118a57]/15 bg-[#eef8f2] hover:border-[#118a57]/35",
    chip: "bg-[#118a57]/12",
    tint: "text-[#0f7a4d]",
  },
  {
    action: "outPatient",
    label: "Out-Patient",
    description: "Register a new patient",
    icon: UserPlus,
    card: "border-blue-500/15 bg-blue-50/70 hover:border-blue-500/35",
    chip: "bg-blue-500/12",
    tint: "text-blue-600",
  },
  {
    action: "transactions",
    label: "Transactions",
    description: "View sales history",
    icon: ReceiptText,
    card: "border-violet-500/15 bg-violet-50/70 hover:border-violet-500/35",
    chip: "bg-violet-500/12",
    tint: "text-violet-600",
  },
  {
    action: "items",
    label: "Items",
    description: "Manage products & services",
    icon: Package,
    card: "border-amber-500/20 bg-amber-50/70 hover:border-amber-500/40",
    chip: "bg-amber-500/15",
    tint: "text-amber-600",
  },
];

interface PosQuickActionsProps {
  /** Focus the client search to begin a sale. */
  onNewSale: () => void;
  /** Open the walk-in / out-patient registration dialog. */
  onOutPatient: () => void;
  /** Switch to the transaction history view. */
  onTransactions: () => void;
  /** Switch to the item listing view. */
  onItems: () => void;
}

/**
 * Row of entry-point tiles shown under the welcome hero.
 *
 * The same four destinations as the rail, surfaced as large touch targets for
 * counter use while no client is selected. They disappear once a sale is under
 * way, when the product grid needs the space.
 */
export function PosQuickActions({
  onNewSale,
  onOutPatient,
  onTransactions,
  onItems,
}: PosQuickActionsProps) {
  const handlers: Record<QuickAction["action"], () => void> = {
    newSale: onNewSale,
    outPatient: onOutPatient,
    transactions: onTransactions,
    items: onItems,
  };

  return (
    <div className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-4">
      {QUICK_ACTIONS.map(
        ({ action, label, description, icon: Icon, card, chip, tint }) => (
          <button
            key={action}
            type="button"
            onClick={handlers[action]}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all hover:shadow-sm ${card}`}
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${chip} ${tint}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-[#0f4435]">
                {label}
              </span>
              <span className="block truncate text-xs text-[#0f4435]/60">
                {description}
              </span>
            </span>
          </button>
        )
      )}
    </div>
  );
}
