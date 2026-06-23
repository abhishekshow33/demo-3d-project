# Scope: 3D Cinematic Gallery Audit

## Architecture
- `three/BuildingScene.tsx`: The overall 3D scene holding the gallery elements.
- `three/AchievementFrameWall.tsx`: The frame walls for achievements.
- `three/WallNarrativePlaques.tsx`: The narrative plaques for context.
- `animation_Rules.md`: The single source of truth for design, layout, and animation.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | BuildingScene Audit & Fix | `three/BuildingScene.tsx` | none | IN_PROGRESS |
| 2 | AchievementFrameWall Audit & Fix | `three/AchievementFrameWall.tsx` | none | IN_PROGRESS |
| 3 | WallNarrativePlaques Audit & Fix | `three/WallNarrativePlaques.tsx` | none | IN_PROGRESS |

## Interface Contracts
- All files must adhere to `animation_Rules.md`.
- Material types: `MeshStandardMaterial` over `MeshPhysicalMaterial`.
- No architectural clipping.
- Heritage/Royal vibe enhancement: deeper gold tones, richer textures, classic typography.
