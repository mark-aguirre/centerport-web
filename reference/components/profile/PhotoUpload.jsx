import React, { useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Camera, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PhotoUpload({ photoUrl, onPhotoChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = React.useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onPhotoChange(file_url);
    setUploading(false);
  };

  return (
    
    <div className="flex flex-col items-center gap-2">
      <div className="w-20 h-24 rounded border border-primary/20 overflow-hidden bg-secondary flex items-center justify-center flex-shrink-0">
        {photoUrl ? (
          <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User className="w-7 h-7 text-primary/20" />
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="h-6 text-[10px] px-2 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <Camera className="w-3 h-3 mr-1" />
        {uploading ? "..." : "Photo"}
      </Button>
    </div>
  );
}