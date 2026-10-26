"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Ban,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Loader2,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyStateCard } from "@/components/common/empty-state-card";
import {
  PosFilterGroup,
  POS_FILTER_CONTROL,
  POS_SEARCH_CONTROL,
  POS_SEARCH_ICON,
} from "@/components/transaction/pos/PosFilterGroup";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VoidDialog } from "@/components/transaction/VoidDialog";
import { useTransactionHistory } from "@/hooks/use-transaction-history";
import { formatPeso } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  TRANSACTION_STATUS_FILTERS,
  type TransactionStatus,
  type TransactionSummary,
} from "@/components/transaction/types";

const headerClass =
  "h-12 px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0f4435]/55";

const cellClass = "px-5 py-3.5 text-sm";

/** Pill colours per status, in the POS zone's palette. */
const STATUS_STYLES: Record<TransactionStatus, string> = {
  DRAFT: "bg-[#0f4435]/8 text-[#0f4435]/65",
  SETTLED: "bg-[#cdebdb] text-[#0b6440]",
  VOIDED: "bg-[#fbdcdc] text-[#b3261e]",
};

/** Renders a transaction's status as a filled pill. */
function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}

/** Formats an ISO date string as `MMM d, yyyy`, tolerating null/invalid input. */
function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : format(date, "MMM d, yyyy");
}

