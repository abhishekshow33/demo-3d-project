try:
    import bpy  # type: ignore
except Exception:  # pragma: no cover - Blender-only dependency
    bpy = None
try:
    from mathutils import Vector  # type: ignore
except Exception:  # pragma: no cover - Blender-only dependency
    Vector = None

import math
import os
import sys


ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT)
from human_eye_path_data import STAGES, to_blender

OUT = os.path.join(ROOT, 'path_checkpoints')
os.makedirs(OUT, exist_ok=True)

if bpy is None:
    print('Blender is unavailable; skipping checkpoint rendering.')
    raise SystemExit(0)

scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x = 640
scene.render.resolution_y = 400
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.film_transparent = False
scene.world.use_nodes = True
world_background = scene.world.node_tree.nodes.get('Background')
if world_background:
    world_background.inputs['Color'].default_value = (0.48, 0.62, 0.78, 1)
    world_background.inputs['Strength'].default_value = .72
scene.view_settings.look = 'AgX - Medium High Contrast'

camera = bpy.data.objects.get('Path_QA_Camera')
if camera is None:
    bpy.ops.object.camera_add()
    camera = bpy.context.object
    camera.name = 'Path_QA_Camera'
scene.camera = camera

cli = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
stage_value = cli[0] if cli else os.environ.get('STAGE_FILTER', '')
label_value = cli[1] if len(cli) > 1 else os.environ.get('CHECKPOINT_FILTER', '')
stage_filter = {item.strip() for item in stage_value.split(',') if item.strip()}
label_filter = {item.strip() for item in label_value.split(',') if item.strip()}


def set_route_visibility(stage_id):
    """Render the same zoned set the website loads for each school route."""
    if stage_id.startswith(('05_', '06_')):
        prefixes = ('LM_Girls_', 'LM_AC_Girls_', 'Basketball_', 'Court_', 'Field_',
                    'Foreground_Grass_', 'Campus_Ground', 'LM_Tree_', 'Warm_', 'Facade_')
    elif stage_id.startswith(('07_', '08_')):
        prefixes = ('LM_Boys_Field_', 'Basketball_', 'Court_', 'Field_',
                    'Foreground_Grass_', 'Campus_Ground', 'LM_Tree_', 'Warm_', 'Facade_')
    elif stage_id.startswith('10_'):
        prefixes = ('Memorial_', 'Formal_Garden_', 'Garden_', 'LM_Palm_',
                    'Campus_Ground', 'LM_Tree_', 'Warm_', 'Facade_')
    else:
        prefixes = ('LM_Main', 'LM_Left', 'LM_Right', 'LM_Facade', 'LM_Rotunda_',
                    'LM_COL_', 'LM_Portico_', 'LM_Rooftop_', 'LM_Drum_', 'LM_ROT_',
                    'LM_STAIRS_', 'LM_Stair_', 'Campus_Ground', 'Main_Forecourt',
                    'LM_Tree_', 'LM_ParkedCar_', 'Warm_', 'Facade_')
    for obj in scene.objects:
        if obj.type in {'CAMERA', 'LIGHT'} or obj.name == 'Path_QA_Camera':
            obj.hide_render = False
        else:
            obj.hide_render = not obj.name.startswith(prefixes)

for stage in STAGES:
    if stage_filter and stage['id'] not in stage_filter:
        continue
    set_route_visibility(stage['id'])
    points = stage['points']
    indices = sorted(set((0, min(1, len(points) - 1), max(0, len(points) - 2), len(points) - 1)))
    labels = ('start', 'ground_or_detail', 'focus', 'end')
    for label, index in zip(labels, indices):
        if label_filter and label not in label_filter:
            continue
        position, look_at = points[index]
        camera.location = Vector(to_blender(position))
        target = Vector(to_blender(look_at))
        camera.rotation_euler = (target - camera.location).to_track_quat('-Z', 'Y').to_euler()
        camera.data.angle = math.radians(stage['fov'])
        scene.render.filepath = os.path.join(OUT, f"{stage['id']}_{label}.png")
        bpy.ops.render.render(write_still=True)
        print('Rendered', stage['id'], label)
