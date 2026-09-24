"use client";

import { HeartPulse, ReceiptText } from "lucide-react";

import { useAuth } from "@/components/auth-provider";

/**
 * Dark navy header bar for the counter POS workspace.
 *
 * Mirrors the immersive POS design: a square brand tile and workspace title on
 * the left, and the signed-in operator (name + initials avatar) on the right.
 * Rendered only inside the `/sale` page, so it does not affect the
 * shared app header used elsewhere.
 */
export function PosHeader() {
  const { user } = useAuth();

  const operatorName = user?.full_name || user?.username || "Operator";
  const initials = operatorName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between bg-[#0d2b45] px-4 text-white md:px-6">
      <div className="flex items-center gap-3">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white">
          <ReceiptText className="h-5 w-5" />
          {/* Small medical pulse badge to signal "medical billing". */}
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0d2b45] ring-2 ring-emerald-500">
            <HeartPulse className="h-2.5 w-2.5 text-emerald-400" />
          </span>
        </div>
        <h1 className="flex items-baseline gap-2 text-lg font-bold tracking-tight">
          CenterPort
          <span className="text-sm font-medium text-white/60">Counter POS</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
            Operator
          </p>
          <p className="text-sm font-semibold">{operatorName}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
          {initials || "OP"}
        </div>
      </div>
    </header>
  );
}
