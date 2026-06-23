import bpy
import math
import os
from mathutils import Vector


ROOT = os.path.dirname(os.path.abspath(__file__))
TAU = math.tau


def reset_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        pass


def material(name, color, roughness=0.55, metallic=0.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Metallic'].default_value = metallic
    return mat


def collection(name):
    col = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if col.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(col)
    return col


def move_to_collection(obj, col):
    for old in list(obj.users_collection):
        old.objects.unlink(obj)
    col.objects.link(obj)


def box(name, loc, scale, mat, col, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = (scale[0] / 2, scale[1] / 2, scale[2] / 2)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if mat:
        obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new('Soft heritage edges', 'BEVEL')
        mod.width = bevel
        mod.segments = 2
    move_to_collection(obj, col)
    return obj


def cylinder(name, loc, radius, depth, mat, col, vertices=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc)
    obj = bpy.context.object
    obj.name = name
    if mat:
        obj.data.materials.append(mat)
    move_to_collection(obj, col)
    return obj


def rotated_box(name, loc, scale, rotation, mat, col, bevel=0.0):
    obj = box(name, loc, scale, mat, col, bevel)
    obj.rotation_euler = rotation
    return obj


def column(name, x, y, z0, height, radius, mats, col):
    stone, accent = mats
    cylinder(name, (x, y, z0 + height / 2), radius, height, stone, col, 20)
    cylinder(name + '_Base', (x, y, z0 + 0.25), radius * 1.35, 0.5, accent, col, 20)
    cylinder(name + '_Capital', (x, y, z0 + height - 0.25), radius * 1.45, 0.5, accent, col, 20)
    box(name + '_Abacus', (x, y, z0 + height + 0.03), (radius * 3.25, radius * 3.25, 0.32), accent, col, 0.05)


def arch_panel(name, x, y, z, width, height, mat, col, depth=0.18, segments=12):
    r = width / 2
    spring = height - r
    outline = [(-r, 0), (-r, spring)]
    for i in range(segments + 1):
        a = math.pi - math.pi * i / segments
        outline.append((r * math.cos(a), spring + r * math.sin(a)))
    outline += [(r, 0)]
    verts = [(px + x, y - depth / 2, pz + z) for px, pz in outline]
    verts += [(px + x, y + depth / 2, pz + z) for px, pz in outline]
    n = len(outline)
    faces = [tuple(range(n)), tuple(range(n, 2 * n))]
    for i in range(n):
        j = (i + 1) % n
        faces.append((i, j, n + j, n + i))
    mesh = bpy.data.meshes.new(name + '_Mesh')
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    col.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def curved_wall_shell(name, cx, cy, z0, height, outer_radius, thickness, start_degrees, end_degrees, mat, col, segments=64):
    """Thin rotunda wall with an intentional front opening, never a solid drum."""
    inner_radius = outer_radius - thickness
    verts = []
    for i in range(segments + 1):
        angle = math.radians(start_degrees + (end_degrees - start_degrees) * i / segments)
        for radius in (outer_radius, inner_radius):
            verts.append((cx + radius * math.cos(angle), cy + radius * math.sin(angle), z0))
            verts.append((cx + radius * math.cos(angle), cy + radius * math.sin(angle), z0 + height))
    faces = []
    for i in range(segments):
        a = i * 4; b = (i + 1) * 4
        faces.extend(((a, b, b + 1, a + 1), (a + 2, a + 3, b + 3, b + 2),
                      (a + 1, b + 1, b + 3, a + 3), (a, a + 2, b + 2, b)))
    faces.extend(((0, 1, 3, 2), (len(verts)-4, len(verts)-2, len(verts)-1, len(verts)-3)))
    mesh = bpy.data.meshes.new(name + '_Mesh')
    mesh.from_pydata(verts, [], faces); mesh.update()
    obj = bpy.data.objects.new(name, mesh); col.objects.link(obj); obj.data.materials.append(mat)
    bevel = obj.modifiers.new('Rotunda shell edge bevel', 'BEVEL'); bevel.width = .06; bevel.segments = 2
    return obj


def pediment(name, center, width, depth, rise, mat, col):
    x, y, z = center
    verts = [
        (x-width/2, y-depth/2, z), (x+width/2, y-depth/2, z), (x, y-depth/2, z+rise),
        (x-width/2, y+depth/2, z), (x+width/2, y+depth/2, z), (x, y+depth/2, z+rise),
    ]
    faces = [(0,1,2), (3,5,4), (0,3,4,1), (1,4,5,2), (2,5,3,0)]
    mesh = bpy.data.meshes.new(name + '_Mesh')
    mesh.from_pydata(verts, [], faces)
    obj = bpy.data.objects.new(name, mesh)
    col.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def tree(name, x, y, scale, trunk, leaf, col):
    cylinder(name + '_Trunk', (x, y, 2.0 * scale), 0.35 * scale, 4 * scale, trunk, col, 10)
    for dx, dy, dz, s in [(-.7,0,5,.95),(.7,.2,5.2,.9),(0,-.5,6,1.0)]:
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=2.2*s*scale, location=(x+dx*scale,y+dy*scale,dz*scale))
        o=bpy.context.object; o.name=name+'_Canopy'; o.data.materials.append(leaf); move_to_collection(o,col)


def palm(name, x, y, scale, trunk, leaf, col):
    cylinder(name + '_RingedTrunk', (x, y, 3.4 * scale), .28 * scale, 6.8 * scale, trunk, col, 12)
    for i in range(7):
        a = TAU * i / 7
        frond = box(
            name + f'_Frond_{i+1:02d}',
            (x + math.cos(a) * 2.0 * scale, y + math.sin(a) * 2.0 * scale, 7.0 * scale),
            (4.6 * scale, .42 * scale, .12 * scale), leaf, col, .04
        )
        frond.rotation_euler = (math.radians(-8), math.radians(10), a)
    for z in range(1, 7):
        cylinder(name + f'_TrunkRing_{z}', (x, y, z * scale), .32 * scale, .08 * scale, trunk, col, 12)


def arch_window_module(name, x, y, z, width, height, mats, col, shutters=True, grills=False):
    frame, glass, shutter, metal = mats
    arch_panel(name + '_Recess', x, y + .12, z - .12, width + .5, height + .48, frame, col, .18)
    arch_panel(name + '_Glass', x, y - .06, z, width, height, glass, col, .2)
    box(name + '_Sill', (x, y - .19, z - .03), (width + .48, .28, .22), frame, col, .04)
    # Close-view construction: the frame sits proud of the plaster while the
    # glazing and fanlight remain visibly recessed. These pieces are deliberately
    # separate so grazing light can describe the opening at human-eye height.
    box(name + '_Jamb_L', (x - width * .53, y - .205, z + height * .43), (.12, .16, height * .86), frame, col, .025)
    box(name + '_Jamb_R', (x + width * .53, y - .205, z + height * .43), (.12, .16, height * .86), frame, col, .025)
    box(name + '_Mullion_V', (x, y - .285, z + height * .43), (.055, .045, height * .72), metal, col, .012)
    box(name + '_Mullion_H', (x, y - .285, z + height * .47), (width * .88, .045, .055), metal, col, .012)
    box(name + '_Sill_Drip', (x, y - .36, z - .13), (width + .58, .08, .07), frame, col, .018)
    if shutters:
        box(name + '_Shutter_L', (x - width * .72, y - .22, z + height * .42), (width * .34, .13, height * .76), shutter, col, .035)
        box(name + '_Shutter_R', (x + width * .72, y - .22, z + height * .42), (width * .34, .13, height * .76), shutter, col, .035)
        for side, sx in (('L', x - width * .72), ('R', x + width * .72)):
            for slat in range(7):
                box(name + f'_Shutter_{side}_Louver_{slat+1:02d}',
                    (sx, y - .305, z + height * (.18 + slat * .085)),
                    (width * .27, .045, .045), metal, col, .01)
            for hz in (z + height * .08, z + height * .75):
                cylinder(name + f'_Shutter_{side}_Hinge',
                         (sx + (-1 if side == 'L' else 1) * width * .18, y - .32, hz),
                         .035, .16, metal, col, 8).rotation_euler = (math.pi / 2, 0, 0)
    if grills:
        for gx in (-.3, 0, .3):
            box(name + '_Grill_V', (x + gx * width, y - .31, z + height * .42), (.035, .035, height * .72), metal, col)
        for gz in (.23, .48, .73):
            box(name + '_Grill_H', (x, y - .31, z + height * gz), (width * .82, .035, .035), metal, col)


def rectangular_window_module(name, x, y, z, width, height, mats, col, grills=False):
    frame, glass, shutter, metal = mats
    box(name + '_Recess', (x, y + .1, z + height / 2), (width + .42, .2, height + .4), frame, col, .04)
    box(name + '_Glass', (x, y - .08, z + height / 2), (width, .18, height), glass, col, .025)
    box(name + '_Jamb_L', (x-width*.54,y-.2,z+height/2),(.13,.16,height+.18),frame,col,.025)
    box(name + '_Jamb_R', (x+width*.54,y-.2,z+height/2),(.13,.16,height+.18),frame,col,.025)
    box(name + '_Lintel', (x,y-.2,z+height+.14),(width+.42,.18,.20),frame,col,.035)
    box(name + '_Sill_Drip', (x,y-.34,z-.08),(width+.48,.08,.10),frame,col,.02)
    box(name + '_Mullion_V', (x,y-.30,z+height/2),(.055,.04,height*.88),metal,col,.01)
    box(name + '_Mullion_H', (x,y-.30,z+height/2),(width*.92,.04,.055),metal,col,.01)
    box(name + '_Shutter_L', (x - width * .68, y - .2, z + height / 2), (width * .28, .11, height), shutter, col, .025)
    box(name + '_Shutter_R', (x + width * .68, y - .2, z + height / 2), (width * .28, .11, height), shutter, col, .025)
    if grills:
        for gx in (-.3, 0, .3): box(name + '_Grill_V', (x + gx * width, y - .3, z + height / 2), (.035,.035,height*.9), metal, col)
        for gz in (-.25, 0, .25): box(name + '_Grill_H', (x, y - .3, z + height / 2 + gz * height), (width*.9,.035,.035), metal, col)


def semicircle_step(name, cx, cy, radius, z, depth, mat, col, segments=40):
    verts = [(cx, cy, z - depth / 2), (cx, cy, z + depth / 2)]
    for i in range(segments + 1):
        a = math.pi + math.pi * i / segments
        verts.append((cx + radius * math.cos(a), cy + radius * math.sin(a), z - depth / 2))
        verts.append((cx + radius * math.cos(a), cy + radius * math.sin(a), z + depth / 2))
    faces = []
    for i in range(segments):
        a = 2 + i * 2
        b = a + 2
        faces.extend([(0, b, a), (1, a + 1, b + 1), (a, b, b + 1, a + 1)])
    faces += [(0, 2, 3, 1), (0, 1, len(verts)-1, len(verts)-2)]
    mesh = bpy.data.meshes.new(name + '_Mesh')
    mesh.from_pydata(verts, [], faces); mesh.update()
    obj = bpy.data.objects.new(name, mesh); col.objects.link(obj); obj.data.materials.append(mat)
    bevel = obj.modifiers.new('Stair nosing bevel', 'BEVEL'); bevel.width = .035; bevel.segments = 2
    return obj


def railing_ring(name, cx, cy, radius, z, metal, col, count=28):
    for i in range(count):
        a = TAU * i / count
        x, y = cx + radius * math.cos(a), cy + radius * math.sin(a)
        cylinder(name + f'_Post_{i+1:02d}', (x, y, z + .55), .045, 1.1, metal, col, 8)
    bpy.ops.mesh.primitive_torus_add(major_radius=radius, minor_radius=.055, major_segments=count, minor_segments=8, location=(cx, cy, z + 1.05))
    rail = bpy.context.object; rail.name = name + '_TopRail'; rail.data.materials.append(metal); move_to_collection(rail, col)


def text_sign(name, text, loc, size, mat, col, align='CENTER'):
    bpy.ops.object.text_add(location=loc, rotation=(math.pi / 2, 0, 0))
    obj = bpy.context.object; obj.name = name; obj.data.body = text; obj.data.align_x = align
    obj.data.size = size; obj.data.extrude = .055; obj.data.bevel_depth = .012; obj.data.materials.append(mat)
    move_to_collection(obj, col)
    return obj


def text_sign_reverse(name, text, loc, size, mat, col, align='CENTER'):
    # Face +Y while keeping the glyph baseline upright in world Z.
    bpy.ops.object.text_add(location=loc, rotation=(math.pi / 2, 0, math.pi))
    obj = bpy.context.object; obj.name = name; obj.data.body = text; obj.data.align_x = align
    obj.data.size = size; obj.data.extrude = .055; obj.data.bevel_depth = .012; obj.data.materials.append(mat)
    move_to_collection(obj, col)
    return obj


def ac_unit(name, x, y, z, white, dark, col):
    box(name + '_Body', (x, y, z), (1.35,.55,.82), white, col, .08)
    cylinder(name + '_Fan', (x, y-.3, z), .28, .06, dark, col, 16).rotation_euler = (math.pi/2,0,0)
    box(name + '_Bracket_L', (x-.4,y+.1,z-.55), (.08,.7,.4), dark, col)
    box(name + '_Bracket_R', (x+.4,y+.1,z-.55), (.08,.7,.4), dark, col)


def planter(name, x, y, scale, stone, leaf, col):
    cylinder(name + '_Pot', (x,y,.45*scale), .55*scale, .9*scale, stone, col, 12)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=.75*scale, location=(x,y,1.25*scale))
    o=bpy.context.object; o.name=name+'_Plant'; o.data.materials.append(leaf); move_to_collection(o,col)


