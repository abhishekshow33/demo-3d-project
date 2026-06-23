import bpy
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
scene = bpy.context.scene

font_objects = [obj for obj in scene.objects if obj.type in {'FONT', 'CURVE'}]
if font_objects:
    bpy.ops.object.select_all(action='DESELECT')
    for obj in font_objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = font_objects[0]
    bpy.ops.object.convert(target='MESH')

for obj in [o for o in scene.objects if o.type == 'MESH' and o.modifiers]:
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    for modifier in list(obj.modifiers):
        try:
            bpy.ops.object.modifier_apply(modifier=modifier.name)
        except RuntimeError:
            pass

material_groups = {}
for obj in [o for o in scene.objects if o.type == 'MESH' and len(o.data.materials) == 1]:
    material_groups.setdefault(obj.data.materials[0].name, []).append(obj)

for material_name, objects in material_groups.items():
    if len(objects) < 2:
        continue
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    objects[0].name = 'WEB_' + material_name.replace(' ', '_')

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, 'LaMartiniere_School_Web_Optimized.blend'))
bpy.ops.export_scene.gltf(
    filepath=os.path.join(ROOT, 'LaMartiniere_School_Web.glb'),
    export_format='GLB',
    export_apply=True,
    export_cameras=False,
    export_lights=False,
)
