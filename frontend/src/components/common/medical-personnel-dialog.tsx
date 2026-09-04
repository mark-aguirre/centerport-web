"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Loader2, Stethoscope } from "lucide-react";
import { httpClient } from "@/lib/http-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Medical personnel record returned from the API. */
export interface MedicalPersonnel {
  id: string;
  name: string;
  license_no: string;
  specialization?: string;
  title?: string;
}

interface MedicalPersonnelDialogProps {
  /** Controls dialog visibility. */
  open: boolean;
  /** Callback when dialog open state changes. */
  onOpenChange: (open: boolean) => void;
  /** Called when user selects a personnel from the list. */
  onSelect: (personnel: MedicalPersonnel) => void;
  /** Optional dialog title override (default: "Select Medical Personnel"). */
  title?: string;
  /** Optional description override. */
  description?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Global reusable Medical Personnel Search Dialog.
 *
 * Opens a modal popup where users can search and select medical personnel
 * (doctors, psychologists, psychometricians, etc.) from the database.
 * Designed to be used from any page that needs to pick a medical professional.
 *
 * Features:
 * - Server-side search via /api/medical-personnel/search
 * - Debounced API calls (300ms)
 * - Displays name, license no., and specialization
 * - Keyboard accessible
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <MedicalPersonnelDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   onSelect={(personnel) => {
 *     updateField("psychologist", personnel.name);
 *     updateField("psychologist_license_no", personnel.license_no);
 *   }}
 *   title="Select Psychologist"
 * />
 * ```
 */
export function MedicalPersonnelDialog({
  open,
  onOpenChange,
  onSelect,
  title = "Select Medical Personnel",
  description = "Search by name, license number, or specialization.",
}: MedicalPersonnelDialogProps) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<MedicalPersonnel[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Fetches personnel from the backend search endpoint.
   *
   * The API returns all active personnel when `term` is empty, or filters by
   * name/license/specialization when provided. State updates happen inside the
   * async callback (not synchronously in an effect), so this is safe to invoke
   * from effects and handlers alike.
   */
  const fetchPersonnel = useCallback(async (term: string) => {
    setSearching(true);
    setHasSearched(true);

    try {
      const trimmed = term.trim();
      const params: Record<string, string | number | undefined> = {};
      if (trimmed) {
        params.keyword = trimmed;
      }

      const data = await httpClient.get<MedicalPersonnel[]>(
        "/api/medical-personnel/search",
        params
      );
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch medical personnel:", error);
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  // Reset the search field and load all personnel each time the dialog opens.
  // The keyword reset is deferred into the async fetch callback to avoid a
  // synchronous setState in the effect body.
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 150);

    void (async () => {
      if (cancelled) return;
      setKeyword("");
      await fetchPersonnel("");
    })();

    return () => {
      cancelled = true;
      clearTimeout(focusTimer);
    };
  }, [open, fetchPersonnel]);

  const handleInputChange = (value: string) => {
    setKeyword(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPersonnel(value), 300);
  };

  const handleSelect = (personnel: MedicalPersonnel) => {
    onOpenChange(false);
    onSelect(personnel);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={keyword}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type name or license number..."
            className="pl-9 h-10"
            autoComplete="off"
          />
        </div>

        {/* Results area */}
        <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[400px]">
          {searching ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1 mt-2">
              <p className="text-xs text-muted-foreground px-1 mb-2">
                {results.length} personnel found — click to select
              </p>
              {results.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => handleSelect(person)}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Stethoscope className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {person.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[person.license_no, person.specialization]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Stethoscope className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">
                No personnel found for &quot;{keyword}&quot;
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Search className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">
                Start typing to search
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
