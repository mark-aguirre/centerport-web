# Seabase label-size bump (follow-up) — code verification

## Scope decision
The user asked to enlarge the field labels under "I. Past Medical History",
"II. Physical Examination", "Audiometry & Speech", "Physical Examination
Findings", "III. Result of Ancillary Examinations", and all radio-button option
words — to match the Panama page. In the four physical-exam sub-sections the
primary field/condition labels are `text-[11px]` (not `text-xs`). The parent
session confirmed option (A): enlarge those labels to `text-sm` even where they
are `text-[11px]`, since the "do not touch text-[11px]" guard was meant only for
tiny sub-captions/units, not the named field/condition labels. Panama's
equivalent row labels/options are `text-sm`.

## Files changed (medical sub-sections composed by PhysicalExaminationSection)

### PastMedicalHistoryGrid.tsx ("I. Past Medical History")
- Condition label span: `text-[11px]` -> `text-sm` (1 label template, renders all conditions).
- YES/NO radio option words span: `text-[11px]` -> `text-sm` (1 template, 2 options/row).
- "Others" field label: `text-[11px]` -> `text-sm` (1 label).
- LEFT UNCHANGED: detail `<Input>` (`text-xs`), "Others" `<Input>` (`text-xs`),
  and the "Has applicant suffered... Check the appropriate box." helper `<p>` (`text-xs`).

### VitalsSection.tsx ("II. Physical Examination")
- `InlineVitalField` label span: `text-[11px]` -> `text-sm` (1 template; Height/Weight/BP x2/Pulse/Respiration/BMI).
- "Rhythm:" label span: `text-[11px]` -> `text-sm` (1 label).
- "Body Temperature:" label span: `text-[11px]` -> `text-sm` (1 label).
- LEFT UNCHANGED: all `<Input>`/`<FormSelect>` controls (`text-xs`) and the
  "Enter the data called for. Check the appropriate box..." helper `<p>` (`text-xs`).

### AudiometrySpeechSection.tsx ("Audiometry & Speech")
- "Right:/Left:" hearing-group caption span: `text-[11px]` -> `text-sm` (1 template, 2 renders).
- "Adequate/Inadequate" hearing option words span: `text-xs` -> `text-sm` (1 template).
- Speech "Adequate/Inadequate" option words span: `text-xs` -> `text-sm` (1 template).
- "Hearing by Audio Metry" caption: `text-[11px]` -> `text-sm` (1).
- "Meets Standards in STCW Code, Section A-I/9:" caption: `text-[11px]` -> `text-sm` (1).
- "Satisfactory Hearing" caption: `text-[11px]` -> `text-sm` (1).
- "Unaided Hearing Satisfactory" caption: `text-[11px]` -> `text-sm` (1).
- LEFT UNCHANGED: `AD:`/`AS:` tiny unit sub-captions (`text-[11px]`, 2),
  `<FormSelect>` controls, and the already-`text-sm` bottom medical-condition question.

### FindingsGrid.tsx ("Physical Examination Findings")
- A/B/C column heading `<h3>`: `text-[11px]` -> `text-sm` (1 template, 3 columns).
- "Findings" column heading span: `text-[11px]` -> `text-sm` (1 template, 3 columns).
- Body-system `item.label` span: `text-[11px]` -> `text-sm` (1 template, 20 items).
- LEFT UNCHANGED: per-item remarks `<Input>` (`text-xs`).

### AncillaryExamsSection.tsx ("III. Result of Ancillary Examinations")
- Row labels were ALREADY `text-sm` (no change needed).
- `ResultRow` option words span (normal/with findings, Reactive/Non Reactive):
  `text-xs` -> `text-sm` (1 template).
- Psychological Test option words span (Recommended/.../Not Done):
  `text-xs` -> `text-sm` (1 template).
- LEFT UNCHANGED: "Check appropriate box" helper `<p>` (`text-xs`), X-ray No. `<Input>`
  (`text-xs`), and the already-`text-sm` row labels / Additional Test label / Textarea.

## RADIO_OPTION_LABEL_CLASS handling
`RADIO_OPTION_LABEL_CLASS` (defined in `src/lib/form-styles.ts`, re-exported from
`src/components/panama/constants.ts`) carries ONLY layout classes (flex, gap,
padding, rounding, hover) — it has NO font-size. All radio/checkbox option-word
sizes are set by the inline `<span>` next to each input. Therefore every option
word was bumped via its local inline span. The shared constant was NOT edited.
**No cross-page side effect: Panama and other modules are unaffected.**

## Precision confirmation (grep after edits)
Remaining `text-xs` / `text-[11px]` in the five files are exactly the intended
exclusions: helper paragraphs ("Check the appropriate box", "Enter the data
called for...", "Has applicant suffered..."), `<Input>`/`<Textarea>` controls,
and the `AD:`/`AS:` unit sub-captions. No field label or option word remains at
the smaller sizes.

## Commands run (from `c:\Centerport\10112026\centerport-web\frontend`)
- `npm run type-check`  ->  `tsc --noEmit`  ->  PASS (exit 0, no diagnostics).
- `npm run lint`        ->  `eslint`        ->  PASS (no errors/warnings output).

Note: the PowerShell host wrapper reports a cosmetic `Exit Code: -1` for every
command regardless of real result; the type-check real exit code was captured to
file as `TC_EXIT=0`, and eslint produced zero output (a clean run). Only the five
files above were edited; all are clean.
