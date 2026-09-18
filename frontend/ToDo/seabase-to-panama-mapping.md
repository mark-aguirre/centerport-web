# Seabase to Panama Medical Data Mapping

## Purpose

This document defines the proposed mapping of medical data from **Seabase** to the corresponding sections in **Panama**. It covers:

1. Past Medical History to Examinee's Personal Declaration
2. Seabase Additional Questions to Panama Additional Questions
3. Physical Examination to Medical Examination

## General Import Rules

| Mapping type | Import behavior |
|---|---|
| Exact | Copy the source answer or value directly. |
| Transformed | Convert the source value to the Panama representation using the documented rule. |
| Partial | Import only when the source meaning safely supports the Panama answer; preserve source details for review. |
| One-to-many | Populate every applicable Panama destination and preserve the original Seabase description. |
| Many-to-one | Set the Panama destination to **Yes** when any mapped Seabase source is **Yes**. |
| No equivalent | Leave the Panama field blank or mark it as requiring manual review. Do not assume **No**, **Normal**, **Adequate**, or another clinical result. |
| Seabase-only data | Preserve the source value in a structured migration note, details field, or examiner comments. |

> **Safety rule:** Missing source data is not the same as a negative or normal result. The import must not generate clinical findings that were not recorded in Seabase.

---

# 1. Past Medical History to Examinee's Personal Declaration

## 1.1 Proposed Field Mapping

