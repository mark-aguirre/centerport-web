"use client";

import { useMemo } from "react";
import {
  Boxes,
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  Loader2,
  RotateCcw,
} from "lucide-react";

import { EmptyStateCard } from "@/components/common/empty-state-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PosFilterGroup,
  POS_FILTER_CONTROL,
} from "@/components/transaction/pos/PosFilterGroup";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReceivableReport,
  accountName,
} from "@/hooks/use-receivable-report";
import { formatPeso } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  PACKAGE_FILTERS,
  type PackageFilter,
} from "@/components/receivable/types";

const headerClass =
  "h-12 px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0f4435]/55";

const cellClass = "px-5 py-3.5 text-sm";

/** Shared styling for a POS select trigger standing in a filter row. */
const selectItemClass =
  "data-[selected]:bg-[#118a57] data-[selected]:text-white focus:bg-[#118a57] focus:text-white";

interface ReceivableReportViewProps {
  /**
   * Renders the Reset / Generate action buttons. Receives the wired button
   * elements so the caller can place them (e.g. in a page banner or inline).
   * When omitted, the actions render inline above the filters.
   */
  renderActions?: (actions: React.ReactNode) => React.ReactNode;
}

/**
 * Receivable report view — filters, actions, and the results table.
 *
 * Owns its filter and report state through {@link useReceivableReport}, so it
 * can be dropped into any container; it renders only content (no page title or
 * outer page container). Currently that container is the POS workspace's
 * embedded view, so the styling follows the POS zone's clinical greens and the
 * same two-band shape as the transactions view: a filter bar over a results
 * table. The Reset / Generate actions can be relocated via
 * {@link ReceivableReportViewProps.renderActions}.
 *
 * Unlike transactions, this report does not load on mount — the account filter
 * is required, so nothing is fetched until Generate is pressed.
 */
