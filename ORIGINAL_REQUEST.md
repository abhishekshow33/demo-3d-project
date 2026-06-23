# Original User Request

## Initial Request — 2026-06-22T22:56:02+05:30

An audit and implementation initiative to identify and fix design bugs, layout issues, and animation discrepancies in the 3D cinematic gallery, applying the premium standards of the `/foet` guidelines and strictly enforcing `animation_Rules.md`.

Working directory: /Users/abhishekshow/Downloads/la-martiniere-excellence-improved
Integrity mode: development

## Requirements

### R1. Design Audit and Implementation
Conduct a comprehensive review of `BuildingScene.tsx`, `AchievementFrameWall.tsx`, and `WallNarrativePlaques.tsx` against the `animation_Rules.md` specification and premium design standards. Identify any visual discrepancies (e.g., typography mismatch, wrong material properties, overlapping geometry, poorly timed animations) and implement the necessary code fixes directly in the files.

### R2. Resolve Animation and Performance Lag
Identify and fix sources of UI or animation lag during scrolling or interactive hover states. Ensure 60fps performance by checking texture sizes, material complexity (e.g., preferring MeshStandardMaterial over MeshPhysicalMaterial where appropriate), and shadow mapping configurations according to mobile optimization rules.

## Acceptance Criteria

### Verification
- [ ] An independent Agent-as-Judge verifies that all materials, typography, and frame geometries strictly match the exact numerical specifications in `animation_Rules.md`.
- [ ] The project builds successfully (`npm run build`) without errors after all fixes are applied.
- [ ] No architectural geometry (like pillars or wainscoting) clips into or overlaps with the content frames or plaques.

## Follow-up — 2026-06-22T22:58:31+05:30

refine the design make it more royal and heritage vibe

## Follow-up — 2026-06-22T23:00:31+05:30

I have already updated `InteriorLighting.tsx` with the new cinematic gold/amber lighting scheme for the Royal vibe. 

Please focus the new Orchestrator on updating `BuildingScene.tsx` (deep mahogany/walnut woods, warm ivory damask plaster, and metallic gold `#B8860B` for the floor engraving text) and `WallNarrativePlaques.tsx` (switching to `Playfair Display` + `Inter` typography with an ivory `#FFF9EE` base). Do not touch `InteriorLighting.tsx` to avoid conflicts.
