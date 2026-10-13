# Implementation Plan — Seabase field-label size bump (`text-xs` → `text-sm`)

## Goal

Make FIELD LABEL font size on the Seabase page bigger so it matches Panama. Panama
labels are `text-sm` (see `LABEL_CLASSES` in
`frontend/src/components/panama/GeneralInfoSection.tsx`); Seabase labels are
currently `text-xs`. Only the SIZE token on labels changes (`text-xs` → `text-sm`).
Do NOT touch font-weight, color, tracking, uppercase, or the size of inputs,
radio/checkbox option words, or helper/instruction paragraphs.

In-place edits in the user's checkout — no worktree.

## What renders the Seabase page

`frontend/src/app/(app)/seabase/page.tsx` renders:
1. `PersonalInfoSection` (common) as a preSection — `frontend/src/components/common/personal-info-section.tsx`.
2. `PhysicalExaminationSection` — `frontend/src/components/medical/PhysicalExaminationSection.tsx`,
   which composes 10 medical sub-sections (all in `frontend/src/components/medical/`).

## Classification rule applied

- BUMP (`text-xs` → `text-sm`): a `<Label>`/`<label>`/`<span>`/`<p>` whose text is a
  field caption, a question row/label, or a radio/checkbox group HEADING — these are
  the elements that visually read as "the label for this field".
- LEAVE AS-IS: `<Input>`/`<Textarea>`/`<select>` elements (their `text-xs` controls
  typed-value size), individual radio/checkbox OPTION words (Yes/No/Fit/Unfit/
  Adequate/etc.), small helper/instruction paragraphs ("Check the appropriate box",
  "Check appropriate box", "On the basis of the examinee's..."), and anything already
  sized `text-[11px]` (those are a different, smaller token and out of scope — the task
  is specifically a `text-xs` → `text-sm` bump).

Where a label is already `text-[11px]` (e.g. VitalsSection captions), it is NOT a
`text-xs` occurrence and is intentionally left unchanged — bumping `text-[11px]`
would exceed the stated scope.

---

## Key decisions

- **form-field.tsx is NOT edited.** `frontend/src/components/common/form-field.tsx`
  renders a `text-xs font-bold uppercase` label and is imported by ~20 components
  across profile, panama, mlc, visit, transaction, listing, and receivable features
  (confirmed by grep for `from "@/components/common/form-field"`). The Seabase page
  DOES use it indirectly: `FitnessAssessmentSection` renders date fields and
  "Medical Certification No." via `FormField`. Editing form-field.tsx would enlarge
  labels on many unrelated pages, which is out of scope. Decision: leave form-field.tsx
  unchanged; the few FormField-rendered labels in FitnessAssessmentSection stay
  `text-xs`. This is a deliberate, accepted limitation (those date/cert labels remain
  at the old size).

- **MLC / medical / landbase side-effect (common PersonalInfoSection).**
  `frontend/src/components/common/personal-info-section.tsx` is shared. Changing its
  `labelClasses` affects not only Seabase but ALSO: the MLC page (`/mlc`, direct
  import), the medical page (`/medical`, via `components/medical/PersonalInfoSection.tsx`
  wrapper), and the landbase page (`/landbase`, via `components/landbase/PersonalInfoSection.tsx`
  wrapper). All four pages' Personal Information card labels will grow from `text-xs`
  to `text-sm`. This is acceptable (consistent with the goal) but MUST be called out
  in the final summary.

---

## Edits

- [ ] 1. Bump the shared Personal Information label size.
      In `labelClasses`, change `text-xs` → `text-sm`. Leave `inputClasses`
      (already `text-sm`) and the Name-row sub-label `span` (`text-[11px]`) untouched.
      From: `const labelClasses = "text-xs font-semibold text-foreground/70 whitespace-nowrap";`
      To:   `const labelClasses = "text-sm font-semibold text-foreground/70 whitespace-nowrap";`
      Files: `frontend/src/components/common/personal-info-section.tsx`
      Side-effect: also enlarges Personal Info labels on /mlc, /medical, /landbase.
      Verify: `npm run type-check` and `npm run lint` pass (see step 11).

