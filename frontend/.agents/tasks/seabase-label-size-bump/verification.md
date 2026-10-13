# Verification — Seabase field-label size bump (`text-xs` → `text-sm`)

## Commands run (from `frontend/`)

- `tsc --noEmit` (the `type-check` script) → exit 0, no output (no type errors).
- `eslint` (the `lint` script) → exit 0 for the change. The only problems ESLint
  reports (3 errors + 1 warning) are PRE-EXISTING and live in files NOT touched by
  this task:
  - `src/components/layout/app-sidebar.tsx:188` (react-hooks/set-state-in-effect)
  - `src/hooks/use-transaction-form.ts:149,165` (react-hooks/set-state-in-effect)
  - `src/hooks/use-entity-form.ts:717` (react-hooks/exhaustive-deps, warning)
  None of the 8 edited files produce any ESLint error or warning. These edits are
  className-only (`text-xs` → `text-sm`) and cannot introduce lint/type issues.

> Note: `npm run ...` is blocked by this machine's PowerShell execution policy, so the
> same underlying scripts were invoked directly (`tsc --noEmit`, `eslint`).

## Labels bumped per file (count)

- `src/components/common/personal-info-section.tsx` — 1
  (`labelClasses` constant used by every Personal Information label).
- `src/components/medical/QuestionnaireGrid.tsx` — 4
  (Q1–7 row caption, "Please select on the appropriate box." heading, "Comments"
  label, Q8 row caption).
- `src/components/medical/VisionSection.tsx` — 2
  ("Uncorrected" row caption, "Corrected" row caption).
- `src/components/medical/AudiometrySpeechSection.tsx` — 1
  ("Is applicant suffering from any medical condition…" question).
- `src/components/medical/ConditionQuestionsSection.tsx` — 2
  (identification-documents heading, "Fit for Look-out Duties:" heading).
- `src/components/medical/AncillaryExamsSection.tsx` — 5
  (`ResultRow` label, `SelectResultRow` label, "X-ray No.:" label, "Psychological
  Test:" label, "Additional Test (Specify)…" label).
- `src/components/medical/FinalRecommendationSection.tsx` — 3
  (`CertificationResultRow` label, "REMARK/Special Needs:" label, "Restriction
  Details:" label).
- `src/components/medical/FitnessAssessmentSection.tsx` — 2
  (`FitnessChoice` label, "Visual Aids Required:" label).

Total: 20 label occurrences bumped `text-xs` → `text-sm`.

## Deliberately left as `text-xs` (confirmed via re-grep)

- `<Input>`/`<Textarea>`/date inputs (typed-value size): question detail input and
  Vision/Ancillary/FinalRecommendation inputs, `personnelInputClasses`.
- Radio/checkbox OPTION words: Yes/No, Adequate/Inadequate, FIT/UNFIT, YES/NO visual
  aids, PASSED / WITH SIGNIFICANT FINDINGS, psychological-test options, speech/hearing
  options (several via the shared `RADIO_OPTION_LABEL_CLASS`, which was NOT edited).
- Helper/instruction paragraphs: "Check appropriate box" (Ancillary) and "On the basis
  of the examinee's…" (FitnessAssessment).
- All `text-[11px]` captions (VitalsSection, PastMedicalHistoryGrid, FindingsGrid,
  AcuityInput labels, column headers, AD/AS, Satisfactory Hearing, Authorized
  Physician / Medical Director labels, medications instruction, Yes/No mini-headers) —
  out of scope (different, smaller token).

## Files inspected but NOT changed (no in-scope `text-xs` label)

- `src/components/medical/VitalsSection.tsx` — captions are `text-[11px]`; `text-xs`
  only on inputs/helper.
- `src/components/medical/PastMedicalHistoryGrid.tsx` — labels `text-[11px]`; `text-xs`
  on inputs and the "Has applicant suffered…" helper paragraph.
- `src/components/medical/FindingsGrid.tsx` — labels/headers `text-[11px]`; only
  `text-xs` is the remarks input.
- `src/components/common/form-field.tsx` — intentionally NOT edited (broadly shared
  across ~20 components / many unrelated pages). Consequence: the FitnessAssessment
  date fields and "Medical Certification No." rendered through `FormField` stay
  `text-xs`. Accepted limitation per plan.

## Side-effect (recorded)

The shared `personal-info-section.tsx` `labelClasses` change also enlarges Personal
Information labels on `/mlc`, `/medical`, and `/landbase` (all consume the same common
component). This is consistent with the goal and accepted.
