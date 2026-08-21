"use client";

import { SectionHeader } from "@/components/common/section-header";
import { SetNormalButton } from "@/components/common/set-normal-button";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { PsychologySectionProps, PsychologyRecord, TraitRating } from "./types";

// ---------------------------------------------------------------------------
// Trait category definitions
// ---------------------------------------------------------------------------

interface TraitDef {
  key: keyof PsychologyRecord;
  label: string;
}

interface TraitCategory {
  title: string;
  traits: TraitDef[];
}

/** All personality trait categories matching the form layout. */
const TRAIT_CATEGORIES: TraitCategory[] = [
  {
    title: "Sense of Responsibility",
    traits: [
      { key: "trait_perseverance", label: "Perseverance" },
      { key: "trait_obedience", label: "Obedience" },
      { key: "trait_self_discipline", label: "Self Discipline/Orderly" },
      { key: "trait_enthusiasm", label: "Enthusiasm" },
      { key: "trait_initiative", label: "Initiative" },
    ],
  },
  {
    title: "Emotional Stability",
    traits: [
      { key: "trait_withstand_boredom", label: "Can Withstand boredom and work alone" },
      { key: "trait_stress_tolerance", label: "Tolerance to stress, pressure, and inconveniences" },
      { key: "trait_faces_reality", label: "Faces Reality" },
      { key: "trait_confidence", label: "Confidence" },
      { key: "trait_relaxed", label: "Relaxed" },
    ],
  },
  {
    title: "Objectivity",
    traits: [
      { key: "trait_tough_mindedness", label: "Tough-mindedness" },
      { key: "trait_adaptability", label: "Adaptability" },
      { key: "trait_practicality", label: "Practicality" },
    ],
  },
  {
    title: "Motivation",
    traits: [
      { key: "trait_assertiveness", label: "Assertiveness" },
      { key: "trait_independence", label: "Independence" },
      { key: "trait_resourcefulness", label: "Resourcefulness" },
    ],
  },
  {
    title: "Interpersonal and Personal Adjustment",
    traits: [
      { key: "trait_teamwork", label: "Relationship with Peers and Co-workers (Team manship)" },
      { key: "trait_deference", label: "Relationship with Superiors, Employers and Authority Figures (Deference)" },
      { key: "trait_self_esteem", label: "Self-esteem" },
      { key: "trait_aggressive_tendencies", label: "Aggressive Tendencies" },
    ],
  },
  {
    title: "Goal Orientation",
    traits: [
      { key: "trait_goal_orientation", label: "Direct one's effort towards clear cut objectives" },
    ],
  },
];

/** Rating scale values and descriptions. */
const RATING_SCALE: ReadonlyArray<{ value: TraitRating; label: string }> = [
  { value: "1", label: "Very Low" },
  { value: "2", label: "Low" },
  { value: "3", label: "Low Average" },
  { value: "4", label: "Average" },
  { value: "5", label: "High Average" },
  { value: "6", label: "High" },
  { value: "7", label: "Very High" },
];

/** Shared columns keep every rating control on the same vertical guide. */
const TRAIT_GRID_CLASSES =
  "grid min-w-[52rem] grid-cols-[minmax(22rem,1fr)_repeat(7,minmax(3.25rem,0.42fr))]";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Section II: Personality Traits and Characteristics.
 *
 * Renders a grid with trait categories, each containing individual traits
 * rated on a 1-7 scale (1=Very Low ... 7=Very High).
 *
 * The "Set Normal" button sets all traits to "4" (Average).
 *
 * Scale legend:
 * 7=Very High, 6=High, 5=High Average, 4=Average,
 * 3=Low Average, 2=Low, 1=Very Low
 */
