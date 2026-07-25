import React from "react";
import SectionHeader from "./SectionHeader";
import FormField from "./FormField";
import { Briefcase } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function WorkExperienceSection({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="Previous Work Experience (Last Vessel Only)" icon={Briefcase} />
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-2">
            
          <FormField label="Date Started" value={data.prev_date_started} onChange={(v) => update("prev_date_started", v)} type="date" className="col-span-2" />
          <FormField label="Date End" value={data.prev_date_end} onChange={(v) => update("prev_date_end", v)} type="date" className="col-span-2" />
          <FormField label="Length of Stay" value={data.prev_length_of_stay} onChange={(v) => update("prev_length_of_stay", v)} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <FormField label="Company" value={data.prev_company} onChange={(v) => update("prev_company", v)} />
          <FormField label="Position" value={data.prev_position} onChange={(v) => update("prev_position", v)} />
          <FormField label="Reason of Leaving" value={data.prev_reason_of_leaving} onChange={(v) => update("prev_reason_of_leaving", v)} />
        </div>
        <div className="space-y-0.5">
          <Label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">Remarks</Label>
          <Textarea
            value={data.remark || ""}
            onChange={(e) => update("remark", e.target.value)}
            className="bg-white border-primary/20 focus:border-primary focus:ring-primary/20 text-xs min-h-[52px] px-2 py-1"
          />
        </div>
      </div>
    </div>
  );
}