def lowpoly_car(name, x, y, rot, body, glass, dark, col):
    base = rotated_box(name+'_Body',(x,y,.65),(4.2,1.75,.9),(0,0,rot),body,col,.18)
    cabin = rotated_box(name+'_Cabin',(x,y,.0),(2.2,1.55,.72),(0,0,rot),glass,col,.15)
    cabin.location.z = 1.28
    for sx in (-1.35,1.35):
        for sy in (-.84,.84):
            dx=sx*math.cos(rot)-sy*math.sin(rot); dy=sx*math.sin(rot)+sy*math.cos(rot)
            cylinder(name+'_Wheel',(x+dx,y+dy,.42),.34,.22,dark,col,12).rotation_euler=(math.pi/2,0,rot)


def bench(name, x, y, rot, wood, metal, col):
    rotated_box(name+'_Seat',(x,y,.75),(2.4,.55,.16),(0,0,rot),wood,col,.05)
    rotated_box(name+'_Back',(x-.24*math.sin(rot),y+.24*math.cos(rot),1.25),(2.4,.12,.85),(0,0,rot),wood,col,.04)
    for s in (-.85,.85):
        dx=s*math.cos(rot); dy=s*math.sin(rot)
        box(name+'_Leg',(x+dx,y+dy,.38),(.12,.12,.75),metal,col)


def lamp(name, x, y, metal, glow, col):
    cylinder(name+'_Pole',(x,y,2.8),.09,5.6,metal,col,10)
    box(name+'_Arm',(x+.35,y,5.45),(.7,.1,.1),metal,col)
    box(name+'_Lantern',(x+.72,y,5.22),(.45,.35,.55),glow,col,.06)


def bollard(name, x, y, metal, col):
    cylinder(name,(x,y,.45),.13,.9,metal,col,12)


def notice_board(name, x, y, z, text, frame, face, col):
    box(name+'_Frame',(x,y,z),(3.0,.18,2.0),frame,col,.08)
    box(name+'_Face',(x,y-.12,z),(2.72,.08,1.72),face,col,.03)
    text_sign(name+'_Text',text,(x,y-.19,z-.08),.32,frame,col)


