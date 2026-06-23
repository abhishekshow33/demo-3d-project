# Scope: BuildingScene Audit & Fix

## Mission
Audit and implement design, layout, and animation fixes in `three/BuildingScene.tsx` according to `animation_Rules.md`. Also apply a "royal/heritage vibe" (deeper gold tones, richer textures, classic typography, etc) while maintaining premium standards.

## Architecture
- `three/BuildingScene.tsx`: The overall 3D scene holding the gallery elements.
- `animation_Rules.md`: The single source of truth for design, layout, and animation.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | BuildingScene Audit & Fix | `three/BuildingScene.tsx` | none | PLANNED |

## Interface Contracts
- Must adhere to `animation_Rules.md`.
- Material types: `MeshStandardMaterial` over `MeshPhysicalMaterial`.
- No architectural geometry clipping.
- Heritage/Royal vibe enhancement.
