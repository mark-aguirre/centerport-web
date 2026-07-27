"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Camera, RotateCcw, Check, X, ZoomIn, ZoomOut } from "lucide-react";

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;

interface CameraCaptureProps {
  /** Called with the captured image as a File object ready for upload. */
  onCapture: (file: File) => void;
  disabled?: boolean;
}

/**
 * Camera capture dialog for taking profile photos via webcam.
 *
 * Opens a dialog with a live webcam feed. The user can zoom in/out on the
 * live feed, capture a snapshot, review it, retake if needed, and confirm.
 * The confirmed image is returned as a File object (JPEG) for upload via
 * the existing file upload flow.
 *
 * Zoom is implemented via CSS transform on the video element so it works
 * universally regardless of whether the camera hardware supports zoom.
 */
export default function CameraCapture({ onCapture, disabled }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [open, setOpen] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(ZOOM_MIN);

  /** Start webcam stream when dialog opens. */
  const startCamera = useCallback(async () => {
    setError(null);
    setCaptured(null);
    setZoom(ZOOM_MIN);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
    }
  }, []);

  /** Stop all tracks on the media stream. */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  /** Zoom in — increment zoom level. */
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX));
  }, []);

  /** Zoom out — decrement zoom level. */
  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN));
  }, []);

  /**
   * Capture a snapshot from the video feed onto the hidden canvas.
   * Accounts for current zoom by drawing only the visible (cropped) portion.
   */
  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    // Calculate the visible crop area based on zoom
    const cropW = vw / zoom;
    const cropH = vh / zoom;
    const cropX = (vw - cropW) / 2;
    const cropY = (vh - cropH) / 2;

    // Output canvas matches the crop dimensions for a clean capture
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCaptured(dataUrl);
  }, [zoom]);

  /** Reset the captured image and show live feed again. */
  const handleRetake = useCallback(() => {
    setCaptured(null);
    // Re-attach the stream to the video element after React re-mounts it
    requestAnimationFrame(() => {
      if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
    });
  }, []);

  /** Confirm the captured photo — convert to File and pass to parent. */
  const handleConfirm = useCallback(() => {
    if (!captured) return;

    // Convert data URL to Blob then to File
    const byteString = atob(captured.split(",")[1]);
    const mimeString = captured.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });

    onCapture(file);
    setOpen(false);
  }, [captured, onCapture]);

  /** Manage stream lifecycle with dialog open/close. */
  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
      setCaptured(null);
      setError(null);
      setZoom(ZOOM_MIN);
    }
    return () => stopCamera();
  }, [open, startCamera, stopCamera]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={disabled}
            />
          }
        >
          <Camera className="w-3 h-3 mr-1" />
          Capture
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Capture Photo</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-3">
            {error ? (
              <div className="w-full aspect-[4/3] rounded bg-destructive/10 flex items-center justify-center text-destructive text-sm text-center px-4">
                {error}
              </div>
            ) : captured ? (
              <img
                src={captured}
                alt="Captured preview"
                className="w-full aspect-[4/3] rounded object-cover border"
              />
            ) : (
              <div className="relative w-full aspect-[4/3] rounded border bg-black overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transition-transform duration-150"
                  style={{ transform: `scale(${zoom})` }}
                />
                {/* Zoom controls overlay */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded-md p-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleZoomOut}
                    disabled={zoom <= ZOOM_MIN}
                    className="text-white hover:bg-white/20 disabled:opacity-30"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-white text-[10px] font-medium min-w-[2.5rem] text-center select-none">
                    {zoom.toFixed(2)}x
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleZoomIn}
                    disabled={zoom >= ZOOM_MAX}
                    className="text-white hover:bg-white/20 disabled:opacity-30"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Hidden canvas for snapshot rendering */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <DialogFooter className="flex gap-2 sm:justify-center">
            {!captured && !error && (
              <Button type="button" onClick={handleCapture} size="sm">
                <Camera className="w-4 h-4 mr-1" />
                Take Photo
              </Button>
            )}
            {captured && (
              <>
                <Button type="button" variant="outline" size="sm" onClick={handleRetake}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Retake
                </Button>
                <Button type="button" size="sm" onClick={handleConfirm}>
                  <Check className="w-4 h-4 mr-1" />
                  Use Photo
                </Button>
              </>
            )}
            {error && (
              <DialogClose
                render={<Button type="button" variant="outline" size="sm" />}
              >
                <X className="w-4 h-4 mr-1" />
                Close
              </DialogClose>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