def corridor_door(name, x, y, z, frame, panel, glass, metal, col):
    box(name + '_Recess', (x, y + .10, z + 2.25), (2.65, .28, 4.75), frame, col, .06)
    box(name + '_Panel', (x, y - .08, z + 1.72), (2.22, .18, 3.45), panel, col, .05)
    box(name + '_Transom', (x, y - .09, z + 4.02), (2.22, .16, .72), glass, col, .04)
    box(name + '_Threshold', (x, y - .32, z + .08), (2.7, .65, .16), frame, col, .04)
    cylinder(name + '_Handle', (x + .78, y - .22, z + 1.76), .055, .30, metal, col, 8).rotation_euler = (math.pi / 2, 0, 0)
    # Panel moulding, working hardware and divided transom keep corridor doors
    # readable during the wall-pan shot instead of appearing as flat rectangles.
    for row, panel_z in enumerate((z+.72, z+1.62, z+2.58)):
        box(name + f'_RaisedPanel_{row+1:02d}', (x, y-.205, panel_z), (1.72,.055,.62), frame, col, .045)
        box(name + f'_PanelInset_{row+1:02d}', (x, y-.238, panel_z), (1.42,.025,.38), panel, col, .025)
    for side in (-1, 1):
        for hinge_z in (z+.48, z+1.72, z+3.02):
            cylinder(name + f'_Hinge_{side}_{hinge_z:.2f}', (x+side*1.02,y-.225,hinge_z), .045,.24,metal,col,10).rotation_euler=(math.pi/2,0,0)
    for mullion_x in (-.55, 0, .55):
        box(name + '_TransomMullion', (x+mullion_x,y-.20,z+4.02), (.045,.04,.64), metal,col,.01)
    box(name + '_HandlePlate', (x+.78,y-.235,z+1.76),(.16,.035,.42),metal,col,.025)
    cylinder(name + '_Keyhole', (x+.78,y-.265,z+1.52),.025,.04,metal,col,8).rotation_euler=(math.pi/2,0,0)


def wall_plaque(name, x, y, z, width, height, frame, face, col):
    box(name + '_Frame', (x, y, z), (width + .18, .12, height + .18), frame, col, .04)
    box(name + '_Face', (x, y - .08, z), (width, .06, height), face, col, .025)


def shallow_awning(name, x, y, z, width, depth, material_, col, faces_positive_y=False):
    """A weathered masonry hood matching the field-facing window canopies."""
    direction = 1 if faces_positive_y else -1
    hood = box(name, (x, y + direction * depth / 2, z), (width, depth, .22), material_, col, .06)
    hood.rotation_euler.x = math.radians(direction * -4)
    return hood


def balcony_rail(name, center_x, y, z, width, metal_, col, post_spacing=1.15):
    box(name + '_Top', (center_x, y, z + .95), (width, .08, .08), metal_, col)
    box(name + '_Bottom', (center_x, y, z + .12), (width, .07, .07), metal_, col)
    count = max(2, int(width / post_spacing))
    for i in range(count + 1):
        x = center_x - width / 2 + width * i / count
        box(name + f'_Post_{i+1:02d}', (x, y, z + .53), (.045, .045, .85), metal_, col)


def quoin_stack(name, x, y, z0, height, depth, stone_, col, faces_positive_y=False):
    """Alternating corner stones used on the Girls and Boys field elevations."""
    direction = 1 if faces_positive_y else -1
    rows = int(height / .72)
    for i in range(rows):
        width = 1.05 if i % 2 == 0 else .78
        box(name + f'_{i+1:02d}', (x, y + direction * depth / 2, z0 + .36 + i * .72), (width, depth, .58), stone_, col, .035)


def facade_windows(prefix, xs, front_y, levels, mat, col, width=1.4, height=2.35):
    for li, z in enumerate(levels):
        for i, x in enumerate(xs):
            arch_panel(f'{prefix}_L{li+1}_{i+1:02d}', x, front_y, z, width, height, mat, col)


