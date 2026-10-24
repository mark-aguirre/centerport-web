"use client";

import { FormAutocomplete } from "@/components/common/form-autocomplete";
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import { SectionHeader } from "@/components/common/section-header";
import PhotoUpload from "@/components/profile/PhotoUpload";
import type { SeafarerProfile } from "@/lib/api";
import {
  CITIES,
  COUNTRIES,
  DESIGNATIONS,
  NATIONALITIES,
  POSITIONS,
  RELIGIONS,
} from "@/lib/suggestions";
import { useEmployers } from "@/hooks/use-employers";
import { BriefcaseBusiness, ClipboardList, UserRound } from "lucide-react";

interface VisitRegistrationFormProps {
  data: SeafarerProfile;
  onChange: React.Dispatch<React.SetStateAction<SeafarerProfile>>;
  editing: boolean;
  purposeOfVisit: string;
  onPurposeChange: (v: string) => void;
  sirb: string;
  onSirbChange: (v: string) => void;
  /**
   * Renders the "Visit Details" section. False when the dialog is showing a
   * profile with no visit attached, i.e. the directory's "View Details".
   */
  showVisitDetails: boolean;
  firstFieldRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * Organized patient registration form for the Visit dialog.
 *
 * Fields only. The record's identity chips and the Save / Cancel / Edit / New
 * actions live in {@link VisitFormHeader} on the dialog's header row, so they
 * stay put while this panel scrolls.
 */
export function VisitRegistrationForm({
  data,
  onChange,
  editing,
  purposeOfVisit,
  onPurposeChange,
  sirb,
  onSirbChange,
  showVisitDetails,
}: VisitRegistrationFormProps) {
  const update = (field: keyof SeafarerProfile, value: string) =>
    onChange((prev) => ({ ...prev, [field]: value }));

  const employers = useEmployers();

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
      {/* Each section uses the visit page's panel treatment: an
          `overflow-hidden rounded-lg border-primary/20` card whose band is a
          `banner` SectionHeader at `bannerInset="p-3"`, wrapped in `px-3 pt-3`
          so the inset's negative margins bleed it to the card edge, with the
          body in a matching `px-3 pb-3`. Keep the wrapper padding and the
          inset in step — `p-4` here with a `p-3` inset leaves the band short
          of the corners. */}
      <section className="overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm">
        <div className="px-3 pt-3">
          <SectionHeader
            title="Identity & Contact"
            icon={UserRound}
            subtitle="Personal and contact information"
            banner
            bannerInset="p-3"
          />
        </div>

        <div className="grid gap-4 px-3 pb-3 md:grid-cols-[auto_minmax(0,1fr)]">
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

      <section className="overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm">
        <div className="px-3 pt-3">
          <SectionHeader
            title="Employment & Documents"
            icon={BriefcaseBusiness}
            subtitle="Current work assignment and identification"
            banner
            bannerInset="p-3"
          />
        </div>

        {/* Two even rows of three: assignment on top, the documents that
            identify the seafarer below. */}
        <div className="grid gap-2 px-3 pb-3 md:grid-cols-12">
          <FormAutocomplete label="Designation" value={data.designation} onChange={(v) => update("designation", v)} suggestions={DESIGNATIONS} disabled={!editing} className="md:col-span-4" size="sm" />
          <FormAutocomplete label="Position" value={data.position} onChange={(v) => update("position", v)} suggestions={POSITIONS} disabled={!editing} className="md:col-span-4" size="sm" />
          <FormAutocomplete label="Employer" value={data.employer} onChange={(v) => update("employer", v)} suggestions={employers} disabled={!editing} className="md:col-span-4" size="sm" />
          <FormField label="Passport No." value={data.passport_no} onChange={(v) => update("passport_no", v)} disabled={!editing} className="md:col-span-4" size="sm" />
          <FormField label="Seaman's Book No." value={data.seamans_book_no} onChange={(v) => update("seamans_book_no", v)} disabled={!editing} className="md:col-span-4" size="sm" />
          <FormAutocomplete label="Country of Destination" value={data.country_of_destination} onChange={(v) => update("country_of_destination", v)} suggestions={COUNTRIES} disabled={!editing} className="md:col-span-4" size="sm" />
        </div>
      </section>

      {/* Only meaningful when a visit is in play — opened from Today's Visits,
          or on its way to being created. The directory's "View Details" is a
          look at the profile alone, where SIRB and purpose belong to no
          particular visit. */}
      {showVisitDetails ? (
        <section className="overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm">
          <div className="px-3 pt-3">
            <SectionHeader
              title="Visit Details"
              icon={ClipboardList}
              subtitle="Information for the current clinic visit"
              banner
              bannerInset="p-3"
            />
          </div>

          <div className="grid gap-2 px-3 pb-3 md:grid-cols-12">
            <FormField label="SIRB" value={sirb} onChange={onSirbChange} disabled={!editing} className="md:col-span-4" size="sm" />
            <FormField label="Purpose of Visit" value={purposeOfVisit} onChange={onPurposeChange} disabled={!editing} className="md:col-span-4" size="sm" />
            <FormField label="Remarks" value={data.remark} onChange={(v) => update("remark", v)} disabled={!editing} className="md:col-span-4" size="sm" />
          </div>
        </section>
      ) : null}
    </div>
  );
}
