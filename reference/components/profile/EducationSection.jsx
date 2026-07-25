import React from "react";
import SectionHeader from "./SectionHeader";
import FormField from "./FormField";
import { GraduationCap } from "lucide-react";


export default function EducationSection({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader title="Educational History" icon={GraduationCap} />
      <div className="grid grid-cols-2 gap-2">
        <FormField label="Elementary" value={data.elementary} onChange={(v) => update("elementary", v)} />
        <FormField label="High School" value={data.high_school} onChange={(v) => update("high_school", v)} />
        <FormField label="College / University" value={data.college_university} onChange={(v) => update("college_university", v)} />
        <FormField label="Course" value={data.course} onChange={(v) => update("course", v)} />
        <FormField label="Highest Level Attended" value={data.highest_level_attended} onChange={(v) => update("highest_level_attended", v)} className="col-span-2" />
      </div>
    </div>
  );
}