"use client";

import { SectionHeader } from "@/components/common/section-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { PsychologyRecord, PsychologySectionProps } from "./types";

const READ_ONLY_INPUT_CLASSES = cn(
  "h-7 w-full border border-primary/20 bg-white px-2 text-xs shadow-none",
  "pointer-events-none focus-visible:border-primary dark:bg-input/30"
);

/** Builds the single full-name value used by the compact psychology form. */
function formatFullName(data: PsychologyRecord): string {
  const givenNames = [data.first_name, data.middle_name].filter(Boolean).join(" ");
  return [data.last_name, givenNames].filter(Boolean).join(", ");
}

interface ReadOnlyFieldProps {
  label: string;
  value: string;
  type?: "text" | "date";
  inputClassName?: string;
}

/** Renders a label and input as sibling grid cells for precise column alignment. */
function ReadOnlyField({
  label,
  value,
  type = "text",
  inputClassName,
}: ReadOnlyFieldProps) {
  return (
    <>
      <Label className="whitespace-nowrap text-[11px] font-semibold text-foreground/80">
        {label}:
      </Label>
      <Input
        type={type}
        value={value}
        readOnly
        tabIndex={-1}
        aria-label={label}
        className={cn(READ_ONLY_INPUT_CLASSES, inputClassName)}
      />
    </>
  );
}

/**
 * Displays the profile-derived patient information for a psychological evaluation.
 *
 * The layout follows the compact paper-form arrangement while keeping all profile
 * fields read-only; demographic changes continue to be managed from the profile page.
 */
export default function PsychologyPersonalInfoSection({ data }: PsychologySectionProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-primary/20 bg-card p-3 shadow-sm">
      <SectionHeader title="Patient Information" className="mb-2 pb-1.5" />

      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 gap-y-2 md:grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(16rem,3.8fr)_auto_minmax(6.5rem,1.35fr)_auto_minmax(3.5rem,0.7fr)_auto_minmax(6rem,1.25fr)]">
        <ReadOnlyField label="Name" value={formatFullName(data)} />
        <ReadOnlyField label="Birth date" value={data.date_of_birth} type="date" />
        <ReadOnlyField label="Age" value={data.age} />
        <ReadOnlyField label="Gender" value={data.gender} />
        <ReadOnlyField label="Agency" value={data.employer} />
        <ReadOnlyField
          label="Position"
          value={data.position}
          inputClassName="xl:col-span-5"
        />
      </div>
    </section>
  );
}
