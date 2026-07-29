"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, UserPlus, Loader2, User } from "lucide-react";
import { api, type SeafarerProfile } from "@/lib/api";

interface PatientSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when user selects an existing patient from search results. */
  onSelectPatient: (profile: SeafarerProfile) => void;
  /** Called when user clicks "Register New Patient". */
  onRegisterNew: () => void;
}

/**
 * Search-first dialog for the Visit workflow.
 *
 * Flow:
 * 1. User types a name → results appear
 * 2. If patient found → click to select → opens registration form (view mode)
 * 3. If not found → click "Register New Patient" → opens registration form (edit mode)
 */
export function PatientSearchDialog({
  open,
  onOpenChange,
  onSelectPatient,
  onRegisterNew,
}: PatientSearchDialogProps) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<SeafarerProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setKeyword("");
      setResults([]);
      setHasSearched(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const doSearch = useCallback(async (term: string) => {
    if (term.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setSearching(true);
    setHasSearched(true);
    try {
      const found = await api.entities.SeafarerProfile.search(term, 20);
      setResults(found);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setKeyword(value);
    // Debounce search
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  const handleSelect = (profile: SeafarerProfile) => {
    onOpenChange(false);
    onSelectPatient(profile);
  };

  const handleRegisterNew = () => {
    onOpenChange(false);
    onRegisterNew();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Patient Visit</DialogTitle>
          <DialogDescription>
            Search for an existing patient or register a new one.
          </DialogDescription>
        </DialogHeader>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={keyword}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type patient name to search..."
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
                {results.length} result{results.length !== 1 ? "s" : ""} found — click to select
              </p>
              {results.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => handleSelect(profile)}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {profile.last_name}, {profile.first_name} {profile.middle_name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[profile.profile_id, profile.position, profile.employer]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : hasSearched && keyword.trim().length >= 2 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <User className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">
                No patient found for &quot;{keyword}&quot;
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                You can register this patient as new.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Search className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">
                Start typing a name to search
              </p>
            </div>
          )}
        </div>

        {/* Register New button — always visible */}
        <div className="pt-3 border-t">
          <Button
            className="w-full"
            variant="outline"
            onClick={handleRegisterNew}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Register New Patient
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
