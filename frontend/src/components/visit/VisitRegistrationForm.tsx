"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/common/form-field";
import { FormAutocomplete } from "@/components/common/form-autocomplete";
import { FormSelect } from "@/components/common/form-select";
import PhotoUpload from "@/components/profile/PhotoUpload";
import {
  NATIONALITIES,
  RELIGIONS,
  CITIES,
  POSITIONS,
  EMPLOYERS,
  DESIGNATIONS,
} from "@/lib/suggestions";
import { Save, Loader2, Pencil, Plus, X } from "lucide-react";
import type { SeafarerProfile } from "@/lib/api";

interface VisitRegistrationFormProps {
  data: SeafarerProfile;
  onChange: React.Dispatch<React.SetStateAction<SeafarerProfile>>;
  editing: boolean;
  saving: boolean;
  isExistingRecord: boolean;
  purposeOfVisit: string;
  onPurposeChange: (v: string) => void;
  sirb: string;
  onSirbChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onNew: () => void;
  firstFieldRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * Compact patient registration form for the Visit dialog.
 */
export function VisitRegistrationForm({
  data,
  onChange,
  editing,
  saving,
  isExistingRecord,
  purposeOfVisit,
  onPurposeChange,
  sirb,
  onSirbChange,
  onSave,
  onCancel,
  onEdit,
  onNew,
  firstFieldRef,
}: VisitRegistrationFormProps) {
  const update = (field: keyof SeafarerProfile, value: string) =>
    onChange((prev) => ({ ...prev, [field]: value }));

  const handleBirthdateChange = (val: string) => {
    const updates: Partial<SeafarerProfile> = { birthdate: val };
    if (val) {
      const birth = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      updates.age = String(age);
    } else {
      updates.age = "";
    }
    onChange((prev) => ({ ...prev, ...updates }) as SeafarerProfile);
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center justify-between pb-1 border-b border-border/50">
        <div className="flex items-center gap-2">
          {isExistingRecord && data.profile_id && (
            <span className="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {data.profile_id}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {editing ? (
            <>
              <Button size="xs" onClick={onSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5 mr-1" />
                )}
                {isExistingRecord ? "Update" : "Save"}
              </Button>
              <Button variant="outline" size="xs" onClick={onCancel} disabled={saving}>
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="xs" onClick={onEdit} disabled={!isExistingRecord}>
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
              <Button size="xs" onClick={onNew}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                New
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Photo + Name row */}
      <div className="flex gap-3">
        <PhotoUpload
          photoUrl={data.photo_url}
          onPhotoChange={(url) => update("photo_url", url)}
          disabled={!editing}
        />
        <div className="flex-1 space-y-1.5">
          <div className="grid grid-cols-3 gap-2">
            <FormField label="Last Name" value={data.last_name} onChange={(v) => update("last_name", v)} required disabled={!editing} size="sm" />
            <FormField label="First Name" value={data.first_name} onChange={(v) => update("first_name", v)} required disabled={!editing} size="sm" />
            <FormField label="Middle Name" value={data.middle_name} onChange={(v) => update("middle_name", v)} disabled={!editing} size="sm" />
          </div>
          <div className="grid grid-cols-12 gap-2">
            <FormField label="Address" value={data.address} onChange={(v) => update("address", v)} disabled={!editing} className="col-span-5" size="sm" />
            <FormAutocomplete label="City" value={data.city} onChange={(v) => update("city", v)} suggestions={CITIES} disabled={!editing} className="col-span-4" size="sm" />
            <FormField label="Contact No." value={data.contact_no} onChange={(v) => update("contact_no", v)} disabled={!editing} className="col-span-3" size="sm" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <FormField label="Birthdate" value={data.birthdate} onChange={handleBirthdateChange} type="date" required disabled={!editing} size="sm" />
            <FormField label="Age" value={data.age} onChange={() => {}} disabled size="sm" />
            <FormSelect label="Gender" value={data.gender} onChange={(v) => update("gender", v)} options={["Male", "Female"]} required disabled={!editing} size="sm" />
            <FormSelect label="M. Status" value={data.marital_status} onChange={(v) => update("marital_status", v)} options={["Single", "Married", "Widowed", "Separated"]} disabled={!editing} size="sm" />
          </div>
        </div>
      </div>

      {/* Remaining rows — tight grid */}
      <div className="grid grid-cols-4 gap-2">
        <FormAutocomplete label="Place of Birth" value={data.place_of_birth} onChange={(v) => update("place_of_birth", v)} suggestions={CITIES} disabled={!editing} size="sm" />
        <FormAutocomplete label="Religion" value={data.religion} onChange={(v) => update("religion", v)} suggestions={RELIGIONS} disabled={!editing} size="sm" />
        <FormAutocomplete label="Nationality" value={data.nationality} onChange={(v) => update("nationality", v)} suggestions={NATIONALITIES} disabled={!editing} size="sm" />
        <FormAutocomplete label="Designation" value={data.designation} onChange={(v) => update("designation", v)} suggestions={DESIGNATIONS} disabled={!editing} size="sm" />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <FormAutocomplete label="Position" value={data.position} onChange={(v) => update("position", v)} suggestions={POSITIONS} disabled={!editing} size="sm" />
        <FormAutocomplete label="Employer" value={data.employer} onChange={(v) => update("employer", v)} suggestions={EMPLOYERS} disabled={!editing} className="col-span-2" size="sm" />
        <FormField label="Passport No." value={data.passport_no} onChange={(v) => update("passport_no", v)} disabled={!editing} size="sm" />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <FormField label="Seaman's Book No." value={data.seamans_book_no} onChange={(v) => update("seamans_book_no", v)} disabled={!editing} size="sm" />
        <FormField label="SIRB" value={sirb} onChange={onSirbChange} disabled={!editing} size="sm" />
        <FormField label="Remarks" value={data.remark} onChange={(v) => update("remark", v)} disabled={!editing} className="col-span-2" size="sm" />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <FormField label="Purpose of Visit" value={purposeOfVisit} onChange={onPurposeChange} disabled={!editing} size="sm" />
      </div>
    </div>
  );
}
