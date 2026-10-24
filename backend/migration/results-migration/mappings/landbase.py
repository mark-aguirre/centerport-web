"""landbase.csv -> public.landbase_pemes.

The legacy export has the same shape as seabase, but the landbase target
stores the per-system examination as 19 flat ``pe_*`` columns holding "N" or
"A" rather than as JSONB findings maps, and the questionnaire as eight scalar
``questionnaire_N`` columns rather than one JSONB map.

The ``pe_*`` columns are always written explicitly. Their DDL default is the
string ``'NORMAL'``, which matches neither radio option, so an omitted column
would render as unanswered.
"""

from __future__ import annotations

from typing import Any, Mapping

from common import (
    EXAM_RESULT,
    REACTIVE_SNAKE,
    ModuleSpec,
    RowContext,
    blood_type,
    boolean,
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

#: target pe_* column -> legacy "no finding" flag column.
#: The matching ``pe_*_findings`` text column takes the legacy note.
EXPLORATION = {
    "pe_skin": ("ot_SKIN_TAG", "ot_SKIN"),
    "pe_head_scalp": ("ot_HEAD_NECK_SCALP_TAG", "ot_HEAD_NECK_SCALP"),
    "pe_eyes_external": ("ot_EYES_TAG", "ot_EYES"),
    "pe_pupils": ("ot_PUPILS_TAG", "ot_PUPILS"),
    "pe_ears": ("ot_EARS_EARDRUM_TAG", "ot_EARS_EARDRUM"),
    "pe_nose_sinuses": ("ot_NOSE_SINUSES_TAG", "ot_NOSE_SINUSES"),
    "pe_mouth_throat": ("ot_MOUTH_THROAT_TAG", "ot_MOUTH_THROAT"),
    "pe_neck_lymph_nodes": ("ot_NECK_LN_THYROID_TAG", "ot_NECK_LN_THYROID"),
    "pe_breast_axilla": ("ot_CHEST_BREAST_AXILLA_TAG", "ot_CHEST_BREAST_AXILLA"),
    "pe_chest_lungs": ("ot_LUNGS_TAG", "ot_LUNGS"),
    "pe_heart": ("ot_HEART_TAG", "ot_HEART"),
    "pe_abdomen": ("ot_ABDOMEN_TAG", "ot_ABDOMEN"),
    "pe_back": ("ot_BACK_FLANK_TAG", "ot_BACK_FLANK"),
    "pe_anus_rectum": ("ot_ANUS_RECTUM_TAG", "ot_ANUS_RECTUM"),
    "pe_genito_urinary": ("ot_GU_SYSTEM_TAG", "ot_GU_SYSTEM"),
    "pe_inguinals_genitals": ("ot_INGUINALS_GENITALS_TAG", "ot_INGUINALS_GENITALS"),
    "pe_extremities": ("ot_EXTREMITIES_TAG", "ot_EXTREMITIES"),
    "pe_reflexes": ("ot_REFLEXES_TAG", "ot_REFLEXES"),
    "pe_dental": ("ot_DENTAL_TAG", "ot_DENTAL"),
}

#: Landbase stores the psychological recommendation display-cased, unlike the
#: medical module's snake_case equivalent.
PSYCH_TEST = {
    "recommend": "Recommended",
    "recommended": "Recommended",
    "rec": "Recommended",
    "rwr": "Rec. w/Reservation",
    "reserve": "Rec. w/Reservation",
    "nr": "Not Recommended",
    "not recommended": "Not Recommended",
    "nd": "Not Done",
    "not done": "Not Done",
}

PASS_STATUS = {
    "normal": "passed",
    "passed": "passed",
    "pass": "passed",
    "y": "passed",
    "with_f": "with_significant_findings",
    "with findings": "with_significant_findings",
    "with significant findings": "with_significant_findings",
    "n": "with_significant_findings",
}

PREGNANCY = {"negative": "Negative", "positive": "Positive", "n/a": "N/A"}

ADEQUACY = {"a": "adequate", "adequate": "adequate", "i": "inadequate", "inadequate": "inadequate"}

RECOMMENDATION = {
    "fit": "FIT",
    "unfit": "UNFIT",
    "fit to work": "FIT TO WORK",
    "fit w/ restriction": "FIT w/ RESTRICTION",
    "fit with restriction": "FIT w/ RESTRICTION",
    "fit for employment": "FIT FOR EMPLOYMENT",
    "fit for training": "FIT FOR TRAINING",
    "fit for enrollment": "FIT FOR ENROLLMENT",
    "fit for sea duty": "FIT FOR SEA DUTY",
}

VISUAL_AID = {"spectacles": "glasses", "glasses": "glasses", "contactlens": "contact_lens"}

#: Prefix fallbacks for the ~100 landbase rows whose legacy recommendation is
#: free text ("UNFIT / EXPIRED", "FIT TO WORK AS CONDUCTOR"). The column is
#: validated server-side against the RecommendationValue enum, so the value
#: has to be one of the enum strings; the original wording is preserved in
#: remarks by build_row so the qualification is not lost.
RECOMMENDATION_PREFIXES = (
    ("FIT FOR ENROLLMENT", "FIT FOR ENROLLMENT"),
    ("FIT FOR EMPLOYMENT", "FIT FOR EMPLOYMENT"),
    ("FIT FOR TRAINING", "FIT FOR TRAINING"),
    ("FIT FOR SEA DUTY", "FIT FOR SEA DUTY"),
    ("FIT TO WORK", "FIT TO WORK"),
    ("FIT W/ RESTRICTION", "FIT w/ RESTRICTION"),
    ("FIT WITH RESTRICTION", "FIT w/ RESTRICTION"),
    ("UNFIT", "UNFIT"),
    ("TEMPORARY UNFIT", "UNFIT"),
    ("FIT", "FIT"),
)


def _recommendation(value: Any, ctx: RowContext) -> tuple[str | None, str | None]:
    """Resolves a legacy recommendation to the enum, keeping the original.

    Returns ``(enum_value, qualification)`` where the qualification is the
    original legacy string whenever it carried more than the bare enum value,
    so build_row can fold it into remarks.
    """
    out = clean(value)
    if out is None:
        return None, None
    normalized = " ".join(out.upper().split())
    exact = RECOMMENDATION.get(normalized.lower())
    if exact is not None:
        return exact, None
    for prefix, enum_value in RECOMMENDATION_PREFIXES:
        if normalized.startswith(prefix):
            ctx.unmapped[f"recommendation~{out}"] += 1
            return enum_value, out
    ctx.unmapped[f"recommendation={out}"] += 1
    return None, out


def build_row(src: Mapping[str, str], ctx: RowContext) -> dict[str, Any]:
    recommendation, recommendation_detail = _recommendation(
        src.get("rm_recommendation"), ctx
    )
    systolic = number_like(src.get("pe_BP"))
    diastolic = number_like(src.get("pe_BP_DIASTOLIC"))

    row: dict[str, Any] = {
        # Past medical history
        "medical_history": jsonb(history.build_medical_history(src)),
        "medical_history_others": clean(src.get("mh_others")),
        "consulted_doctor": boolean(src.get("mh_consulted")),
        "consulted_doctor_details": clean(src.get("mh_consulted_specify")),
        "maintenance_medications": clean(src.get("mh_maintenance_meds")),
        # Questionnaire
        "questionnaire_comments": clean(src.get("mh2_column7_comment")),
        "questionnaire_8_details": clean(src.get("mh2_column8_comment")),
        # Vital signs
        "pe_weight": number_like(src.get("pe_WEIGHT")),
        "pe_height": number_like(src.get("pe_HEIGHT")),
        "pe_bmi": number_like(src.get("pe_BODY_BUILD")),
        "pe_pulse_rate": number_like(src.get("pe_PULSE")),
        "pe_bp_systolic": systolic,
        "pe_bp_diastolic": diastolic,
        "pe_blood_pressure": f"{systolic}/{diastolic}" if systolic and diastolic else None,
        "pe_respiration": number_like(src.get("pe_RESPIRATION")),
        "pe_rhythm": mapped(
            src.get("pe_RHYTHM"),
            {"regular": "Regular", "irregular": "Irregular"},
            unmapped=ctx.unmapped,
            label="pe_rhythm",
        ),
        # Legacy reused the "conversational hearing" column for temperature.
        "pe_body_temperature": number_like(
            (src.get("pe_CONVERSATIONAL_AD") or "").replace("\u00b0C", "").replace("C", "")
        ),
        # Vision
        "vision_far_od_uncorrected": text(src.get("pe_FAR_OD_U"), 50),
        "vision_far_os_uncorrected": text(src.get("pe_FAR_OS_U"), 50),
        "vision_far_od_corrected": text(src.get("pe_FAR_OD_C"), 50),
        "vision_far_os_corrected": text(src.get("pe_FAR_OS_C"), 50),
        "vision_near_od_uncorrected": text(src.get("pe_NEAR_ODJ_U"), 50),
        "vision_near_os_uncorrected": text(src.get("pe_NEAR_OSJ_U"), 50),
        "vision_near_od_corrected": text(src.get("pe_NEAR_ODJ_C"), 50),
        "vision_near_os_corrected": text(src.get("pe_NEAR_OSJ_C"), 50),
        "vision_satisfactory_sight": yes_no(src.get("pe_SATISFACTORY_SIGHT_UNAID")),
        "vision_visual_aid": mapped(
            src.get("pe_VISUAL_AIDS_WORN"),
            VISUAL_AID,
            unmapped=ctx.unmapped,
            label="vision_visual_aid",
        ),
        # Tri-state: NULL means colour vision was not assessed.
        "vision_color_adequate": boolean(src.get("pe_ISHIHARA_C")),
        # Hearing and speech
        "hearing_ad": text(src.get("pe_HEARING_AD"), 255),
        "hearing_as": text(src.get("pe_HEARING_AS"), 255),
        "hearing_satisfactory": yes_no(src.get("pe_SATISFACTORY_HEARING")),
        "hearing_right_adequacy": mapped(
            src.get("pe_HEARING_RIGHT"), ADEQUACY, unmapped=ctx.unmapped, label="hearing_right"
        ),
        "hearing_left_adequacy": mapped(
            src.get("pe_HEARING_LEFT"), ADEQUACY, unmapped=ctx.unmapped, label="hearing_left"
        ),
        "speech_clarity": mapped(
            src.get("pe_CLARITY_OF_SPEECH"), ADEQUACY, unmapped=ctx.unmapped, label="speech_clarity"
        ),
        "psychological_satisfactory": yes_no(src.get("pe_SATISFACTORY_PSYCHO")),
        # Ancillary examinations
        "xray_no": text(src.get("an_remarks"), 255),
        "chest_xray": mapped(
            src.get("an_cxr"), EXAM_RESULT, unmapped=ctx.unmapped, label="an_cxr"
        ),
        "cbc": mapped(src.get("an_cbc"), EXAM_RESULT, unmapped=ctx.unmapped, label="an_cbc"),
        "cec": mapped(src.get("an_ecg"), EXAM_RESULT, unmapped=ctx.unmapped, label="an_ecg"),
        "pregnancy_test": mapped(
            src.get("an_pregnancy_test"), PREGNANCY, unmapped=ctx.unmapped, label="an_pregnancy_test"
        ),
        "urinalysis": mapped(
            src.get("an_urinalysis"), EXAM_RESULT, unmapped=ctx.unmapped, label="an_urinalysis"
        ),
        "stool_exam": mapped(
            src.get("an_stool_exam"), EXAM_RESULT, unmapped=ctx.unmapped, label="an_stool_exam"
        ),
        "hbsag": mapped(
            src.get("an_hbsag"), REACTIVE_SNAKE, unmapped=ctx.unmapped, label="an_hbsag"
        ),
        "hiv_aids_test": mapped(
            src.get("an_hiv"), REACTIVE_SNAKE, unmapped=ctx.unmapped, label="an_hiv"
        ),
        "apb": mapped(src.get("an_rpr"), REACTIVE_SNAKE, unmapped=ctx.unmapped, label="an_rpr"),
        "blood_type": blood_type(src.get("an_blood_type"), ctx.unmapped, "an_blood_type"),
        "psychological_test": mapped(
            src.get("an_psychological_exam"),
            PSYCH_TEST,
            unmapped=ctx.unmapped,
            label="an_psychological_exam",
        ),
        "additional_tests": "\n".join(
            part
            for part in (
                clean(src.get("an_additional_test")),
                clean(src.get("an_additional_test2")),
            )
            if part
        )
        or None,
        # Remarks and results. The recommendation qualification is folded in
        # here because the recommendation column itself only accepts the enum.
        "remarks": "\n".join(
            part
            for part in (
                clean(src.get("rm_remarks")),
                clean(src.get("rm_restriction")),
                recommendation_detail,
            )
            if part
        )
        or None,
        "basic_peme_result": mapped(
            src.get("rm_basic_doh_exam"), PASS_STATUS, unmapped=ctx.unmapped, label="basic_peme_result"
        ),
        "additional_lab_result": mapped(
            src.get("rm_add_lab_tests"), PASS_STATUS, unmapped=ctx.unmapped, label="additional_lab_result"
        ),
        "flag_medical_lab_result": mapped(
            src.get("rm_flag_medlab_req"), PASS_STATUS, unmapped=ctx.unmapped, label="flag_medical_lab_result"
        ),
        # Recommendation
        "recommendation": recommendation,
        "date_of_fitness": iso_date(src.get("rm_fitness_date")),
        "valid_until": iso_date(src.get("rm_valid_until")),
        "authorized_physician": title_case_name(text(src.get("rm_pathologist"), 255)),
        "medical_certification_no": text(src.get("rm_reference_no"), 255),
        "medical_director": title_case_name(text(src.get("rm_medtech"), 255)),
    }

    # Questionnaire 1-8 plus the details columns for 1-6.
    for index, legacy in enumerate(
        (
            "mh2_column1",
            "mh2_column2",
            "mh2_column3",
            "mh2_column4",
            "mh2_column5",
            "mh2_column6",
            "mh2_column7",
            "mh2_column8",
        ),
        start=1,
    ):
        row[f"questionnaire_{index}"] = yes_no(src.get(legacy))
        if index <= 6:
            row[f"questionnaire_{index}_details"] = clean(src.get(f"{legacy}_comment"))

    # Physical exploration: always write "N"/"A" explicitly.
    for column, (tag_column, note_column) in EXPLORATION.items():
        flag = yes_no(src.get(tag_column))
        row[column] = None if flag is None else ("N" if flag == "yes" else "A")
        row[f"{column}_findings"] = clean(src.get(note_column))

    return row


SPEC = ModuleSpec(
    name="landbase",
    csv_file="landbase.csv",
    table="landbase_pemes",
    business_id_column="peme_id",
    business_id_prefix="PEME",
    sequence="peme_seq",
    papin_columns=("rm_papin", "pat_papin"),
    build_row=build_row,
    jsonb_columns=("medical_history",),
    notes=(
        "doh_accreditation_no, ref_no, drug_test and date_initial_peme have "
        "no legacy counterpart and are left NULL. peme_id is VARCHAR(12), an "
        "exact fit for PEME + 8 digits."
    ),
)
