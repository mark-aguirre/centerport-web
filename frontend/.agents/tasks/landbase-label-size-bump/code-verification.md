# Landbase label-size bump — code verification

## Scope decision (mirrors the Seabase change + its follow-up, "option A")
Enlarge FIELD LABELS / question captions / section + column headings / group
headings AND radio/checkbox OPTION WORDS on the Landbase page up to `text-sm`
(Panama's reference label size), consistent with Seabase. Where the primary
field/condition/column labels are currently `text-[11px]` (not `text-xs`), they
were bumped to `text-sm` too (the "don't touch text-[11px]" guard was meant only
for tiny unit sub-captions, not the named field/condition/heading labels).

Size token only — no change to font-weight, color, tracking, uppercase, or layout.
Inputs, select controls, helper/instruction paragraphs, and tiny unit sub-captions
were left unchanged.

## Components that actually render on /landbase
Confirmed via `src/app/(app)/landbase/page.tsx` → PersonalInfoSection,
PastMedicalHistorySection, QuestionnaireSection, PhysicalExaminationSection,
AncillaryExaminationsSection, RemarksSection, ResultsSection, RecommendationSection.

## Files changed (per-file bump counts)

### QuestionnaireSection.tsx
- (a) field-label/heading/caption bumps: 5
  - Q1–6 row number span `text-xs` → `text-sm` (template, renders all 6 rows)
  - Q1–6 row caption span `text-xs` → `text-sm` (template)
  - Q7 number span + Q7 caption span `text-xs` → `text-sm` (2)
  - Q8 number span + Q8 caption span `text-xs` → `text-sm` (2)
  - "Comments" `<Label>` `text-xs` → `text-sm` (1)
    (counted template-wise: 5 distinct span/label edits)
- (b) radio option-word bumps: 0 (YesNoControl renders NO visible per-option
  text; the only visible Yes/No text is the top column mini-header `text-[11px]`,
  left as-is to match the Seabase decision for the same mini-headers).
- LEFT UNCHANGED: DetailInput `<Input>` (`text-xs`), both `<Textarea>` (`text-sm`),
  the Yes/No column mini-headers (`text-[11px]`), and the Q8 "If yes, please list
  the medication(s)…" instruction label (`text-xs`, treated as instruction text —
  parallels the Seabase medications-instruction exclusion).

### PastMedicalHistorySection.tsx
- (a) field-label/heading bumps: 4
  - HistoryRow condition `item.label` span `text-xs` → `text-sm` (template, all 31 conditions)
  - "Others" `<Label>` `text-xs` → `text-sm`
  - "Have you consulted any doctor…" checkbox `<Label>` `text-xs` → `text-sm`
  - "Are you taking maintenance medications?…" `<Label>` `text-xs` → `text-sm`
- (b) radio option-word bumps: 1 (YES/NO option span `text-xs` → `text-sm`,
  template renders both options for every condition row)
