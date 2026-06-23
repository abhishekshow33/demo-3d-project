# Model accuracy repair report

Date: 2026-06-22

## Reference basis

The rebuild uses the seven raw frames in `LaMartiniere_HumanEye_3D_Background_MasterPlan.zip`, the human-eye path JSON, the hyper-detail object inventory, and the required QA checklist. It is a reference-led virtual reconstruction; survey-grade dimensions still require measured plans or photogrammetry.

## Corrected architecture

- Shared Heritage Hall: continuous three-level wings, curved rotunda, nine-column portico, lower arcade, arched upper openings, Ionic-style capital relief, curved stair nosing, rooftop drum and parapet bands.
- Boys façade: separate route zone with a three-storey central projection, five upper vents/awnings, seven middle openings, seven ground openings, crest, upright roof name, plaques, drainpipes and red service pipe.
- Girls façade: separate asymmetric route zone with a tall west wing, lower east annex, projected pediment, seven-column upper screen, six arched balcony openings, three ground doors, quoins and roof identity.
- Memorial: stone stepped pedestal, plaque, capstone and a modeled Claude Martin bust with torso, shoulders, uniform braid, neck and head.
- Existing corridor, court, field, road, weathering, vegetation and service-detail zones remain intact.

## Automated acceptance

- `validate_model_accuracy.py`: checks distinct school GLBs and required architectural node counts.
- `validate_human_eye_path.py` in Blender: samples the actual master-scene collision volumes.
- `validate_three_building_site.py`: checks routes, content inventory and the 5 MB zone limit.
- TypeScript, ESLint and production build checks.

Final high-detail zone sizes: Boys 2.3 MB, Girls 3.1 MB, Rotunda 1.5 MB, Heritage 3.0 MB. Initial Boys/Girls LODs are approximately 1.0 MB each.

## Visual checkpoints

- `path_checkpoints/02_rotunda_focus.png`
- `path_checkpoints/05_girls_reveal_focus.png`
- `path_checkpoints/07_boys_wide_focus.png`
- `path_checkpoints/10_memorial_focus.png`