| Seabase Past Medical History | Panama No. | Panama condition | Mapping type | Transformation or handling |
|---|---:|---|---|---|
| High Blood Pressure | 1 | High blood pressure | Exact | Copy Yes/No. |
| Trachoma, other eye Disorders | 2 | Eye/vision problem | Partial | Copy **Yes** when Seabase is Yes. Preserve the specific eye condition in the details field. A Seabase No only addresses this source category and may not exclude all Panama eye or vision problems. |
| Deafness, other Ear Disorders | 3 | Ear (hearing/tinnitus) | Partial | Copy **Yes** when Seabase is Yes and preserve details. Do not interpret a source No as excluding every hearing or tinnitus condition unless requirements approve that behavior. |
| No direct source | 4 | Heart surgery | None | Leave blank and require manual entry. An operation entry may be reviewed, but must not automatically be classified as heart surgery without supporting details. |
| No direct source | 5 | Varicose veins | None | Leave blank and require manual entry. |
| No direct source | 6 | Hemorrhoids | None | Leave blank and require manual entry. |
| Nose or Throat Disorders | 7 | Nose problems | One-to-many, partial | If Seabase is Yes, set Panama No. 7 to Yes and preserve the original source description. |
| Nose or Throat Disorders | 8 | Throat problems | One-to-many, partial | If Seabase is Yes, set Panama No. 8 to Yes and preserve the original source description. Because Seabase combines nose and throat, both Panama fields require review unless separate source details identify the affected area. |
| Asthma | 9 | Asthma/bronchitis | Partial | Copy Yes/No for asthma. Preserve that the source specifically records asthma rather than bronchitis. |
| Blood Disorders | 10 | Blood disorders | Exact | Copy Yes/No. |
| Diabetes Mellitus | 11 | Diabetes | Exact | Copy Yes/No. |
| Other Endocrine Disorders (e.g. Goiter) | 12 | Thyroid problems | Partial | Set Panama to Yes only when the source detail identifies goiter or another thyroid condition. Other endocrine conditions must be preserved in details and manually reviewed. |
| Stomach Pain, Gastritis or Ulcer | 13 | Digestive disorders | Many-to-one, partial | Set Panama to Yes when source is Yes; preserve the specific condition. |
| Other Abdominal Disorders | 13 | Digestive disorders | Many-to-one, partial | Set Panama to Yes when source is Yes; preserve the specific condition. Review whether the recorded abdominal disorder is digestive. |
| Kidney or Bladder Disorder | 14 | Kidney problems | Partial | Set Panama to Yes when source is Yes and preserve whether the source condition concerns the kidney or bladder. |
| No direct source | 15 | Skin problems | None | Leave blank and require manual entry. |
| Allergies (Specify) | 16 | Allergies | Exact/derived | Copy Yes/No and copy the allergy description into the details field. |
| Fainting Spells, Fits, Seizures or other Neurological Disorders | 17 | Epilepsy/seizures | Partial | Set to Yes when source details identify fits, epilepsy, or seizures. Do not classify unrelated neurologic disorders as epilepsy. |
| Insomnia or sleep disorders, Manias, Phobias | 18 | Sleep problem | Partial | Set to Yes when insomnia or a sleep disorder is recorded. Mania or phobia alone should map to psychiatric problems rather than sleep problems. |
| Genetic, Hereditary or familial Disorders | 19 | Sickle-cell disease (or a close family member) | Partial, conditional | Set to Yes only when details explicitly identify sickle-cell disease or a close family member with sickle-cell disease. Generic hereditary disorders are not equivalent. |
| No direct source | 20 | Hernias | None | Leave blank and require manual entry. An abdominal disorder must not automatically be classified as a hernia. |
| Sexually Transmitted Diseases | 21 | Genital disorders (or any sexually transmitted disease) | Partial | A source Yes supports a Panama Yes. Preserve the source detail. A source No does not necessarily exclude non-infectious genital disorders. |
| No direct source | 22 | Do you smoke? | None | Leave blank and require manual entry. |
| Operations (Specify) | 23 | Surgeries | Exact/derived | Copy Yes/No and copy the operation description into the details field. |
| Tuberculosis | 24 | Infectious diseases | Many-to-one | Set Panama to Yes when source is Yes; preserve **Tuberculosis** in details. |
| Tropical Diseases | 24 | Infectious diseases | Many-to-one, partial | Set Panama to Yes when the recorded tropical disease is infectious; preserve the exact condition for review. |
| Schistosomiasis | 24 | Infectious diseases | Many-to-one | Set Panama to Yes when source is Yes; preserve **Schistosomiasis** in details. |
| Frequent Dizziness | 25 | Dizziness/fainting | Partial | Copy Yes/No for dizziness and preserve the source description. |
| Fainting Spells, Fits, Seizures or other Neurological Disorders | 25 | Dizziness/fainting | Partial | Set to Yes when details identify fainting. Do not set for seizures or other neurologic disorders alone. |
| Fainting Spells, Fits, Seizures or other Neurological Disorders | 26 | Loss of consciousness | Partial, conditional | Set to Yes only when the source answer or details indicate loss of consciousness or fainting. |
| No direct source | 27 | Do you use alcohol? | None | Leave blank and require manual entry. |
| No direct source | 28 | Do you use drugs? | None | Leave blank and require manual entry. |
| Depression, other Mental Disorders | 29 | Psychiatric problems | Partial | Set to Yes when source is Yes and preserve the diagnosis or details. |
| Insomnia or sleep disorders, Manias, Phobias | 29 | Psychiatric problems | Partial | Set to Yes for mania, phobia, or another psychiatric condition. Insomnia alone should map to sleep problem. |
| Depression, other Mental Disorders | 30 | Depression | Partial, conditional | Set to Yes only when depression is recorded. Other mental disorders alone are not equivalent to depression. |
| No direct source | 31 | Loss of memory | None | Leave blank and require manual entry. |
| No direct source | 32 | Balance problems | None | Leave blank and require manual entry. Dizziness alone should not automatically be treated as a balance problem. |
| Frequent Headaches | 33 | Severe headaches | Partial | A source Yes indicates frequent headaches, but not necessarily severe headaches. Import as Yes only if business rules accept frequent as sufficient, otherwise flag for review. |
| Heart Disease/Heart Pain | 34 | Heart/vascular disease | Partial | Copy **Yes** and preserve whether the source records heart disease or heart pain. |
| Rheumatic Fever | 34 | Heart/vascular disease | Partial, conditional | Map only when medical details establish cardiac or vascular involvement; otherwise preserve in details for review. |
| No direct source | 35 | Restricted mobility | None | Leave blank and require manual entry. |
| Back Injury; Joint Pain/Arthritis/Rheumatism | 36 | Back problems | One-to-many, partial | Set to Yes when source details indicate a back injury or back problem. |
| Back Injury; Joint Pain/Arthritis/Rheumatism | 37 | Joint problems | One-to-many, partial | Set to Yes when source details indicate joint pain, arthritis, or rheumatism. If details do not distinguish the condition, flag both destinations for review. |
| No direct source | 38 | Amputation | None | Leave blank and require manual entry. |
| Head or Neck Injury | 39 | Fractures/dislocation | Partial, conditional | Map only if source details explicitly identify a fracture or dislocation. An injury alone is not equivalent. |
| Back Injury; Joint Pain/Arthritis/Rheumatism | 39 | Fractures/dislocation | Partial, conditional | Map only if details explicitly identify a fracture or dislocation. |
| No direct source | 40 | COVID-19 | None | Leave blank and require manual entry. |
| Last Menstrual Period | 41 | Pregnancy | Not equivalent | Do not derive pregnancy from the last menstrual period alone. Preserve the date in an appropriate reproductive-history field if Panama has one; otherwise retain it in migration notes for authorized clinical review. |
| Gynecological Disorder (For female) | 41 | Pregnancy | Not equivalent | Do not derive pregnancy from a gynecological disorder. Preserve the condition in details or comments. |
| Cancer or Tumor | N/A | No direct Panama condition | Seabase-only | Preserve in the Panama details or comments and flag for clinical review. |
| Other Lung Disorders | N/A | No direct Panama condition | Seabase-only | Preserve the exact disorder in details or comments. Do not classify as infectious disease without supporting details. |
| Rheumatic Fever | N/A | No exact Panama condition | Seabase-only/partial | Preserve in details. Use Panama No. 34 only when supporting information establishes heart or vascular relevance. |
| Head or Neck Injury | N/A | No exact Panama condition | Seabase-only/partial | Preserve in details. Use Panama No. 39 only for a documented fracture or dislocation. |
| Other Endocrine Disorders not involving the thyroid | N/A | No direct Panama condition | Seabase-only | Preserve the exact condition in details or comments. |
| Cancer or Tumor, Other Lung Disorders, non-thyroid Endocrine Disorders, and other unmatched conditions | N/A | If any above questions were answered “yes,” please give details / Comments | Fallback | Append a structured description so the information is not lost. |
| Others | N/A | Details / Comments | Fallback | Copy the complete free-text value. Do not overwrite existing comments. |

