"""seabase.csv -> public.medical_exams.

The widest mapping in the set. Legacy prefixes:
  ``mh_``  past medical history        -> medical_history JSONB
  ``mh2_`` questionnaire columns 1-8   -> questionnaire JSONB
  ``pe_``  physical examination        -> vitals, vision, audiometry columns
  ``ot_``  per-system findings + notes -> findings_a/b/c + findings_*_remarks
  ``an_``  ancillary examinations      -> ancillary_* columns
  ``rm_``  result master               -> certification and fitness columns

Two legacy quirks are carried deliberately, both documented at their mapping:
``pe_CONVERSATIONAL_AD`` holds the body temperature, and ``an_remarks`` holds
the chest x-ray number.

The ``skin`` / ``heent`` / ``chest_lungs`` / ... system columns are left NULL
on purpose: the findings A/B/C grid superseded them and no current form writes
or reads them.
"""

from __future__ import annotations

from typing import Any, Mapping

from common import (
    EXAM_RESULT,
    REACTIVE_SNAKE,
    ModuleSpec,
    RowContext,
    age_from_birthdate,
    blood_type,
    clean,
    iso_date,
    jsonb,
    mapped,
    number_like,
    text,
    title_case_name,
    yes_no,
)

from . import _shared_history as history

#: findings_a/b/c keys, byte-for-byte as the FindingsGrid declares them,
#: paired with the legacy "no finding" flag and the legacy note column.
FINDINGS = {
    "findings_a": [
        ("Skin", "ot_SKIN_TAG", "ot_SKIN"),
        ("Head, Scalp", "ot_HEAD_NECK_SCALP_TAG", "ot_HEAD_NECK_SCALP"),
        ("Eyes External", "ot_EYES_TAG", "ot_EYES"),
        ("Pupils", "ot_PUPILS_TAG", "ot_PUPILS"),
        ("Ears", "ot_EARS_EARDRUM_TAG", "ot_EARS_EARDRUM"),
        ("Nose, Sinuses", "ot_NOSE_SINUSES_TAG", "ot_NOSE_SINUSES"),
        ("Mouth, Throat", "ot_MOUTH_THROAT_TAG", "ot_MOUTH_THROAT"),
    ],
    "findings_b": [
        ("Neck, Lymph Nodes", "ot_NECK_LN_THYROID_TAG", "ot_NECK_LN_THYROID"),
        ("Thyroid", "ot_NECK_LN_THYROID_TAG", None),
        ("Breast, Axilla", "ot_CHEST_BREAST_AXILLA_TAG", "ot_CHEST_BREAST_AXILLA"),
        ("Chest and Lungs", "ot_LUNGS_TAG", "ot_LUNGS"),
        ("Heart", "ot_HEART_TAG", "ot_HEART"),
        ("Abdomen", "ot_ABDOMEN_TAG", "ot_ABDOMEN"),
        ("Back", "ot_BACK_FLANK_TAG", "ot_BACK_FLANK"),
    ],
    "findings_c": [
        ("Anus, Rectum", "ot_ANUS_RECTUM_TAG", "ot_ANUS_RECTUM"),
        ("Genito-Urinary System", "ot_GU_SYSTEM_TAG", "ot_GU_SYSTEM"),
        ("Inguinals, genitalia", "ot_INGUINALS_GENITALS_TAG", "ot_INGUINALS_GENITALS"),
        ("Extremities", "ot_EXTREMITIES_TAG", "ot_EXTREMITIES"),
        ("Reflexes", "ot_REFLEXES_TAG", "ot_REFLEXES"),
        ("Dental (Teeth/gums)", "ot_DENTAL_TAG", "ot_DENTAL"),
    ],
}

PSYCH_EXAM = {
    "recommend": "recommended",
    "recommended": "recommended",
    "rec": "recommended",
    "nr": "not_recommended",
    "not recommended": "not_recommended",
    "nd": "not_done",
    "not done": "not_done",
    "rwr": "rec_with_reservation",
    "reserve": "rec_with_reservation",
    "rec. w/reservation": "rec_with_reservation",
}

PREGNANCY = {"negative": "Negative", "positive": "Positive", "n/a": "N/A"}

