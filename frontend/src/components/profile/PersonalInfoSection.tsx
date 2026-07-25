"use client";

import { SectionHeader } from "@/components/common/section-header";
import { FormField } from "@/components/common/form-field";
import { FormSelect } from "@/components/common/form-select";
import PhotoUpload from "./PhotoUpload";
import { User } from "lucide-react";
import type { SeafarerProfile } from "@/lib/api";
import type { ProfileSectionProps } from "./types";

/**
 * Personal information form section.
 *
 * Captures core identity fields: name, address, birthdate (with auto
 * age calculation), gender, marital status, nationality, and contact info.
 * Includes a photo upload area on the left.
 */
export default function PersonalInfoSection({
  data,
  onChange,
}: ProfileSectionProps) {
  const update = (field: keyof SeafarerProfile, value: string) =>
    onChange({ ...data, [field]: value });

  const handleBirthdateChange = (val: string) => {
    const updates: Partial<SeafarerProfile> = { birthdate: val };
    if (val) {
      const birth = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      updates.age = String(age);
    }
    onChange({ ...data, ...updates } as SeafarerProfile);
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="Personal Information" icon={User} />
      <div className="flex gap-4">
        <PhotoUpload
          photoUrl={data.photo_url}
          onPhotoChange={(url) => update("photo_url", url)}
        />
        <div className="flex-1 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <FormField
              label="Last Name"
              value={data.last_name}
              onChange={(v) => update("last_name", v)}
              required
              size="sm"
            />
            <FormField
              label="First Name"
              value={data.first_name}
              onChange={(v) => update("first_name", v)}
              required
              size="sm"
            />
            <FormField
              label="Middle Name"
              value={data.middle_name}
              onChange={(v) => update("middle_name", v)}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <FormField
              label="Address"
              value={data.address}
              onChange={(v) => update("address", v)}
              className="col-span-2"
              size="sm"
            />
            <FormField
              label="City"
              value={data.city}
              onChange={(v) => update("city", v)}
              size="sm"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <FormField
              label="Birthdate"
              value={data.birthdate}
              onChange={handleBirthdateChange}
              type="date"
              required
              size="sm"
            />
            <FormField
              label="Age"
              value={data.age}
              onChange={() => {}}
              disabled
              size="sm"
            />
            <FormSelect
              label="Gender"
              value={data.gender}
              onChange={(v) => update("gender", v)}
              options={["Male", "Female"]}
              size="sm"
            />
            <FormSelect
              label="Marital Status"
              value={data.marital_status}
              onChange={(v) => update("marital_status", v)}
              options={["Single", "Married", "Widowed", "Separated"]}
              size="sm"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <FormField
              label="Place of Birth"
              value={data.place_of_birth}
              onChange={(v) => update("place_of_birth", v)}
              size="sm"
            />
            <FormField
              label="Religion"
              value={data.religion}
              onChange={(v) => update("religion", v)}
              size="sm"
            />
            <FormField
              label="Nationality"
              value={data.nationality}
              onChange={(v) => update("nationality", v)}
              size="sm"
            />
            <FormField
              label="Contact No."
              value={data.contact_no}
              onChange={(v) => update("contact_no", v)}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
