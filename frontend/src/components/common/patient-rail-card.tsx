"use client";

import { Church, Flag, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { resolvePhotoUrl } from "@/lib/photo";
import { cn } from "@/lib/utils";

interface PatientRailCardProps {
  /** Patient photo URL (relative backend paths are resolved through the proxy). */
  photoUrl?: string;
  /** Display name, e.g. "GOMEZ, RAYMOND". */
  name?: string;
  /** Business id shown under the name (e.g. the record's own id). */
  recordId?: string;
  /** Gender, paired with age on the first detail row. */
  gender?: string;
  /** Age in years (number only — the "years old" suffix is added here). */
  age?: string;
  /** Nationality. */
  nationality?: string;
  /** Religion. */
  religion?: string;
  /** Extra classes for the card element. */
  className?: string;
}

/** One icon + text detail row. Renders nothing when there is no value. */
function DetailRow({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-foreground/80">
      <Icon className="h-4 w-4 shrink-0 text-foreground/50" />
      <span className="min-w-0 truncate">{children}</span>
    </div>
  );
}

/**
 * Compact patient summary card for a page's left rail.
 *
 * Shows the patient photo, display name, record id, and the few identity
 * details that are worth keeping on screen while scrolling a long form
 * (gender and age, nationality, religion). Rows with no value are omitted
 * rather than rendered as placeholders.
 *
 * Sits above a {@link SectionNav} in the rail; the rail itself owns the
 * sticky positioning so the card and the navigator scroll together.
 */
export function PatientRailCard({
  photoUrl,
  name,
  recordId,
  gender,
  age,
  nationality,
  religion,
  className,
}: PatientRailCardProps) {
  const resolvedPhoto = resolvePhotoUrl(photoUrl);
  const genderAge = [gender, age ? `${age} years old` : ""]
    .filter(Boolean)
    .join("   ");

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-3 shadow-sm",
        className
      )}
    >
      {/* Photo (or a neutral placeholder when the patient has none). */}
      <div className="flex justify-center">
        {resolvedPhoto ? (
          // Backend-served patient photo, kept off the image optimizer the same
          // way PhotoUpload does (the standalone build would need `sharp`).
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolvedPhoto}
            alt={name ? `Photo of ${name}` : "Patient photo"}
            className="h-40 w-32 rounded-md border border-primary/15 object-cover"
          />
        ) : (
          <div className="flex h-40 w-32 items-center justify-center rounded-md border border-primary/20 bg-secondary">
            <User className="h-12 w-12 text-primary/30" aria-hidden />
          </div>
        )}
      </div>

      {/* Identity. */}
      <div className="mt-3 space-y-0.5">
        <p className="truncate text-sm font-bold text-foreground">
          {name?.trim() ? name : "No patient selected"}
        </p>
        {recordId && (
          <p className="truncate text-xs font-medium text-foreground/50">
            {recordId}
          </p>
        )}
      </div>

      {/* Details. */}
      {(genderAge || nationality || religion) && (
        <div className="mt-3 space-y-2">
          {genderAge && <DetailRow icon={User}>{genderAge}</DetailRow>}
          {nationality && <DetailRow icon={Flag}>{nationality}</DetailRow>}
          {religion && <DetailRow icon={Church}>{religion}</DetailRow>}
        </div>
      )}
    </div>
  );
}
