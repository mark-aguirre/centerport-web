/**
 * Transaction (POS-style) feature types.
 *
 * The Transaction module is a point-of-sale sale/charge flow: a customer, a set
 * of transaction items (each a snapshot of a product at the time it was added),
 * and a lifecycle (DRAFT → SETTLED → VOIDED). "Receivable" is intentionally NOT
 * used here — it is reserved for the amounts-owed report. See `ToDo/Transaction.md`.
 *
 * These types are the source of truth for the Transaction pages and are imported
 * into `lib/api.ts` for endpoint typing.
 */

/**
 * Billing responsibility for an item / transaction. This is a *billing type*,
 * not a payment method — see `ToDo/Transaction.md` §22.
 */
export type BillingType = "Application Paid" | "Billed Agency";

/** All billing-type values, for use in `<FormSelect>` option lists. */
export const BILLING_TYPES: BillingType[] = ["Application Paid", "Billed Agency"];

/** Transaction lifecycle status. */
export type TransactionStatus = "DRAFT" | "SETTLED" | "VOIDED";

/** Status filter options for the history page (includes "All"). */
export const TRANSACTION_STATUS_FILTERS = ["All", "DRAFT", "SETTLED", "VOIDED"] as const;

/**
 * A customer that a transaction is billed to. Loaded via the customer lookup
 * endpoint; the fields mirror what the POS workspace displays.
 */
export interface Customer {
  id: string;
  /** Display name (e.g. "Juan Dela Cruz"). */
  name: string;
  /** Application number, when the customer came through an application. */
  application_no?: string | null;
  /** Agency the customer is associated with. */
  agency?: string | null;
}

/**
 * A sellable product / service, used as the source of item defaults. Mirrors an
 * {@link ../listing/types#Item} but is the read-only lookup shape consumed by the
 * product selector.
 */
export interface Product {
  id: string;
  /** Business identifier (e.g. `ITM-000123`). */
  product_id?: string;
  /** Product / service name. */
  name: string;
  /** Description used as the default item description snapshot. */
  description: string;
  /** Current price (used as the default price snapshot). */
  price: number;
  /** Default professional fee for this product. */
  professional_fee: number;
}

/**
 * A single line in a transaction. Stores *snapshots* of the product's price and
 * description at the time it was added, so historical transactions stay accurate
 * even if the product master later changes. See `ToDo/Transaction.md` §14–§15.
 */
export interface TransactionItem {
  /** Server-generated UUID for a persisted item (absent for a draft line). */
  id?: string;
  /** Client-side stable key for React while the transaction is a draft. */
  key: string;
  /** The source product's UUID. */
  product_id: string;
  /** Description snapshot (may include the "- Personal Account" suffix). */
  description_snapshot: string;
  /** Price snapshot in pesos at time of add. */
  price_snapshot: number;
  /** Professional fee assigned to this item (defaults from the product/transaction). */
  professional_fee: number;
  /** Billing responsibility for this item (defaults from the transaction). */
  billing_type: BillingType;
  /** Whether this item is a personal account. */
  personal_account: boolean;
}

/**
 * A transaction. In DRAFT it is built client-side; on Settle the backend
 * recalculates totals and persists it as SETTLED.
 */
export interface Transaction {
  id?: string;
  /** Business identifier (e.g. `TXN-000123`), server-generated. */
  transaction_id?: string;
  /** Customer this transaction is billed to. */
  customer_id: string;
  /** Denormalized customer name for list display. */
  customer_name?: string;
  status: TransactionStatus;
  /** Transaction default billing type (new items inherit it). */
  default_billing_type: BillingType;
  /** Transaction default professional fee (new items inherit it). */
  default_professional_fee: number;
  items: TransactionItem[];
  /** Authoritative total from the backend (frontend computes for display only). */
  total_amount?: number;
  created_by?: string;
  created_date?: string;
  settled_by?: string;
  settled_at?: string;
  voided_by?: string;
  voided_at?: string;
  void_reason?: string;
}

/**
 * Lightweight transaction row for the history list. The list endpoint returns
 * summary fields rather than full item arrays.
 */
export interface TransactionSummary {
  id: string;
  transaction_id: string;
  customer_name: string;
  status: TransactionStatus;
  /** Predominant / default billing type for display. */
  billing_type: BillingType;
  total_amount: number;
  created_date?: string;
  settled_at?: string;
}

/** Payload sent to create/settle a transaction. */
export interface TransactionPayload {
  customer_id: string;
  default_billing_type: BillingType;
  default_professional_fee: number;
  items: Array<{
    product_id: string;
    description_snapshot: string;
    price_snapshot: number;
    professional_fee: number;
    billing_type: BillingType;
    personal_account: boolean;
  }>;
}

/** Empty default state for a new (draft) transaction. */
export const EMPTY_TRANSACTION: Transaction = {
  customer_id: "",
  status: "DRAFT",
  default_billing_type: "Application Paid",
  default_professional_fee: 0,
  items: [],
};

/**
 * Computes the display total for a transaction from its items.
 *
 * The backend is authoritative for the persisted total (see `Transaction.md`
 * §16); this is a client-side breakdown for responsiveness only.
 */
export function computeTransactionTotals(items: TransactionItem[]): {
  itemsTotal: number;
  feesTotal: number;
  total: number;
} {
  const itemsTotal = items.reduce((sum, i) => sum + (i.price_snapshot || 0), 0);
  const feesTotal = items.reduce((sum, i) => sum + (i.professional_fee || 0), 0);
  return { itemsTotal, feesTotal, total: itemsTotal + feesTotal };
}

/**
 * Builds the display description for an item, appending the personal-account
 * suffix when applicable without mutating the stored product description.
 */
export function itemDisplayDescription(description: string, personalAccount: boolean): string {
  return personalAccount ? `${description} - Personal Account` : description;
}