- LEFT UNCHANGED: all condition detail `<Input>`, "Others"/consulted/medications
  `<Input>` (`text-xs`), and the `SectionHeader` subtitle ("Has applicant
  suffered… Check the appropriate box.", rendered by the shared SectionHeader).

### PhysicalExaminationSection.tsx ("II. Physical Examination" + "Physical Examination Findings")
- (a) field-label/heading bumps: 13 (templates)
  - CompactInput `label` span `text-[11px]` → `text-sm` (Weight/Height/BMI/Pulse/
    Systolic/Diastolic/Respiration/Body Temperature)
  - "Blood Pressure:" `<p>` `text-[11px]` → `text-sm`
  - "Rhythm:" span `text-[11px]` → `text-sm`
  - Vision column headings `text-[11px]` → `text-sm` ×5 (Far Vision, Near Vision,
    Satisfactory Sight, Visual Aids, Color Vision)
  - "Uncorrected" / "Corrected" row captions `text-xs` → `text-sm` ×2
  - "Clarity of Speech:" span `text-[11px]` → `text-sm`
  - "Satisfactory Psychological Test" span `text-[11px]` → `text-sm`
  - "Satisfactory Hearing:" span `text-[11px]` → `text-sm`
  - "Right:" / "Left:" hearing captions `text-[11px]` → `text-sm` ×2
  - A/B/C column heading `<h3>` `text-[11px]` → `text-sm` (template ×3 columns)
  - "Findings" column heading span `text-[11px]` → `text-sm` (template ×3 columns)
  - FindingRow `item.label` span `text-[11px]` → `text-sm` (template ×19 items)
  ("Vision" and "Hearing by Audiometry" headings were already `text-sm`.)
- (b) radio/checkbox option-word bumps: 2 (templates)
  - ChoiceGroup option span `text-xs` → `text-sm` (YES/NO, Adequate/Inadequate,
    Glasses/Contact Lens — all go through this one span)
  - Color-vision checkbox option span `text-xs` → `text-sm` (Adequate/Defective)
- LEFT UNCHANGED: all `<Input>` / `<FormSelect>` controls (`text-xs`),
  AcuityPair OD/OS unit sub-captions (`text-[11px]`), AD:/AS: unit sub-captions
  (`text-[11px]`), and the "Enter the data called for…" instruction `<p>` (`text-xs`).

### AncillaryExaminationsSection.tsx ("III. Result of Ancillary Examinations")
- (a) field-label/heading bumps: 4
  - ExamRow `label` span `text-xs` → `text-sm` (template, all A–I rows + Psychological Test row label uses the same ExamRow? no — see below)
  - "X-ray No.:" `<label>` `text-xs` → `text-sm`
  - "J. Blood Type:" span `text-xs` → `text-sm`
  - "Psychological Test:" span `text-xs` → `text-sm`
  - "Additional Test (Specify):…" `<label>` (italic) `text-xs` → `text-sm`
    (counted: ExamRow template + X-ray + J.Blood Type + Psychological Test +
    Additional Test = 5 distinct edits)
- (b) radio option-word bumps: 0 — see cross-component note below.
- LEFT UNCHANGED: "Check appropriate box" helper `<p>` (`text-xs`), X-ray No.
  `<Input>` (`text-xs`), the `<Textarea>` (`text-sm`), and all `<FormSelect>` controls.

### ResultsSection.tsx
- (a) field-label bumps: 1 (row `{label}:` span `text-xs` → `text-sm`, template ×3 rows)
- (b) radio option-word bumps: 1 (PASSED / WITH SIGNIFICANT FINDINGS option span
  `text-xs` → `text-sm`, template ×2 options × 3 rows — local inline span)

### Files that render but needed NO edit
- PersonalInfoSection.tsx — thin wrapper around the shared common
  `personal-info-section.tsx`, whose `labelClasses` is ALREADY `text-sm`
  (bumped during the Seabase change). Nothing to do.
- RemarksSection.tsx — the "IV. Remarks/Restriction:" label is already `text-sm`;
  the only `text-xs` is the `<Input>` control. No change.
- RecommendationSection.tsx — "V. Recommendation:" heading already `text-sm`;
  the certification fields render through the shared `CertificationDetailsFields`
  (uses `FormField` / `text-[11px]` personnel labels) which is shared across
  Medical/MLC/Landbase — intentionally not edited (same discipline as the Seabase
  decision to leave the broadly-shared form-field alone).

## Shared-constant / cross-component handling
- `RADIO_OPTION_LABEL_CLASS` (`src/lib/form-styles.ts`) carries ONLY layout
  classes (flex/gap/padding/rounding/hover) and NO font-size — identical to
  Seabase. All option-word sizes live on local inline spans, so every bumped
  option word (PastMedicalHistory YES/NO, PhysicalExamination ChoiceGroup +
  color-vision, Results PASSED/…): was changed on its LOCAL inline span. The
  shared constant was NOT edited → NO cross-page side effect.
- AncillaryExaminationsSection renders its result/reactive/psychological option
  words through the SHARED common `RadioGroup` component
  (`src/components/common/radio-group.tsx`), which sets option-word size on its
  OWN internal `<span className="text-xs …">`. That component is used by many
  other pages (profile, visit, panama, etc.), so bumping it would be a cross-page
  side effect. Per the precision rules (prefer local overrides; only edit a shared
  constant/component if unavoidable), the shared RadioGroup was LEFT UNCHANGED and
  the Ancillary A–I RadioGroup option words remain `text-xs`. Their row LABELS
  (A. Chest x-ray:, etc.) were still enlarged. This is an accepted limitation to
  avoid an unintended cross-page change.
- No cross-page side effects were introduced by this task.

## Confirmation — inputs / helper paragraphs / unit sub-captions unchanged
Re-grep of the edited files confirms every remaining `text-xs` / `text-[11px]` is
on one of: an `<Input>`/`<Textarea>`/`<FormSelect>` control, a helper/instruction
paragraph ("Check appropriate box", "Enter the data called for…", the Q8 "If yes,
please list the medication(s)…" instruction), a tiny unit sub-caption (AcuityPair
OD/OS, AD:/AS:), or the Questionnaire Yes/No column mini-headers (left per Seabase
precedent). No primary field label, section/column heading, group heading, or
visible radio/checkbox option word (except the shared-RadioGroup Ancillary options
noted above) remains at the smaller size.

## Commands run (from c:\Centerport\10112026\centerport-web\frontend)
- type-check: `node .\node_modules\typescript\bin\tsc --noEmit` → PASS,
  real exit code captured to `tc-exit.txt` = `TC_EXIT=0`, no diagnostics.
- lint: `node .\node_modules\eslint\bin\eslint.js <5 edited files>` → PASS,
  real exit code captured to `lint-exit.txt` = `LINT_EXIT=0`, zero output
  (no errors/warnings in the edited files).

Note: `npm run …` / `npx` are blocked by this machine's PowerShell execution
policy (same as the Seabase run), so the underlying binaries were invoked
directly via `node`. The PowerShell host prints a cosmetic `Exit Code: -1` for
every command regardless of result; the real exit codes were captured to the
files above.