## 1.2 Conditions Without a Safe Seabase Equivalent

| Panama No. | Panama condition | Import handling |
|---:|---|---|
| 4 | Heart surgery | Leave blank; manual review. |
| 5 | Varicose veins | Leave blank; manual entry. |
| 6 | Hemorrhoids | Leave blank; manual entry. |
| 15 | Skin problems | Leave blank; manual entry. |
| 20 | Hernias | Leave blank; manual entry. |
| 22 | Do you smoke? | Leave blank; manual entry. |
| 27 | Do you use alcohol? | Leave blank; manual entry. |
| 28 | Do you use drugs? | Leave blank; manual entry. |
| 31 | Loss of memory | Leave blank; manual entry. |
| 32 | Balance problems | Leave blank; manual entry. |
| 35 | Restricted mobility | Leave blank; manual entry. |
| 38 | Amputation | Leave blank; manual entry. |
| 40 | COVID-19 | Leave blank; manual entry. |
| 41 | Pregnancy | Leave blank unless a separate, explicit pregnancy source exists. |

## 1.3 Suggested Details Format

When a mapped Panama answer is **Yes**, preserve the originating Seabase data in a details field using a structured format:

```text
Imported from Seabase Past Medical History:
- Source condition: <Seabase condition>
- Answer: Yes
- Source details: <specified details, if available>
- Mapping status: Exact / Partial / Requires review
```

---

# 2. Additional Questions Mapping

## 2.1 Question Mapping

