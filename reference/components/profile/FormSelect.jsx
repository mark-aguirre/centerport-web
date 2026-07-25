import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FormSelect({ label, value, onChange, options, required, className = "" }) {
  return (
    
    <div className={`space-y-0.5 ${className}`}>
      <Label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger className="h-7 text-xs bg-white border-primary/20 focus:border-primary focus:ring-primary/20 px-2">
          <SelectValue placeholder={`Select...`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}