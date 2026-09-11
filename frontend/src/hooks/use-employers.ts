"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { EMPLOYERS } from "@/lib/suggestions";

/**
 * Loads the list of employer names from the backend.
 *
 * Employers are sourced from the database (`/api/employers`) so the selection
 * field stays in sync with the master list. The static {@link EMPLOYERS} array
 * is used only as an offline fallback while the request is in-flight or if it
 * fails, so the field always has usable suggestions.
 *
 * The list is fetched once per mount and cached on the backend, so this is
 * cheap to use in any form that shows an employer field.
 *
 * @returns the employer names to feed into a `FormAutocomplete`'s `suggestions`
 */
export function useEmployers(): string[] {
  const [employers, setEmployers] = useState<string[]>(EMPLOYERS);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const names = await api.Employer.listNames();
        if (!cancelled && names.length > 0) {
          setEmployers(names);
        }
      } catch (error) {
        // Keep the static fallback list on failure.
        console.error("Failed to load employers from server:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return employers;
}