/** The timestamp a row is dated by, as a sortable number. */
function rowTime(tx: TransactionSummary): number {
  const raw = tx.settled_at ?? tx.created_date;
  if (!raw) return 0;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

/**
 * Transaction history view — filters, results table, and the void dialog.
 *
 * Owns its own list and filter state through {@link useTransactionHistory}, so
 * it can be dropped into any container; it renders only the content (no page
 * title or outer page container), leaving surrounding chrome to the caller.
 * Currently that caller is the POS workspace's embedded "Transactions" view, so
 * the styling follows the POS zone's clinical greens rather than the app-wide
 * primary token.
 *
 * Two bands: a filter bar (search, status, date range) over a results table.
 * Date order is a client-side toggle on top of whatever order the server
 * returns, which is why it is local state rather than part of the query.
 */
export function TransactionHistoryView() {
  const {
    transactions,
    loading,
    filters,
    setFilter,
    pendingVoid,
    voidReason,
    setVoidReason,
    requestVoid,
    cancelVoid,
    confirmVoid,
    voiding,
  } = useTransactionHistory();

  // Newest first by default, matching how the counter reads the day's takings.
  const [newestFirst, setNewestFirst] = useState(true);

  const rows = useMemo(() => {
    // Copy before sorting so the hook's array is never mutated.
    return [...transactions].sort((a, b) =>
      newestFirst ? rowTime(b) - rowTime(a) : rowTime(a) - rowTime(b)
    );
  }, [transactions, newestFirst]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-xl border border-[#0f4435]/10 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Search carries its own in-field magnifier, matching the client
              search on the New Sale hero, so the label needs no icon. */}
          <PosFilterGroup label="Search">
            <div className="relative">
              <Search aria-hidden="true" className={POS_SEARCH_ICON} />
              <Input
                type="search"
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
                placeholder="Search transaction # or customer..."
                aria-label="Search transactions"
                className={POS_SEARCH_CONTROL}
              />
            </div>
          </PosFilterGroup>

          <PosFilterGroup icon={SlidersHorizontal} label="Status">
            <Select
              value={filters.status}
              onValueChange={(v) => setFilter("status", v as string)}
            >
              <SelectTrigger
                className={cn(POS_FILTER_CONTROL, "rounded-lg")}
                aria-label="Filter by status"
              >
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_STATUS_FILTERS.map((opt) => (
                  <SelectItem
                    key={opt}
                    value={opt}
                    className="data-[selected]:bg-[#118a57] data-[selected]:text-white focus:bg-[#118a57] focus:text-white"
                  >
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PosFilterGroup>

          <PosFilterGroup icon={CalendarDays} label="From">
            <Input
              type="date"
              value={filters.from}
              onChange={(e) => setFilter("from", e.target.value)}
              aria-label="From date"
              className={POS_FILTER_CONTROL}
            />
          </PosFilterGroup>

          <PosFilterGroup icon={CalendarDays} label="To">
            <Input
              type="date"
              value={filters.to}
              onChange={(e) => setFilter("to", e.target.value)}
              aria-label="To date"
              className={POS_FILTER_CONTROL}
            />
          </PosFilterGroup>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-[#0f4435]/10 bg-white py-24 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[#118a57]" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyStateCard
          className="border-[#118a57]/25 bg-white/70"
          message="No transactions found. Adjust your filters or create a new transaction."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#0f4435]/10 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-[#0f4435]/10 bg-[#f6faf8] hover:bg-[#f6faf8]">
                <TableHead className={headerClass}>Transaction #</TableHead>
                <TableHead className={headerClass}>Customer</TableHead>
                <TableHead className={headerClass}>
                  <button
                    type="button"
                    onClick={() => setNewestFirst((prev) => !prev)}
                    aria-label={
                      newestFirst
                        ? "Sort by date, oldest first"
                        : "Sort by date, newest first"
                    }
                    className="flex cursor-pointer items-center gap-1.5 uppercase tracking-[0.08em] transition-colors hover:text-[#0f7a4d]"
                  >
                    Date
                    {newestFirst ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronUp className="h-3.5 w-3.5" />
                    )}
                  </button>
                </TableHead>
                <TableHead className={cn(headerClass, "text-right")}>
                  Total
                </TableHead>
                <TableHead className={headerClass}>Billing Type</TableHead>
                <TableHead className={headerClass}>Status</TableHead>
                <TableHead className={cn(headerClass, "text-right")}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((tx) => (
                <TableRow
                  key={tx.id}
                  className="border-[#0f4435]/8 transition-colors hover:bg-[#f4faf7]"
                >
                  <TableCell className={cn(cellClass, "font-bold text-[#0f4435]")}>
                    {tx.transaction_id || "—"}
                  </TableCell>
                  <TableCell className={cn(cellClass, "text-[#0f4435]/85")}>
                    {tx.customer_name || "—"}
                  </TableCell>
                  <TableCell className={cn(cellClass, "text-[#0f4435]/70")}>
                    {formatDate(tx.settled_at ?? tx.created_date)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      cellClass,
                      "text-right font-semibold tabular-nums text-[#0f4435]"
                    )}
                  >
                    {formatPeso(tx.total_amount)}
                  </TableCell>
                  <TableCell className={cn(cellClass, "text-[#0f4435]/70")}>
                    {tx.billing_type}
                  </TableCell>
                  <TableCell className={cellClass}>
                    <StatusBadge status={tx.status} />
                  </TableCell>
                  <TableCell className={cn(cellClass, "text-right")}>
                    {tx.status === "SETTLED" ? (
                      <button
                        type="button"
                        onClick={() => requestVoid(tx)}
                        className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[#e0b4b0] bg-white px-3 text-sm font-medium text-[#c0392b] transition-colors hover:bg-[#fdf4f3]"
                      >
                        <Ban className="h-4 w-4" />
                        Void
                      </button>
                    ) : (
                      <span className="text-[#0f4435]/35">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <p className="border-t border-[#0f4435]/8 px-5 py-3 text-xs font-medium text-[#0f7a4d]">
            {rows.length} transaction{rows.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      <VoidDialog
        open={!!pendingVoid}
        onOpenChange={(open) => {
          if (!open) cancelVoid();
        }}
        transaction={pendingVoid}
        reason={voidReason}
        onReasonChange={setVoidReason}
        voiding={voiding}
        onConfirm={confirmVoid}
      />
    </div>
  );
}