- [ ] 2. Bump questionnaire question/caption labels (NOT option words or inputs).
      Bump these FOUR `text-xs` occurrences:
      - Question row caption in `QuestionnaireRow` — `<span className="text-xs leading-tight text-foreground/80">` → `text-sm leading-tight ...`.
      - Column heading `<span className="text-xs font-bold text-foreground/90">Please select on the appropriate box.</span>` → `text-sm font-bold ...`.
      - "Comments" label `<label ... className="pt-1 text-xs font-semibold text-foreground/80">` → `pt-1 text-sm font-semibold ...`.
      - Q8 row caption `<span className="text-xs leading-tight text-foreground/80">` (the "Are you taking any non-prescription..." row) → `text-sm leading-tight ...`.
      Leave: detail `<Input>` (`text-xs`), the medications instruction label (`text-[11px]`),
      the Yes/No column mini-headers (`text-[11px]`), and the two `<Textarea>` (`text-sm`).
      Files: `frontend/src/components/medical/QuestionnaireGrid.tsx`
      Verify: step 11.

- [ ] 3. Bump the "Uncorrected"/"Corrected" row captions in Vision.
      Change the two row-label spans `<div className="... text-xs text-foreground/80 ...">Uncorrected</div>`
      and `...>Corrected</div>` from `text-xs` → `text-sm`.
      Leave: `VisionChoice` option words (`text-xs text-foreground/80`), all `AcuityInput`
      labels and column headers (`text-[11px]`), and `<Input>` (`text-xs`).
      Files: `frontend/src/components/medical/VisionSection.tsx`
      Verify: step 11.

- [ ] 4. Bump the sea-service aggravation question label in Audiometry & Speech.
      Change the `<p className="flex-1 text-xs font-semibold uppercase leading-relaxed text-primary/80">`
      ("Is applicant suffering from any medical condition...") `text-xs` → `text-sm`.
      Leave: the two sets of option words (`text-xs text-foreground/80` in `HearingRadioGroup`
      and the Speech radio group), and all `text-[11px]` sub-labels (AD/AS, Right/Left,
      Satisfactory Hearing, etc.).
      Files: `frontend/src/components/medical/AudiometrySpeechSection.tsx`
      Verify: step 11.

- [ ] 5. Bump the two condition-question group headings.
      Change `<span className="whitespace-nowrap text-right text-xs font-semibold uppercase text-foreground/80">`
      ("Confirmation that identification documents were checked...") `text-xs` → `text-sm`,
      and `<span className="whitespace-nowrap text-right text-xs font-bold uppercase tracking-wide text-primary">`
      ("Fit for Look-out Duties:") `text-xs` → `text-sm`.
      Leave: both Yes/No option words (`text-xs text-foreground/80`).
      Files: `frontend/src/components/medical/ConditionQuestionsSection.tsx`
      Verify: step 11.

- [ ] 6. Bump ancillary-exam field captions and headings.
      Bump these `text-xs` occurrences:
      - `ResultRow` label `<span className="border-r border-primary/20 px-2 text-xs font-semibold text-foreground/80">` → `... text-sm font-semibold ...`.
      - `SelectResultRow` label `<span className="border-r border-primary/20 px-2 text-xs font-semibold text-foreground/80">` → `... text-sm font-semibold ...`.
      - "X-ray No.:" label `<label ... className="text-xs font-semibold text-foreground/80">` → `text-sm font-semibold ...`.
      - "Psychological Test:" label `<span className="text-xs font-semibold text-foreground/80">` → `text-sm font-semibold ...`.
      - "Additional Test (Specify)..." label `<label ... className="text-xs font-semibold italic text-foreground/80">` → `text-sm font-semibold italic ...`.
      Leave: the `ResultRow` option words (`whitespace-nowrap text-xs text-foreground/80`),
      the "Psychological Test" option words (`text-xs text-foreground/80`), the
      "Check appropriate box" helper `<p>` (`text-xs`), the X-ray `<Input>` (`text-xs`),
      and the `<Textarea>` (`text-sm`).
      Files: `frontend/src/components/medical/AncillaryExamsSection.tsx`
      Verify: step 11.