def build():
    reset_scene()
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.length_unit = 'METERS'
    scene.render.engine = 'BLENDER_EEVEE_NEXT'
    scene.render.resolution_x = 1600
    scene.render.resolution_y = 1000
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.film_transparent = False
    scene.world.color = (0.055, 0.075, 0.11)

    white = material('Heritage Off White', (0.82, 0.81, 0.72), .74)
    aged_white = material('Aged Plaster Variation', (0.69, 0.68, 0.61), .82)
    trim = material('Warm Limestone Trim', (0.94, 0.91, 0.79), .66)
    glass = material('Shadowed Blue Glass', (0.055, 0.11, 0.15), .28, .05)
    shutter = material('Muted Lavender Grey', (0.31, 0.28, 0.36), .72)
    stone = material('Weathered Stair Stone', (0.39, 0.40, 0.38), .9)
    grass = material('Monsoon Lawn', (0.12, 0.31, 0.13), .96)
    grass2 = material('Formal Garden Green', (0.18, 0.40, 0.16), .98)
    road = material('Campus Asphalt', (0.10, 0.11, 0.12), .96)
    court = material('Terracotta Court', (0.56, 0.22, 0.12), .88)
    courtblue = material('Court Blue', (0.06, 0.27, 0.43), .82)
    line = material('Court Lines', (0.92, 0.87, 0.67), .75)
    trunk = material('Tree Trunk', (0.18, 0.09, 0.035), 1)
    leaf = material('Tree Canopy', (0.045, 0.19, 0.06), .95)
    bronze = material('Memorial Bronze', (0.17, 0.11, 0.055), .45, .45)
    roof = material('Weathered Roof Concrete', (0.48, 0.47, 0.43), .9)
    metal = material('Dark Campus Metal', (0.055, 0.065, 0.07), .68, .55)
    dirt = material('Subtle Weathering', (0.19, 0.16, 0.12), .98)
    curb = material('Road Curb Stone', (0.54, 0.53, 0.49), .92)
    flower = material('Garden Flower Accent', (0.52, 0.055, 0.09), .92)
    wood = material('Campus Bench Wood', (0.29, 0.12, 0.045), .75)
    sign_face = material('Notice Board Green', (0.055, 0.18, 0.13), .7)
    lamp_glow = material('Lamp Glass', (0.95, 0.72, 0.28), .25)
    car_maroon = material('Car Maroon', (0.28, 0.025, 0.035), .36, .35)
    car_silver = material('Car Silver', (0.44, 0.47, 0.48), .3, .65)
    car_blue = material('Car Blue', (0.03, 0.13, 0.25), .32, .45)
    patch_brown = material('Worn Field Patch', (0.29, 0.19, 0.075), .99)

    ground_col = collection('06_Ground_Field_Courts_Roads')
    main_col = collection('02_Main_Heritage_Block')
    rot_col = collection('03_Rotunda_Portico')
    girls_col = collection('04_Girls_Field_Block')
    modern_col = collection('05_Modern_Internal_Block')
    landscape_col = collection('07_Landscape_Trees_Plants')
    props_col = collection('08_Props_Signs_Railings_AC')
    service_col = collection('06_Service_AC_Pipes_Cables')
    weather_col = collection('10_Weathering_Decals')
    life_col = collection('09_Props_Campus_Life')

    box('Campus_Ground', (0, 40, -0.35), (180, 210, .7), grass, ground_col)
    box('Main_Forecourt', (0, -19, .01), (78, 24, .08), road, ground_col)
    box('Internal_Road', (-72, 45, .02), (10, 140, .10), road, ground_col)
    box('Internal_Road_Curb_L', (-77.2,45,.22),(.45,140,.42),curb,ground_col,.08)
    box('Internal_Road_Curb_R', (-66.8,45,.22),(.45,140,.42),curb,ground_col,.08)
    for i,(px,py,sx,sy) in enumerate([(-71,15,2.3,5.5),(-73,48,3.2,7),(-70,88,2.6,6.5)]):
        box(f'Road_Wear_Patch_{i+1}',(px,py,.085),(sx,sy,.035),aged_white,weather_col,.18)
    box('LM_Road_SpeedBreaker',(-72,20,.18),(9.2,.8,.28),curb,ground_col,.12)
    for stripe,x in enumerate((-75.5,-73.2,-70.8,-68.5)):
        box(f'LM_Road_SpeedBreaker_Stripe_{stripe+1}',(x,20,.335),(1.0,.82,.035),line,ground_col,.02)
    for i,(px,py,rot) in enumerate([(-73.8,12,.18),(-72.2,15,-.14),(-70.6,18,.22)]):
        rotated_box(f'LM_Road_Cable_{i+1}',(px,py,.16),(4.2,.09,.08),(0,0,rot),metal,props_col,.035)

    # Uneven field tone and boundary strips keep the ground from reading as a flat plane.
    for i,(px,py,sx,sy) in enumerate([(-30,38,18,9),(28,48,23,12),(-14,83,15,7),(35,112,20,8)]):
        box(f'Field_Worn_Patch_{i+1}',(px,py,.055),(sx,sy,.025),patch_brown,weather_col,.5)
    box('Field_Boundary_Front',(0,31,.14),(122,.32,.28),curb,ground_col,.05)

    # Main heritage facade, centered on the rotunda.
    box('LM_MainBlock', (0, 5.0, 7), (90, 18, 14), white, main_col, .16)
    box('LM_LeftWing_Upper', (-31, 4.6, 15.25), (27, 17, 2.5), white, main_col, .12)
    box('LM_RightWing_Upper', (31, 4.6, 15.25), (27, 17, 2.5), white, main_col, .12)
    box('LM_LeftWing_RoofPatch',(-31,4.6,16.55),(26,16,.18),roof,weather_col,.08)
    box('LM_RightWing_RoofPatch',(31,4.6,16.55),(26,16,.18),roof,weather_col,.08)
    box('LM_MainRoof_Parapet', (0, 4.8, 14.2), (91, 18.5, 0.75), trim, main_col, .08)
    box('LM_Main_Facade_Ledge_L',(-31,-4.45,8.9),(28,.52,.38),trim,main_col,.06)
    box('LM_Main_Facade_Ledge_R',(31,-4.45,8.9),(28,.52,.38),trim,main_col,.06)
    for x in (-44,-22,22,44):
        box('LM_Facade_Pilaster', (x, -4.15, 7.2), (1.0,.55,14.4), trim, main_col, .07)
    wing_xs = [x for x in range(-41, 42, 5) if abs(x) > 15]
    for li,z in enumerate([2.2,6.4,10.5]):
        for wi,x in enumerate(wing_xs):
            arch_window_module(f'LM_Main_Window_L{li+1}_{wi+1:02d}',x,-4.32,z,1.65,2.55,(trim,glass,shutter,metal),main_col,True,li==0)
            if (wi+li)%3==0:
                box('LM_Window_Dirt',(x,-4.52,z-.18),(.72,.035,.78),dirt,weather_col,.08)

    # Rear and east-side elevations are visible during the garden and field
    # transition. They must carry the same rhythm as the hero facade rather than
    # reading as blank extrusion walls.
    for li,z in enumerate([2.2,6.4,10.5]):
        for wi,x in enumerate(wing_xs):
            arch_panel(f'LM_Rear_Window_L{li+1}_{wi+1:02d}',x,14.12,z,1.65,2.55,glass,main_col,.22)
            box(f'LM_Rear_Window_Frame_L{li+1}_{wi+1:02d}',(x,14.24,z+1.1),(2.05,.18,3.0),trim,main_col,.05)
            arch_panel(f'LM_Rear_Window_Glass_L{li+1}_{wi+1:02d}',x,14.36,z,1.65,2.55,glass,main_col,.24)
    for side in (-1, 1):
        sx = side * 45.12
        for li,z in enumerate([3.3,7.5,11.6]):
            for yi,y in enumerate((0.0,5.0,10.0)):
                box(f'LM_Side_Window_Frame_{side}_{li}_{yi}',(sx,y,z),(0.20,2.35,2.85),trim,main_col,.05)
                box(f'LM_Side_Window_Glass_{side}_{li}_{yi}',(sx+side*.12,y,z),(0.12,1.72,2.30),glass,main_col,.04)

    # Service objects are deliberately irregular, as in a functioning school facade.
    for i,(x,z) in enumerate([(-39,7.2),(-29,3.8),(-19,11.0),(21,7.4),(31,3.9),(41,10.9)]):
        ac_unit(f'LM_AC_Main_{i+1:02d}',x,-4.75,z,aged_white,metal,service_col)
        box(f'LM_AC_Stain_{i+1:02d}',(x,-4.53,z-.85),(.5,.035,1.15),dirt,weather_col,.05)
    for i,x in enumerate((-43.2,-23.2,23.2,43.2)):
        cylinder(f'LM_DrainPipe_{i+1:02d}',(x,-4.65,6.5),.11,12.5,metal,service_col,10)
        box(f'LM_PipeStain_{i+1:02d}',(x,-4.48,6.3),(.34,.03,12.0),dirt,weather_col,.04)
    box('LM_Subtle_Service_Cable',(-30,-4.82,12.9),(24,.055,.055),metal,service_col)

    # Balcony / facade rail strips.
    for side in (-1,1):
        sx=side*31
        box('LM_Balcony_Rail_Top',(sx,-4.88,9.55),(25,.09,.09),metal,props_col)
        for x in [sx+i for i in range(-12,13,2)]:
            box('LM_Balcony_Rail_V',(x,-4.88,9.08),(.045,.045,.95),metal,props_col)

    # Curved rotunda and classical portico.
    curved_wall_shell('LM_Rotunda_OpenShell', 0, -1.8, 0, 14.2, 12.0, .48, -70, 250, white, rot_col, 72)
    box('LM_Rotunda_PortalPier_L',(-4.15,-13.15,6.85),(1.1,1.05,13.7),trim,rot_col,.08)
    box('LM_Rotunda_PortalPier_R',(4.15,-13.15,6.85),(1.1,1.05,13.7),trim,rot_col,.08)
    cylinder('LM_Rotunda_RoofBand', (0, -1.8, 14.35), 12.6, .75, trim, rot_col, 48)
    for i, angle in enumerate([205,222,239,256,273,290,307,324,341]):
        a=math.radians(angle)
        x,y=13.15*math.cos(a), -1.8+13.15*math.sin(a)
        column(f'LM_COL_MainPortico_{i+1:02d}',x,y,1.35,11.5,.62,(white,trim),rot_col)
    # Entablature and roof lip as broad rings.
    cylinder('LM_Portico_Entablature', (0,-1.8,13.15), 13.85, .9, trim, rot_col, 48)
    cylinder('LM_Rooftop_Drum', (0,-1.8,18.4), 9.5, 7.3, white, rot_col, 48)
    cylinder('LM_Rooftop_Drum_Cornice_Lower', (0,-1.8,15.15), 10.0, .55, trim, rot_col, 48)
    cylinder('LM_Rooftop_Drum_Cornice_Upper', (0,-1.8,22.0), 10.1, .65, trim, rot_col, 48)
    cylinder('LM_Rooftop_Weathered_Cap',(0,-1.8,22.42),9.65,.22,roof,weather_col,48)
    for i in range(12):
        a=TAU*i/12
        arch_panel(f'LM_Drum_Window_{i+1:02d}',9.0*math.cos(a),-1.8+9.0*math.sin(a),17.0,1.1,2.45,glass,rot_col,.25)
    railing_ring('LM_Drum_Parapet_Railing',0,-1.8,9.85,22.35,metal,props_col,30)
    for i in range(16):
        a=TAU*i/16
        x,y=10.25*math.cos(a),-1.8+10.25*math.sin(a)
        cylinder(f'LM_Roof_Finial_{i+1:02d}',(x,y,23.25),.11,.85,bronze,props_col,8)

    # Arched upper openings and recessed shutters behind the hero colonnade.
    for i,x in enumerate((-8.1,-5.4,-2.7,0,2.7,5.4,8.1)):
        arch_window_module(f'LM_Rotunda_UpperWindow_{i+1:02d}',x,-13.88,7.55,1.35,2.7,(trim,glass,shutter,metal),rot_col,True,False)
    # The real lower rotunda is an arcade, not a blank cylinder. Dark recesses,
    # fanlights and pale shutters retain depth when viewed between columns.
    for i, x in enumerate((-8.1, -5.4, -2.7, 2.7, 5.4, 8.1)):
        arch_panel(f'LM_Rotunda_LowerOpening_Trim_{i+1:02d}', x, -13.91, 1.05, 1.62, 4.9, trim, rot_col, .22)
        arch_panel(f'LM_Rotunda_LowerOpening_Shadow_{i+1:02d}', x, -14.05, 1.24, 1.25, 4.45, glass, rot_col, .18)
        box(f'LM_Rotunda_LowerShutter_{i+1:02d}', (x, -14.18, 2.75), (1.05, .12, 2.7), shutter, rot_col, .045)
        for bar in (-.32, 0, .32):
            box(f'LM_Rotunda_FanlightBar_{i+1:02d}', (x + bar, -14.27, 4.78), (.035, .035, .72), metal, props_col)
    # Ionic-style capital relief and square plinths are critical in the close pass.
    for i, angle in enumerate([205,222,239,256,273,290,307,324,341]):
        a = math.radians(angle)
        x, y = 13.15 * math.cos(a), -1.8 + 13.15 * math.sin(a)
        box(f'LM_COL_Plith_{i+1:02d}', (x, y, 1.17), (1.65, 1.65, .34), trim, rot_col, .06)
        for side in (-1, 1):
            cylinder(f'LM_COL_Volute_{i+1:02d}_{side}', (x + side * .63, y - .03, 12.62), .19, .20, trim, rot_col, 16).rotation_euler = (math.pi / 2, 0, 0)
    cylinder('LM_Rotunda_ParapetBand_Lower', (0, -1.8, 14.78), 12.75, .24, trim, rot_col, 64)
    cylinder('LM_Rotunda_ParapetBand_Upper', (0, -1.8, 15.08), 12.45, .22, white, rot_col, 64)
    arch_panel('LM_CentralDoor_Recess',0,-13.83,1.12,3.45,5.85,trim,props_col,.28)
    box('LM_ROT_DOOR_Center_Left',(-.70,-14.08,3.32),(1.34,.24,4.36),shutter,rot_col,.06)
    box('LM_ROT_DOOR_Center_Right',(.70,-14.08,3.32),(1.34,.24,4.36),shutter,rot_col,.06)
    cylinder('LM_ROT_DOOR_Handle_Left',(-.12,-14.24,3.12),.055,.28,bronze,rot_col,8).rotation_euler=(math.pi/2,0,0)
    cylinder('LM_ROT_DOOR_Handle_Right',(.12,-14.24,3.12),.055,.28,bronze,rot_col,8).rotation_euler=(math.pi/2,0,0)
    for side, x, hinge_x in (('Left',-.70,-1.34),('Right',.70,1.34)):
        for hinge_index, hinge_z in enumerate((1.55,3.25,4.95)):
            cylinder(f'LM_ROT_DOOR_{side}_Hinge_{hinge_index+1:02d}',
                     (hinge_x,-14.25,hinge_z),.055,.30,bronze,rot_col,10).rotation_euler=(math.pi/2,0,0)
        box(f'LM_ROT_DOOR_{side}_HandlePlate',(x + (.54 if side == 'Left' else -.54),-14.27,3.12),(.16,.04,.48),bronze,rot_col,.025)
    # Divided glazed fanlight above the leaves, based on the supplied frontal
    # references. The radial bars follow the arch rather than faking a rectangle.
    box('LM_ROT_DOOR_TransomRail',(0,-14.25,5.62),(2.78,.07,.10),bronze,rot_col,.018)
    for i, angle in enumerate((-62,-31,0,31,62)):
        a=math.radians(angle)
        bar=box(f'LM_ROT_DOOR_FanlightBar_{i+1:02d}',(math.sin(a)*.44,-14.27,6.15+math.cos(a)*.12),(.045,.045,1.12),bronze,rot_col,.01)
        bar.rotation_euler.y=-a
    box('LM_Rotunda_Landing',(0,-15.1,1.16),(20,3.1,.42),stone,rot_col,.08)
    # True semi-circular grand staircase with visible nosing on every riser.
    for i in range(10):
        semicircle_step(f'LM_STAIRS_Rotunda_{i+1:02d}',0,-1.8,14.2+i*.72,1.02-i*.105,.24,stone,rot_col,44)
    for x in (-10.2,10.2):
        cylinder('LM_Stair_Handrail_Post',(x,-15.0,1.55),.055,1.4,metal,props_col,8)
        rotated_box('LM_Stair_Handrail',(x,-18.2,2.05),(.09,7,.09),(0,0,0),metal,props_col)

    # Human-eye detail budget: molding rings, door panel depth, stair wear and
    # column-base grime are visible during the close portico walk.
    for i, angle in enumerate([205,222,239,256,273,290,307,324,341]):
        a = math.radians(angle)
        x, y = 13.15 * math.cos(a), -1.8 + 13.15 * math.sin(a)
        cylinder(f'LM_COL_BaseMolding_{i+1:02d}', (x, y, 1.72), .91, .18, trim, rot_col, 24)
        cylinder(f'LM_COL_CapitalMolding_{i+1:02d}', (x, y, 12.38), .94, .16, trim, rot_col, 24)
        cylinder(f'LM_COL_BaseGrime_{i+1:02d}', (x, y, 1.43), .70, .12, dirt, weather_col, 20)
    for side,x in (('Left',-.70),('Right',.70)):
        for row,row_z in enumerate((2.05, 3.25, 4.35)):
            box(f'LM_ROT_DOOR_{side}_Panel_{row+1}', (x, -14.27, row_z), (1.02, .08, .72), bronze, rot_col, .08)
    for i in range(10):
        box(f'LM_Stair_Wear_{i+1:02d}', (0, -16.15-i*.58, 1.15-i*.10), (5.2+i*.55, .10, .025), dirt, weather_col, .03)

    # Rain streaks and base contact darkening make the hero facade feel grounded.
    for i,x in enumerate((-9,-6,-3,3,6,9)):
        box(f'LM_Rotunda_Streak_{i+1:02d}',(x,-13.74,6.0+i%2),(.18,.025,3.8),dirt,weather_col,.04)
    box('LM_Rotunda_Base_AO',(0,-13.75,.42),(19,.04,.48),dirt,weather_col,.06)

    # Formal garden / memorial to the east.
    box('Formal_Garden_Lawn', (48,-6,.04), (30,25,.12), grass2, ground_col)
    cylinder('Memorial_Platform',(48,-6,.28),4.8,.48,stone,props_col,32)
    box('Memorial_Plinth',(48,-6,.95),(4.4,3.7,1.35),trim,props_col,.14)
    box('Memorial_Column',(48,-6,3.25),(3.65,3.0,4.25),trim,props_col,.16)
    box('Memorial_Capstone',(48,-6,5.52),(4.25,3.45,.42),stone,props_col,.12)
    bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=1.15, radius2=.56, depth=1.75, location=(48,-6,6.55))
    statue=bpy.context.object; statue.name='Memorial_Statue_Figure'; statue.data.materials.append(bronze); move_to_collection(statue,props_col)
    box('Memorial_Bust_Shoulders',(48,-6,6.15),(2.55,.92,.58),bronze,props_col,.22)
    cylinder('Memorial_Bust_Neck',(48,-6,7.45),.28,.48,bronze,props_col,16)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=.57, location=(48,-6,7.92))
    head=bpy.context.object; head.name='Memorial_Bust_Head'; head.scale=(.82,.78,1.08); head.data.materials.append(bronze); move_to_collection(head,props_col)
    for i in range(5):
        box(f'Memorial_Uniform_Braid_{i+1:02d}',(48,-6.49,6.35+i*.23),(1.18,.055,.07),trim,props_col,.02)
    box('Memorial_Engraved_Plaque',(48,-7.68,2.35),(2.35,.10,1.75),bronze,props_col,.05)
    text_sign('Memorial_Plaque_Name','MAJOR GENERAL CLAUDE MARTIN',(48,-7.76,2.72),.18,trim,props_col)
    text_sign('Memorial_Plaque_Founder','FOUNDER  •  1836',(48,-7.76,2.22),.16,trim,props_col)
    for side in (-1,1):
        cylinder(f'Memorial_Side_Detail_{side}',(48+side*1.7,-7.0,2.25),.12,1.55,trim,props_col,10)
    for a in range(0,360,45):
        aa=math.radians(a)
        gx,gy=48+8*math.cos(aa),-6+8*math.sin(aa)
        cylinder('Garden_Bed',(gx,gy,.22),1.65,.35,leaf,landscape_col,16)
        cylinder('Garden_Bed_Edge',(gx,gy,.10),1.9,.18,curb,landscape_col,16)
        for j in range(3):
            fa=TAU*j/3
            cylinder('Garden_Flower',(gx+.75*math.cos(fa),gy+.75*math.sin(fa),.52),.18,.55,flower,landscape_col,8)
    for i,(px,py,s) in enumerate([(38,-2,1.05),(58,-1,1.0),(39,-12,.95),(58,-12,1.08)]):
        palm(f'LM_Palm_{i+1:02d}',px,py,s,trunk,leaf,landscape_col)
    for i,(px,py) in enumerate([(38,-17),(43,-18),(53,-18),(58,-17)]):
        planter(f'Garden_Planter_{i+1:02d}',px,py,.9,stone,leaf,landscape_col)
    bench('Garden_Bench_01',38,-7,math.pi/2,wood,metal,life_col)
    bench('Garden_Bench_02',58,-7,-math.pi/2,wood,metal,life_col)
    lamp('Garden_Lamp_01',39,-15,metal,lamp_glow,life_col)
    lamp('Garden_Lamp_02',57,-15,metal,lamp_glow,life_col)

    # Institutional branding in raised geometry.
    text_sign('LM_Boys_Roof_Sign','LA MARTINIERE FOR BOYS',(30,-4.92,16.15),.72,bronze,props_col)
    box('LM_Crest_Shield',(-30,-4.78,12.8),(4.4,.22,3.6),bronze,props_col,.32)
    box('LM_Crest_Blue_Field',(-30,-4.93,12.9),(3.6,.10,2.8),courtblue,props_col,.28)
    text_sign('LM_Crest_Lettering','LA MARTINIERE',(-30,-5.02,13.0),.36,trim,props_col)
    text_sign('LM_Crest_Year','1836',(-30,-5.02,12.3),.28,trim,props_col)

    # Boys field-facing identity on the rear elevation, visible from the real
    # playing-field side without moving or duplicating the heritage building.
    # A shallow central projection creates the distinct Frame 5/6 elevation:
    # three storeys, five high vents, seven hooded windows and a service level.
    box('LM_Boys_Field_CentralBlock', (0, 14.52, 8.15), (52, 1.05, 16.3), white, main_col, .10)
    box('LM_Boys_Field_Cornice_Top', (0, 15.10, 16.25), (53.2, .42, .48), trim, main_col, .06)
    box('LM_Boys_Field_Cornice_Mid', (0, 15.10, 10.68), (52.6, .36, .30), trim, main_col, .04)
    box('LM_Boys_Field_Cornice_Lower', (0, 15.10, 5.42), (52.6, .36, .30), trim, main_col, .04)
    quoin_stack('LM_Boys_Field_Quoin_L', -25.3, 15.02, .15, 16, .42, trim, main_col, True)
    quoin_stack('LM_Boys_Field_Quoin_R', 25.3, 15.02, .15, 16, .42, trim, main_col, True)
    for i, x in enumerate((-17.5, -8.75, 0, 8.75, 17.5)):
        box(f'LM_Boys_Field_UpperWindow_Recess_{i+1:02d}', (x, 15.13, 13.15), (2.55, .18, 2.0), glass, main_col, .04)
        shallow_awning(f'LM_Boys_Field_UpperAwning_{i+1:02d}', x, 15.11, 14.32, 3.05, .72, trim, props_col, True)
    for i, x in enumerate((-21, -14, -7, 0, 7, 14, 21)):
        arch_panel(f'LM_Boys_Field_MiddleTrim_{i+1:02d}', x, 15.12, 6.55, 2.35, 3.35, trim, main_col, .22)
        arch_panel(f'LM_Boys_Field_MiddleWindow_{i+1:02d}', x, 15.28, 6.78, 1.92, 2.92, glass, main_col, .16)
        box(f'LM_Boys_Field_MiddleShutter_L_{i+1:02d}', (x-.72, 15.40, 8.0), (.42, .10, 2.25), shutter, props_col, .03)
        box(f'LM_Boys_Field_MiddleShutter_R_{i+1:02d}', (x+.72, 15.40, 8.0), (.42, .10, 2.25), shutter, props_col, .03)
        shallow_awning(f'LM_Boys_Field_MiddleAwning_{i+1:02d}', x, 15.17, 9.96, 2.72, .78, trim, props_col, True)
    for i, x in enumerate((-21, -14, -7, 0, 7, 14, 21)):
        arch_panel(f'LM_Boys_Field_GroundTrim_{i+1:02d}', x, 15.12, .55, 2.35, 4.25, trim, main_col, .22)
        arch_panel(f'LM_Boys_Field_GroundOpening_{i+1:02d}', x, 15.30, .78, 1.92, 3.82, glass if i in (2,3,4) else shutter, main_col, .16)
    for i, x in enumerate((-22, -11, 0, 11, 22)):
        cylinder(f'LM_Boys_Field_DrainPipe_{i+1:02d}', (x, 15.42, 8.0), .09, 15.6, metal, service_col, 10)
    wall_plaque('LM_Boys_Field_Plaque_Left', -4.2, 15.46, 3.15, 2.4, 1.15, bronze, trim, props_col)
    wall_plaque('LM_Boys_Field_Plaque_Right', 4.2, 15.46, 3.15, 2.4, 1.15, bronze, trim, props_col)
    text_sign_reverse('LM_Boys_Field_Roof_Sign','LA MARTINIERE FOR BOYS',(0,15.34,16.75),.78,bronze,props_col)
    box('LM_Boys_Field_Crest_Shield',(0,15.18,12.1),(4.2,.18,3.2),bronze,props_col,.28)
    box('LM_Boys_Field_Crest_Blue',(0,15.30,12.1),(3.45,.08,2.5),courtblue,props_col,.22)
    text_sign_reverse('LM_Boys_Field_Crest_Name','LA MARTINIERE',(0,15.38,12.35),.32,trim,props_col)
    text_sign_reverse('LM_Boys_Field_Crest_Motto','LABORE ET CONSTANTIA',(0,15.38,11.7),.20,trim,props_col)
    box('LM_Boys_Field_RedPipe',(0,15.31,1.8),(48,.12,.18),car_maroon,service_col,.06)
    for x in (-20,-10,10,20):
        shallow_awning(f'LM_Boys_Field_LowerAwning_{x}', x, 15.15, 4.92, 3.0, .85, trim, props_col, True)

    # Field-facing girls block, set across the playing field.
    gy=102
    # The reference elevation is intentionally asymmetric: a tall three-level
    # west wing, a projected classical centre and a lower eastern annex.
    box('LM_Girls_LeftWing',(-39,gy,8.3),(48,16,16.6),white,girls_col,.14)
    box('LM_Girls_RightWing',(41,gy+1.4,6.5),(44,13.2,13.0),aged_white,girls_col,.14)
    box('LM_Girls_CentralBay',(0,gy-0.8,9.4),(40,17.6,18.8),white,girls_col,.16)
    box('LM_Girls_Left_Offset',(-62,gy+2.0,6.7),(10,12,13.4),aged_white,girls_col,.12)
    box('LM_Girls_Right_Offset',(65,gy+2.1,5.8),(12,11,11.6),aged_white,girls_col,.12)
    pediment('LM_Girls_Pediment',(0,gy-9.65,18.75),40,1.05,4.4,trim,girls_col)
    box('LM_Girls_RoofSign_Base',(0,gy-9.25,22.65),(30,.18,.16),metal,props_col,.03)
    box('LM_Girls_Parapet_L',(-42,gy-8.2,17.0),(39,.8,.9),trim,girls_col,.06)
    box('LM_Girls_Parapet_R',(43,gy-6.9,13.3),(42,.8,.9),trim,girls_col,.06)
    wing_rows = (
        ('West', (-58,-52,-46,-40,-34,-28,-22), gy-8.28, (2.2,6.6,11.0)),
        ('East', (22,28,34,40,46,52,58), gy-5.42, (2.0,6.2,10.2)),
    )
    for wing, xs, face_y, levels in wing_rows:
        for li,z in enumerate(levels):
            for wi,x in enumerate(xs):
                arch_window_module(f'LM_Girls_{wing}_Window_L{li+1}_{wi+1:02d}',x,face_y,z,1.65,2.6,(trim,glass,shutter,metal),girls_col,li!=1,True)
                if (wi+li)%4==0:
                    box(f'LM_Girls_{wing}_Window_Stain',(x,face_y-.20,z-.12),(.65,.025,.9),dirt,weather_col,.05)
    box('LM_Girls_UpperColonnade_Shadow',(0,gy-9.42,14.2),(31,.42,6.2),glass,girls_col,.05)
    for x in (-12,-8,-4,0,4,8,12):
        column('LM_Girls_UpperCol',x,gy-9.76,10.85,6.7,.40,(white,trim),girls_col)
    # Six arched first-floor openings, a real balcony rail and three dark doors.
    for i, x in enumerate((-12.5,-7.5,-2.5,2.5,7.5,12.5)):
        arch_panel(f'LM_Girls_CentralArch_Trim_{i+1:02d}', x, gy-9.42, 5.9, 2.45, 3.75, trim, girls_col, .22)
        arch_panel(f'LM_Girls_CentralArch_Window_{i+1:02d}', x, gy-9.58, 6.12, 2.02, 3.30, glass, girls_col, .16)
    balcony_rail('LM_Girls_CentralBalcony', 0, gy-9.88, 5.65, 31, metal, props_col, .78)
    box('LM_Girls_Lower_Arcade_Recess',(0,gy-9.38,2.85),(31,.55,5.4),white,girls_col,.1)
    for i,x in enumerate((-10,0,10)):
        arch_panel(f'LM_Girls_GroundDoor_Trim_{i+1:02d}',x,gy-9.70,.45,3.1,4.55,trim,girls_col,.24)
        arch_panel(f'LM_Girls_GroundDoor_Shadow_{i+1:02d}',x,gy-9.88,.68,2.55,4.05,glass,girls_col,.16)
        for leaf, dx in (('L',-.62),('R',.62)):
            box(f'LM_Girls_GroundDoor_{i+1:02d}_Leaf_{leaf}',(x+dx,gy-10.02,2.52),(1.16,.16,3.52),shutter,girls_col,.045)
            for row, panel_z in enumerate((1.35,2.55,3.65)):
                box(f'LM_Girls_GroundDoor_{i+1:02d}_{leaf}_Panel_{row+1:02d}',(x+dx,gy-10.13,panel_z),(.86,.055,.62),trim,girls_col,.045)
        box(f'LM_Girls_GroundDoor_{i+1:02d}_TransomRail',(x,gy-10.13,4.45),(2.38,.055,.08),bronze,girls_col,.012)
        for mullion in (-.72,0,.72):
            box(f'LM_Girls_GroundDoor_{i+1:02d}_FanlightMullion',(x+mullion,gy-10.13,4.82),(.045,.045,.62),bronze,girls_col,.01)
    quoin_stack('LM_Girls_CentralQuoin_L',-19.2,gy-9.55,.2,18.1,.42,trim,girls_col,False)
    quoin_stack('LM_Girls_CentralQuoin_R',19.2,gy-9.55,.2,18.1,.42,trim,girls_col,False)
    text_sign('LM_Girls_Pediment_Name','LA MARTINIERE FOR GIRLS',(0,gy-10.18,19.15),.38,bronze,props_col)
    text_sign('LM_Girls_Roof_Sign','LA MARTINIERE FOR GIRLS',(0,gy-9.66,22.8),.85,bronze,props_col)
    for i,(x,z) in enumerate([(-48,7.4),(-30,3.9),(30,7.4),(48,3.9)]):
        ac_unit(f'LM_AC_Girls_{i+1:02d}',x,gy-8.7,z,aged_white,metal,service_col)
        box('LM_Girls_AC_Stain',(x,gy-8.48,z-.8),(.5,.025,1.15),dirt,weather_col,.04)
    for i,x in enumerate((-56,-24,24,56)):
        cylinder(f'LM_Girls_DrainPipe_{i+1:02d}',(x,gy-8.6,6.4),.105,12.3,metal,service_col,10)
    box('LM_Girls_Roofline_Weathering',(0,gy-8.66,14.12),(110,.03,.28),dirt,weather_col,.04)

    # Sports court and simple markings.
    box('Basketball_Court',(0,72,.04),(28,15,.10),court,ground_col)
    box('Court_Center_Lane',(0,72,.105),(4.8,15,.025),courtblue,ground_col)
    box('Court_Center_Line',(0,72,.125),(.12,15,.035),line,ground_col)
    box('Court_Sideline_A',(0,64.55,.125),(28,.10,.035),line,ground_col)
    box('Court_Sideline_B',(0,79.45,.125),(28,.10,.035),line,ground_col)
    box('Court_Baseline_L',(-13.95,72,.125),(.10,15,.035),line,ground_col)
    box('Court_Baseline_R',(13.95,72,.125),(.10,15,.035),line,ground_col)
    box('Court_Key_L',(-10.2,72,.13),(7.4,.10,.04),line,ground_col)
    box('Court_Key_R',(10.2,72,.13),(7.4,.10,.04),line,ground_col)
    for x in (-10.2,10.2):
        box('Court_Key_Side_A',(x,69.3,.13),(.10,5.4,.04),line,ground_col)
        box('Court_Key_Side_B',(x,74.7,.13),(.10,5.4,.04),line,ground_col)
    bpy.ops.mesh.primitive_torus_add(major_radius=1.8,minor_radius=.065,major_segments=32,minor_segments=6,location=(0,72,.17))
    circle=bpy.context.object; circle.name='Court_Center_Circle'; circle.data.materials.append(line); move_to_collection(circle,ground_col)
    # Sports posts and simple markers.
    for i,x in enumerate((-13.2,13.2)):
        cylinder(f'Court_Post_{i+1}',(x,72,2.0),.10,4.0,metal,life_col,10)
        box(f'Court_Backboard_{i+1}',(x,72,3.6),(.18,3.0,1.8),line,life_col,.05)
    for i,x in enumerate((-18,18)):
        cylinder(f'Field_Marker_{i+1}',(x,45,.65),.06,1.3,line,life_col,8)

    # Near-ground detail for the field/court gaze beat.
    box('Field_Drain_Channel',(0,31.45,.12),(122,.52,.24),metal,ground_col,.05)
    for i,x in enumerate(range(-58,59,4)):
        box(f'Field_Drain_Grate_{i+1:02d}',(x,31.12,.26),(2.7,.12,.05),line,ground_col,.02)
    for i,(px,py,rot,length) in enumerate([(-8,67,.28,6.5),(6,74,-.34,5.2),(-4,78,.16,3.8)]):
        rotated_box(f'Court_Surface_Crack_{i+1:02d}',(px,py,.16),(length,.055,.018),(0,0,rot),dirt,weather_col,.015)
    for i,(px,py,sx,sy) in enumerate([(-9,70,2.2,.35),(7,76,1.7,.28),(2,66,1.4,.25)]):
        box(f'Court_Scuff_{i+1:02d}',(px,py,.155),(sx,sy,.012),aged_white,weather_col,.18)
    for i in range(36):
        x = -22 + (i % 12) * 4
        y = 32.2 + (i // 12) * .75
        cylinder(f'Foreground_Grass_{i+1:02d}',(x,y,.22),.025,.42,grass2,landscape_col,5)

    # Modern internal classroom block.
    box('LM_Modern_Block',(-50,54,7.0),(32,14,14),white,modern_col,.12)
    box('LM_Modern_UpperBand',(-50,47.0,12.5),(32,.7,3.0),glass,modern_col,.06)
    box('LM_Modern_Walkway_Shadow',(-50,46.7,3.7),(32,.45,6.8),glass,modern_col,.05)
    for x in range(-63,-36,5):
        column('LM_Modern_Col',x,46.6,.3,8.0,.38,(white,trim),modern_col)
    for li,z in enumerate((4.1,8.4,11.6)):
        for wi,x in enumerate(range(-62,-37,4)):
            rectangular_window_module(f'LM_Modern_Window_L{li+1}_{wi+1:02d}',x,46.55,z,2.15,1.7,(trim,glass,shutter,metal),modern_col,li==0)
    box('LM_Modern_Railing_Top',(-50,46.1,8.2),(31,.08,.08),metal,props_col)
    for x in range(-65,-34,2): box('LM_Modern_Railing_V',(x,46.1,7.6),(.04,.04,1.2),metal,props_col)
    cylinder('LM_Internal_Circular_Tower',(-50,72,8.0),6.2,16.0,white,modern_col,36)
    cylinder('LM_Internal_Tower_Roof',(-50,72,16.25),6.7,.55,trim,modern_col,36)
    for i in range(12):
        a=TAU*i/12
        x,y=-50+5.8*math.cos(a),72+5.8*math.sin(a)
        cylinder(f'LM_Internal_Tower_Col_{i+1:02d}',(x,y,6.0),.24,11.5,trim,modern_col,12)
    for i,(px,py) in enumerate([(-64,45.8),(-59,45.8),(-54,45.8),(-49,45.8),(-44,45.8),(-39,45.8),(-66,62),(-66,72),(-66,82)]):
        planter(f'Internal_Road_Planter_{i+1:02d}',px,py,.72,stone,leaf,landscape_col)
    for i,py in enumerate((22,42,62,82,102)):
        lamp(f'Internal_Road_Lamp_{i+1:02d}',-65.5,py,metal,lamp_glow,life_col)
    notice_board('LM_Internal_NoticeBoard',-64,47.0,3.0,'NOTICE',bronze,sign_face,life_col)
    text_sign('LM_Internal_Block_Label','CLASSROOM BLOCK',(-50,46.15,14.25),.58,bronze,props_col)

    # True walkable open corridor along the internal classroom block.
    box('LM_Corridor_Floor',(-50,41.4,.18),(35,11.5,.36),stone,modern_col,.08)
    box('LM_Corridor_Canopy',(-50,41.4,8.35),(35,11.5,.38),trim,modern_col,.08)
    box('LM_Corridor_Skirting',(-50,46.34,.54),(34,.16,.62),aged_white,modern_col,.03)
    for i,x in enumerate((-62,-56,-50,-44,-38)):
        corridor_door(f'LM_Corridor_Door_{i+1:02d}',x,46.42,.35,trim,shutter,glass,metal,modern_col)
        wall_plaque(f'LM_Corridor_RoomPlaque_{i+1:02d}',x+1.72,46.26,3.25,1.0,.55,bronze,sign_face,props_col)
        box(f'LM_Corridor_Switch_{i+1:02d}',(x-1.7,46.18,1.65),(.28,.12,.42),aged_white,props_col,.025)
        box(f'LM_Corridor_FloorWear_{i+1:02d}',(x,43.3,.37),(3.6,1.1,.018),dirt,weather_col,.3)
    box('LM_Corridor_Conduit',(-50,46.10,6.65),(34,.07,.07),metal,service_col)
    for i,x in enumerate((-59,-50,-41)):
        box(f'LM_Corridor_WallLamp_{i+1:02d}',(x,46.02,6.0),(.55,.20,.28),lamp_glow,props_col,.05)
        cylinder(f'LM_Corridor_CeilingFan_{i+1:02d}',(x,43.2,7.72),.16,.55,metal,props_col,10)
        for blade in range(3):
            a = TAU * blade / 3
            rotated_box(f'LM_Corridor_FanBlade_{i+1:02d}_{blade+1}',(x+math.cos(a)*.65,43.2+math.sin(a)*.65,7.48),(1.35,.16,.06),(0,0,a),metal,props_col,.03)
    wall_plaque('LM_Corridor_HeritageBoard',-46.8,46.20,4.15,4.5,2.3,bronze,sign_face,props_col)
    box('LM_Corridor_FireExtinguisher',(-64.5,45.95,1.5),(.42,.28,1.25),car_maroon,props_col,.12)
    bench('LM_Corridor_Bench',-55,42.1,0,wood,metal,life_col)

    bpy.ops.object.light_add(type='AREA', location=(-50, 37.5, 5.2))
    corridor_fill = bpy.context.object
    corridor_fill.name = 'Corridor_Fill'
    corridor_fill.data.energy = 850
    corridor_fill.data.shape = 'RECTANGLE'
    corridor_fill.data.size = 18
    corridor_fill.data.size_y = 5
    corridor_fill.rotation_euler = (math.radians(90), 0, 0)

    # Campus-life props provide human scale without bloating the web mesh.
    for i,(px,py,rot,mat) in enumerate([
        (-30,-13,math.pi/2,car_maroon),(-24,-13,math.pi/2,car_silver),(-18,-13,math.pi/2,car_blue),
        (22,-13,math.pi/2,car_silver),(28,-13,math.pi/2,car_maroon),(-71,25,0,car_blue)
    ]):
        lowpoly_car(f'LM_ParkedCar_{i+1:02d}',px,py,rot,mat,glass,metal,life_col)
        box(f'LM_CarShadow_{i+1:02d}',(px,py,.08),(4.6,2.0,.025),dirt,weather_col,.25)
    bench('Field_Bench_01',-22,58,0,wood,metal,life_col)
    bench('Field_Bench_02',22,58,math.pi,wood,metal,life_col)
    for i,(px,py) in enumerate([(-64,18),(-64,55),(34,-12),(62,-12)]):
        cylinder(f'LM_Dustbin_{i+1:02d}',(px,py,.65),.36,1.3,sign_face,life_col,12)
        cylinder(f'LM_Dustbin_Lid_{i+1:02d}',(px,py,1.34),.41,.12,metal,life_col,12)
    for i,px in enumerate(range(-12,13,3)):
        bollard(f'LM_Entry_Bollard_{i+1:02d}',px,-27.2,metal,life_col)
    for i,py in enumerate(range(35,111,10)):
        bollard(f'LM_Road_Bollard_{i+1:02d}',-66.3,py,metal,life_col)
    cylinder('LM_Flagpole',(42,-17,6.0),.11,12.0,metal,life_col,12)
    box('LM_Flag',(43.55,-17,10.2),(3.0,.08,1.65),car_maroon,life_col,.03)
    notice_board('LM_Main_Entry_Board',34,-4.95,4.2,'OFFICE',bronze,sign_face,life_col)
    text_sign('LM_Heritage_Plaque','FOUNDED 1836',(34,-5.08,2.7),.34,bronze,props_col)

    # Low-poly trees, deliberately sparse near hero facade.
    trees=[(-58,-8,1.4),(58,10,1.4),(-58,30,1.5),(61,34,1.45),(-62,82,1.4),(60,84,1.5),(-55,118,1.5),(54,120,1.5),(42,-18,1.2),(57,-18,1.15)]
    for i,(x,y,s) in enumerate(trees):
        tree(f'LM_Tree_{i+1:02d}',x,y,s,trunk,leaf,landscape_col)
        shadow=box(f'LM_TreeShadow_{i+1:02d}',(x+2.3*s,y+1.3*s,.06),(7*s,4*s,.018),dirt,weather_col,.8)
        shadow.rotation_euler.z=math.radians(18)

    # Align secondary campus zones to the supplied direction path.  The editable
    # master keeps semantic names, so these zone moves remain easy to revise.
    # Roof-edge and ground-line discoloration completes the weathering layer.
    box('LM_Main_Roof_Stain_L',(-31,-4.5,13.72),(27,.025,.32),dirt,weather_col,.03)
    box('LM_Main_Roof_Stain_R',(31,-4.5,13.72),(27,.025,.32),dirt,weather_col,.03)
    box('LM_Main_Ground_Dirt_L',(-31,-4.48,.45),(28,.025,.6),dirt,weather_col,.05)
    box('LM_Main_Ground_Dirt_R',(31,-4.48,.45),(28,.025,.6),dirt,weather_col,.05)

    # Camera and lighting.
    bpy.ops.object.light_add(type='SUN', location=(-20,-30,65))
    sun=bpy.context.object; sun.name='Warm_Afternoon_Sun'; sun.data.energy=3.1; sun.rotation_euler=(math.radians(28),math.radians(-18),math.radians(-28))
    bpy.ops.object.light_add(type='AREA', location=(0,-48,34))
    area=bpy.context.object; area.name='Facade_Fill'; area.data.energy=1900; area.data.shape='DISK'; area.data.size=35
    def track(obj, point):
        obj.rotation_euler=(Vector(point)-obj.location).to_track_quat('-Z','Y').to_euler()
    bpy.ops.object.camera_add(location=(74,-88,48))
    cam=bpy.context.object; cam.name='Hero_Camera'; cam.data.lens=48; track(cam,(0,1,8)); scene.camera=cam

    # Color management and output.
    scene.view_settings.look = 'AgX - Medium High Contrast'
    scene.render.filepath=os.path.join(ROOT,'lamartiniere_school_preview.png')
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'LaMartiniere_School_Master.blend'))

    # Build a separate web scene: bake modifiers/text, then merge single-material meshes.
    # The editable master above retains the complete semantic object hierarchy.
    font_objects=[obj for obj in scene.objects if obj.type in {'FONT','CURVE'}]
    if font_objects:
        bpy.ops.object.select_all(action='DESELECT')
        for obj in font_objects: obj.select_set(True)
        bpy.context.view_layer.objects.active=font_objects[0]
        bpy.ops.object.convert(target='MESH')
    for obj in [o for o in scene.objects if o.type == 'MESH' and o.modifiers]:
        bpy.context.view_layer.objects.active=obj
        obj.select_set(True)
        for mod in list(obj.modifiers):
            try: bpy.ops.object.modifier_apply(modifier=mod.name)
            except RuntimeError: pass
        obj.select_set(False)
    material_groups={}
    for obj in [o for o in scene.objects if o.type == 'MESH' and len(o.data.materials)==1]:
        material_groups.setdefault(obj.data.materials[0].name,[]).append(obj)
    for mat_name, objects in material_groups.items():
        if len(objects)<2: continue
        bpy.ops.object.select_all(action='DESELECT')
        for obj in objects: obj.select_set(True)
        bpy.context.view_layer.objects.active=objects[0]
        bpy.ops.object.join()
        objects[0].name='WEB_' + mat_name.replace(' ','_')
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'LaMartiniere_School_Web_Optimized.blend'))
    bpy.ops.export_scene.gltf(filepath=os.path.join(ROOT,'LaMartiniere_School_Web.glb'), export_format='GLB', export_apply=True, export_cameras=False, export_lights=False)
    # Preview rendering is intentionally separate so regeneration stays fast.


if __name__ == '__main__':
    build()
