"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { differenceInYears, isValid, parseISO } from "date-fns";
import {
  CalendarPlus,
  ChevronRight,
  FileText,
  Loader2,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { CompactPager } from "@/components/common/compact-pager";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { api, type Paged, type SeafarerProfile } from "@/lib/api";
import { cn } from "@/lib/utils";

/** Rows per page — matches the visit list so both footers stay in step. */
const PAGE_SIZE = 10;

/** Delay before a keystroke turns into a request. */
const SEARCH_DEBOUNCE_MS = 300;

interface PatientListPanelProps {
  /** Row action: open the record ready to capture a new visit. */
  onAddVisit: (profile: SeafarerProfile) => void;
  /** Row action: open the record read-only, without starting a visit. */
  onViewDetails: (profile: SeafarerProfile) => void;
  /** Called by the header's add button; opens the registration form directly. */
  onRegisterNew: () => void;
}

/**
 * Initials for the row avatar, e.g. "Joshua Santos" renders "JS".
 *
 * Falls back to a single initial when only one name is on file, and to an
 * em dash when neither is — some migrated legacy rows have blank names.
 */
function initialsOf(profile: SeafarerProfile): string {
  const first = profile.first_name?.trim().charAt(0) ?? "";
  const last = profile.last_name?.trim().charAt(0) ?? "";
  const initials = `${first}${last}`.toUpperCase();
  return initials || "—";
}

/**
 * The "Male · 24 years old" line under a patient's name.
 *
 * Age is derived from `birthdate` rather than read from the stored `age`
 * column: `age` is a free-text field captured at registration, so it is
 * already stale for anyone who has had a birthday since. The stored value is
 * the fallback for profiles with a missing or unparseable birthdate, which the
 * legacy data has plenty of.
 */
function describe(profile: SeafarerProfile): string {
  const parts: string[] = [];
  if (profile.gender?.trim()) parts.push(profile.gender.trim());

  const birthdate = profile.birthdate?.trim();
  const parsed = birthdate ? parseISO(birthdate) : null;
  if (parsed && isValid(parsed)) {
    const years = differenceInYears(new Date(), parsed);
    if (years >= 0 && years < 130) parts.push(`${years} years old`);
  } else if (profile.age?.trim()) {
    parts.push(`${profile.age.trim()} years old`);
  }

  return parts.join(" \u00B7 ");
}

/**
 * Patient directory panel for the visit page.
 *
 * Browses every profile on file a page at a time, with the backend's
 * case-insensitive keyword search (last name, first name, or profile ID)
 * narrowing the same list.
 *
 * Clicking a row offers the two things a clerk does with a patient already on
 * file: "Add Visit" opens the record ready to capture today's purpose and
 * SIRB, "View Details" opens it read-only and writes nothing. The add button
 * in the header opens the same dialog empty, as "New Patient Registration".
 *
 * Paging is server-side because the directory runs to hundreds of rows: the
 * panel asks for one {@link PAGE_SIZE}-row page and keeps the envelope so the
 * footer can state the real total rather than the size of what it happens to
 * hold.
 *
 * Fetching is kicked off from a zero-delay timer inside the effect rather than
 * called directly, which keeps the first `setLoading` out of the effect body —
 * `react-hooks/set-state-in-effect` rejects the direct form. Same pattern as
 * `useVisit`'s list load.
 */
export function PatientListPanel({
  onAddVisit,
  onViewDetails,
  onRegisterNew,
}: PatientListPanelProps) {
  const [keyword, setKeyword] = useState("");
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<Paged<SeafarerProfile> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (pageIndex: number, search: string) => {
    setLoading(true);
    try {
      setResult(
        await api.entities.SeafarerProfile.page({
          page: pageIndex,
          size: PAGE_SIZE,
          search,
        })
      );
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load(page, term);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load, page, term]);

  // Debounce in the change handler, not an effect, so a keystroke never
  // queues a render-triggered state update.
  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setTerm(value);
      setPage(0);
    }, SEARCH_DEBOUNCE_MS);
  };

  const clearKeyword = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setKeyword("");
    setTerm("");
    setPage(0);
  };

  const handleRowAction = (
    profile: SeafarerProfile,
    action: (profile: SeafarerProfile) => void
  ) => {
    setSelectedId(profile.id ?? null);
    action(profile);
  };

  const patients = result?.content ?? [];
  const total = result?.total_elements ?? 0;
  const firstRow = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const lastRow = Math.min(total, page * PAGE_SIZE + patients.length);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm">
      {/* Panel header — same banded SectionHeader the form cards use, so the
          visit page reads as part of the same app as the medical forms. The
          `px-3 pt-3` wrapper plus `bannerInset="p-3"` is the pairing from
          `personal-info-section.tsx`: the inset's negative margins bleed the
          band back out to the card edge. */}
      <div className="px-3 pt-3">
        <SectionHeader
          title="Patients"
          icon={Users}
          banner
          bannerInset="p-3"
          action={
            /* Shortcut straight to the registration form, skipping the search
               dialog. The search step exists to stop duplicate profiles, so
               this is not a replacement for it — the save path still looks the
               person up by last name + first name + birthdate and updates the
               existing profile rather than creating a second one.

               Labelled rather than icon-only: the icon alone needed a tooltip
               to say what it did, which is a hover the primary way into
               registering a patient should not depend on. The text is its own
               accessible name, so the tooltip is gone. */
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRegisterNew}
              className="cursor-pointer"
            >
              <UserPlus aria-hidden="true" />
              New Patient
            </Button>
          }
        />
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(event) => handleKeywordChange(event.target.value)}
            placeholder="Search patient name, ID, or passport..."
            className="h-9 pr-9 pl-9 text-xs"
            autoComplete="off"
            aria-label="Search patients"
          />
          {keyword ? (
            <button
              type="button"
              onClick={clearKeyword}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Rows */}
      <div className="min-h-0 flex-1 overflow-y-auto border-t border-border">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-3 py-16 text-center">
            <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              {term ? "No patient matches that search." : "No patients on file yet."}
            </p>
          </div>
        ) : (
          <ul>
            {patients.map((profile) => {
              const selected = Boolean(profile.id) && profile.id === selectedId;
              return (
                <li key={profile.id ?? profile.profile_id}>
                  {/* The whole row is the menu trigger rather than carrying a
                      separate kebab: a row click is ambiguous on its own now
                      that it leads to two different places, and the menu is
                      how the user picks. Keyboard users get it from Enter on
                      the focused row for free. */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          aria-current={selected ? "true" : undefined}
                          className={cn(
                            "flex w-full items-center gap-3 border-b border-border/60 px-3 py-2.5 text-left transition-colors",
                            selected
                              ? "bg-primary/10"
                              : "hover:bg-primary/5 aria-expanded:bg-primary/5"
                          )}
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {initialsOf(profile)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-semibold text-foreground uppercase">
                              {[profile.last_name, profile.first_name]
                                .filter(Boolean)
                                .join(", ") || "—"}
                            </span>
                            <span className="block truncate text-[11px] text-muted-foreground">
                              {profile.profile_id || "—"}
                            </span>
                            <span className="block truncate text-[11px] text-muted-foreground">
                              {describe(profile) || "\u00A0"}
                            </span>
                          </span>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 shrink-0",
                              selected
                                ? "text-primary"
                                : "text-muted-foreground/60"
                            )}
                          />
                        </button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleRowAction(profile, onAddVisit)}
                      >
                        <CalendarPlus aria-hidden="true" />
                        <span>Add Visit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleRowAction(profile, onViewDetails)}
                      >
                        <FileText aria-hidden="true" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2.5">
        <span className="text-xs text-muted-foreground">
          {total === 0
            ? "No patients"
            : `Showing ${firstRow}\u2013${lastRow} of ${total} patients`}
        </span>
        <CompactPager
          page={page}
          totalPages={result?.total_pages ?? 0}
          onPageChange={setPage}
          disabled={loading}
        />
      </div>
    </div>
  );
}