- [ ] 7. Bump final-recommendation row captions and remark labels.
      Bump these `text-xs` occurrences:
      - `CertificationResultRow` label `<span className="text-xs text-foreground/80">{label}:</span>` → `text-sm text-foreground/80`.
      - "REMARK/Special Needs:" label `<label ... className="text-xs font-bold text-foreground/80">` → `text-sm font-bold ...`.
      - "Restriction Details:" label `<label ... className="text-xs font-bold text-foreground/80">` → `text-sm font-bold ...`.
      Leave: the certification option words `<span className="whitespace-nowrap text-xs text-foreground/80">`,
      and both remark/restriction `<Input>` (`text-xs`).
      Files: `frontend/src/components/medical/FinalRecommendationSection.tsx`
      Verify: step 11.

- [ ] 8. Bump fitness-assessment group labels.
      Bump these `text-xs` occurrences:
      - `FitnessChoice` label `<span className="text-xs font-bold uppercase text-foreground/80">{label}:</span>` → `text-sm font-bold uppercase ...`.
      - "Visual Aids Required:" label `<span className="text-xs font-semibold text-foreground/80">` → `text-sm font-semibold ...`.
      Leave: the FIT/UNFIT option words (`text-xs text-foreground/80`), the YES/NO visual-aids
      option words (`text-xs text-foreground/80`), the "On the basis of the examinee's..."
      helper `<p>` (`text-xs`), the "Authorized Physician"/"Medical Director" labels
      (`text-[11px]`), and the personnel `<Input>` (`personnelInputClasses`, `text-xs`).
      Do NOT edit the `FormField`-rendered date / "Medical Certification No." labels (they
      live in form-field.tsx, which is intentionally not touched — see Key decisions).
      Files: `frontend/src/components/medical/FitnessAssessmentSection.tsx`
      Verify: step 11.

## Files deliberately NOT changed (inspected, confirmed no in-scope label)

- [ ] 9. Confirm (no edit) these Seabase-rendered files have no in-scope `text-xs` label:
      - `frontend/src/components/medical/VitalsSection.tsx` — all field captions are
        `text-[11px]` (out of scope); its only `text-xs` matches are the `<Input>`
        controls and the "Enter the data called for..." helper `<p>`. No change.
      - `frontend/src/components/medical/PastMedicalHistoryGrid.tsx` — condition labels
        and "Others" label are `text-[11px]`; the "Has applicant suffered..." text is a
        helper/instruction `<p>` (`text-xs`, left as-is); remaining `text-xs` are `<Input>`.
        No change.
      - `frontend/src/components/medical/FindingsGrid.tsx` — item labels and column
        headers are `text-[11px]`; the only `text-xs` is the remarks `<Input>`. No change.
      - `frontend/src/components/common/form-field.tsx` — NOT edited (broadly shared;
        see Key decisions).
      Files: none modified.
      Verify: step 11.

- [ ] 10. Sanity re-grep the edited files for leftover label `text-xs`.
      Run a `text-xs` search across the eight edited files and confirm every remaining
      `text-xs` is on an input/select/textarea, a radio/checkbox option word, or a helper
      paragraph — not on a field caption/question/heading.
      Files: none modified (inspection only).
      Verify: manual read of grep output against the leave-list above.

## Final verification

- [ ] 11. Build-time verification.
      Run from `frontend/`:
      - `npm run type-check` — expected: no TypeScript errors (className-only edits
        should not affect types).
      - `npm run lint` — expected: no new ESLint errors in the edited files.
      - `npm run build` — expected: Next.js build succeeds.
      Files: none modified.
      Verify: all three commands exit 0.

## Summary points to surface at the end

- Enlarged Seabase field labels from `text-xs` to `text-sm` across the common
  PersonalInfoSection and 7 medical sub-sections (steps 1-8).
- Left inputs, radio/checkbox option words, helper paragraphs, and all `text-[11px]`
  captions unchanged.
- form-field.tsx intentionally not edited; a few FitnessAssessmentSection labels
  (dates, Medical Certification No.) rendered through it remain `text-xs`.
- SIDE-EFFECT: the shared common PersonalInfoSection change also enlarges Personal
  Information labels on /mlc, /medical, and /landbase.
