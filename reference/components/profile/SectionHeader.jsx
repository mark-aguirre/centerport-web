import React from "react";


export default function SectionHeader({ title, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-primary/20">
      {Icon && <Icon className="w-4 h-4 text-primary" />}
      <h2 className="text-xs font-bold text-primary uppercase tracking-widest">{title}</h2>
    </div>
  );
}