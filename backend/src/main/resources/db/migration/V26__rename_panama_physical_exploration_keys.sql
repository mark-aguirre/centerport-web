-- Rename Panama physical-exploration keys from human-readable form labels
-- (e.g. "G-U system", "Spine (Cervical, Thoracic and Lumbar)") to stable
-- snake_case identifiers that match the frontend key set.
--
-- The physical_exploration column is a schemaless JSONB map, so this rebuilds
-- each row's map with the new keys, copying the value from the old label key.
--
-- Values that are absent stay absent (jsonb_strip_nulls drops keys whose value
-- resolves to NULL), preserving the original sparse-map behaviour.

UPDATE panama_certificates
SET physical_exploration = jsonb_strip_nulls(
    jsonb_build_object(
        'head',                            physical_exploration -> 'Head',
        'mouth_nose_throat',               physical_exploration -> 'Mouth, Nose, Throat',
        'dental_exam',                     physical_exploration -> 'Dental Exam',
        'ears_general',                    physical_exploration -> 'Ears (general)',
        'tympanic_membrane',               physical_exploration -> 'Tympanic Membrane',
        'eyes',                            physical_exploration -> 'Eyes',
        'pupils',                          physical_exploration -> 'Pupils',
        'ophthalmoscopy',                  physical_exploration -> 'Ophthalmoscopy',
        'eye_movement',                    physical_exploration -> 'Eye movement',
        'lungs_and_chest',                 physical_exploration -> 'Lungs and Chest',
        'breast_examination',              physical_exploration -> 'Breast examination',
        'heart',                           physical_exploration -> 'Heart',
        'skin',                            physical_exploration -> 'Skin',
        'varicose_veins',                  physical_exploration -> 'Varicose veins',
        'vascular_incl_pedal',             physical_exploration -> 'Vascular (inc. Pedal)',
        'abdomen_and_viscera',             physical_exploration -> 'Abdomen and viscera',
        'hernias',                         physical_exploration -> 'Hernias',
        'anus_not_rectal_exam',            physical_exploration -> 'Anus (not rectal exam)',
        'gu_system',                       physical_exploration -> 'G-U system',
        'upper_and_lower',                 physical_exploration -> 'Upper and lower',
        'spine_cervical_thoracic_lumbar',  physical_exploration -> 'Spine (Cervical, Thoracic and Lumbar)',
        'neurologic_full_brief',           physical_exploration -> 'Neurologic (full brief)',
        'psychiatric',                     physical_exploration -> 'Psychiatric',
        'general_appearance',              physical_exploration -> 'General appearance'
    )
)
WHERE physical_exploration IS NOT NULL;
