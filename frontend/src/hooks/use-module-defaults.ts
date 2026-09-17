"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type {
  ModuleDefaults,
  ModuleDefaultEntry,
  PersonnelModuleCode,
  PersonnelRoleCode,
} from "@/lib/api";

/**
 * Fetches the active default signatories configured for a module in the Super
 * Admin page and exposes them for report forms to pre-fill on new records.
 *
 * <p>Report forms call {@link mapEntriesToFields} with a role→field mapping to
 * turn the resolved defaults into the flat field names their form model uses.
 * Because assignments are resolved server-side and only include <b>active</b>
 * personnel, updating an assignment in the Super Admin page is immediately
 * reflected the next time a form loads its defaults — no code change needed.
 *
 * <p>The hook is resilient: a failed fetch (e.g. no assignments configured yet)
 * simply yields empty defaults, so the form still works and the section can
 * surface a "no active assignment" message.
 *
 * @param module the module whose defaults to resolve
 * @returns a ref holding the latest resolved entries and a loaded flag
 */
export function useModuleDefaults(module: PersonnelModuleCode) {
  // A ref (not just state) so the synchronous getNewRecordDefaults() callback in
  // useEntityForm can read the freshest value at click time.
  const entriesRef = useRef<ModuleDefaultEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [entries, setEntries] = useState<ModuleDefaultEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const defaults: ModuleDefaults =
          await api.PersonnelAssignment.defaults(module);
        if (cancelled) return;
        entriesRef.current = defaults.entries ?? [];
        setEntries(defaults.entries ?? []);
      } catch {
        if (cancelled) return;
        entriesRef.current = [];
        setEntries([]);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [module]);

  return { entriesRef, entries, loaded };
}

/**
 * Maps resolved module-default entries onto a form's flat field names.
 *
 * @param entries resolved defaults from {@link useModuleDefaults}
 * @param mapping per-role field mapping — for each role, which form fields
 *   should receive the person's name / license
 * @returns a partial object of field values (empty when nothing is assigned)
 *
 * @example
 * ```ts
 * mapEntriesToFields(entries, {
 *   AUTHORIZED_PHYSICIAN: { name: "authorized_physician", licenseNo: "medical_certification_no" },
 *   MEDICAL_DIRECTOR: { name: "medical_director" },
 * });
 * ```
 */
export function mapEntriesToFields<T>(
  entries: ModuleDefaultEntry[],
  mapping: Partial<
    Record<PersonnelRoleCode, { name?: keyof T; licenseNo?: keyof T }>
  >
): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const entry of entries) {
    const fieldMap = mapping[entry.role];
    if (!fieldMap) continue;
    if (fieldMap.name) {
      result[fieldMap.name as string] = entry.personnel_name;
    }
    if (fieldMap.licenseNo) {
      result[fieldMap.licenseNo as string] = entry.personnel_license_no;
    }
  }
  return result as Partial<T>;
}
