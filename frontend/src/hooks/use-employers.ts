"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

/**
 * Loads the list of employer names from the backend.
 *
 * Employers are sourced from the database (`/api/employers`), which is the
 * single source of truth, so the selection field stays in sync with the master
 * list. The list is empty until the request resolves; the backend caches the
 * response, so this is cheap to use in any form that shows an employer field.
 *
 * @returns the employer names to feed into a `FormAutocomplete`'s `suggestions`
 */
export function useEmployers(): string[] {
  const [employers, setEmployers] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const names = await api.Employer.listNames();
        if (!cancelled) {
          setEmployers(names);
        }
      } catch (error) {
        console.error("Failed to load employers from server:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return employers;
}
