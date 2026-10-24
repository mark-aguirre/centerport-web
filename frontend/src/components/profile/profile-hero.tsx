"use client";

import {
  CalendarDays,
  Flag,
  Church,
  MapPin,
  Phone,
  Home,
  User,
  Heart,
} from "lucide-react";
import { resolvePhotoUrl } from "@/lib/photo";
import { cn } from "@/lib/utils";
import type { SeafarerProfile } from "@/lib/api";
import PhotoUpload from "./PhotoUpload";

interface ProfileHeroProps {
  /** Current profile data. */
  data: SeafarerProfile;
  /** Updates the photo URL (enabled in edit mode). */
  onPhotoChange: (url: string) => void;
  /** When true, the photo upload controls are read-only. */
  disabled?: boolean;
}

/**
 * Formats an ISO date (`YYYY-MM-DD`) as `MM/DD/YYYY` for display.
 *
 * Falls back to the raw value when it does not look like an ISO date, so
 * already-formatted or partial input is shown unchanged rather than blanked.
 */
function formatBirthdate(value?: string): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const [, y, m, d] = match;
  return `${m}/${d}/${y}`;
}

/** One labeled quick-info chip in the hero strip. */
function InfoChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-primary/10 bg-white px-3.5 py-2 shadow-sm dark:bg-white/5">
      <Icon className="h-4 w-4 shrink-0 text-primary/70" />
      <div className="min-w-0 leading-tight">
        <div className="whitespace-nowrap text-[13px] font-semibold text-foreground">
          {value?.trim() ? value : "—"}
        </div>
        <div className="whitespace-nowrap text-[11px] text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}

/** Small status pill (gender, age, marital status) under the name. */
function StatusPill({
  icon: Icon,
  children,
  className,
}: {
  icon: typeof User;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

/**
 * Patient summary hero card shown above the profile form.
 *
 * Profile photo (with upload/capture controls) on the left, the patient's
 * name, a row of status pills (gender, age, marital status), a strip of
 * white quick-info chips (birthdate, nationality, religion, place of birth,
 * contact), the city line, and a soft decorative wave carrying the company
 * tagline on the right.
 */
export function ProfileHero({ data, onPhotoChange, disabled }: ProfileHeroProps) {
  const fullName = [data.last_name, data.first_name]
    .filter(Boolean)
    .join(", ");
  const displayName = [fullName, data.middle_name].filter(Boolean).join(" ");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-card shadow-sm">
      {/* Soft decorative wave on the right, flush to the edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] md:block"
      >
        <svg
          viewBox="0 0 500 220"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="hero-wave" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgb(191 219 254)" stopOpacity="0" />
              <stop offset="55%" stopColor="rgb(191 219 254)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="rgb(147 197 253)" stopOpacity="0.75" />
            </linearGradient>
          </defs>
          <path
            fill="url(#hero-wave)"
            d="M120,0 C180,55 150,130 230,165 C300,195 380,175 500,200 L500,0 Z"
          />
          <path
            fill="rgb(219 234 254)"
            fillOpacity="0.6"
            d="M180,0 C230,70 210,120 290,150 C360,176 430,150 500,165 L500,0 Z"
          />
        </svg>
      </div>

      {/* Script tagline over the wave. */}
      <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 text-right md:block lg:right-10">
        <p
          className="text-lg italic leading-snug text-blue-500/80 lg:text-xl"
          style={{ fontFamily: "'Segoe Script', 'Brush Script MT', cursive" }}
        >
          Healthy People,
          <br />
          Safer Seas,
          <br />
          Brighter Tomorrows.
        </p>
      </div>

      <div className="relative flex flex-col gap-4 p-4 sm:flex-row">
        {/* Photo + upload/capture controls. */}
        <div className="shrink-0">
          {resolvePhotoUrl(data.photo_url) || !disabled ? (
            <PhotoUpload
              photoUrl={data.photo_url}
              onPhotoChange={onPhotoChange}
              disabled={disabled}
            />
          ) : (
            <div className="flex h-40 w-32 items-center justify-center rounded border border-primary/20 bg-secondary">
              <User className="h-12 w-12 text-primary/30" />
            </div>
          )}
        </div>

        {/* Identity block. */}
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-primary">
              {displayName || "New Patient"}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {data.gender && (
                <StatusPill
                  icon={User}
                  className="bg-blue-500/10 text-blue-700 dark:text-blue-300"
                >
                  {data.gender}
                </StatusPill>
              )}
              {data.age && (
                <StatusPill
                  icon={CalendarDays}
                  className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                >
                  {data.age} years old
                </StatusPill>
              )}
              {data.marital_status && (
                <StatusPill
                  icon={Heart}
                  className="bg-rose-500/10 text-rose-600 dark:text-rose-300"
                >
                  {data.marital_status}
                </StatusPill>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <InfoChip
              icon={CalendarDays}
              label="Birthdate"
              value={formatBirthdate(data.birthdate)}
            />
            <InfoChip icon={Flag} label="Nationality" value={data.nationality} />
            <InfoChip icon={Church} label="Religion" value={data.religion} />
            <InfoChip icon={MapPin} label="Place of Birth" value={data.place_of_birth} />
            <InfoChip icon={Phone} label="Contact No." value={data.contact_no} />
          </div>

          {(data.address || data.city) && (
            <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <Home className="h-3.5 w-3.5 shrink-0 text-primary/60" />
              <span className="min-w-0">
                {[data.address, data.city].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
