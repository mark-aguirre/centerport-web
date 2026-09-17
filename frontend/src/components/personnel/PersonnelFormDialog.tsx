"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/http-client";
import type { MedicalPersonnelRecord, PersonnelRoleCode } from "@/lib/api";
import { ALL_ROLES, ROLE_LABELS } from "@/lib/personnel";

/** Fields the admin can edit for a personnel record. */
interface PersonnelFormState {
  name: string;
  license_no: string;
  role: PersonnelRoleCode | "";
  title: string;
  signature_url: string;
  active: boolean;
}

const EMPTY_FORM: PersonnelFormState = {
  name: "",
  license_no: "",
  role: "",
  title: "",
  signature_url: "",
  active: true,
};

interface PersonnelFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Record being edited, or null when creating a new one. */
  record: MedicalPersonnelRecord | null;
  /** Called after a successful create/update so the parent can refresh. */
  onSaved: () => void;
}

/**
 * Create / edit dialog for a medical personnel record.
 *
 * Captures the fields the Super Admin manages centrally — full name, PRC
 * license number, structured role, professional title, signature image URL,
 * and active status — so names, license numbers, and signatures are never
 * hardcoded elsewhere. On save it calls the ADMIN-only create/update endpoints
 * and surfaces field-level validation errors from the backend.
 */
export function PersonnelFormDialog({
  open,
  onOpenChange,
  record,
  onSaved,
}: PersonnelFormDialogProps) {
  const [form, setForm] = useState<PersonnelFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const isEditing = !!record;

  // Hydrate the form from the target record when the dialog transitions to open
  // (or the record changes while open). This is done during render via a stored
  // signature — not in an effect — to avoid cascading-render lint violations and
  // to have the correct values on the first paint.
  const openSignature = open ? (record?.id ?? "new") : null;
  const [hydratedFor, setHydratedFor] = useState<string | null>(null);
  if (open && openSignature !== hydratedFor) {
    setForm(
      record
        ? {
            name: record.name ?? "",
            license_no: record.license_no ?? "",
            role: record.role ?? "",
            title: record.title ?? "",
            signature_url: record.signature_url ?? "",
            active: record.active ?? true,
          }
        : EMPTY_FORM
    );
    setHydratedFor(openSignature);
  } else if (!open && hydratedFor !== null) {
    setHydratedFor(null);
  }

  const update = <K extends keyof PersonnelFormState>(
    key: K,
    value: PersonnelFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!form.license_no.trim()) {
      toast.error("License number is required");
      return;
    }

    const payload: Partial<MedicalPersonnelRecord> = {
      name: form.name.trim(),
      license_no: form.license_no.trim(),
      role: form.role || null,
      title: form.title.trim() || undefined,
      signature_url: form.signature_url.trim() || null,
      active: form.active,
    };

    setSaving(true);
    try {
      if (isEditing && record) {
        await api.MedicalPersonnel.update(record.id, payload);
        toast.success("Personnel updated");
      } else {
        await api.MedicalPersonnel.create(payload);
        toast.success("Personnel created");
      }
      onOpenChange(false);
      onSaved();
    } catch (error) {
      if (error instanceof ApiError && error.violations.length > 0) {
        error.violations.forEach((v) => toast.error(`${v.field}: ${v.message}`));
      } else if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save personnel");
      }
    } finally {
      setSaving(false);
    }
  };

  const labelClass =
    "text-[11px] font-semibold text-primary/60 uppercase tracking-wider";
  const inputClass =
    "h-8 text-xs bg-white border border-primary/30 rounded-md px-2 shadow-sm hover:border-primary/50 focus-visible:border-primary dark:bg-input/30";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Medical Personnel" : "New Medical Personnel"}
          </DialogTitle>
          <DialogDescription>
            Centrally managed signatory details used across all reports and
            certificates.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="mp-name" className={labelClass}>
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="mp-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Dr. Juan Dela Cruz"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="mp-license" className={labelClass}>
                License No. <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mp-license"
                value={form.license_no}
                onChange={(e) => update("license_no", e.target.value)}
                placeholder="PRC-0012345"
                className={inputClass}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="mp-title" className={labelClass}>
                Title
              </Label>
              <Input
                id="mp-title"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Dr."
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className={labelClass}>Role / Category</Label>
            <Select
              value={form.role}
              onValueChange={(v) => update("role", (v as PersonnelRoleCode) ?? "")}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ALL_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground italic">
              The role determines which modules this person can be assigned to.
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="mp-signature" className={labelClass}>
              Signature Image URL
            </Label>
            <Input
              id="mp-signature"
              value={form.signature_url}
              onChange={(e) => update("signature_url", e.target.value)}
              placeholder="https://…/signature.png"
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => update("active", e.target.checked)}
              className="w-4 h-4 accent-primary rounded"
              aria-label="Active status"
            />
            <span className="text-xs text-foreground/80">
              Active (available for selection and assignment)
            </span>
          </label>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            {isEditing ? "Save Changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
