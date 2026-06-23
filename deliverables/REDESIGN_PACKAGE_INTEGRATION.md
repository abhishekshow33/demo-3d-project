# Cinematic redesign package integration

Source package: `lamartiniere-3d-redesign.zip`  
Integrated: 22 June 2026

## Integrated into the live routes

- Three distinct experiences: shared Heritage Hall, Boys campus and Girls campus.
- Package scroll states mapped to the project camera-stage schema.
- Fluorescent, clickable crest portals with semantic DOM equivalents.
- Door opening, interior lighting and human-eye foyer walkthrough.
- Reusable achievement frame walls with academic, sports, cultural, community and alumni categories.
- Chandelier, sconce, outdoor, court, pool, courtyard and frame-lighting systems.
- Boys court and swimming-pool route.
- Girls courtyard, fountain, value monuments, pavilions, court and pool route.
- Route-specific façade materials: red brick/forest green for Boys and ivory/burgundy for Girls.
- Olympic-proportion 50 × 25 pool surfaces with five lane guides and moving caustic lights.
- Interactive basketball hoops with pointer glow feedback.
- Achievement frames with hover scale, category colour, year, title and description labels.
- Deterministic fountain particles and spatially separated courtyard, court and pool zones.
- Curated institutional content routes and source provenance.
- Low-LOD arrival, next-zone preloading, mobile DPR cap, reduced motion and WebGL fallback.
- Locally optimized cinematic Heritage Hall fallback generated through Picsart.

## Intentionally adapted rather than copied

- Prototype files created their own Canvas and scroll tracker; the production app keeps one reusable Canvas controller and one authoritative scroll state per route.
- Prototype achievement-wall props conflicted across scene files; the live implementation uses one typed `AchievementFrameWall` interface.
- Missing texture paths and audio files were not referenced. Materials use supported PBR values and the experience remains silent until approved audio assets exist.
- Package camera heights above 3 m were lowered where necessary to preserve the approved human-eye walkthrough.
- The package proposed Next.js 14; the project remains on its tested Next.js 15 version.
- Expensive real-time reflection probes and broad shadow maps were replaced with physical materials, moving caustic lights and limited route-specific lighting for mobile stability.

## Remaining production inputs

- Approved achievement photography with captions and rights metadata; the current frames use designed category fields and verified text labels.
- Approved ambient sound, door creak and navigation chime files.
- Exact architectural plans for documentary-accurate pool/court placement. Until supplied, these areas remain labeled as reference-led virtual recreations.
