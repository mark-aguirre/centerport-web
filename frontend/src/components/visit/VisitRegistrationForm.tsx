"use client";

import { FormAutocomplete } from "@/components/common/form-autocomplete";
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import { SectionHeader } from "@/components/common/section-header";
import PhotoUpload from "@/components/profile/PhotoUpload";
import { Button } from "@/components/ui/button";
import type { SeafarerProfile } from "@/lib/api";
import {
  CITIES,
  DESIGNATIONS,
  EMPLOYERS,
  NATIONALITIES,
  POSITIONS,
  RELIGIONS,
} from "@/lib/suggestions";
import {
  BriefcaseBusiness,
  ClipboardList,
  Loader2,
  Pencil,
  Plus,
  Save,
  UserRound,
  X,
} from "lucide-react";

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
 * Organized patient registration form for the Visit dialog.
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
    <div className="h-full min-h-0 space-y-3 overflow-y-auto p-4">
      <div className="sticky top-0 z-10 flex flex-col gap-2 rounded-lg border border-primary/10 bg-background/95 px-3 py-2 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {isExistingRecord && data.profile_id ? (
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
              Patient ID: {data.profile_id}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
              New patient
            </span>
          )}
          <span className="text-xs text-foreground/70">
            {editing ? "Editing details" : "Viewing patient record"}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {editing ? (
            <>
              <Button
                type="button"
                size="sm"
                className="cursor-pointer"
                onClick={onSave}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-1 h-4 w-4" />
                )}
                {isExistingRecord ? "Update" : "Save"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={onCancel}
                disabled={saving}
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={onEdit}
                disabled={!isExistingRecord}
              >
                <Pencil className="mr-1 h-4 w-4" />
                Edit
              </Button>
              <Button
                type="button"
                size="sm"
                className="cursor-pointer"
                onClick={onNew}
              >
                <Plus className="mr-1 h-4 w-4" />
                New
              </Button>
            </>
          )}
        </div>
      </div>

      <section className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
        <SectionHeader
          title="Identity & Contact"
          icon={UserRound}
          subtitle="Personal and contact information"
        />

        <div className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)]">
          <PhotoUpload
            photoUrl={data.photo_url}
            onPhotoChange={(url) => update("photo_url", url)}
            disabled={!editing}
          />

          <div className="min-w-0 space-y-2">
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              <FormField label="Last Name" value={data.last_name} onChange={(v) => update("last_name", v)} required disabled={!editing} size="sm" />
              <FormField label="First Name" value={data.first_name} onChange={(v) => update("first_name", v)} required disabled={!editing} size="sm" />
              <FormField label="Middle Name" value={data.middle_name} onChange={(v) => update("middle_name", v)} disabled={!editing} size="sm" />
            </div>

            <div className="grid gap-2 md:grid-cols-12">
              <FormField label="Address" value={data.address} onChange={(v) => update("address", v)} disabled={!editing} className="md:col-span-5" size="sm" />
              <FormAutocomplete label="City" value={data.city} onChange={(v) => update("city", v)} suggestions={CITIES} disabled={!editing} className="md:col-span-4" size="sm" />
              <FormField label="Contact No." value={data.contact_no} onChange={(v) => update("contact_no", v)} disabled={!editing} className="md:col-span-3" size="sm" />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
              <FormField label="Birthdate" value={data.birthdate} onChange={handleBirthdateChange} type="date" required disabled={!editing} size="sm" />
              <FormField label="Age" value={data.age} onChange={() => {}} disabled size="sm" />
              <FormSelect label="Gender" value={data.gender} onChange={(v) => update("gender", v)} options={["Male", "Female"]} required disabled={!editing} size="sm" />
              <FormSelect label="Marital Status" value={data.marital_status} onChange={(v) => update("marital_status", v)} options={["Single", "Married", "Widowed", "Separated"]} disabled={!editing} size="sm" />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              <FormAutocomplete label="Place of Birth" value={data.place_of_birth} onChange={(v) => update("place_of_birth", v)} suggestions={CITIES} disabled={!editing} size="sm" />
              <FormAutocomplete label="Religion" value={data.religion} onChange={(v) => update("religion", v)} suggestions={RELIGIONS} disabled={!editing} size="sm" />
              <FormAutocomplete label="Nationality" value={data.nationality} onChange={(v) => update("nationality", v)} suggestions={NATIONALITIES} disabled={!editing} size="sm" />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
        <SectionHeader
          title="Employment & Documents"
          icon={BriefcaseBusiness}
          subtitle="Current work assignment and identification"
        />

        <div className="grid gap-2 md:grid-cols-12">
          <FormAutocomplete label="Designation" value={data.designation} onChange={(v) => update("designation", v)} suggestions={DESIGNATIONS} disabled={!editing} className="md:col-span-3" size="sm" />
          <FormAutocomplete label="Position" value={data.position} onChange={(v) => update("position", v)} suggestions={POSITIONS} disabled={!editing} className="md:col-span-3" size="sm" />
          <FormAutocomplete label="Employer" value={data.employer} onChange={(v) => update("employer", v)} suggestions={EMPLOYERS} disabled={!editing} className="md:col-span-6" size="sm" />
          <FormField label="Passport No." value={data.passport_no} onChange={(v) => update("passport_no", v)} disabled={!editing} className="md:col-span-6" size="sm" />
          <FormField label="Seaman's Book No." value={data.seamans_book_no} onChange={(v) => update("seamans_book_no", v)} disabled={!editing} className="md:col-span-6" size="sm" />
        </div>
      </section>

      <section className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
        <SectionHeader
          title="Visit Details"
          icon={ClipboardList}
          subtitle="Information for the current clinic visit"
        />

        <div className="grid gap-2 md:grid-cols-12">
          <FormField label="SIRB" value={sirb} onChange={onSirbChange} disabled={!editing} className="md:col-span-4" size="sm" />
          <FormField label="Remarks" value={data.remark} onChange={(v) => update("remark", v)} disabled={!editing} className="md:col-span-8" size="sm" />
          <FormField label="Purpose of Visit" value={purposeOfVisit} onChange={onPurposeChange} disabled={!editing} className="md:col-span-12" size="sm" />
        </div>
      </section>
    </div>
  );
}