| Seabase No. | Seabase question | Panama No. | Panama question | Mapping type | Import handling |
|---:|---|---:|---|---|---|
| 1 | Have you ever been signed off as sick or repatriated from a ship? | 37 | Have you ever been signed off due to illness or repatriated? | Near-exact | Copy Yes/No and copy the associated Seabase text detail, if present. |
| 2 | Have you ever been hospitalized? | 38 | Have you ever been hospitalized? | Exact | Copy Yes/No and associated detail. |
| 3 | Have you ever been declared unfit for sea duty? | 39 | Have you ever been declared unfit for sea duty? | Exact | Copy Yes/No and associated detail. |
| 4 | Has your medical certificate ever been restricted or revoked? | 40 | Has your medical certificate ever been restricted or revoked? | Exact | Copy Yes/No and associated detail. |
| 5 | Are you aware that you have any medical problem, disease or illness? | 41 | Do you have any disease or ailment that you have not been asked about and you consider important to mention? | Partial | A Seabase Yes may support Panama Yes, but the questions are not identical. Import as requiring review and preserve the source wording and details. A Seabase No should not automatically set Panama to No. |
| 6 | Do you feel healthy and fit to perform the duties of your designated position/occupation? | 42 | Do you feel healthy and fit to perform the duties of your designed position/occupation? | Near-exact | Copy Yes/No. The visible Panama wording uses **designed**; Seabase uses **designated**. This appears to be a label wording difference. |
| 7 | Are you allergic to any medication? | 43 | Are you allergic to any medications? | Exact | Copy Yes/No and preserve any allergy details. |
| N/A | No Seabase source shown | 44 | Are you allergic to any food or supplement alternative? | None | Leave blank and require manual entry. Do not default to No. |
| 8 | Are you taking any non-prescription or prescription medication? | 45 | Are you taking any non-prescription or prescription medications? | Exact | Copy Yes/No and map the medication list, purpose, and dosage. |

## 2.2 Free-Text Mapping

| Seabase field | Panama field | Mapping type | Import handling |
|---|---|---|---|
| Per-question text box for Seabase Questions 1 to 6 | Details and/or Comments | Derived | Append each non-empty response with its Seabase question number and question label. Do not merge values without labels. |
| Comments | Comments | Exact | Copy the complete value. If Panama already has comments, append rather than overwrite. |
| If yes, please list the medication(s) taken/being taken, and the purpose(s) and dosage(s) | If yes, please list the medications taken and the purpose(s) and dosage(s) | Near-exact | Copy complete text without truncating medication name, purpose, or dosage. |

## 2.3 Recommended Transformation Summary

| Source | Destination | Rule |
|---|---|---|
| Seabase Q1 | Panama Q37 | Direct Yes/No plus detail. |
| Seabase Q2 | Panama Q38 | Direct Yes/No plus detail. |
| Seabase Q3 | Panama Q39 | Direct Yes/No plus detail. |
| Seabase Q4 | Panama Q40 | Direct Yes/No plus detail. |
| Seabase Q5 | Panama Q41 | Partial mapping; preserve source and flag for review. Do not automatically import a source No as Panama No. |
| Seabase Q6 | Panama Q42 | Direct Yes/No. |
| Seabase Q7 | Panama Q43 | Direct Yes/No plus allergy detail. |
| No source | Panama Q44 | Leave blank; manual entry. |
| Seabase Q8 | Panama Q45 | Direct Yes/No plus medication detail. |
| Seabase Comments | Panama Comments | Copy or append without overwriting. |

---

# 3. Physical Examination to Medical Examination

## 3.1 Clinical Data

| Seabase Physical Examination | Panama Medical Examination | Mapping type | Unit/transformation | Import handling |
|---|---|---|---|---|
| Height (cm) | Height (CM) | Exact | Centimetres | Copy numeric value after validating the unit and permitted range. |
| Weight (kg) | Weight (KG) | Exact | Kilograms | Copy numeric value after validating the unit and permitted range. |
| BMI | Body Mass Index (BMI) | Exact/derived | kg/m² | Prefer the recorded Seabase BMI. If the target design calls for recalculation, retain both source BMI and calculated BMI for audit when they differ. |
| Pulse Rate (bpm) | Heart Rate (Minute) | Exact | Beats per minute | Copy numeric value. |
| Respiration | Respiratory Rate (Minute) | Exact | Breaths per minute | Copy numeric value. |
| Blood Pressure Systolic (mm Hg) | Blood Pressure Systolic (mmHg) | Exact | mmHg | Copy numeric value. |
| Blood Pressure Diastolic (mm Hg) | Diastolic (mmHg) | Exact | mmHg | Copy numeric value. |
| Body Temperature | No direct field visible | Seabase-only | Preserve source unit | Preserve in migration notes or an examiner remarks field. Do not discard the value. |
| Rhythm: Regular/other selection | No direct field visible | Seabase-only | Preserve label | Preserve in migration notes or examiner remarks. |
| No Seabase field visible | Oxygen Saturation (SpO2) | Panama-only | Percentage | Leave blank and require manual entry or another verified source. |

