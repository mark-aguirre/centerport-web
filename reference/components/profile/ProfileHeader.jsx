import React from "react";
import { format } from "date-fns";

export default function ProfileHeader({ profileId, createdDate, updatedDate }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div>
        <h1 className="text-lg font-bold text-primary tracking-tight">Seafarer Profile</h1>
        <p className="text-xs text-muted-foreground">Fields marked <span className="text-destructive">*</span> are required</p>
      </div>
      
      <div className="flex flex-col items-end gap-0.5">
        {profileId && (
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded tracking-widest">
            {profileId}
          </span>
        )}
        {createdDate && (
          <span className="text-[10px] text-muted-foreground">
            Registered: {format(new Date(createdDate), "MMM d, yyyy h:mm a")}
          </span>
        )}
        {updatedDate && (
          <span className="text-[10px] text-muted-foreground">
            Updated: {format(new Date(updatedDate), "MMM d, yyyy h:mm a")}
          </span>
        )}
      </div>
    </div>
  );
}