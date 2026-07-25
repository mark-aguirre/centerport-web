import React from "react";
import SectionHeader from "./SectionHeader";
import FormField from "./FormField";
import { Users } from "lucide-react";

export default function FamilyDataSection({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="Family Data" icon={Users} />
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-2">
            
          <FormField label="Father's Name" value={data.father_name} onChange={(v) => update("father_name", v)} className="col-span-2" />
          <FormField label="Father's Occupation" value={data.father_occupation} onChange={(v) => update("father_occupation", v)} className="col-span-2" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <FormField label="Mother's Name" value={data.mother_name} onChange={(v) => update("mother_name", v)} className="col-span-2" />
          <FormField label="Mother's Occupation" value={data.mother_occupation} onChange={(v) => update("mother_occupation", v)} className="col-span-2" />
        </div>
        <div className="grid grid-cols-6 gap-2">
          <FormField label="Brothers" value={data.no_of_brothers} onChange={(v) => update("no_of_brothers", parseInt(v) || "")} type="number" />
          <FormField label="Sisters" value={data.no_of_sisters} onChange={(v) => update("no_of_sisters", parseInt(v) || "")} type="number" />
          <FormField label="Birth Order" value={data.birth_order} onChange={(v) => update("birth_order", parseInt(v) || "")} type="number" />
          <FormField label="Children" value={data.no_of_children} onChange={(v) => update("no_of_children", parseInt(v) || "")} type="number" />
          <FormField label="Spouse Name" value={data.spouse_name} onChange={(v) => update("spouse_name", v)} className="col-span-2" />
        </div>
        <FormField label="Spouse's Occupation" value={data.spouse_occupation} onChange={(v) => update("spouse_occupation", v)} className="max-w-sm" />
      </div>
    </div>
  );
}