## 3.2 Use of Glasses or Contact Lenses

| Seabase source | Panama destination | Mapping type | Transformation |
|---|---|---|---|
| Spectacles selected | Use of glasses or contact lenses: Yes/No; specify type and purpose | Derived | Set the textual value to **Yes - Spectacles** and append the purpose only when a source purpose exists. |
| Contact Lenses selected | Use of glasses or contact lenses: Yes/No; specify type and purpose | Derived | Set the textual value to **Yes - Contact lenses** and append the purpose only when available. |
| Spectacles and Contact Lenses selected | Same Panama field | Derived | Set to **Yes - Spectacles and contact lenses**. |
| Neither selected, with explicit Seabase negative value | Same Panama field | Derived | Set to **No** only when the source explicitly records that no glasses or contact lenses are used. |
| No selection or missing source data | Same Panama field | Missing | Leave blank. Do not infer No. |

## 3.3 Visual Acuity Mapping

**Eye abbreviations:** OD = right eye; OS = left eye.

| Seabase vision field | Panama visual-acuity field | Mapping type | Import handling |
|---|---|---|---|
| Far Vision, Uncorrected, OD | Distant, Unaided, Right Eye | Exact | Copy the complete acuity notation as text. |
| Far Vision, Uncorrected, OS | Distant, Unaided, Left Eye | Exact | Copy the complete acuity notation as text. |
| No binocular far-vision field visible | Distant, Unaided, Binocular | None | Leave blank unless another verified source provides a binocular result. Do not calculate from right and left eye values. |
| Far Vision, Corrected, OD | Distant, Aided, Right Eye | Exact | Copy the complete acuity notation as text. |
| Far Vision, Corrected, OS | Distant, Aided, Left Eye | Exact | Copy the complete acuity notation as text. |
| Near Vision, Uncorrected, OD | Short distance, Unaided, Right Eye | Exact | Copy the complete near-vision notation as text. |
| Near Vision, Uncorrected, OS | Short distance, Unaided, Left Eye | Exact | Copy the complete near-vision notation as text. |
| Near Vision, Corrected, OD | Short distance, Aided, Right Eye | Exact | Copy the complete near-vision notation as text. |
| Near Vision, Corrected, OS | Short distance, Aided, Left Eye | Exact | Copy the complete near-vision notation as text. |
| Visual Acuity = Adequate/Inadequate | No exact result field visible beyond acuity values | Seabase-only/summary | Preserve as a summary note if needed. Do not replace the detailed Panama acuity values with the summary. |

## 3.4 Visual Fields

| Seabase source | Panama destination | Mapping type | Import handling |
|---|---|---|---|
| No right-eye visual-field result visible | Visual Fields, Right eye, Normal/Defective | None | Leave both options unselected and require manual entry or another verified source. |
| No left-eye visual-field result visible | Visual Fields, Left eye, Normal/Defective | None | Leave both options unselected and require manual entry or another verified source. |

> Do not default the Panama visual fields to **Normal** merely because Seabase visual acuity is marked **Adequate**. Visual acuity and visual-field assessment are different recorded findings.

## 3.5 Color Vision

