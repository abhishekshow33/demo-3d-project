# Scope: WallNarrativePlaques Audit & Fix

## Mission
Audit and implement design, layout, and animation fixes in `three/WallNarrativePlaques.tsx` according to `animation_Rules.md`. Also apply a "royal/heritage vibe" (deeper gold tones, richer textures, classic typography, etc) while maintaining premium standards.

## Architecture
- `three/WallNarrativePlaques.tsx`: The narrative plaques for context.
- `animation_Rules.md`: The single source of truth for design, layout, and animation.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | WallNarrativePlaques Audit & Fix | `three/WallNarrativePlaques.tsx` | none | PLANNED |

## Interface Contracts
- Must adhere to `animation_Rules.md` (e.g., Plaque dimensions, matte white board, bronze frame).
- Material types: `MeshStandardMaterial` over `MeshPhysicalMaterial`.
- No architectural geometry clipping.
- Heritage/Royal vibe enhancement.
