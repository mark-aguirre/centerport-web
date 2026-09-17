"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, History } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/common/section-header";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import type {
  MedicalPersonnelRecord,
  PersonnelAssignmentRecord,
  PersonnelAssignmentAuditRecord,
  PersonnelModuleCode,
  PersonnelRoleCode,
} from "@/lib/api";
import {
  ALL_MODULES,
  MODULE_ROLES,
  moduleLabel,
  roleLabel,
} from "@/lib/personnel";

/** Key for a single (module, role) matrix cell. */
function cellKey(module: PersonnelModuleCode, role: PersonnelRoleCode): string {
  return `${module}:${role}`;
}

interface AssignmentMatrixProps {
  /** All personnel (active + inactive) — used to populate the per-role pickers. */
  personnel: MedicalPersonnelRecord[];
  /** Bumped by the parent when personnel change so pickers refresh. */
  personnelVersion: number;
}

/**
 * Module × role assignment matrix.
 *
 * Renders one row per module/role combination from the assignment matrix and
 * lets the Super Admin choose the active personnel that should serve as the
 * default signatory. Each picker is constrained to active personnel holding the
 * cell's role, satisfying "each module can only select personnel assigned to
 * its allowed roles." Saving upserts the assignment; a per-module audit trail is
 * available on demand.
 */
