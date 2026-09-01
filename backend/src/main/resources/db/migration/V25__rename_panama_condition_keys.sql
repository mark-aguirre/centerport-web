-- Rename Panama personal-declaration condition keys from opaque identifiers
-- (condition_1, condition_ear, ...) to semantic names that match the form labels.
--
-- The conditions column is a schemaless JSONB map, so this rebuilds each row's
-- map with the new keys. For each target key we take the current value from the
-- existing semantic/legacy key, preferring the split semantic key when present
-- and falling back to the legacy combined key (condition_3/5/20/33) otherwise.
--
-- Values that are absent stay absent (COALESCE of NULLs => key omitted via
-- jsonb_strip_nulls at the end), preserving the original sparse-map behaviour.

UPDATE panama_certificates
SET conditions = jsonb_strip_nulls(
    jsonb_build_object(
        'high_blood_pressure',    conditions -> 'condition_1',
        'eye_vision_problem',     conditions -> 'condition_2',
        'ear_problem',            COALESCE(conditions -> 'condition_ear', conditions -> 'condition_3'),
        'heart_surgery',          conditions -> 'condition_4',
        'varicose_veins',         COALESCE(conditions -> 'condition_varicose_veins', conditions -> 'condition_5'),
        'hemorrhoids',            COALESCE(conditions -> 'condition_hemorrhoids', conditions -> 'condition_5'),
        'nose_problem',           COALESCE(conditions -> 'condition_nose', conditions -> 'condition_3'),
        'throat_problem',         COALESCE(conditions -> 'condition_throat', conditions -> 'condition_3'),
        'asthma_bronchitis',      conditions -> 'condition_6',
        'blood_disorders',        conditions -> 'condition_7',
        'diabetes',               conditions -> 'condition_8',
        'thyroid_problems',       conditions -> 'condition_9',
        'digestive_disorders',    conditions -> 'condition_10',
        'kidney_problems',        conditions -> 'condition_11',
        'skin_problems',          conditions -> 'condition_12',
        'allergies',              conditions -> 'condition_13',
        'epilepsy_seizures',      conditions -> 'condition_14',
        'sleep_problem',          conditions -> 'condition_19',
        'sickle_cell_disease',    conditions -> 'condition_15',
        'hernias',                conditions -> 'condition_16',
        'genital_disorders',      conditions -> 'condition_17',
        'smoking',                COALESCE(conditions -> 'condition_smoking', conditions -> 'condition_20'),
        'surgeries',              conditions -> 'condition_21',
        'infectious_diseases',    conditions -> 'condition_22',
        'dizziness_fainting',     conditions -> 'condition_23',
        'loss_of_consciousness',  conditions -> 'condition_24',
        'alcohol',                COALESCE(conditions -> 'condition_alcohol', conditions -> 'condition_20'),
        'drugs',                  COALESCE(conditions -> 'condition_drugs', conditions -> 'condition_20'),
        'psychiatric_problems',   conditions -> 'condition_25',
        'depression',             conditions -> 'condition_26',
        'loss_of_memory',         conditions -> 'condition_28',
        'balance_problems',       conditions -> 'condition_29',
        'severe_headaches',       conditions -> 'condition_30',
        'heart_vascular_disease', conditions -> 'condition_31',
        'restricted_mobility',    conditions -> 'condition_32',
        'back_problem',           COALESCE(conditions -> 'condition_back', conditions -> 'condition_33'),
        'joint_problem',          COALESCE(conditions -> 'condition_joint', conditions -> 'condition_33'),
        'amputation',             conditions -> 'condition_34',
        'fractures_dislocation',  conditions -> 'condition_35',
        'covid_19',               conditions -> 'condition_36',
        'pregnancy',              conditions -> 'condition_18'
    )
)
WHERE conditions IS NOT NULL;
