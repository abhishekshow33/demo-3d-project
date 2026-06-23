"""Patch the editable master with high-value eye-level opening details.

This pass is intentionally small and deterministic: it upgrades only geometry
that the scroll camera approaches, keeping each web zone below its payload cap.
"""
import bpy
import math
import os

ROOT = os.path.dirname(os.path.abspath(__file__))

def mat(name):
    return bpy.data.materials.get(name)

def col(name):
    return bpy.data.collections[name]

def box(name, location, scale, material, collection, bevel=.015):
    old = bpy.data.objects.get(name)
    if old: bpy.data.objects.remove(old, do_unlink=True)
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj=bpy.context.object; obj.name=name; obj.scale=tuple(v/2 for v in scale)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    for current in list(obj.users_collection): current.objects.unlink(obj)
    collection.objects.link(obj)
    if bevel:
        modifier=obj.modifiers.new('Close-detail bevel','BEVEL'); modifier.width=bevel; modifier.segments=2
    return obj

def cylinder(name, location, radius, depth, material, collection):
    old=bpy.data.objects.get(name)
    if old: bpy.data.objects.remove(old, do_unlink=True)
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=radius, depth=depth, location=location, rotation=(math.pi/2,0,0))
    obj=bpy.context.object; obj.name=name; obj.data.materials.append(material)
    for current in list(obj.users_collection): current.objects.unlink(obj)
    collection.objects.link(obj); return obj

def curved_wall_shell(name, cx, cy, z0, height, outer_radius, thickness, start_degrees, end_degrees, material, collection, segments=72):
    old=bpy.data.objects.get(name)
    if old: bpy.data.objects.remove(old, do_unlink=True)
    inner_radius=outer_radius-thickness; verts=[]
    for i in range(segments+1):
        angle=math.radians(start_degrees+(end_degrees-start_degrees)*i/segments)
        for radius in (outer_radius,inner_radius):
            verts.extend(((cx+radius*math.cos(angle),cy+radius*math.sin(angle),z0),(cx+radius*math.cos(angle),cy+radius*math.sin(angle),z0+height)))
    faces=[]
    for i in range(segments):
        a=i*4; b=(i+1)*4
        faces.extend(((a,b,b+1,a+1),(a+2,a+3,b+3,b+2),(a+1,b+1,b+3,a+3),(a,a+2,b+2,b)))
    faces.extend(((0,1,3,2),(len(verts)-4,len(verts)-2,len(verts)-1,len(verts)-3)))
    mesh=bpy.data.meshes.new(name+'_Mesh'); mesh.from_pydata(verts,[],faces); mesh.update()
    obj=bpy.data.objects.new(name,mesh); collection.objects.link(obj); obj.data.materials.append(material)
    modifier=obj.modifiers.new('Rotunda shell edge bevel','BEVEL'); modifier.width=.06; modifier.segments=2
    return obj

trim=mat('Warm Limestone Trim'); white=mat('Heritage Off White'); bronze=mat('Memorial Bronze'); shutter=mat('Muted Lavender Grey')
metal=mat('Dark Campus Metal'); glass=mat('Shadowed Blue Glass')
heritage=col('02_Main_Heritage_Block'); rotunda=col('03_Rotunda_Portico')
girls=col('04_Girls_Field_Block'); corridor=col('05_Modern_Internal_Block')

# Replace the solid center drum with a thin rotunda shell. The forty-degree
# opening is centered on the ceremonial doorway while the upper drum survives.
solid=bpy.data.objects.get('LM_Rotunda_CurvedWall')
if solid: bpy.data.objects.remove(solid,do_unlink=True)
curved_wall_shell('LM_Rotunda_OpenShell',0,-1.8,0,14.2,12.0,.48,-70,250,white,rotunda)
box('LM_Rotunda_PortalPier_L',(-4.15,-13.15,6.85),(1.1,1.05,13.7),trim,rotunda,.08)
box('LM_Rotunda_PortalPier_R',(4.15,-13.15,6.85),(1.1,1.05,13.7),trim,rotunda,.08)