| Seabase value/field | Panama destination | Mapping type | Transformation or handling |
|---|---|---|---|
| Adequate | Color Vision = Normal | Transformed | Convert **Adequate** to **Normal** if approved as equivalent by the business or clinical owner. |
| Defective | Color Vision = Defective | Exact | Convert to **Defective**. |
| Missing/not performed | Color Vision = Not tested | Conditional | Use **Not tested** only when the source explicitly indicates the test was not performed; otherwise leave blank. |
| No source value visible | Color Vision = Doubtful | None | Do not populate automatically. |
| Color Vision Date Taken | No dedicated date field visible in the shown Panama section | Seabase-only | Preserve in notes or an available test-date field elsewhere in Panama. |
| No color-test method visible | Method: (Plates) Pseudo-Isochromatic Ishihara 24 or 38 plates equivalent | Panama-only | Leave blank unless another verified source records the method. Do not infer Ishihara from the color result alone. |
| Panama Color Vision selection = Yes in the Seabase standards area | Panama Color Vision status | Ambiguous | Confirm the semantic meaning of the Seabase **Yes** value before using it; the visible Seabase form also has a separate Adequate/Defective result. Prefer the explicit Adequate/Defective result. |

## 3.6 Audiometry and Hearing

### Seabase Summary Hearing Fields

| Seabase field | Visible Seabase values | Possible Panama handling | Mapping type |
|---|---|---|---|
| AD / Right | Adequate or Inadequate | Preserve as a right-ear hearing summary or examiner note. | Summary only |
| AS / Left | Adequate or Inadequate | Preserve as a left-ear hearing summary or examiner note. | Summary only |
| Satisfactory Hearing | Yes/No | Preserve as a standards-assessment note if the Panama model contains a suitable field outside the shown table. | Summary only |
| Unaided Hearing Satisfactory | Yes/No | Preserve as an unaided-hearing note if a suitable Panama field exists. | Summary only |
| Speech | Adequate/Inadequate | Preserve in remarks; no direct speech field is visible in the Panama screenshot. | Seabase-only |

### Panama Pure-Tone Audiometry Fields

| Panama frequency | Right ear source | Left ear source | Import handling |
|---:|---|---|---|
| 500 Hz | No numerical threshold visible in Seabase | No numerical threshold visible in Seabase | Leave blank; populate only from a verified audiometry result. |
| 1000 Hz | No numerical threshold visible in Seabase | No numerical threshold visible in Seabase | Leave blank; populate only from a verified audiometry result. |
| 2000 Hz | No numerical threshold visible in Seabase | No numerical threshold visible in Seabase | Leave blank; populate only from a verified audiometry result. |
| 3000 Hz | No numerical threshold visible in Seabase | No numerical threshold visible in Seabase | Leave blank; populate only from a verified audiometry result. |
| 4000 Hz | No numerical threshold visible in Seabase | No numerical threshold visible in Seabase | Leave blank; populate only from a verified audiometry result. |
| 6000 Hz | No numerical threshold visible in Seabase | No numerical threshold visible in Seabase | Leave blank; populate only from a verified audiometry result. |
| 8000 Hz | No numerical threshold visible in Seabase | No numerical threshold visible in Seabase | Leave blank; populate only from a verified audiometry result. |

> The Seabase Adequate/Inadequate hearing summaries must not be converted into numerical dB thresholds.

## 3.7 Other Seabase Physical-Examination Findings

| Seabase field | Panama equivalent visible in screenshot | Import handling |
|---|---|---|
| Is applicant suffering from any medical condition likely to be aggravated by service at sea, render the seafarer unfit, or endanger others on board? | No direct field visible | Preserve the complete Yes/No result in examiner remarks or a structured migration note. |
| Confirmation that identification documents were checked at the point of examination | No direct field visible | Preserve in an identity-verification or administrative field if Panama provides one elsewhere; otherwise retain in migration notes. |
| Fit for look-out duties | No direct field visible | Preserve in the fitness/medical examiner determination area if Panama provides one elsewhere; otherwise retain in migration notes. |

---

# 4. Consolidated Import Matrix

