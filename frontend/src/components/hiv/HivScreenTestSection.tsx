"use client";

/**
 * HIV (HIV-1) Screen Test section for an HIV report.
 *
 * Mirrors the reference form: a short descriptive line, a "Screening Test
 * Used" checklist (RAPID, Particle Agglutination, EIA/CMA/ELFA, and an
 * "Others (Specify)" free-text), and a Nonreactive / Reactive result radio
 * group.
 */

import { ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createFieldUpdater } from "./utils";
import type { HivReport, HivSectionProps } from "./types";

/** Result options for the HIV screening radio group. */
const RESULT_OPTIONS = ["Nonreactive", "Reactive"] as const;

/** Checkbox screening-method rows: [label, field]. */
const SCREENING_METHODS: ReadonlyArray<[string, keyof HivReport]> = [
  ["RAPID", "test_rapid"],
  ["Particle Agglutination", "test_particle_agglutination"],
  ["EIA/CMA/ELFA", "test_eia_cma_elfa"],
];

export default function HivScreenTestSection({
  data,
  onChange,
  disabled,
}: HivSectionProps) {
  const updateField = createFieldUpdater(data, onChange);

  const inputClasses = cn(
    "h-7 text-xs bg-white border border-primary/20 rounded px-2",
    "focus:outline-none focus-visible:border-primary dark:bg-input/30",
    disabled && "pointer-events-none opacity-70"
  );

  return (
    <div className="rounded-lg border border-primary/10 bg-card p-4 shadow-sm">
      <SectionHeader
        title="Human Immunodeficiency Virus (HIV) Screen Test"
        icon={ShieldCheck}
        banner
      />

      <p className="text-xs text-foreground/80 font-medium mb-3">
        Human Immunodeficiency Virus Type (HIV-1) as a screening test for HIV/AIDS:
      </p>

      <div className="grid grid-cols-[1.2fr_1fr] gap-6 items-start">
        {/* Screening Test Used — checkbox list */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
            Screening Test Used: (Please Check)
          </span>

          <div className="space-y-1.5">
            {SCREENING_METHODS.map(([label, field]) => (
              <label
                key={field}
                className={cn(
                  "flex items-center gap-2",
                  disabled ? "cursor-default" : "cursor-pointer"
                )}
              >
                <input
                  type="checkbox"
                  checked={!!data[field]}
                  onChange={(e) => updateField(field, e.target.checked)}
                  disabled={disabled}
                  className="w-4 h-4 accent-primary rounded"
                  aria-label={`Screening test used - ${label}`}
                />
                <span className="text-xs text-foreground/80">{label}</span>
              </label>
            ))}

            {/* Others (Specify) */}
            <div className="flex items-center gap-2 pt-0.5">
              <Label className="text-xs text-foreground/80 whitespace-nowrap">
                Others (Specify):
              </Label>
              <Input
                value={data.test_others}
                onChange={(e) => updateField("test_others", e.target.value)}
                className={cn(inputClasses, "flex-1")}
                disabled={disabled}
                aria-label="Other screening test"
              />
            </div>
          </div>
        </div>

        {/* Result — Nonreactive / Reactive radio */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
            Result:
          </span>
          <div
            className="flex items-center gap-6"
            role="radiogroup"
            aria-label="HIV screening result"
          >
            {RESULT_OPTIONS.map((option) => (
              <label
                key={option}
                className={cn(
                  "flex items-center gap-1.5",
                  disabled ? "cursor-default" : "cursor-pointer"
                )}
              >
                <input
                  type="radio"
                  name="hiv_result"
                  checked={data.result === option}
                  onChange={() => updateField("result", option)}
                  disabled={disabled}
                  className="w-4 h-4 accent-primary"
                  aria-label={`HIV result - ${option}`}
                />
                <span className="text-xs text-foreground/80 uppercase">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
