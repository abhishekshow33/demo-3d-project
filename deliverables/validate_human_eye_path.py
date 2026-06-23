try:
    import bpy  # type: ignore
except Exception:  # pragma: no cover - Blender-only dependency
    bpy = None

try:
    from mathutils import Vector  # type: ignore
except Exception:  # pragma: no cover - Blender-only dependency
    Vector = None

import os
import sys


ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT)
from human_eye_path_data import STAGES, to_blender

COLLISION_PREFIXES = (
    'LM_MainBlock', 'LM_Rotunda_CurvedWall', 'LM_Girls_LeftWing',
    'LM_Girls_RightWing', 'LM_Girls_CentralBay', 'LM_Modern_Block',
    'LM_Internal_Circular_Tower', 'LM_Corridor_Canopy', 'LM_Corridor_Floor',
)


def world_bounds(obj, margin=.12):
    corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    minimum = Vector((min(v.x for v in corners), min(v.y for v in corners), min(v.z for v in corners)))
    maximum = Vector((max(v.x for v in corners), max(v.y for v in corners), max(v.z for v in corners)))
    minimum -= Vector((margin, margin, margin))
    maximum += Vector((margin, margin, margin))
    return minimum, maximum


def inside(point, bounds):
    minimum, maximum = bounds
    return all(minimum[i] <= point[i] <= maximum[i] for i in range(3))


colliders = []
if bpy is not None and Vector is not None:
    colliders = [(obj.name, world_bounds(obj)) for obj in bpy.context.scene.objects if obj.name.startswith(COLLISION_PREFIXES)]

errors = []

if len(STAGES) != 10:
    errors.append(f'Expected 10 stages, found {len(STAGES)}')

for index, stage in enumerate(STAGES):
    expected_prefix = f'{index + 1:02d}_'
    if not stage['id'].startswith(expected_prefix):
        errors.append(f"{stage['id']}: expected prefix {expected_prefix}")
    if not 32 <= stage['fov'] <= 42:
        errors.append(f"{stage['id']}: FOV {stage['fov']} outside 32-42")
    points = stage['points']
    if len(points) < 3:
        errors.append(f"{stage['id']}: expected at least 3 keyframes, found {len(points)}")
    limit = 2.4
    for point_index, (position, _) in enumerate(points):
        height = position[1]
        if not 1.55 <= height <= limit:
            errors.append(f"{stage['id']} point {point_index}: height {height} outside 1.55-{limit}")
    if stage.get('collision_exempt'):
        continue
    for start, end in zip(points, points[1:]):
        if colliders:
            p0 = Vector(to_blender(start[0]))
            p1 = Vector(to_blender(end[0]))
            for sample in range(21):
                point = p0.lerp(p1, sample / 20)
                for name, bounds in colliders:
                    if inside(point, bounds):
                        errors.append(f"{stage['id']}: camera collision with {name} at {tuple(round(v, 2) for v in point)}")
                        break

if errors:
    print('\n'.join(errors))
    raise SystemExit(1)

print(f"Validated {sum(len(stage['points']) for stage in STAGES)} keyframes across {len(STAGES)} stages")
print('Height: 1.55-2.4m; FOV: 32-42; Blender collision sweep skipped' if not colliders else 'Height: 1.55-2.4m; FOV: 32-42; no major-volume collisions outside the intentional corridor portal')
