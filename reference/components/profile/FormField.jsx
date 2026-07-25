import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FormField({ label, value, onChange, type = "text", placeholder, required, className = "", disabled }) {
  return (
    
    <div className={`space-y-0.5 ${className}`}>
      <Label className="text-[10px] font-semibold text-primary/60 uppercase tracking-wider">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-7 text-xs bg-white border-primary/20 focus:border-primary focus:ring-primary/20 px-2"
      />
    </div>
  );
}