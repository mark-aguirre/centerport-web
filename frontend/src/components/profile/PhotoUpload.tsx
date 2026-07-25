"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { base44 } from "@/lib/api";
import { Camera, User } from "lucide-react";

interface PhotoUploadProps {
  photoUrl: string;
  onPhotoChange: (url: string) => void;
}

/**
 * Profile photo upload with preview thumbnail.
 *
 * Shows a placeholder icon or the current photo. Clicking the "Photo"
 * button triggers a file picker. The selected image is uploaded via
 * the base44 integration and the resulting URL is passed back.
 */
export default function PhotoUpload({
  photoUrl,
  onPhotoChange,
}: PhotoUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onPhotoChange(file_url);
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-24 rounded border border-primary/20 overflow-hidden bg-secondary flex items-center justify-center flex-shrink-0">
        {photoUrl ? (
          <Image src={photoUrl} alt="Profile" fill className="object-cover" unoptimized />
        ) : (
          <User className="w-7 h-7 text-primary/30" />
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
      >
        <Camera className="w-3 h-3 mr-1" />
        {uploading ? "..." : "Photo"}
      </Button>
    </div>
  );
}