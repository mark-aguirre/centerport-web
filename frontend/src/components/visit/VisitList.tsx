"use client";

import { format } from "date-fns";
import { Loader2, Plus, RefreshCw, Users } from "lucide-react";
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
 */
export function VisitList({
  visits,
  loading,
  onRefresh,
  onNewPatient,
  onSelectVisit,
}: VisitListProps) {
  const today = format(new Date(), "MMMM d, yyyy");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Today&apos;s Visits
            </h2>
            <p className="text-xs text-muted-foreground">{today}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Count badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {visits.length} visit{visits.length !== 1 ? "s" : ""} today
        </span>
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
        <div className="rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
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
        </div>
      )}
    </div>
  );
}
