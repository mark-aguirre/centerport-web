/**
 * Shared form utility functions used across all entity form modules.
 *
 * Provides generic implementations of common patterns: stripping system
 * fields, sanitizing payloads for backend submission, creating field
 * updaters for section components, and humanizing field names for
 * error display.
 */

/**
 * Base constraint for records managed by the form system.
 *
 * All entity types (LandbasePeme, MedicalExam, MlcRecord, PanamaCertificate)
 * share these optional system fields managed by the backend.
 */
export interface BaseRecord {
  id?: string;
  created_date?: string;
  updated_date?: string;
}

/**
 * Strip system-managed fields from a record before sending to the backend.
 *
 * Removes fields listed in `systemFields` which are server-generated and
 * must not be included in create/update payloads.
 *
 * @param record - Full record from form state
 * @param systemFields - Array of field names to remove
 * @returns Record without the specified system fields
 *
 * @example
 * ```ts
 * const payload = stripSystemFields(data, ["id", "peme_id", "created_date", "updated_date"]);
 * ```
 */
export function stripSystemFields<T extends BaseRecord>(
  record: T,
  systemFields: readonly string[]
): Partial<T> {
  const entries = Object.entries(record).filter(
    ([key]) => !systemFields.includes(key)
  );
  return Object.fromEntries(entries) as Partial<T>;
}

/**
 * Sanitize payload before sending to the backend.
 *
 * Converts empty strings to null for enum-typed and optional fields so
 * the backend doesn't reject them during deserialization. Optionally
 * preserves arrays and specific field types.
 *
 * @param record - Partial record to sanitize
 * @param options - Configuration for preservation rules
 * @returns Sanitized record with empty strings replaced by null
 *
 * @example
 * ```ts
 * const clean = sanitizePayload(payload, { preserveArrayFields: ["visual_aids"] });
 * ```
 */
export function sanitizePayload<T>(
  record: Partial<T>,
  options: {
    preserveArrayFields?: string[];
  } = {}
): Partial<T> {
  const { preserveArrayFields = [] } = options;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(record as Record<string, unknown>)) {
    if (Array.isArray(value) && preserveArrayFields.includes(key)) {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] = value;
    } else {
      result[key] = value === "" ? null : value;
    }
  }

  return result as Partial<T>;
}

/**
 * Create a field updater function for section components.
 *
 * Returns a callback that updates a single field on the record and
 * calls the parent onChange with the new state. Eliminates the repeated
 * `(field, value) => onChange({ ...data, [field]: value })` pattern
 * across all section components.
 *
 * @param data - Current form data
 * @param onChange - Parent state setter
 * @returns Updater function accepting a field key and new value
 *
 * @example
 * ```tsx
 * const updateField = createFieldUpdater(data, onChange);
 * <input onChange={(e) => updateField("remarks", e.target.value)} />
 * ```
 */
export function createFieldUpdater<T extends object>(
  data: T,
  onChange: (data: T) => void
): (field: keyof T, value: unknown) => void {
  return (field, value) => onChange({ ...data, [field]: value } as T);
}

/**
 * Convert a snake_case or camelCase field name to a human-readable label.
 *
 * Used for displaying validation error messages with friendly field names.
 *
 * @param field - Raw field name (e.g. "last_name", "seafarerProfileId")
 * @returns Human-friendly label (e.g. "Last Name", "Seafarer Profile Id")
 *
 * @example
 * ```ts
 * humanizeField("last_name")         // "Last Name"
 * humanizeField("seafarerProfileId") // "Seafarer Profile Id"
 * ```
 */
export function humanizeField(field: string): string {
  return field
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Coerce null/undefined values in a raw API response to appropriate defaults.
 *
 * Handles the common pattern where the backend returns null for empty fields
 * but React controlled inputs require empty strings. Special field types
 * (booleans, objects, arrays) are preserved with their proper empty values.
 *
 * @param record - Raw record from API response (may contain nulls)
 * @param fieldDefaults - Map of field names to their default empty values
 * @returns Record with nulls replaced by appropriate defaults
 *
 * @example
 * ```ts
 * const coerced = coerceNulls(rawRecord, {
 *   medical_history: {},
 *   consulted_doctor: false,
 *   visual_aids: [],
 * });
 * ```
 */
export function coerceNulls(
  record: Record<string, unknown>,
  fieldDefaults: Record<string, unknown> = {}
): Record<string, unknown> {
  const coerced: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(record)) {
    if (value === null || value === undefined) {
      coerced[key] = fieldDefaults[key] ?? "";
    } else {
      coerced[key] = value;
    }
  }

  return coerced;
}
