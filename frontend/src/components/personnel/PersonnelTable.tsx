"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Loader2,
  Plus,
  Pencil,
  Ban,
  RotateCcw,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/common/search-bar";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import type {
  MedicalPersonnelRecord,
  PersonnelRoleCode,
} from "@/lib/api";
import { ALL_ROLES, roleLabel, ROLE_LABELS } from "@/lib/personnel";
import { PersonnelFormDialog } from "./PersonnelFormDialog";

/** Sortable column keys mapped to backend sort fields. */
type SortField = "name" | "license_no" | "role" | "updated_date";

const SORT_FIELD_MAP: Record<SortField, string> = {
  name: "name",
  license_no: "licenseNo",
  role: "role",
  updated_date: "updatedDate",
};

type ActiveFilter = "all" | "active" | "inactive";

interface PersonnelTableProps {
  /** Called whenever the personnel set changes (create/edit/deactivate/etc.). */
  onPersonnelChanged?: (records: MedicalPersonnelRecord[]) => void;
}

/**
 * Admin table of medical personnel with search, role/status filtering, and
 * column sorting, plus create / edit / deactivate / reactivate / delete
 * actions.
 *
 * Deactivation is the primary "remove" action (preserving historical report
 * signatures); a hard delete is offered but the backend rejects it with a
 * clear message when the person is referenced by existing reports.
 */
export function PersonnelTable({ onPersonnelChanged }: PersonnelTableProps) {
  const [records, setRecords] = useState<MedicalPersonnelRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<PersonnelRoleCode | "all">("all");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MedicalPersonnelRecord | null>(null);

  const [confirm, setConfirm] = useState<{
    kind: "deactivate" | "delete";
    record: MedicalPersonnelRecord;
  } | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const sort = `${SORT_FIELD_MAP[sortField]},${sortDir}`;
      const page = await api.MedicalPersonnel.listAdmin({
        search: search.trim() || undefined,
        role: roleFilter === "all" ? undefined : roleFilter,
        active:
          activeFilter === "all" ? undefined : activeFilter === "active",
        sort,
        size: 200,
      });
      setRecords(page.content);
      onPersonnelChanged?.(page.content);
    } catch {
      toast.error("Failed to load personnel");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, activeFilter, sortField, sortDir, onPersonnelChanged]);

  // Debounce reloads so typing in the search box doesn't hammer the API.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void load();
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [load]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-3 h-3 opacity-40" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    );
  };

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (record: MedicalPersonnelRecord) => {
    setEditing(record);
    setDialogOpen(true);
  };

  const handleReactivate = async (record: MedicalPersonnelRecord) => {
    try {
      await api.MedicalPersonnel.reactivate(record.id);
      toast.success(`${record.name} reactivated`);
      void load();
    } catch {
      toast.error("Failed to reactivate personnel");
    }
  };

  const runConfirm = async () => {
    if (!confirm) return;
    setConfirmBusy(true);
    try {
      if (confirm.kind === "deactivate") {
        await api.MedicalPersonnel.deactivate(confirm.record.id);
        toast.success(`${confirm.record.name} deactivated`);
      } else {
        await api.MedicalPersonnel.remove(confirm.record.id);
        toast.success(`${confirm.record.name} deleted`);
      }
      setConfirm(null);
      void load();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        toast.error(error.message);
      } else if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Action failed");
      }
    } finally {
      setConfirmBusy(false);
    }
  };

  const headerClass =
    "text-[11px] font-bold text-primary/70 uppercase tracking-wider cursor-pointer select-none";

  // Render helper (not a component) so it can close over toggleSort/sortIcon
  // without violating the "no components defined during render" rule.
  const renderSortableHead = (field: SortField, label: string) => (
    <TableHead>
      <button
        type="button"
        onClick={() => toggleSort(field)}
        className={`flex items-center gap-1 ${headerClass}`}
      >
        {label}
        {sortIcon(field)}
      </button>
    </TableHead>
  );

  const filtersActive =
    search.trim() !== "" || roleFilter !== "all" || activeFilter !== "all";

  const emptyMessage = useMemo(
    () =>
      filtersActive
        ? "No personnel match the current filters."
        : "No personnel records yet. Add one to get started.",
    [filtersActive]
  );

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <div className="flex flex-wrap items-end gap-2 mb-3">
        <div className="flex-1 min-w-[200px]">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search name, license, or specialization…"
          />
        </div>

        <div className="w-44">
          <Select
            value={roleFilter}
            onValueChange={(v) =>
              setRoleFilter((v as PersonnelRoleCode | "all") ?? "all")
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {ALL_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {ROLE_LABELS[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-36">
          <Select
            value={activeFilter}
            onValueChange={(v) => setActiveFilter((v as ActiveFilter) ?? "all")}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button size="sm" onClick={openNew} className="gap-1">
          <Plus className="w-4 h-4" />
          New Personnel
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : records.length === 0 ? (
        <p className="py-12 text-center text-xs text-muted-foreground italic">
          {emptyMessage}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {renderSortableHead("name", "Name")}
              {renderSortableHead("license_no", "License No.")}
              {renderSortableHead("role", "Role")}
              <TableHead className="text-[11px] font-bold text-primary/70 uppercase tracking-wider">
                Signature
              </TableHead>
              <TableHead className="text-[11px] font-bold text-primary/70 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-[11px] font-bold text-primary/70 uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-xs font-medium text-foreground">
                  {r.title ? `${r.title} ` : ""}
                  {r.name}
                </TableCell>
                <TableCell className="text-xs text-foreground/80">
                  {r.license_no}
                </TableCell>
                <TableCell className="text-xs text-foreground/80">
                  {r.role ? (
                    roleLabel(r.role)
                  ) : (
                    <span className="text-muted-foreground italic">
                      Unassigned
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-foreground/80">
                  {r.signature_url ? (
                    <Badge variant="secondary">On file</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {r.active === false ? (
                    <Badge variant="outline" className="text-muted-foreground">
                      Inactive
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Active</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(r)}
                      aria-label={`Edit ${r.name}`}
                      className="cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    {r.active === false ? (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleReactivate(r)}
                        aria-label={`Reactivate ${r.name}`}
                        className="cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setConfirm({ kind: "deactivate", record: r })}
                        aria-label={`Deactivate ${r.name}`}
                        className="cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setConfirm({ kind: "delete", record: r })}
                      aria-label={`Delete ${r.name}`}
                      className="cursor-pointer text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <PersonnelFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        record={editing}
        onSaved={load}
      />

      <ConfirmDialog
        open={!!confirm}
        title={
          confirm?.kind === "delete"
            ? "Delete personnel record?"
            : "Deactivate personnel record?"
        }
        message={
          confirm?.kind === "delete" ? (
            <>
              This permanently deletes{" "}
              <strong>{confirm?.record.name}</strong>. If the person is
              referenced by existing reports, deletion is blocked — deactivate
              instead to preserve historical signatures.
            </>
          ) : (
            <>
              <strong>{confirm?.record.name}</strong> will no longer appear in
              selection dialogs or as a default signatory. Historical reports
              keep their existing signature. You can reactivate later.
            </>
          )
        }
        confirmLabel={confirm?.kind === "delete" ? "Delete" : "Deactivate"}
        confirmVariant="destructive"
        icon={confirm?.kind === "delete" ? Trash2 : Ban}
        busy={confirmBusy}
        onConfirm={runConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