export function ReceivableReportView({ renderActions }: ReceivableReportViewProps) {
  const {
    filters,
    setFilter,
    reset,
    accounts,
    paymentTypes,
    lookupsLoading,
    report,
    generating,
    generate,
  } = useReceivableReport();

  // Account selector uses names as the option list; map back to id on change.
  const accountNames = useMemo(() => accounts.map((a) => a.name), [accounts]);
  const paymentTypeOptions = useMemo(
    () => ["All", ...paymentTypes.map((p) => p.label)],
    [paymentTypes]
  );

  const selectedAccountName = accountName(accounts, filters.account_id);

  const handleAccountChange = (name: string) => {
    const match = accounts.find((a) => a.name === name);
    setFilter("account_id", match?.id ?? "");
  };

  const actions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="h-11 cursor-pointer border-[#0f4435]/15 bg-white px-4 text-sm font-semibold text-[#0f4435] hover:bg-[#eef8f2]"
        onClick={reset}
        disabled={generating}
      >
        <RotateCcw className="mr-1.5 h-4 w-4" />
        Reset
      </Button>
      <Button
        className="h-11 cursor-pointer bg-gradient-to-r from-[#118a57] to-[#0d7349] px-5 text-sm font-semibold text-white shadow-sm hover:from-[#0f7a4d] hover:to-[#0b6440]"
        onClick={generate}
        disabled={generating || lookupsLoading}
      >
        {generating ? (
          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        ) : (
          <FileText className="mr-1.5 h-4 w-4" />
        )}
        Generate
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {renderActions ? (
        renderActions(actions)
      ) : (
        <div className="flex justify-end">{actions}</div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-[#0f4435]/10 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <PosFilterGroup icon={Building2} label="Account">
            <Select
              value={selectedAccountName}
              onValueChange={(v) => handleAccountChange(v as string)}
            >
              <SelectTrigger
                className={cn(POS_FILTER_CONTROL, "rounded-lg")}
                aria-label="Filter by account"
              >
                <SelectValue placeholder="Select an account..." />
              </SelectTrigger>
              <SelectContent>
                {accountNames.map((opt) => (
                  <SelectItem key={opt} value={opt} className={selectItemClass}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PosFilterGroup>

          <PosFilterGroup icon={CreditCard} label="Payment Type">
            <Select
              value={filters.payment_type || "All"}
              onValueChange={(v) =>
                setFilter("payment_type", v === "All" ? "" : (v as string))
              }
            >
              <SelectTrigger
                className={cn(POS_FILTER_CONTROL, "rounded-lg")}
                aria-label="Filter by payment type"
              >
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {paymentTypeOptions.map((opt) => (
                  <SelectItem key={opt} value={opt} className={selectItemClass}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PosFilterGroup>

          <PosFilterGroup icon={CalendarDays} label="From Date">
            <Input
              type="date"
              value={filters.from_date}
              onChange={(e) => setFilter("from_date", e.target.value)}
              aria-label="From date"
              className={POS_FILTER_CONTROL}
            />
          </PosFilterGroup>

          <PosFilterGroup icon={CalendarDays} label="To Date">
            <Input
              type="date"
              value={filters.to_date}
              onChange={(e) => setFilter("to_date", e.target.value)}
              aria-label="To date"
              className={POS_FILTER_CONTROL}
            />
          </PosFilterGroup>

          {/* Package classification, as a segmented row across the full width —
              three short options read better side by side than stacked in a
              narrow column. */}
          <PosFilterGroup
            icon={Boxes}
            label="Package"
            className="lg:col-span-4"
          >
            <div
              className="flex h-11 flex-wrap items-center gap-5"
              role="radiogroup"
              aria-label="Package classification"
            >
              {PACKAGE_FILTERS.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="radio"
                    name="package_filter"
                    checked={filters.package_filter === option}
                    onChange={() =>
                      setFilter("package_filter", option as PackageFilter)
                    }
                    className="h-4 w-4 accent-[#118a57]"
                    aria-label={`Package - ${option}`}
                  />
                  <span className="text-sm text-[#0f4435]/80">{option}</span>
                </label>
              ))}
            </div>
          </PosFilterGroup>
        </div>
      </div>

      {/* Results */}
      {generating ? (
        <div className="flex items-center justify-center rounded-xl border border-[#0f4435]/10 bg-white py-24 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[#118a57]" />
        </div>
      ) : !report ? (
        <EmptyStateCard
          className="border-[#118a57]/25 bg-white/70"
          message="Set your filters and click Generate to view receivables."
        />
      ) : report.rows.length === 0 ? (
        <EmptyStateCard
          className="border-[#118a57]/25 bg-white/70"
          message="No receivables match these filters. Adjust and Generate again."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#0f4435]/10 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-[#0f4435]/10 bg-[#f6faf8] hover:bg-[#f6faf8]">
                <TableHead className={headerClass}>Transaction #</TableHead>
                <TableHead className={headerClass}>Customer</TableHead>
                <TableHead className={headerClass}>Account</TableHead>
                <TableHead className={headerClass}>Description</TableHead>
                <TableHead className={headerClass}>Payment Type</TableHead>
                <TableHead className={headerClass}>Date</TableHead>
                <TableHead className={cn(headerClass, "text-right")}>
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-[#0f4435]/8 transition-colors hover:bg-[#f4faf7]"
                >
                  <TableCell className={cn(cellClass, "font-bold text-[#0f4435]")}>
                    {row.transaction_id || "—"}
                  </TableCell>
                  <TableCell className={cn(cellClass, "text-[#0f4435]/85")}>
                    {row.customer_name || "—"}
                  </TableCell>
                  <TableCell className={cn(cellClass, "text-[#0f4435]/70")}>
                    {row.account_name || "—"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      cellClass,
                      "max-w-[260px] truncate text-[#0f4435]/70"
                    )}
                  >
                    {row.description || "—"}
                  </TableCell>
                  <TableCell className={cn(cellClass, "text-[#0f4435]/70")}>
                    {row.payment_type || "—"}
                  </TableCell>
                  <TableCell className={cn(cellClass, "text-[#0f4435]/70")}>
                    {row.date || "—"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      cellClass,
                      "text-right font-semibold tabular-nums text-[#0f4435]"
                    )}
                  >
                    {formatPeso(row.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="border-t border-[#0f4435]/10 bg-[#f6faf8]">
              <TableRow className="hover:bg-[#f6faf8]">
                <TableCell
                  colSpan={6}
                  className={cn(
                    cellClass,
                    "text-[11px] font-bold uppercase tracking-[0.08em] text-[#0f7a4d]"
                  )}
                >
                  Total ({report.total_count} record
                  {report.total_count !== 1 ? "s" : ""})
                </TableCell>
                <TableCell
                  className={cn(
                    cellClass,
                    "text-right text-base font-bold tabular-nums text-[#0f7a4d]"
                  )}
                >
                  {formatPeso(report.total_amount)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </div>
  );
}
