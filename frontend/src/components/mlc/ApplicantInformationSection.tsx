"use client";

import { FormField } from "@/components/common/form-field";
import { SectionHeader } from "@/components/common/section-header";
import { UserRound } from "lucide-react";

import type { MlcRecord, MlcSectionProps } from "./types";

/**
 * Applicant identity section for the MLC physician declaration.
 *
 * Values come from the selected seafarer profile and remain read-only on the
 * MLC page so the certificate always references the canonical profile data.
 */
export default function ApplicantInformationSection({
  data,
  onChange,
  disabled = true,
}: MlcSectionProps) {
  const update = (field: keyof MlcRecord, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
      <SectionHeader
        title="Applicant Information"
        icon={UserRound}
        subtitle="From the selected seafarer profile"
      />

      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <FormField label="Last Name" value={data.last_name} onChange={(value) => update("last_name", value)} disabled={disabled} required />
          <FormField label="First Name" value={data.first_name} onChange={(value) => update("first_name", value)} disabled={disabled} required />
          <FormField label="Middle Name" value={data.middle_name} onChange={(value) => update("middle_name", value)} disabled={disabled} />
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <FormField label="Place of Birth" value={data.place_of_birth} onChange={(value) => update("place_of_birth", value)} disabled={disabled} />
          <FormField label="Passport No." value={data.passport_no} onChange={(value) => update("passport_no", value)} disabled={disabled} />
          <FormField label="Religion" value={data.religion} onChange={(value) => update("religion", value)} disabled={disabled} />
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <FormField label="Nationality" value={data.nationality} onChange={(value) => update("nationality", value)} disabled={disabled} />
          <FormField label="Gender" value={data.gender} onChange={(value) => update("gender", value)} disabled={disabled} />
          <FormField label="Civil Status" value={data.civil_status} onChange={(value) => update("civil_status", value)} disabled={disabled} />
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <FormField className="md:col-span-2" label="Address" value={data.address} onChange={(value) => update("address", value)} disabled={disabled} />
          <FormField label="Contact No." value={data.contact_no} onChange={(value) => update("contact_no", value)} disabled={disabled} />
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <FormField label="Employer" value={data.employer} onChange={(value) => update("employer", value)} disabled={disabled} />
          <FormField label="Position" value={data.position} onChange={(value) => update("position", value)} disabled={disabled} />
        </div>
      </div>
    </div>
  );
}
