/**
 * Item Listing feature types.
 *
 * An "item" is a billable thing the clinic charges for — a medical service, a
 * laboratory examination, a package, or any other chargeable line. These types
 * are the source of truth for the Item Listing page and are imported into
 * `lib/api.ts` for endpoint typing.
 */

/**
 * A billable item / service master record.
 */
export interface Item {
  /** Server-generated UUID (absent for a new, unsaved item). */
  id?: string;
  /** Human-facing business identifier (e.g. `ITM-000123`), server-generated. */
  item_id?: string;
  /** Item / service name (required). */
  name: string;
  /** Longer description shown on transactions and reports. */
  description: string;
  /** Current unit price in pesos (major units). */
  price: number;
  /** Default professional fee applied when this item is added to a transaction. */
  professional_fee: number;
  /** Whether the item counts as a package (drives the report package filter). */
  is_package: boolean;
  /** Whether the item is active and available for selection. */
  active: boolean;
  /** Audit fields (output-only). */
  created_by?: string;
  updated_by?: string;
  created_date?: string;
  updated_date?: string;
}

/** Empty default state for a new item (all fields initialized). */
export const EMPTY_ITEM: Item = {
  name: "",
  description: "",
  price: 0,
  professional_fee: 0,
  is_package: false,
  active: true,
};
