import React from "react";
import SectionHeader from "./SectionHeader";
import FormField from "./FormField";
import { Anchor } from "lucide-react";


export default function EmploymentSection({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="Employment Details" icon={Anchor} />
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <FormField label="Employer" value={data.employer} onChange={(v) => update("employer", v)} />
          <FormField label="Designation" value={data.designation} onChange={(v) => update("designation", v)} />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <FormField label="Passport No." value={data.passport_no} onChange={(v) => update("passport_no", v)} />
          <FormField label="Seaman's Book No." value={data.seamans_book_no} onChange={(v) => update("seamans_book_no", v)} />
          <FormField label="Position" value={data.position} onChange={(v) => update("position", v)} />
          <FormField label="Country" value={data.country} onChange={(v) => update("country", v)} />
        </div>
        <FormField label="Country of Destination" value={data.country_of_destination} onChange={(v) => update("country_of_destination", v)} className="max-w-xs" />
      </div>
    </div>
  );
}