"""Generate lightweight Boys and Girls pool zones for the three-building web experience.

Run:
  blender --background --python deliverables/build_three_building_experiences.py
"""

import json
import os

import bpy


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT = os.path.join(ROOT, 'public', 'models', 'experiences')


def mat(name, color, roughness=.5, metallic=0):
    material = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    material.diffuse_color = (*color, 1)
    material.use_nodes = True
    principled = material.node_tree.nodes.get('Principled BSDF')
    principled.inputs['Base Color'].default_value = (*color, 1)
    principled.inputs['Roughness'].default_value = roughness
    principled.inputs['Metallic'].default_value = metallic
    return material


def cube(name, location, dimensions, material, collection):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    for current in list(obj.users_collection):
        current.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


def cylinder(name, location, radius, depth, material, collection):
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=radius, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    for current in list(obj.users_collection):
        current.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


def fresh_collection(name):
    old = bpy.data.collections.get(name)
    if old:
        for obj in list(old.objects):
            bpy.data.objects.remove(obj, do_unlink=True)
        bpy.data.collections.remove(old)
    collection = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(collection)
    return collection


def build_pool(school, accent):
    collection = fresh_collection(f'WEB_{school.upper()}_POOL')
    stone = mat(f'{school}_Pool_Stone', (.64, .59, .49), .72)
    water = mat(f'{school}_Pool_Water', accent, .12, .08)
    line = mat(f'{school}_Pool_Lines', (.82, .96, .98), .38)
    metal = mat(f'{school}_Pool_Metal', (.46, .53, .56), .25, .7)
    cube(f'{school}_Pool_Deck', (0, 0, .0), (31, 16, .25), stone, collection)
    cube(f'{school}_Pool_Water', (0, 0, .18), (27, 12, .12), water, collection)
    for lane in (-4, 0, 4):
        cube(f'{school}_Pool_Lane_{lane}', (0, lane, .27), (26, .05, .03), line, collection)
    for x in (-13, 13):
        for y in (-5.5, 5.5):
            cylinder(f'{school}_Pool_Ladder_{x}_{y}', (x, y, .8), .06, 1.6, metal, collection)
    return collection


def export_collection(collection, path):
    bpy.ops.object.select_all(action='DESELECT')
    for obj in collection.objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = next(iter(collection.objects))
    bpy.ops.export_scene.gltf(
        filepath=path, export_format='GLB', use_selection=True, export_apply=True,
        export_cameras=False, export_lights=False, export_animations=False,
    )


def main():
    os.makedirs(os.path.join(OUTPUT, 'boys'), exist_ok=True)
    os.makedirs(os.path.join(OUTPUT, 'girls'), exist_ok=True)
    boys = build_pool('boys', (.05, .43, .65))
    girls = build_pool('girls', (.10, .55, .66))
    export_collection(boys, os.path.join(OUTPUT, 'boys', 'pool.glb'))
    export_collection(girls, os.path.join(OUTPUT, 'girls', 'pool.glb'))
    manifest = {
        'generatedBy': 'deliverables/build_three_building_experiences.py',
        'zones': {
            'shared': ['exterior', 'entrance', 'interior', 'gallery', 'vegetation', 'weathering'],
            'boys': ['exterior', 'entrance', 'interior', 'gallery', 'courts', 'field', 'pool', 'vegetation', 'weathering'],
            'girls': ['exterior', 'entrance', 'interior', 'gallery', 'courts', 'field', 'pool', 'vegetation', 'weathering'],
        },
        'performance': {'maxZoneBytes': 5242880, 'desktopFps': 50, 'mobileFps': 30},
    }
    with open(os.path.join(OUTPUT, 'manifest.json'), 'w', encoding='utf-8') as handle:
        json.dump(manifest, handle, indent=2)
    print('Generated three-building experience zones in', OUTPUT)


if __name__ == '__main__':
    main()