# Ceremonial double door: hinges, locks, transom rail and radial fanlight bars.
for side, hinge_x in (('Left',-1.34),('Right',1.34)):
    for index,z in enumerate((1.55,3.25,4.95),1):
        cylinder(f'LM_ROT_DOOR_{side}_Hinge_{index:02d}',(hinge_x,-14.27,z),.055,.30,bronze,rotunda)
    box(f'LM_ROT_DOOR_{side}_HandlePlate',((-0.16 if side=='Left' else .16),-14.285,3.12),(.16,.045,.48),bronze,rotunda)
box('LM_ROT_DOOR_TransomRail',(0,-14.285,5.62),(2.78,.06,.10),bronze,rotunda)
for index,angle in enumerate((-62,-31,0,31,62),1):
    a=math.radians(angle)
    bar=box(f'LM_ROT_DOOR_FanlightBar_{index:02d}',(math.sin(a)*.42,-14.29,6.13+math.cos(a)*.12),(.045,.045,1.08),bronze,rotunda,.008)
    bar.rotation_euler.y=-a

# Main façade openings nearest the entrance: divided glazing, sill drip and
# louvered shutters. The names match the procedural master contract.
wing_xs=[x for x in range(-41,42,5) if abs(x)>15]
for wi,x in enumerate(wing_xs,1):
    if abs(x)>31: continue
    name=f'LM_Main_Window_L1_{wi:02d}'
    z=2.2; width=1.65; height=2.55
    box(name+'_Mullion_V',(x,-4.625,z+height*.43),(.055,.045,height*.72),metal,heritage,.008)
    box(name+'_Mullion_H',(x,-4.625,z+height*.47),(width*.88,.045,.055),metal,heritage,.008)
    box(name+'_Sill_Drip',(x,-4.68,z-.13),(width+.58,.08,.07),trim,heritage,.012)
    for side,sx in (('L',x-width*.72),('R',x+width*.72)):
        for slat in range(5):
            box(name+f'_Shutter_{side}_Louver_{slat+1:02d}',(sx,-4.645,z+height*(.23+slat*.105)),(width*.27,.045,.045),metal,heritage,.007)

# Girls entrance leaves and divided fanlights.
gy=102
for index,x in enumerate((-10,0,10),1):
    for leaf,dx in (('L',-.62),('R',.62)):
        box(f'LM_Girls_GroundDoor_{index:02d}_Leaf_{leaf}',(x+dx,gy-10.02,2.52),(1.16,.16,3.52),shutter,girls,.04)
        for row,pz in enumerate((1.35,2.55,3.65),1):
            box(f'LM_Girls_GroundDoor_{index:02d}_{leaf}_Panel_{row:02d}',(x+dx,gy-10.13,pz),(.86,.055,.62),trim,girls,.035)
    box(f'LM_Girls_GroundDoor_{index:02d}_TransomRail',(x,gy-10.13,4.45),(2.38,.055,.08),bronze,girls,.01)
    for mullion in (-.72,0,.72):
        box(f'LM_Girls_GroundDoor_{index:02d}_FanlightMullion_{mullion:+.2f}',(x+mullion,gy-10.13,4.82),(.045,.045,.62),bronze,girls,.008)

# Corridor wall-pan: raised panels, hinge leaves, backplate/keyhole and transom bars.
for index,x in enumerate((-62,-56,-50,-44,-38),1):
    prefix=f'LM_Corridor_Door_{index:02d}'
    for row,pz in enumerate((1.07,1.97,2.93),1):
        box(f'{prefix}_RaisedPanel_{row:02d}',(x,46.205,pz),(1.72,.055,.62),trim,corridor,.035)
        box(f'{prefix}_PanelInset_{row:02d}',(x,46.17,pz),(1.42,.025,.38),shutter,corridor,.02)
    for hinge_index,hz in enumerate((.83,2.07,3.37),1):
        cylinder(f'{prefix}_Hinge_{hinge_index:02d}',(x-1.02,46.17,hz),.045,.24,metal,corridor)
    for mi,mx in enumerate((-.55,0,.55),1):
        box(f'{prefix}_TransomMullion_{mi:02d}',(x+mx,46.18,4.37),(.045,.04,.64),metal,corridor,.008)
    box(f'{prefix}_HandlePlate',(x+.78,46.165,2.11),(.16,.035,.42),bronze,corridor,.02)
    cylinder(f'{prefix}_Lock',(x+.78,46.14,1.87),.025,.04,metal,corridor)

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'LaMartiniere_School_Master.blend'))
print('Enhanced close-view doors, windows and corridor hardware')
