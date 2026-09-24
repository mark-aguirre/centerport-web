"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/http-client";

/**
 * Loads the list of employer names from the backend.
 *
 * Employers are sourced from the database (`/api/employers`), which is the
 * single source of truth, so the selection field stays in sync with the master
 * list. The list is empty until the request resolves; the backend caches the
 * response, so this is cheap to use in any form that shows an employer field.
 *
 * The employer endpoint is restricted to ADMIN, INFORMATION and RELEASING. For
 * a role without access (e.g. ACCOUNTING opening the /sale out-patient dialog)
 * the request 403s; that is expected and yields an empty suggestion list, not
 * an error — the field is free-text and works fine without suggestions.
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
        // 403 is expected for roles without employer access (e.g. ACCOUNTING
        // using the /sale out-patient dialog). Employer suggestions are an
        // optional free-text autocomplete, so degrade silently to an empty
        // list rather than logging an error. Surface anything else.
        if (error instanceof ApiError && error.status === 403) {
          return;
        }
        console.error("Failed to load employers from server:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return employers;
}
