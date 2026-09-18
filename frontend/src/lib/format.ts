/**
 * Shared formatting helpers.
 *
 * Framework-agnostic display helpers used across feature modules. Keep these
 * pure (no React, no DOM) so they can run on the server and client alike.
 */

/**
 * Peso currency formatter (Philippine peso, `en-PH` locale).
 *
 * Reused across the billing/transaction modules so all amounts render the same
 * way, e.g. `₱1,550.00`. Instantiated once at module scope because constructing
 * an `Intl.NumberFormat` is comparatively expensive.
 */
const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formats a number as Philippine peso currency, e.g. `₱1,550.00`.
 *
 * Non-finite values (`null`, `undefined`, `NaN`) are treated as `0` so the UI
 * always shows a well-formed amount rather than a blank or `NaN`.
 *
 * @param amount - the numeric amount (major units, e.g. `1550` → `₱1,550.00`)
 * @returns the formatted peso string
 *
 * @example
 * ```ts
 * formatPeso(1550);      // "₱1,550.00"
 * formatPeso(500.5);     // "₱500.50"
 * formatPeso(undefined); // "₱0.00"
 * ```
 */
export function formatPeso(amount: number | null | undefined): string {
  const value = typeof amount === "number" && Number.isFinite(amount) ? amount : 0;
  return pesoFormatter.format(value);
}

/**
 * Parses a user-entered currency string into a number.
 *
 * Strips the peso sign, thousands separators, and stray whitespace, then
 * coerces to a finite number. Returns `0` for empty or unparseable input so
 * callers can rely on a numeric result.
 *
 * @param input - raw text such as `"₱1,550.00"` or `"1550"`
 * @returns the parsed numeric amount (defaults to `0`)
 */
export function parsePeso(input: string | number | null | undefined): number {
  if (typeof input === "number") {
    return Number.isFinite(input) ? input : 0;
  }
  if (!input) return 0;
  const cleaned = input.replace(/[^0-9.-]/g, "");
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) ? value : 0;
}
