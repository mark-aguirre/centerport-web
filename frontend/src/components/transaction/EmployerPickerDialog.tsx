"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, Check, Loader2, Search, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PosDialogMark } from "@/components/transaction/pos/PosDialogMark";
import { posArt } from "@/components/transaction/pos/pos-theme";
import { api } from "@/lib/api";
import type { ReceivableAccount } from "@/components/receivable/types";
import { ApiError } from "@/lib/http-client";
import { cn } from "@/lib/utils";

interface EmployerPickerDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Fired when the dialog requests to open or close. */
  onOpenChange: (open: boolean) => void;
  /**
   * The currently selected employer name, highlighted in the list so the user
   * can see the active choice when they reopen the picker.
   */
  selected?: string;
  /** Fired with the chosen employer's name when a row is picked. */
  onSelect: (name: string) => void;
}

/**
 * Browse-and-pick list of employers / manning-agencies from the master list.
 *
 * Opened from the Employer / Agency field on the Add Out-Patient dialog, so the
 * cashier can see every employer and just pick one rather than remembering and
 * typing the exact name. Loads the full list once per open, then filters
 * client-side as the user types — the list is small and already alphabetised by
 * the backend, so a local filter is instant and avoids a round-trip per
 * keystroke.
 *
 * Reuses the Receivable Report's account lookup (`/api/receivables/accounts`),
 * which already returns the employer master list and is permitted for the same
 * roles that use the POS workspace (ADMIN, ACCOUNTING). This avoids widening the
 * employer endpoint's access just to populate this list.
 *
 * Styled as the POS dialog bands (mint header with the clipboard mark, white
 * list body) so it reads as a sibling of the Add Out-Patient dialog it opens
 * from. A role without access gets an empty list and a clear empty-state message
 * rather than an error.
 */
export function EmployerPickerDialog({
  open,
  onOpenChange,
  selected,
  onSelect,
}: EmployerPickerDialogProps) {
  const [employers, setEmployers] = useState<ReceivableAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [query, setQuery] = useState("");

  // Load the full list each time the dialog opens, so a freshly added employer
  // shows without a page reload. All state updates happen inside the deferred
  // callback (not synchronously in the effect body) to satisfy the
  // react-hooks/set-state-in-effect rule, matching the SearchSelect pattern.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const handle = window.setTimeout(async () => {
      if (cancelled) return;
      setQuery("");
      setRestricted(false);
      setLoading(true);
      try {
        const records = await api.Receivables.listAccounts();
        if (!cancelled) {
          setEmployers(
            [...records].sort((a, b) => a.name.localeCompare(b.name))
          );
        }
      } catch (error) {
        if (!cancelled) {
          setEmployers([]);
          // 403 means the signed-in role can't read the account list. Surface a
          // calm empty state instead of an error — the field still works
          // free-text.
          if (error instanceof ApiError && error.status === 403) {
            setRestricted(true);
          } else {
            console.error("Failed to load employers:", error);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return employers;
    return employers.filter((e) => e.name.toLowerCase().includes(keyword));
  }, [employers, query]);

  const handlePick = useCallback(
    (name: string) => {
      onSelect(name);
      onOpenChange(false);
    },
    [onSelect, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col gap-0 overflow-hidden rounded-xl border-[#0f4435]/12 p-0">
        {/* Header band — mint wash, clipboard mark, matching the POS dialogs. */}
        <DialogHeader className="relative overflow-hidden border-b border-[#0f4435]/8 bg-[#f1f8f4] px-7 py-6 pr-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-cover bg-right bg-no-repeat opacity-70"
            style={{ backgroundImage: posArt("leafWash") }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f1f8f4] via-[#f1f8f4]/85 to-transparent"
          />

          <div className="relative flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#118a57]/15 text-[#0f7a4d]">
              <Building2 className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-2xl text-[#0f4435]">
                Select Employer / Agency
              </DialogTitle>
              <DialogDescription className="mt-1 max-w-md text-sm leading-relaxed text-[#0f4435]/70">
                Pick an employer from the master list, or search by name.
              </DialogDescription>
            </div>
          </div>

          <PosDialogMark />
        </DialogHeader>

        {/* Search bar. */}
        <div className="border-b border-[#0f4435]/8 bg-white px-7 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0f4435]/35" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search employers"
              aria-label="Search employers"
              autoFocus
              className="h-12 w-full rounded-lg border border-[#0f4435]/15 bg-[#fafcfb] pl-11 pr-10 text-sm text-[#0f4435] transition-colors hover:border-[#118a57]/40 focus-visible:border-[#118a57] focus-visible:ring-2 focus-visible:ring-[#118a57]/20"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-[#0f4435]/40 transition-colors hover:bg-[#0f4435]/5 hover:text-[#0f4435]/70"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Result list. */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-white px-3 py-3">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#0f4435]/60">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading employers...
            </div>
          ) : restricted ? (
            <EmptyState
              title="Employer list unavailable"
              detail="Your role can't view the employer list. You can still type the employer name directly in the field."
            />
          ) : employers.length === 0 ? (
            <EmptyState
              title="No employers found"
              detail="There are no employers in the master list yet."
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No matches"
              detail={`No employer matches "${query.trim()}".`}
            />
          ) : (
            <ul role="listbox" className="space-y-1">
              {filtered.map((employer) => {
                const isSelected = selected === employer.name;
                return (
                  <li key={employer.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handlePick(employer.name)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors cursor-pointer",
                        isSelected
                          ? "border-[#118a57]/40 bg-[#118a57]/10"
                          : "border-transparent hover:border-[#118a57]/25 hover:bg-[#f1f8f4]"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          isSelected
                            ? "bg-[#118a57]/20 text-[#0f7a4d]"
                            : "bg-[#0f4435]/5 text-[#0f4435]/50"
                        )}
                      >
                        <Building2 className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#0f4435]">
                        {employer.name}
                      </span>
                      {isSelected && (
                        <Check className="h-5 w-5 shrink-0 text-[#0f7a4d]" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Centred empty / error message for the list body. */
function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-6 py-16 text-center">
      <Building2 className="mb-1 h-8 w-8 text-[#0f4435]/20" />
      <p className="text-sm font-semibold text-[#0f4435]/70">{title}</p>
      <p className="max-w-sm text-xs text-[#0f4435]/50">{detail}</p>
    </div>
  );
}
