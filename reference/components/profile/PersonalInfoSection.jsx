import React from "react";
import SectionHeader from "./SectionHeader";
import FormField from "./FormField";
import FormSelect from "./FormSelect";
import PhotoUpload from "./PhotoUpload";
import { User } from "lucide-react";

export default function PersonalInfoSection({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  // Auto calculate age
  const handleBirthdateChange = (val) => {
    const updates = { birthdate: val };
    if (val) {
      const birth = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      updates.age = age;
    }
    onChange({ ...data, ...updates });
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="Personal Information" icon={User} />
      <div className="flex gap-4">
        <PhotoUpload photoUrl={data.photo_url} onPhotoChange={(url) => update("photo_url", url)} />
        <div className="flex-1 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <FormField label="Last Name" value={data.last_name} onChange={(v) => update("last_name", v)} required />
            <FormField label="First Name" value={data.first_name} onChange={(v) => update("first_name", v)} required />
            <FormField label="Middle Name" value={data.middle_name} onChange={(v) => update("middle_name", v)} />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <FormField label="Address" value={data.address} onChange={(v) => update("address", v)} className="col-span-2" />
            <FormField label="City" value={data.city} onChange={(v) => update("city", v)} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <FormField label="Birthdate" value={data.birthdate} onChange={handleBirthdateChange} type="date" required />
            <FormField label="Age" value={data.age} onChange={() => {}} disabled />
            <FormSelect label="Gender" value={data.gender} onChange={(v) => update("gender", v)} options={["Male", "Female"]} />
            <FormSelect label="Marital Status" value={data.marital_status} onChange={(v) => update("marital_status", v)} options={["Single", "Married", "Widowed", "Separated"]} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <FormField label="Place of Birth" value={data.place_of_birth} onChange={(v) => update("place_of_birth", v)} />
            <FormField label="Religion" value={data.religion} onChange={(v) => update("religion", v)} />
            <FormField label="Nationality" value={data.nationality} onChange={(v) => update("nationality", v)} />
            <FormField label="Contact No." value={data.contact_no} onChange={(v) => update("contact_no", v)} />
          </div>
        </div>
      </div>
    </div>
  );
}