ADEQUACY = {"a": "adequate", "adequate": "adequate", "i": "inadequate", "inadequate": "inadequate"}

#: medical_exams.final_recommendation offers exactly these four options, and
#: they are spelled differently from the landbase enum ("FIT WITH RESTRICTION"
#: here versus "FIT w/ RESTRICTION" there). The legacy seabase export uses the
#: same four values, so this is a one-to-one mapping.
RECOMMENDATION = {
    "fit for sea duty": "FIT FOR SEA DUTY",
    "fit with restriction": "FIT WITH RESTRICTION",
    "fit w/ restriction": "FIT WITH RESTRICTION",
    "unfit": "UNFIT",
    "fit to work": "FIT TO WORK",
}

#: cert_basic_ooh / cert_additional_labs / cert_flagpost are pass-status
#: columns, not exam-result columns; legacy records them as Y/N.
PASS_STATUS = {
    "y": "passed",
    "passed": "passed",
    "normal": "passed",
    "n": "with_significant_findings",
    "with_f": "with_significant_findings",
    "with significant findings": "with_significant_findings",
}


def _findings(src: Mapping[str, str]) -> dict[str, dict[str, Any]]:
    """Builds the three findings maps and their three remarks maps.

    In the legacy data the ``ot_*_TAG`` flag is 1 on ~99.8% of rows and the
    free-text note is usually an incidental observation (a tattoo, spectacles)
    rather than an abnormality, which is why 1 means *normal*. The grid uses
    the same polarity: a checked box is a normal finding.
    """
    built: dict[str, dict[str, Any]] = {}
    for column, items in FINDINGS.items():
        values: dict[str, bool] = {}
        remarks: dict[str, str] = {}
        for key, tag_column, note_column in items:
            flag = yes_no(src.get(tag_column))
            if flag is not None:
                values[key] = flag == "yes"
            if note_column:
                note = clean(src.get(note_column))
                if note is not None:
                    remarks[key] = note
        built[column] = values
        built[f"{column}_remarks"] = remarks
    return built


