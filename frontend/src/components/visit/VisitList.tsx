"use client";

import { format } from "date-fns";
import { CalendarCheck, Loader2, Plus, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PatientVisitRecord } from "@/lib/api";

interface VisitListProps {
  visits: PatientVisitRecord[];
  loading: boolean;
  onRefresh: () => void;
  onNewPatient: () => void;
  onSelectVisit: (visit: PatientVisitRecord) => void;
}

/**
 * Table listing today's patient visit records.
 *
 * Shows visit ID, profile ID, patient name, gender, employer, position,
 * purpose of visit, and registration time. Clicking a row opens the
 * patient record dialog.
 *
 * Presented as one card: the header and the row count sit inside the same
 * border as the table, so the list reads as a single panel under the page
 * banner. The date is deliberately absent here — the banner above already
 * states it, and repeating it twice in the first 100px of the page was noise.
 */
export function VisitList({
  visits,
  loading,
  onRefresh,
  onNewPatient,
  onSelectVisit,
}: VisitListProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <CalendarCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-foreground">
              Today&apos;s Visits
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              Scheduled and walk-in visits for today.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={onNewPatient}>
            <Plus className="h-4 w-4 mr-1.5" />
            New Patient
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : visits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">
            No visits recorded today yet.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Click &quot;New Patient&quot; to register a visit.
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[50px] text-xs">#</TableHead>
                <TableHead className="text-xs">Visit ID</TableHead>
                <TableHead className="text-xs">Profile ID</TableHead>
                <TableHead className="text-xs">Last Name</TableHead>
                <TableHead className="text-xs">First Name</TableHead>
                <TableHead className="text-xs">Gender</TableHead>
                <TableHead className="text-xs">Employer</TableHead>
                <TableHead className="text-xs">Purpose</TableHead>
                <TableHead className="text-xs">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.map((visit, idx) => (
                <TableRow
                  key={visit.id ?? idx}
                  className="cursor-pointer hover:bg-primary/5 transition-colors"
                  onClick={() => onSelectVisit(visit)}
                >
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-primary">
                    {visit.visit_id ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {visit.profile_id ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {visit.last_name || "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {visit.first_name || "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {visit.gender || "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {visit.employer || "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {visit.purpose_of_visit || "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {visit.created_date
                      ? format(new Date(visit.created_date), "hh:mm a")
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Row count — the mock's footer strip, fed by the list already in hand. */}
          <div className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
            Showing {visits.length} visit{visits.length !== 1 ? "s" : ""} today
          </div>
        </>
      )}
    </div>
  );
}
