import { useState, useCallback, useRef } from "react";
import { api, type SeafarerProfile } from "@/lib/api";

export interface UseProfileSearchResult {
  /** Current search results from the backend. */
  searchResults: SeafarerProfile[];
  /** Whether a search request is in-flight. */
  searchLoading: boolean;
  /** Trigger a search by keyword (debounced at 300ms). */
  handleSearch: (keyword: string) => void;
  /** Clear search results (e.g. after selecting a result). */
  clearSearch: () => void;
}

/**
 * Reusable hook for searching seafarer profiles.
 *
 * Provides debounced search (300ms) against the backend profile search API.
 * Every page in the app uses this same search — it always searches seafarer
 * profiles by name or profile ID.
 *
 * Usage:
 * ```tsx
 * const { searchResults, searchLoading, handleSearch, clearSearch } = useProfileSearch();
 *
 * // Pass to FormToolbar:
 * <FormToolbar
 *   onSearch={handleSearch}
 *   searchResults={searchResults}
 *   searchLoading={searchLoading}
 *   onSelectResult={(result) => { clearSearch(); loadProfile(result); }}
 * />
 * ```
 */
export function useProfileSearch(): UseProfileSearchResult {
  const [searchResults, setSearchResults] = useState<SeafarerProfile[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((keyword: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!keyword.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const results = await api.entities.SeafarerProfile.search(keyword, 10);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchLoading(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  return {
    searchResults,
    searchLoading,
    handleSearch,
    clearSearch,
  };
}