| Area | Auto-import | Transform before import | Manual or alternate source required | Preserve in comments/notes |
|---|---|---|---|---|
| Past medical history | Exact or explicitly supported Yes/No conditions | One-to-many and many-to-one mappings; condition-specific validation | Panama-only questions and non-equivalent conditions | Original source condition, details, and partial mappings |
| Additional questions | Q1 to Q4, Q6 to Q8 where meanings align | Q5 to Q41 requires review | Panama Q44 | Per-question details and existing comments |
| Clinical data | Height, weight, BMI, pulse, respiration, systolic and diastolic BP | Unit and numeric validation | SpO2 | Temperature and rhythm if no target field exists |
| Vision | Individual far/near OD and OS values | Adequate to Normal for color vision, subject to approval | Binocular acuity, visual fields, color-test method | Date taken and summary assessments when no target exists |
| Hearing | None of the numerical frequency thresholds from the shown Seabase section | None; do not derive dB thresholds | All right/left thresholds from 500 to 8000 Hz | AD/AS adequacy, satisfactory hearing, unaided hearing, and speech |
| Administrative fitness findings | None from fields shown | None | Target must be located elsewhere in Panama | Identity check, look-out fitness, and service-at-sea risk answer |

---

# 5. Conflict and Merge Rules

| Scenario | Required behavior |
|---|---|
| Panama field is blank and mapping is exact | Import the Seabase value. |
| Panama already contains a user-entered value | Do not silently overwrite. Retain both values and flag the conflict for review. |
| Multiple Seabase Yes answers map to one Panama condition | Set the Panama condition to Yes and append every contributing source condition to details. |
| One combined Seabase condition maps to multiple Panama conditions | Populate only the destinations explicitly supported by source details. If details are unavailable, flag the destinations for review. |
| Seabase answer is missing | Leave the Panama answer blank. |
| Seabase answer is No but the source question is narrower than Panama | Do not automatically set Panama to No. Mark the mapping as partial or unresolved. |
| Source and target use different terms | Preserve the original source label and document the transformation. |
| A free-text source contains more detail than the Panama Boolean field | Import the Boolean when safe and append the original text to the details or comments field. |
| Existing Panama comments are present | Append imported content with a source label; never replace existing comments. |

---

# 6. Recommended Audit Metadata

| Metadata field | Example value |
|---|---|
| Source system | Seabase |
| Source section | Past Medical History / Additional Questions / Physical Examination |
| Source field | High Blood Pressure |
| Source value | Yes |
| Destination system | Panama |
| Destination section | Examinee's Personal Declaration |
| Destination field | 1. High blood pressure |
| Mapping type | Exact |
| Import status | Imported / Requires review / Not mapped |
| Original details | Source free text copied without alteration |
| Imported timestamp | System-generated timestamp |
| Imported by | Migration process or authenticated user identifier |

---

# 7. Validation Checklist

| Check | Expected result |
|---|---|
| All exact mappings copied correctly | Source and target values match. |
| Panama-only fields handled safely | Missing values remain blank and are not defaulted to No or Normal. |
| Partial mappings reviewed | Target answer is populated only when source meaning supports it. |
| One-to-many mappings validated | Combined Seabase questions do not create unsupported Panama findings. |
| Details preserved | Specific conditions, operations, allergies, and medication information remain available. |
| Existing Panama data protected | User-entered data is not silently overwritten. |
| Units validated | Height, weight, BP, heart rate, respiratory rate, and BMI use the expected units. |
| Visual acuity copied as text | Formats such as fractions or J notation are not reformatted destructively. |
| Audiometry thresholds not fabricated | Frequency-specific dB fields remain blank unless a verified result is available. |
| Clinical review flags generated | Ambiguous, partial, conflicting, and unmapped values are visible for review. |

---

# 8. Key Decisions Requiring Business or Clinical Approval

| Decision | Reason |
|---|---|
| Whether Seabase Frequent Headaches can automatically set Panama Severe Headaches to Yes | Frequency and severity are not identical. |
| Whether Seabase Adequate color vision is formally equivalent to Panama Normal | Labels differ even though the intended result may align. |
| Whether a No from a narrower Seabase condition can set a broader Panama condition to No | A narrow source question may not exclude all conditions covered by the broader target. |
| How combined Nose or Throat Disorders should populate separate Panama nose and throat questions | The Seabase Boolean does not identify which area applies without details. |
| How generic neurological disorders should affect epilepsy/seizures, dizziness/fainting, and loss of consciousness | The combined source field contains multiple distinct clinical concepts. |
| Where Seabase-only findings should be stored in Panama | The screenshots do not show a dedicated target for every source field. |
| Whether source BMI should be copied or recalculated | Recalculation may expose rounding or source-data differences. |

