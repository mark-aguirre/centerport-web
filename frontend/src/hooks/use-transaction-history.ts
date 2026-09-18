"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import type { TransactionSummary } from "@/components/transaction/types";

/** Filter state for the transaction history list. */
export interface TransactionHistoryFilters {
  search: string;
  status: string;
  from: string;
  to: string;
}

const EMPTY_FILTERS: TransactionHistoryFilters = {
  search: "",
  status: "All",
  from: "",
  to: "",
};

/** Return shape of {@link useTransactionHistory}. */
export interface UseTransactionHistoryResult {
  transactions: TransactionSummary[];
  loading: boolean;
  filters: TransactionHistoryFilters;
  setFilter: (field: keyof TransactionHistoryFilters, value: string) => void;
  refresh: () => void;

  // --- Void ---
  pendingVoid: TransactionSummary | null;
  voidReason: string;
  setVoidReason: (value: string) => void;
  requestVoid: (tx: TransactionSummary) => void;
  cancelVoid: () => void;
  confirmVoid: () => Promise<void>;
  voiding: boolean;
}

/**
 * State and actions for the Transaction History page.
 *
 * Loads a filtered list of transactions and supports voiding a settled one.
 * Filters are applied server-side through `api.entities.Transaction.list`.
 */
export function useTransactionHistory(): UseTransactionHistoryResult {
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionHistoryFilters>(EMPTY_FILTERS);

  const [pendingVoid, setPendingVoid] = useState<TransactionSummary | null>(null);
  const [voidReason, setVoidReason] = useState("");
  const [voiding, setVoiding] = useState(false);

  const load = useCallback(async (active: TransactionHistoryFilters) => {
    setLoading(true);
    try {
      const paged = await api.entities.Transaction.list({
        search: active.search || undefined,
        status: active.status,
        from: active.from || undefined,
        to: active.to || undefined,
      });
      setTransactions(paged.content);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Debounce so typing in the search box doesn't fire a request per keystroke.
    const handle = window.setTimeout(() => void load(filters), 300);
    return () => window.clearTimeout(handle);
  }, [filters, load]);

  const setFilter = useCallback(
    (field: keyof TransactionHistoryFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const refresh = useCallback(() => void load(filters), [filters, load]);

  const requestVoid = useCallback((tx: TransactionSummary) => {
    setPendingVoid(tx);
    setVoidReason("");
  }, []);

  const cancelVoid = useCallback(() => {
    setPendingVoid(null);
    setVoidReason("");
  }, []);

  const confirmVoid = useCallback(async () => {
    if (!pendingVoid) return;
    if (!voidReason.trim()) {
      toast.error("A reason is required to void a transaction");
      return;
    }
    setVoiding(true);
    try {
      await api.entities.Transaction.void(pendingVoid.id, voidReason.trim());
      toast.success(`Transaction ${pendingVoid.transaction_id} voided`);
      setPendingVoid(null);
      setVoidReason("");
      await load(filters);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to void transaction"
      );
    } finally {
      setVoiding(false);
    }
  }, [pendingVoid, voidReason, filters, load]);

  return {
    transactions,
    loading,
    filters,
    setFilter,
    refresh,
    pendingVoid,
    voidReason,
    setVoidReason,
    requestVoid,
    cancelVoid,
    confirmVoid,
    voiding,
  };
}
