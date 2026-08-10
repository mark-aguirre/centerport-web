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

/** Rating scale values (1-7). */
const RATINGS: TraitRating[] = ["1", "2", "3", "4", "5", "6", "7"];

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
    <div className="bg-card rounded-lg p-4 shadow-sm border border-primary/10">
      <SectionHeader
        title="II. Personality Traits and Characteristics"
        icon={Users}
        action={<SetNormalButton onClick={handleSetNormal} disabled={disabled} />}
      />

      {/* Rating scale legend */}
      <div className="flex items-center gap-2 mb-3 text-[10px] text-muted-foreground px-1">
        <span className="font-semibold text-primary/70">Note legend:</span>
        <span><strong>7</strong> - Very High</span>
        <span><strong>6</strong> - High</span>
        <span><strong>5</strong> - High Average</span>
        <span><strong>4</strong> - Average</span>
        <span><strong>3</strong> - Low Average</span>
        <span><strong>2</strong> - Low</span>
        <span><strong>1</strong> - Very Low</span>
      </div>

      {/* Table */}
      <div className="border border-primary/15 rounded-md overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_repeat(7,2.5rem)] bg-muted/50 border-b border-primary/15">
          <div className="px-3 py-1.5" />
          {RATINGS.map((r) => (
            <div key={r} className="flex items-center justify-center py-1.5">
              <span className="text-[11px] font-bold text-primary">{r}</span>
            </div>
          ))}
        </div>

        {/* Categories and traits */}
        {TRAIT_CATEGORIES.map((category) => (
          <div key={category.title}>
            {/* Category header row */}
            <div className="grid grid-cols-[1fr_repeat(7,2.5rem)] bg-muted/30 border-b border-primary/10">
              <div className="px-3 py-1.5">
                <span className="text-[11px] font-bold text-foreground uppercase">
                  {category.title}
                </span>
              </div>
              {RATINGS.map((r) => (
                <div key={r} className="flex items-center justify-center" />
              ))}
            </div>

            {/* Individual trait rows */}
            {category.traits.map((trait, idx) => (
              <div
                key={trait.key}
                className={cn(
                  "grid grid-cols-[1fr_repeat(7,2.5rem)] border-b border-muted/30 last:border-b-0",
                  idx % 2 === 0 ? "bg-white dark:bg-card" : "bg-muted/10",
                  disabled && "pointer-events-none"
                )}
              >
                <div className="px-3 py-1.5 pl-8 flex items-center">
                  <span className="text-xs text-foreground/80">{trait.label}</span>
                </div>
                {RATINGS.map((r) => (
                  <div key={r} className="flex items-center justify-center py-1">
                    <input
                      type="radio"
                      name={trait.key}
                      checked={data[trait.key] === r}
                      onChange={() => updateField(trait.key, r)}
                      className="w-3.5 h-3.5 accent-primary"
                      tabIndex={disabled ? -1 : undefined}
                      aria-label={`${trait.label} - Rating ${r}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