export function AssignmentMatrix({
  personnel,
  personnelVersion,
}: AssignmentMatrixProps) {
  const [assignments, setAssignments] = useState<PersonnelAssignmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingCell, setSavingCell] = useState<string | null>(null);

  const [auditModule, setAuditModule] = useState<PersonnelModuleCode | null>(null);
  const [audit, setAudit] = useState<PersonnelAssignmentAuditRecord[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // Loads assignments and updates state. State updates happen inside this async
  // function (not synchronously in the effect body) to avoid cascading renders.
  const loadAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.PersonnelAssignment.list();
      setAssignments(data);
    } catch {
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const data = await api.PersonnelAssignment.list();
        if (!cancelled) setAssignments(data);
      } catch {
        if (!cancelled) toast.error("Failed to load assignments");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Active personnel grouped by role, for the per-cell pickers.
  const personnelByRole = useMemo(() => {
    const map = new Map<PersonnelRoleCode, MedicalPersonnelRecord[]>();
    for (const p of personnel) {
      if (!p.role || p.active === false) continue;
      const list = map.get(p.role) ?? [];
      list.push(p);
      map.set(p.role, list);
    }
    return map;
    // personnelVersion forces recompute when the parent reloads personnel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personnel, personnelVersion]);

  // Fast lookup of the current assignment for a cell.
  const assignmentByCell = useMemo(() => {
    const map = new Map<string, PersonnelAssignmentRecord>();
    for (const a of assignments) {
      map.set(cellKey(a.module, a.role), a);
    }
    return map;
  }, [assignments]);

  const handleAssign = async (
    module: PersonnelModuleCode,
    role: PersonnelRoleCode,
    personnelId: string
  ) => {
    const key = cellKey(module, role);
    setSavingCell(key);
    try {
      await api.PersonnelAssignment.assign({
        module,
        role,
        personnel_id: personnelId,
      });
      toast.success(`${moduleLabel(module)} · ${roleLabel(role)} updated`);
      await loadAssignments();
      if (auditModule === module) {
        void loadAudit(module);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save assignment");
      }
    } finally {
      setSavingCell(null);
    }
  };

  const loadAudit = useCallback(async (module: PersonnelModuleCode) => {
    setAuditLoading(true);
    try {
      const page = await api.PersonnelAssignment.audit(module);
      setAudit(page.content);
    } catch {
      toast.error("Failed to load assignment history");
      setAudit([]);
    } finally {
      setAuditLoading(false);
    }
  }, []);

  const toggleAudit = (module: PersonnelModuleCode) => {
    if (auditModule === module) {
      setAuditModule(null);
      setAudit([]);
      return;
    }
    setAuditModule(module);
    void loadAudit(module);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="Module Assignments"
        icon={History}
        subtitle="Default signatories loaded automatically into each module's reports and certificates."
      />

      <div className="space-y-5">
        {ALL_MODULES.map((module) => (
          <div key={module} className="rounded-md border border-primary/10">
            <div className="flex items-center justify-between border-b border-primary/10 bg-muted/30 px-3 py-2">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest">
                {moduleLabel(module)}
              </h3>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => toggleAudit(module)}
                className="cursor-pointer gap-1"
              >
                <History className="w-3 h-3" />
                {auditModule === module ? "Hide history" : "History"}
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] font-bold text-primary/70 uppercase tracking-wider w-48">
                    Role
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-primary/70 uppercase tracking-wider">
                    Assigned Personnel
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-primary/70 uppercase tracking-wider w-40">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MODULE_ROLES[module].map((role) => {
                  const key = cellKey(module, role);
                  const current = assignmentByCell.get(key);
                  const candidates = personnelByRole.get(role) ?? [];
                  const isSaving = savingCell === key;

                  // Map the selected id to a readable label. Prefer the current
                  // assignment's own snapshot (always present, even if the person
                  // was later deactivated or had their role changed), then fall
                  // back to the active candidate list.
                  const labelFor = (id: string): string => {
                    if (current && current.personnel_id === id) {
                      const name = current.personnel_name ?? "";
                      const lic = current.personnel_license_no;
                      return lic ? `${name} — ${lic}` : name || id;
                    }
                    const match = candidates.find((p) => p.id === id);
                    if (match) {
                      return match.license_no
                        ? `${match.name} — ${match.license_no}`
                        : match.name;
                    }
                    return "";
                  };

                  // Ensure the currently-assigned person is always selectable,
                  // even if they're inactive / off-role and thus not a candidate.
                  const showCurrentFallback =
                    !!current &&
                    !candidates.some((p) => p.id === current.personnel_id);

                  return (
                    <TableRow key={key}>
                      <TableCell className="text-xs text-foreground/80 font-medium">
                        {roleLabel(role)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={current?.personnel_id ?? ""}
                            onValueChange={(v) => {
                              const id = v as string;
                              if (id) handleAssign(module, role, id);
                            }}
                            disabled={
                              isSaving ||
                              (candidates.length === 0 && !showCurrentFallback)
                            }
                          >
                            <SelectTrigger className="h-8 text-xs max-w-md">
                              <SelectValue placeholder="Select personnel">
                                {(value: unknown) => {
                                  const id = (value as string) ?? "";
                                  const label = id ? labelFor(id) : "";
                                  return (
                                    label ||
                                    (candidates.length === 0 && !current
                                      ? "No active personnel for this role"
                                      : "Select personnel")
                                  );
                                }}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {showCurrentFallback && current && (
                                <SelectItem
                                  key={current.personnel_id}
                                  value={current.personnel_id}
                                >
                                  {labelFor(current.personnel_id)}
                                  {current.personnel_active === false
                                    ? " (inactive)"
                                    : ""}
                                </SelectItem>
                              )}
                              {candidates.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name}
                                  {p.license_no ? ` — ${p.license_no}` : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isSaving && (
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {current ? (
                          <Badge variant="secondary">Assigned</Badge>
                        ) : (
                          <Badge variant="outline" className="text-destructive border-destructive/40">
                            No active assignment
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {auditModule === module && (
              <div className="border-t border-primary/10 bg-muted/20 px-3 py-2">
                {auditLoading ? (
                  <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Loading history…
                  </div>
                ) : audit.length === 0 ? (
                  <p className="py-2 text-xs text-muted-foreground italic">
                    No changes recorded yet.
                  </p>
                ) : (
                  <ul className="space-y-1 py-1">
                    {audit.map((row) => (
                      <li
                        key={row.id}
                        className="text-[11px] text-foreground/80 flex flex-wrap items-center gap-1"
                      >
                        <span className="font-semibold text-primary/70">
                          {roleLabel(row.role)}:
                        </span>
                        {row.previous_personnel_name ? (
                          <>
                            <span>{row.previous_personnel_name}</span>
                            <span className="text-muted-foreground">→</span>
                          </>
                        ) : null}
                        <span className="font-medium">{row.new_personnel_name}</span>
                        <span className="text-muted-foreground">
                          by {row.changed_by} ·{" "}
                          {new Date(row.changed_at).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
