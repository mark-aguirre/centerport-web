"use client";

import { useCallback, useEffect, useState } from "react";
import { endOfDay, format, startOfMonth } from "date-fns";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import type {
  PaymentTypeOption,
  ReceivableAccount,
  ReceivableReport,
  ReceivableReportFilters,
} from "@/components/receivable/types";

/** Builds the default filter state: package = All, range = current month. */
function defaultFilters(): ReceivableReportFilters {
  const today = new Date();
  return {
    account_id: "",
    payment_type: "",
    package_filter: "All",
    from_date: format(startOfMonth(today), "yyyy-MM-dd"),
    to_date: format(today, "yyyy-MM-dd"),
  };
}

/** Return shape of {@link useReceivableReport}. */
export interface UseReceivableReportResult {
  filters: ReceivableReportFilters;
  setFilter: <K extends keyof ReceivableReportFilters>(
    field: K,
    value: ReceivableReportFilters[K]
  ) => void;
  reset: () => void;

  /** Loaded account options for the account selector. */
  accounts: ReceivableAccount[];
  /** Loaded payment-type options. */
  paymentTypes: PaymentTypeOption[];
  /** True while lookups are loading. */
  lookupsLoading: boolean;

  /** The generated report, or null before the first successful generate. */
  report: ReceivableReport | null;
  /** True while a report is being generated. */
  generating: boolean;
  /** Validate filters and generate the report. */
  generate: () => Promise<void>;
}

/**
 * State and actions for the Receivable Report page.
 *
 * Loads the account and payment-type lookups, holds the filter form, validates
 * the account selection and date range, then generates the report through the
 * `api` client. The date range defaults to the current month.
 */
export function useReceivableReport(): UseReceivableReportResult {
  const [filters, setFilters] = useState<ReceivableReportFilters>(defaultFilters);
  const [accounts, setAccounts] = useState<ReceivableAccount[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentTypeOption[]>([]);
  const [lookupsLoading, setLookupsLoading] = useState(true);
  const [report, setReport] = useState<ReceivableReport | null>(null);
  const [generating, setGenerating] = useState(false);

  // Load lookups once on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLookupsLoading(true);
      try {
        const [acc, pts] = await Promise.all([
          api.Receivables.listAccounts(),
          api.Receivables.listPaymentTypes(),
        ]);
        if (!cancelled) {
          setAccounts(acc);
          setPaymentTypes(pts);
        }
      } catch {
        if (!cancelled) {
          setAccounts([]);
          setPaymentTypes([]);
        }
      } finally {
        if (!cancelled) setLookupsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setFilter = useCallback(
    <K extends keyof ReceivableReportFilters>(
      field: K,
      value: ReceivableReportFilters[K]
    ) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const reset = useCallback(() => {
    setFilters(defaultFilters());
    setReport(null);
  }, []);

  const generate = useCallback(async () => {
    if (!filters.account_id) {
      toast.error("Please select an account.");
      return;
    }
    if (!filters.from_date || !filters.to_date) {
      toast.error("Please provide both From and To dates.");
      return;
    }
    // Compare at day granularity so an equal From/To (single day) is valid.
    if (endOfDay(new Date(filters.to_date)) < new Date(filters.from_date)) {
      toast.error("From Date must be on or before To Date.");
      return;
    }

    setGenerating(true);
    try {
      const result = await api.Receivables.generate(filters);
      setReport(result);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to generate report"
      );
    } finally {
      setGenerating(false);
    }
  }, [filters]);

  return {
    filters,
    setFilter,
    reset,
    accounts,
    paymentTypes,
    lookupsLoading,
    report,
    generating,
    generate,
  };
}

/** Resolves an account's display name from its id (empty string when absent). */
export function accountName(
  accounts: ReceivableAccount[],
  id: string
): string {
  return accounts.find((a) => a.id === id)?.name ?? "";
}