def build_row(src: Mapping[str, str], ctx: RowContext) -> dict[str, Any]:
    exam_date = iso_date(
        src.get("rm_result_date") or src.get("rm_result_date_normalized")
    )
    systolic = number_like(src.get("pe_BP"))
    diastolic = number_like(src.get("pe_BP_DIASTOLIC"))

    if clean(src.get("mh_operations_tag")):
        # The operations answer already comes from mh_operations; the separate
        # legacy tag column carries no additional information.
        ctx.drop("mh_operations_tag (duplicate of mh_operations)")

    row: dict[str, Any] = {
        # Patient snapshot
        "date_of_birth": iso_date(src.get("pat_birthdate")),
        "age": age_from_birthdate(src.get("pat_birthdate"), exam_date),
        # Vital signs
        "pe_height": number_like(src.get("pe_HEIGHT")),
        "pe_weight": number_like(src.get("pe_WEIGHT")),
        "pe_bmi": number_like(src.get("pe_BODY_BUILD")),
        "pe_pulse_rate": number_like(src.get("pe_PULSE")),
        "pe_respiration": number_like(src.get("pe_RESPIRATION")),
        "pe_bp_systolic": systolic,
        "pe_bp_diastolic": diastolic,
        # Legacy reused the "conversational hearing" column for temperature,
        # e.g. "36.8 °C"; the numeric part is what the vitals field expects.
        "pe_body_temperature": number_like(
            (src.get("pe_CONVERSATIONAL_AD") or "").replace("\u00b0C", "").replace("C", "")
        ),
        "pe_rhythm": mapped(
            src.get("pe_RHYTHM"),
            {"regular": "Regular", "irregular": "Irregular"},
            unmapped=ctx.unmapped,
            label="pe_rhythm",
        ),
        "blood_pressure": f"{systolic}/{diastolic}" if systolic and diastolic else None,
        # Vision
        "vision_uncorrected_far_od": text(src.get("pe_FAR_OD_U"), 50),
        "vision_uncorrected_far_os": text(src.get("pe_FAR_OS_U"), 50),
        "vision_corrected_far_od": text(src.get("pe_FAR_OD_C"), 50),
        "vision_corrected_far_os": text(src.get("pe_FAR_OS_C"), 50),
        "vision_uncorrected_near_od": text(src.get("pe_NEAR_ODJ_U"), 50),
        "vision_uncorrected_near_os": text(src.get("pe_NEAR_OSJ_U"), 50),
        "vision_corrected_near_od": text(src.get("pe_NEAR_ODJ_C"), 50),
        "vision_corrected_near_os": text(src.get("pe_NEAR_OSJ_C"), 50),
        "color_vision": "normal"
        if yes_no(src.get("pe_ISHIHARA_C")) == "yes"
        else ("abnormal" if yes_no(src.get("pe_ISHIHARA_C")) == "no" else None),
        "vision_meets_stcw": yes_no(src.get("pe_SATISFACTORY_SIGHT_UNAID")),
        "vision_contact_lenses": mapped(
            src.get("pe_VISUAL_AIDS_WORN"),
            {"spectacles": "spectacles", "contactlens": "contact_lens"},
            unmapped=ctx.unmapped,
            label="vision_contact_lenses",
        ),
        "vision_date_taken": iso_date(src.get("pe_COLOR_VISION_DATE_TAKEN")),
        # Audiometry and speech
        "audio_hearing_by": text(src.get("pe_HEARING_AD"), 255),
        "audio_satisfactory": yes_no(src.get("pe_SATISFACTORY_HEARING")),
        "audio_unaided_hearing": yes_no(src.get("pe_UNAIDED_HEARING_SATISFACTORY")),
        "speech_impaired_hearing": mapped(
            src.get("pe_CLARITY_OF_SPEECH"),
            ADEQUACY,
            unmapped=ctx.unmapped,
            label="speech_clarity",
        ),
        # Condition questions
        "identification_docs_checked": yes_no(src.get("pe_IDENTITY_CONFIRMED")),
        "fit_for_lookout": yes_no(src.get("pe_FIT_FOR_LOOKOUT")),
        # Past medical history
        "medical_history": jsonb(history.build_medical_history(src)),
        "medical_history_others": clean(src.get("mh_others")),
        "consulted_doctor_past": yes_no(src.get("mh_consulted")),
        "maintenance_medications": clean(src.get("mh_maintenance_meds"))
        or clean(src.get("mh_consulted_specify")),
        # Questionnaire
        "questionnaire": jsonb(history.build_questionnaire(src)),
        "questionnaire_comments": clean(src.get("mh2_column7_comment")),
        "questionnaire_medications_detail": clean(src.get("mh2_column8_comment")),
        # Ancillary examinations. Legacy an_remarks holds the chest x-ray
        # reference number, matching rm_reference_no on the xray export.
        "xray_no": text(src.get("an_remarks"), 255),
        "ancillary_chest_xray": mapped(
            src.get("an_cxr"), EXAM_RESULT, unmapped=ctx.unmapped, label="an_cxr"
        ),
        "ancillary_ecg": mapped(
            src.get("an_ecg"), EXAM_RESULT, unmapped=ctx.unmapped, label="an_ecg"
        ),
        "ancillary_cbc": mapped(
            src.get("an_cbc"), EXAM_RESULT, unmapped=ctx.unmapped, label="an_cbc"
        ),
        "ancillary_urinalysis": mapped(
            src.get("an_urinalysis"), EXAM_RESULT, unmapped=ctx.unmapped, label="an_urinalysis"
        ),
        "ancillary_stool_exam": mapped(
            src.get("an_stool_exam"), EXAM_RESULT, unmapped=ctx.unmapped, label="an_stool_exam"
        ),
        "ancillary_hbsag": mapped(
            src.get("an_hbsag"), REACTIVE_SNAKE, unmapped=ctx.unmapped, label="an_hbsag"
        ),
        "ancillary_hiv_aids": mapped(
            src.get("an_hiv"), REACTIVE_SNAKE, unmapped=ctx.unmapped, label="an_hiv"
        ),
        "ancillary_rpr": mapped(
            src.get("an_rpr"), REACTIVE_SNAKE, unmapped=ctx.unmapped, label="an_rpr"
        ),
        "ancillary_pregnancy_test": mapped(
            src.get("an_pregnancy_test"), PREGNANCY, unmapped=ctx.unmapped, label="an_pregnancy_test"
        ),
        "ancillary_blood_type": blood_type(
            src.get("an_blood_type"), ctx.unmapped, "an_blood_type"
        ),
        "ancillary_psychological_test": mapped(
            src.get("an_psychological_exam"),
            PSYCH_EXAM,
            unmapped=ctx.unmapped,
            label="an_psychological_exam",
        ),
        "ancillary_additional_tests": "\n".join(
            part
            for part in (
                clean(src.get("an_additional_test")),
                clean(src.get("an_additional_test2")),
            )
            if part
        )
        or None,
        # Certification
        "cert_basic_ooh": mapped(
            src.get("rm_basic_doh_exam"), PASS_STATUS, unmapped=ctx.unmapped, label="rm_basic_doh_exam"
        ),
        "cert_additional_labs": mapped(
            src.get("rm_add_lab_tests"), PASS_STATUS, unmapped=ctx.unmapped, label="rm_add_lab_tests"
        ),
        "cert_flagpost": mapped(
            src.get("rm_flag_medlab_req"), PASS_STATUS, unmapped=ctx.unmapped, label="rm_flag_medlab_req"
        ),
        # Fitness for service. Legacy stores a per-service "Y" flag.
        "fitness_deck_services": "fit" if yes_no(src.get("rm_deck_srvc_flag")) == "yes" else None,
        "fitness_engine_services": "fit" if yes_no(src.get("rm_engine_srvc_flag")) == "yes" else None,
        "fitness_catering_services": "fit" if yes_no(src.get("rm_catering_srvc_flag")) == "yes" else None,
        "fitness_other_services": "fit" if yes_no(src.get("rm_other_srvc_flag")) == "yes" else None,
        "visual_aids_required": yes_no(src.get("pe_VISUAL_AIDS_REQUIRED")),
        # Final recommendation
        "final_recommendation": mapped(
            src.get("rm_recommendation"),
            RECOMMENDATION,
            unmapped=ctx.unmapped,
            label="final_recommendation",
        ),
        "restriction_details": clean(src.get("rm_restriction")),
        # medical_exams.remarks was dropped in V2, so the legacy remark and
        # the ancillary recommendation share recommendation_remarks.
        "recommendation_remarks": "\n".join(
            part
            for part in (
                clean(src.get("an_recommendation")),
                clean(src.get("rm_remarks")),
            )
            if part
        )
        or None,
        # Dates and signatories
        "date_of_fitness": iso_date(src.get("rm_fitness_date")),
        "valid_until": iso_date(src.get("rm_valid_until")),
        "authorized_physician": title_case_name(text(src.get("rm_pathologist"), 255)),
        "medical_certification_no": text(src.get("rm_reference_no"), 255),
        "medical_director": title_case_name(text(src.get("rm_medtech"), 255)),
        "examining_physician": title_case_name(text(src.get("rm_pathologist"), 255)),
        "license_no": text(src.get("rm_pathologist_license"), 255),
    }

    row.update({column: jsonb(value) for column, value in _findings(src).items()})
    return row


SPEC = ModuleSpec(
    name="seabase",
    csv_file="seabase.csv",
    table="medical_exams",
    business_id_column="exam_id",
    business_id_prefix="MED",
    sequence="med_seq",
    papin_columns=("rm_papin", "pat_papin"),
    build_row=build_row,
    jsonb_columns=(
        "medical_history",
        "questionnaire",
        "findings_a",
        "findings_b",
        "findings_c",
        "findings_a_remarks",
        "findings_b_remarks",
        "findings_c_remarks",
    ),
    notes=(
        "The skin / heent / neck / chest_lungs / cardiovascular / abdomen / "
        "extremities / neurological system columns and the dead *_result "
        "columns (cbc_result, ecg_result, ...) are left NULL: no current form "
        "reads them. Legacy pe_SPEECH, pe_SATISFACTORY_SIGHT_AID and "
        "pe_SATISFACTORY_PSYCHO are empty in every row."
    ),
)
