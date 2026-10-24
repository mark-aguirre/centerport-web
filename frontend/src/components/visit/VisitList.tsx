"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  CalendarCheck,
  FileText,
  Loader2,
  MoreVertical,
  RefreshCw,
  Search,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PatientVisitRecord } from "@/lib/api";

/** Rows per page — matches the patients panel so both footers stay in step. */
const PAGE_SIZE = 10;

interface VisitListProps {
  visits: PatientVisitRecord[];
  loading: boolean;
  onRefresh: () => void;
  onSelectVisit: (visit: PatientVisitRecord) => void;
}

/** "SANTOS, JOSHUA" from the joined profile name fields. */
function patientName(visit: PatientVisitRecord): string {
  const name = [visit.last_name, visit.first_name].filter(Boolean).join(", ");
  return name || "—";
}

/**
 * Fields a visit row is searchable by.
 *
 * Joined into one haystack so a single term can match an ID, a name, an
 * employer, or a purpose without the user choosing a field first.
 */
function haystack(visit: PatientVisitRecord): string {
  return [
    visit.visit_id,
    visit.profile_id,
    visit.last_name,
    visit.first_name,
    visit.employer,
    visit.purpose_of_visit,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/**
 * Table listing today's patient visit records.
 *
 * Presented as one card: header, filter, table, and footer share a border, so
 * the list reads as a single panel beside the patients directory. The date is
 * deliberately absent from the header — the page banner above already states
 * it, and repeating it twice in the first 100px was noise.
 *
 * Filtering and paging are both client-side, over the day's visits the page
 * has already fetched in full. A day's roster is tens of rows, so a round trip
 * per keystroke or page would cost more than it saves — unlike the patients
 * directory next to it, which pages on the server because it spans the whole
 * patient history.
 *
 * Clicking a row, or "Open record" in the row menu, opens the patient record
 * dialog.
 */
export function VisitList({
  visits,
  loading,
  onRefresh,
  onSelectVisit,
}: VisitListProps) {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    if (!term) return visits;
    return visits.filter((visit) => haystack(visit).includes(term));
  }, [visits, keyword]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  // Clamp rather than reset in an effect: the row count changes as the user
  // types or refreshes, and a stale page index would otherwise render blank.
  const currentPage = Math.min(page, Math.max(0, totalPages - 1));
  const pageRows = filtered.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE
  );

  const firstRow = filtered.length === 0 ? 0 : currentPage * PAGE_SIZE + 1;
  const lastRow = currentPage * PAGE_SIZE + pageRows.length;

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(0);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm">
      {/* Card header — same banded SectionHeader the form cards use. The
          `px-3 pt-3` wrapper plus `bannerInset="p-3"` is the pairing from
          `personal-info-section.tsx`: the inset's negative margins bleed the
          band back out to the card edge. */}
      <div className="px-3 pt-3">
        <SectionHeader
          title="Today's Visits"
          icon={CalendarCheck}
          subtitle="Scheduled and walk-in visits for today"
          banner
          bannerInset="p-3"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw
                aria-hidden="true"
                className={loading ? "animate-spin" : undefined}
              />
              Refresh
            </Button>
          }
        />
      </div>

      {/* Filter */}
      <div className="flex justify-end px-3 pb-3">
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(event) => handleKeywordChange(event.target.value)}
            placeholder="Search visit ID, name, or purpose..."
            className="h-9 pr-9 pl-9 text-xs"
            autoComplete="off"
            aria-label="Search today's visits"
          />
          {keyword ? (
            <button
              type="button"
              onClick={() => handleKeywordChange("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-auto border-t border-border">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : visits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No visits recorded today yet.
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Pick a patient from the directory, or use the add button there to
              register a new one.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No visit matches &quot;{keyword}&quot;.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[50px] text-xs">#</TableHead>
                <TableHead className="text-xs">Visit ID</TableHead>
                <TableHead className="text-xs">Patient ID</TableHead>
                <TableHead className="text-xs">Patient Name</TableHead>
                <TableHead className="text-xs">Gender</TableHead>
                <TableHead className="text-xs">Employer</TableHead>
                <TableHead className="text-xs">Purpose</TableHead>
                <TableHead className="text-xs">Time</TableHead>
                <TableHead className="w-[70px] text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((visit, idx) => (
                <TableRow
                  key={visit.id ?? idx}
                  className="cursor-pointer transition-colors hover:bg-primary/5"
                  onClick={() => onSelectVisit(visit)}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {currentPage * PAGE_SIZE + idx + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-primary">
                    {visit.visit_id ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {visit.profile_id ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs font-medium uppercase">
                    {patientName(visit)}
                  </TableCell>
                  <TableCell className="text-xs">{visit.gender || "—"}</TableCell>
                  <TableCell className="text-xs uppercase">
                    {visit.employer || "—"}
                  </TableCell>
                  <TableCell className="max-w-[140px] truncate text-xs text-muted-foreground">
                    {visit.purpose_of_visit || "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {visit.created_date
                      ? format(new Date(visit.created_date), "hh:mm a")
                      : "—"}
                  </TableCell>
                  {/* The menu lives inside a clickable row, so every handler
                      here stops propagation — otherwise opening the menu would
                      also open the record dialog behind it. */}
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label={`Actions for visit ${visit.visit_id ?? idx + 1}`}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => onSelectVisit(visit)}
                        >
                          <FileText className="h-4 w-4" />
                          <span>Open record</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2.5">
        <span className="text-xs text-muted-foreground">
          {filtered.length === 0
            ? "No visits"
            : `Showing ${firstRow}\u2013${lastRow} of ${filtered.length} visit${
                filtered.length !== 1 ? "s" : ""
              }`}
        </span>
        <CompactPager
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          disabled={loading}
        />
      </div>
    </div>
  );
}