export default function PersonalityTraitsSection({
  data,
  onChange,
  disabled,
}: PsychologySectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  /** Set all traits to "4" (Average). */
  const handleSetNormal = () => {
    const updates: Partial<PsychologyRecord> = {};
    for (const category of TRAIT_CATEGORIES) {
      for (const trait of category.traits) {
        (updates as Record<string, string>)[trait.key as string] = "4";
      }
    }
    onChange({ ...data, ...updates });
  };

  return (
    <section className="overflow-hidden rounded-lg border border-primary/20 bg-card p-3 shadow-sm">
      <SectionHeader
        title="II. Personality Traits and Characteristics"
        icon={Users}
        className="mb-2 pb-1.5"
        action={<SetNormalButton onClick={handleSetNormal} readOnly={disabled} />}
      />

      <div className="mb-3 grid grid-cols-2 overflow-hidden rounded-md border border-primary/15 bg-muted/20 sm:grid-cols-4 xl:grid-cols-7">
        {RATING_SCALE.map(({ value, label }, index) => (
          <div
            key={value}
            className={cn(
              "flex min-h-8 items-center justify-center gap-1.5 px-2 py-1 text-center",
              "border-primary/10 text-[11px]",
              index > 0 && "border-l",
              index >= 2 && "max-sm:border-t",
              index >= 4 && "max-xl:border-t"
            )}
          >
            <span className="font-bold text-primary">{value}</span>
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-md border border-primary/15">
        <div className={cn(TRAIT_GRID_CLASSES, "border-b border-primary/15 bg-primary/5")}>
          <div className="sticky left-0 z-10 flex items-center bg-primary/5 px-3 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-primary/80">
              Trait / Characteristic
            </span>
          </div>
          {RATING_SCALE.map(({ value, label }) => (
            <div
              key={value}
              className="flex flex-col items-center justify-center border-l border-primary/10 px-1 py-1.5 text-center"
            >
              <span className="text-xs font-bold leading-none text-primary">{value}</span>
              <span className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>

        {TRAIT_CATEGORIES.map((category) => (
          <div key={category.title}>
            <div className={cn(TRAIT_GRID_CLASSES, "border-b border-primary/15 bg-muted/40")}>
              <div className="sticky left-0 z-10 flex items-center bg-muted px-3 py-1.5 dark:bg-muted/80">
                <span className="text-[11px] font-bold uppercase tracking-wide text-foreground/85">
                  {category.title}
                </span>
              </div>
              {RATING_SCALE.map(({ value }) => (
                <div key={value} className="border-l border-primary/10" aria-hidden="true" />
              ))}
            </div>

            {category.traits.map((trait, index) => (
              <fieldset
                key={trait.key}
                aria-disabled={disabled}
                className={cn(
                  TRAIT_GRID_CLASSES,
                  "m-0 border-0 border-b border-primary/10 p-0 last:border-b-0",
                  "transition-colors hover:bg-primary/[0.035]",
                  disabled && "pointer-events-none",
                  index % 2 === 0 ? "bg-card" : "bg-muted/10"
                )}
              >
                <legend className="sr-only">{trait.label}</legend>
                <div
                  className={cn(
                    "sticky left-0 z-10 flex min-h-9 items-center px-3 py-1.5 pl-6",
                    index % 2 === 0 ? "bg-card" : "bg-muted/10"
                  )}
                >
                  <span className="text-xs leading-snug text-foreground/85">{trait.label}</span>
                </div>
                {RATING_SCALE.map(({ value }) => (
                  <label
                    key={value}
                    className={cn(
                      "flex min-h-9 items-center justify-center border-l border-primary/10",
                      disabled ? "pointer-events-none" : "cursor-pointer hover:bg-primary/5"
                    )}
                  >
                    <input
                      type="radio"
                      name={trait.key}
                      checked={data[trait.key] === value}
                      onChange={() => {
                        if (!disabled) updateField(trait.key, value);
                      }}
                      className={cn(
                        "h-4 w-4 accent-primary",
                        disabled ? "pointer-events-none" : "cursor-pointer"
                      )}
                      tabIndex={disabled ? -1 : undefined}
                      aria-disabled={disabled}
                      aria-label={`${trait.label} - Rating ${value}`}
                    />
                  </label>
                ))}
              </fieldset>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
