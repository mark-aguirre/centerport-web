/**
 * Receivable Report feature types.
 *
 * The Receivable Report is a read-only reporting view over settled transactions,
 * surfacing amounts owed (typically the "Billed Agency" billing type), filtered
 * by account, payment type, package classification, and date range. It does not
 * own transaction state — that belongs to the Transaction module. See
 * `ToDo/Receivable.md`.
 */

/** Package classification filter for the report. */
export type PackageFilter = "Package" | "Not Package" | "All";

/** All package-filter values, in display order (default is "All"). */
export const PACKAGE_FILTERS: PackageFilter[] = ["Package", "Not Package", "All"];

/** A selectable company account for the report's account filter. */
export interface ReceivableAccount {
  id: string;
  name: string;
}

/** A configured payment type option for the report's payment-type filter. */
export interface PaymentTypeOption {
  id: string;
  label: string;
}

/** Filter values submitted when generating the report. */
export interface ReceivableReportFilters {
  /** Selected account UUID (required when generating). */
  account_id: string;
  /** Selected payment type label (optional). */
  payment_type: string;
  /** Package classification. */
  package_filter: PackageFilter;
  /** Inclusive date range, `yyyy-MM-dd`. */
  from_date: string;
  to_date: string;
}

/** A single row in the generated receivable report. */
export interface ReceivableReportRow {
  id: string;
  /** Source transaction business identifier (e.g. `TXN-000123`). */
  transaction_id: string;
  /** Customer / applicant the amount pertains to. */
  customer_name: string;
  /** Account the amount is billed to. */
  account_name: string;
  /** Item / package description. */
  description: string;
  /** Payment type / billing category. */
  payment_type: string;
  /** Whether the row is a package. */
  is_package: boolean;
  /** Amount owed in pesos. */
  amount: number;
  /** Date the amount was recorded / settled (`yyyy-MM-dd`). */
  date: string;
}

/** The full report payload returned by the backend. */
export interface ReceivableReport {
  rows: ReceivableReportRow[];
  /** Total number of rows (may exceed the returned page). */
  total_count: number;
  /** Sum of all row amounts in pesos. */
  total_amount: number;
}
