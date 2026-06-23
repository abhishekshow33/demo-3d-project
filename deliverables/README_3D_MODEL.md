# La Martiniere School 3D reconstruction

This is an editable, hyper-detailed architectural reconstruction derived from the supplied video-analysis and hyper-detail packages. It is intentionally approximate in dimensions because the source video has no survey markers or architectural drawings, but every specified visible structural/detail category is represented.

## Files

- `LaMartiniere_School_Master.blend` — editable Blender master scene, organized by campus zone.
- `LaMartiniere_School_Web_Optimized.blend` — baked and material-batched web scene.
- `LaMartiniere_School_Web.glb` — self-contained web/Three.js-ready model.
- `lamartiniere_school_preview.png` — rendered verification image.
- `build_lamartiniere_school.py` — procedural source; run it in Blender to regenerate the assets.

## Scale and orientation

- Units: meters
- Origin: center of the main rotunda
- X: along the main façade
- Y: campus depth
- Z: up

The model includes the main façade, rotunda, curved stairs, column bases/capitals, recessed windows, shutters, grills, rooftop drum/rail/finials, side wings, Boys/Girls signage, crest relief, field block, internal road block and tower, court, formal garden, memorial/statue, mature trees, palms, service hardware, weathering, cars, benches, lamps, planters, bins, boards, bollards, and field/road variation.

The web export now uses distinct `boys.glb` and `girls.glb` façade zones rather than recoloring the shared Heritage Hall. See `MODEL_ACCURACY_REPORT.md` for the reference mapping and geometry acceptance tests.

## Regenerate

```sh
blender --background --python build_lamartiniere_school.py
```

To regenerate only the batched web asset from the master:

```sh
blender --background LaMartiniere_School_Master.blend --python optimize_web_model.py
```

For survey-grade accuracy, replace the estimated dimensions with a site plan, measured elevations, or drone photogrammetry.
