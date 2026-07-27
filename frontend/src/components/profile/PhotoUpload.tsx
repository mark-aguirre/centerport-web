"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Upload, User } from "lucide-react";
import CameraCapture from "./CameraCapture";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/** Resolve a photo URL — prepends the API base if it's a relative path. */
function resolvePhotoUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url}`;
}

interface PhotoUploadProps {
  photoUrl: string;
  onPhotoChange: (url: string) => void;
  disabled?: boolean;
}

/**
 * Profile photo upload with preview thumbnail and camera capture.
 *
 * Shows a placeholder icon or the current photo. Provides two ways to
 * set a profile photo:
 * - "Upload" button: opens a file picker for selecting an existing image
 * - "Capture" button: opens the webcam dialog for taking a live photo
 *
 * Both paths upload the image via the API and pass back the resulting URL.
 */
export default function PhotoUpload({
  photoUrl,
  onPhotoChange,
  disabled,
}: PhotoUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  /** Handle file picker selection. */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await api.integrations.Core.UploadFile({ file });
      onPhotoChange(file_url);
    } finally {
      setUploading(false);
    }
  };

  /** Handle captured photo from webcam. */
  const handleCameraCapture = async (file: File) => {
    setUploading(true);
    try {
      const { file_url } = await api.integrations.Core.UploadFile({ file });
      onPhotoChange(file_url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-24 rounded border border-primary/20 overflow-hidden bg-secondary flex items-center justify-center flex-shrink-0">
        {photoUrl ? (
          <Image src={resolvePhotoUrl(photoUrl)} alt="Profile" fill className="object-cover" unoptimized />
        ) : (
          <User className="w-7 h-7 text-primary/30" />
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      <div className="flex gap-1">
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={() => fileRef.current?.click()}
          disabled={uploading || disabled}
        >
          <Upload className="w-3 h-3 mr-1" />
          {uploading ? "..." : "Upload"}
        </Button>
        <CameraCapture onCapture={handleCameraCapture} disabled={uploading || disabled} />
      </div>
    </div>
  );
}