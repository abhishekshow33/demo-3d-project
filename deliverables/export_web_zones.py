import bpy
import os
import sys


ROOT = os.path.dirname(os.path.abspath(__file__))
OUTPUT = os.path.join(os.path.dirname(ROOT), 'public', 'models', 'zones')
os.makedirs(OUTPUT, exist_ok=True)


def starts(name, prefixes):
    return any(name.startswith(prefix) for prefix in prefixes)


def zone_for(obj):
    name = obj.name
    if obj.type not in {'MESH', 'FONT', 'CURVE'}:
        return None
    if starts(name, ('LM_Rotunda_', 'LM_Portico_', 'LM_Rooftop_', 'LM_Drum_', 'LM_Roof_Finial_', 'LM_COL_', 'LM_CentralDoor', 'LM_ROT_DOOR_', 'LM_STAIRS_', 'LM_Stair_')):
        return 'rotunda'
    if starts(name, ('LM_Corridor_', 'LM_Modern_', 'LM_Internal_', 'Internal_Road_', 'Road_Wear_', 'LM_Road_')):
        return 'road'
    if starts(name, ('LM_Boys_Field_', 'LM_Boys_Roof_')):
        return 'boys'
    if starts(name, ('LM_Girls_', 'LM_AC_Girls_')):
        return 'girls'
    if starts(name, ('Basketball_', 'Court_', 'Field_', 'Foreground_Grass_')):
        return 'field'
    if starts(name, ('Formal_Garden_', 'Memorial_', 'Garden_', 'LM_Palm_')):
        return 'garden'
    if starts(name, ('LM_Main', 'LM_Left', 'LM_Right', 'LM_Facade', 'LM_Rear', 'LM_Side', 'LM_Balcony', 'LM_AC_Main', 'LM_DrainPipe', 'LM_Subtle', 'LM_Crest', 'LM_Heritage_')):
        return 'heritage'
    if starts(name, ('Campus_Ground', 'Main_Forecourt')):
        return 'ground'
    if any(token in name for token in ('Stain', 'Dirt', 'Weather', 'Wear', 'Scuff', 'Crack', 'Shadow', 'Patch', 'Base_AO', 'Grime')):
        return 'weathering'
    return 'props'


def prepare_scene():
    fonts = [obj for obj in bpy.context.scene.objects if obj.type in {'FONT', 'CURVE'}]
    if fonts:
        bpy.ops.object.select_all(action='DESELECT')
        for obj in fonts:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = fonts[0]
        bpy.ops.object.convert(target='MESH')
    for obj in [item for item in bpy.context.scene.objects if item.type == 'MESH' and item.modifiers]:
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        for modifier in list(obj.modifiers):
            try:
                bpy.ops.object.modifier_apply(modifier=modifier.name)
            except RuntimeError:
                pass


def export_selected(path):
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_cameras=False,
        export_lights=False,
        export_animations=False,
    )


prepare_scene()
objects = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
zones = {name: [] for name in ('ground', 'rotunda', 'heritage', 'boys', 'girls', 'garden', 'field', 'road', 'props', 'weathering')}
for obj in objects:
    zone = zone_for(obj)
    if zone:
        zones[zone].append(obj)

cli = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
zone_value = cli[0] if cli else os.environ.get('ZONE_FILTER', '')
zone_filter = {value.strip() for value in zone_value.split(',') if value.strip()}
for zone, members in zones.items():
    if zone_filter and zone not in zone_filter:
        continue
    bpy.ops.object.select_all(action='DESELECT')
    for obj in members:
        obj.select_set(True)
    if members:
        bpy.context.view_layer.objects.active = members[0]
        export_selected(os.path.join(OUTPUT, zone + '.glb'))

    high_size = os.path.getsize(os.path.join(OUTPUT, zone + '.glb')) / 1024 / 1024 if members else 0
    print(f'{zone}: {len(members)} detailed objects, size={high_size:.2f}MB')
