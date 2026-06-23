# Plan

1. Analyze `BuildingScene.tsx`, `AchievementFrameWall.tsx`, and `WallNarrativePlaques.tsx` against `animation_Rules.md`.
2. Address R1: design bugs, layout issues, and animation discrepancies. Check material properties, typography, frame geometries. Ensure no clipping or overlapping geometry.
3. Address R2: Resolve UI/animation lag. Switch `MeshPhysicalMaterial` to `MeshStandardMaterial` if present and unnecessary. Disable shadow mapping where not needed (distant geometry). Ensure 60fps performance optimizations.
4. Spawn a Subagent (teamwork_preview_explorer) to explore these files and identify exactly what needs to be changed.
5. Spawn a worker to apply the changes to the files.
6. Spawn a reviewer/auditor to verify the fixes against `animation_Rules.md`.
7. Run `npm run build` to verify the build succeeds.
8. Deliver final state.
