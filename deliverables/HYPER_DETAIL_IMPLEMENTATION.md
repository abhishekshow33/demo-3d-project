# Hyper-detail implementation coverage

The supplied hyper-detail package has been implemented into the reproducible Blender generator and the website GLB.

## Direction-path alignment

- Preserved the supplied eight ZIP stages and their exact scroll ranges as the journey backbone.
- Restored the continuous heritage wings, original campus proportions, long internal road, and all architectural zones without camera-driven displacement or global shrinking.
- Added grounded sub-keyframes for curb and stair glances, column parallax, a semicircular rotunda view, garden edging, court texture, corridor wall details, and the final façade reveal.
- Kept normal camera height between 1.65 and 2.2 metres and capped the final architectural view at 3.2 metres.
- Added an independent smoothed gaze path so brief ground glances and wall pans do not distort the walking route.
- Added 32 reproducible QA renders—start, ground/detail, focus, and end for all eight stages—under `path_checkpoints/`.

## Recognition architecture

- Curved rotunda wall and portico
- Nine hero columns with separate shafts, bases, capitals, and abaci
- True semi-circular ten-riser staircase, landing, nosing bevels, and handrails
- Rooftop drum, cornices, weathered cap, parapet railing, and finials
- Long heritage wings with roof slabs, ledges, parapets, balcony rails, and pilasters
- Field-facing Girls block with raised central bay, pediment, upper columns, lower arcade, depth offsets, and parapets
- Internal-road classroom block with colonnade, horizontal window rhythm, railings, and circular tower

## Windows, doors, and branding

- Recessed arched and rectangular window modules
- Dark glass, projecting frames, sills, grey-purple shutters, and grills
- Recessed central entrance and lower field-block arcade
- Raised Boys and Girls roof lettering
- Crest relief, founding year, plaques, building labels, notice boards, and flagpole

## Services and realism

- Irregularly placed AC condensers, fans, brackets, and contact stains
- Drain pipes and subtle service cable
- Roof, sill, base, pipe, and AC weathering geometry
- Off-white plaster variation, weathered roof material, road patches, field wear, and contact-shadow shapes
- Beveled visible architecture and stair edges
- Eye-level molding rings, column-base grime, door panels, stair-wear strips, court cracks, drainage grates, foreground grass, and contact dirt

## Open corridor detail

- A physically open, walkable corridor with floor, canopy, skirting, and collision-safe camera control points
- Recessed paneled doors, thresholds, transoms, handles, room plaques, switches, conduit, and wall lamps
- Ceiling fans, benches, noticeboard, fire extinguisher, floor wear, and readable eye-level wall detail

## Grounds and campus life

- Multi-colour court with full boundary, center, key, and circle markings
- Backboards/posts and field markers
- Road curbs, field boundary, formal garden beds/edging, flowers, shrubs, and planters
- Memorial platform, plinth, column, and figure
- Mature trees, palms with trunk rings/fronds, and tree contact shadows
- Parked cars, benches, lamps, bins, bollards, planters, and boards

## Web optimization

- Fully editable semantic master scene retained
- Eight semantic GLB zones with high/low LODs: ground, rotunda, heritage/corridor, garden, field, internal road, props, and weathering
- Scroll-aware current/next-zone loading with low-detail mobile assets and reusable geometry for repeated architectural and landscape elements
- Every high-detail zone remains below 5 MB; the initial desktop zone set is below 6 MB
- GLBs are exported without cameras/lights and displayed by one persistent React Three Fiber canvas
- Static rendered fallback retained for WebGL-constrained devices
