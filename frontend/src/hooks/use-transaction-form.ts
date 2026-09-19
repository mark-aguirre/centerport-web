"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import {
  computeTransactionTotals,
  EMPTY_TRANSACTION,
  type BillingType,
  type Customer,
  type Product,
  type Transaction,
  type TransactionItem,
  type TransactionPayload,
} from "@/components/transaction/types";

/** Generates a stable client-side key for a draft transaction item. */
function makeItemKey(): string {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** localStorage key for the persisted POS draft (last state). */
const DRAFT_STORAGE_KEY = "centerport-pos-draft";

/** Shape of the persisted draft. */
interface PersistedDraft {
  transaction: Transaction;
  customer: Customer | null;
}

/**
 * Reads the persisted POS draft from localStorage.
 *
 * Returns `null` on the server, when nothing is stored, or when the stored JSON
 * is malformed — callers then fall back to an empty draft.
 */
function loadDraft(): PersistedDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedDraft;
    if (!parsed || typeof parsed !== "object" || !parsed.transaction) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Persists the current POS draft, or clears it when empty. */
function saveDraft(draft: PersistedDraft): void {
  if (typeof window === "undefined") return;
  const empty =
    !draft.customer &&
    !draft.transaction.customer_id &&
    draft.transaction.items.length === 0;
  try {
    if (empty) {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } else {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }
  } catch {
    // Storage may be unavailable (private mode / quota) — persistence is a
    // best-effort convenience, so failures are intentionally swallowed.
  }
}

/** Removes any persisted POS draft. */
function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Return shape of {@link useTransactionForm}. */
export interface UseTransactionFormResult {
  /** The in-progress (draft) transaction. */
  transaction: Transaction;
  /** The selected customer (null until one is chosen). */
  customer: Customer | null;
  /** Select / change the customer (blocked once items exist? no — before settle only). */
  selectCustomer: (customer: Customer) => void;
  /** Override the billed agency for this draft (defaults to the customer's). */
  setAgency: (agency: string | null) => void;
  /** Transaction default billing type. */
  defaultBillingType: BillingType;
  setDefaultBillingType: (value: BillingType) => void;
  /** Transaction default professional fee. */
  defaultProfessionalFee: number;
  setDefaultProfessionalFee: (value: number) => void;

  /** The full product catalog for the POS card grid. */
  catalog: Product[];
  /** True while the catalog is loading. */
  catalogLoading: boolean;

  /** Append a product to the transaction items (inherits current defaults). */
  addProduct: (product: Product) => void;
  /** Replace an item (from the edit dialog). */
  updateItem: (key: string, patch: Partial<TransactionItem>) => void;
  /** Remove an item by its client key. */
  removeItem: (key: string) => void;

  /** Computed totals for display (backend is authoritative on settle). */
  totals: { itemsTotal: number; feesTotal: number; total: number };

  /** Whether the transaction can be settled. */
  canSettle: boolean;
  /** True while a settle request is in flight. */
  settling: boolean;
  /** Settle the transaction; resolves to the settled record on success. */
  settle: () => Promise<Transaction | null>;

  /** Reset the workspace to an empty draft. */
  reset: () => void;
}

/**
 * State and actions for the New Transaction (POS) workspace.
 *
 * Builds a DRAFT transaction client-side — pick a customer, add products as
 * item snapshots, tune per-item billing/fee/personal-account — then settles it
 * through the backend, which recalculates and validates the total. Follows the
 * bespoke-hook pattern; the shared `useEntityForm` is patient-centric and does
 * not fit a POS flow.
 */
export function useTransactionForm(): UseTransactionFormResult {
  const [transaction, setTransaction] = useState<Transaction>(EMPTY_TRANSACTION);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [settling, setSettling] = useState(false);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  // Gate persistence until after the initial restore, so the empty starting
  // state doesn't overwrite a saved draft before we've had a chance to load it.
  const [restored, setRestored] = useState(false);

  // Restore the last in-progress draft (client + cart) after mount. Doing this
  // in an effect (rather than lazy state init) keeps the server-rendered HTML
  // and the first client render identical, avoiding a hydration mismatch.
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setTransaction(draft.transaction);
      setCustomer(draft.customer);
    }
    setRestored(true);
  }, []);

  // Persist the draft whenever it changes, once the initial restore has run.
  useEffect(() => {
    if (!restored) return;
    saveDraft({ transaction, customer });
  }, [restored, transaction, customer]);

  // Load the product catalog once for the POS card grid. An empty keyword
  // returns all active products from the backend search endpoint.
  useEffect(() => {
    let cancelled = false;
    setCatalogLoading(true);
    api.entities.Product.search("", 200)
      .then((products) => {
        if (!cancelled) setCatalog(products);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(
            err instanceof ApiError ? err.message : "Failed to load products"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectCustomer = useCallback((next: Customer) => {
    setCustomer(next);
    setTransaction((prev) => ({
      ...prev,
      customer_id: next.id,
      customer_name: next.name,
      // Default the billed agency to the customer's agency; the operator can
      // change it via the agency search/select.
      billed_agency: next.agency ?? null,
    }));
  }, []);

  const setAgency = useCallback((agency: string | null) => {
    setTransaction((prev) => ({ ...prev, billed_agency: agency }));
  }, []);

  const setDefaultBillingType = useCallback((value: BillingType) => {
    setTransaction((prev) => ({ ...prev, default_billing_type: value }));
  }, []);

  const setDefaultProfessionalFee = useCallback((value: number) => {
    setTransaction((prev) => ({ ...prev, default_professional_fee: value }));
  }, []);

  const addProduct = useCallback((product: Product) => {
    setTransaction((prev) => {
      // Prefer the product's own professional fee; fall back to the
      // transaction default when the product has none.
      const professionalFee =
        product.professional_fee || prev.default_professional_fee;
      const billingType = prev.default_billing_type;

      // Adding the same product with the same billing/fee just bumps the
      // quantity of the existing line rather than creating a duplicate row.
      const existing = prev.items.find(
        (i) =>
          i.product_id === product.id &&
          i.billing_type === billingType &&
          i.professional_fee === professionalFee &&
          !i.personal_account
      );

      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.key === existing.key ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }

      const newItem: TransactionItem = {
        key: makeItemKey(),
        product_id: product.id,
        description_snapshot: product.description || product.name,
        quantity: 1,
        price_snapshot: product.price ?? 0,
        professional_fee: professionalFee,
        billing_type: billingType,
        personal_account: false,
      };
      return { ...prev, items: [...prev.items, newItem] };
    });
  }, []);

  const updateItem = useCallback((key: string, patch: Partial<TransactionItem>) => {
    setTransaction((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.key === key ? { ...item, ...patch } : item
      ),
    }));
  }, []);

  const removeItem = useCallback((key: string) => {
    setTransaction((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.key !== key),
    }));
  }, []);

  const totals = useMemo(
    () => computeTransactionTotals(transaction.items),
    [transaction.items]
  );

  const canSettle = useMemo(
    () =>
      !!transaction.customer_id &&
      transaction.items.length > 0 &&
      transaction.items.every(
        (i) => i.price_snapshot >= 0 && i.professional_fee >= 0
      ),
    [transaction]
  );

  const settle = useCallback(async (): Promise<Transaction | null> => {
    if (!canSettle) {
      toast.error("Select a customer and add at least one valid item before settling.");
      return null;
    }
    setSettling(true);
    try {
      const payload: TransactionPayload = {
        customer_id: transaction.customer_id,
        default_billing_type: transaction.default_billing_type,
        default_professional_fee: transaction.default_professional_fee,
        // Quantity is a display concept only; expand each line into N
        // individual item entries so the backend contract stays unchanged.
        items: transaction.items.flatMap((i) =>
          Array.from({ length: Math.max(1, i.quantity) }, () => ({
            product_id: i.product_id,
            description_snapshot: i.description_snapshot,
            price_snapshot: i.price_snapshot,
            professional_fee: i.professional_fee,
            billing_type: i.billing_type,
            personal_account: i.personal_account,
          }))
        ),
      };
      const settled = await api.entities.Transaction.settle(payload);
      toast.success(
        `Transaction ${settled.transaction_id ?? ""} settled`.trim()
      );
      // The draft is done — drop the persisted last state.
      clearDraft();
      return settled;
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to settle transaction"
      );
      return null;
    } finally {
      setSettling(false);
    }
  }, [canSettle, transaction]);

  const reset = useCallback(() => {
    setTransaction(EMPTY_TRANSACTION);
    setCustomer(null);
    clearDraft();
  }, []);

  return {
    transaction,
    customer,
    catalog,
    catalogLoading,
    selectCustomer,
    setAgency,
    defaultBillingType: transaction.default_billing_type,
    setDefaultBillingType,
    defaultProfessionalFee: transaction.default_professional_fee,
    setDefaultProfessionalFee,
    addProduct,
    updateItem,
    removeItem,
    totals,
    canSettle,
    settling,
    settle,
    reset,
  };
}
