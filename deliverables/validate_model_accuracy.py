"""Geometry contract for the reference-led La Martiniere GLB zones.

Unlike the original size-only test, this inspects the glTF node hierarchy and
fails when a school-specific façade is missing or silently replaced by a shared
generic block.
"""

import json
import os
import struct


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZONES = os.path.join(ROOT, 'public', 'models', 'zones')
errors = []


def glb_json(filename):
    path = os.path.join(ZONES, filename)
    if not os.path.isfile(path):
        errors.append(f'Missing zone: {filename}')
        return {}
    with open(path, 'rb') as handle:
        payload = handle.read()
    if payload[:4] != b'glTF':
        errors.append(f'Invalid GLB header: {filename}')
        return {}
    offset = 12
    while offset + 8 <= len(payload):
        length, chunk_type = struct.unpack_from('<II', payload, offset)
        offset += 8
        chunk = payload[offset:offset + length]
        offset += length
        if chunk_type == 0x4E4F534A:
            return json.loads(chunk.rstrip(b' \0'))
    errors.append(f'No JSON chunk: {filename}')
    return {}


def names(filename):
    return [node.get('name', '') for node in glb_json(filename).get('nodes', [])]


def require(items, label, exact=(), prefixes=()):
    for name in exact:
        if name not in items:
            errors.append(f'{label}: missing {name}')
    for prefix, minimum in prefixes:
        count = sum(name.startswith(prefix) for name in items)
        if count < minimum:
            errors.append(f'{label}: expected >= {minimum} nodes starting {prefix}, found {count}')


rotunda = names('rotunda.glb')
heritage = names('heritage.glb')
boys = names('boys.glb')
girls = names('girls.glb')
road = names('road.glb')
garden = names('garden.glb')

require(rotunda, 'rotunda',
        exact=('LM_Rotunda_OpenShell', 'LM_Rotunda_PortalPier_L', 'LM_Rotunda_PortalPier_R',
               'LM_CentralDoor_Recess', 'LM_Rotunda_Landing', 'LM_Rooftop_Drum',
               'LM_ROT_DOOR_Left_Hinge_01', 'LM_ROT_DOOR_Right_Hinge_03', 'LM_ROT_DOOR_FanlightBar_03'),
        prefixes=(('LM_COL_MainPortico_', 36), ('LM_STAIRS_Rotunda_', 10),
                  ('LM_Rotunda_UpperWindow_', 28), ('LM_Rotunda_LowerOpening_', 12),
                  ('LM_COL_Volute_', 18)))
if 'LM_Rotunda_CurvedWall' in rotunda:
    errors.append('rotunda: solid center obstruction still exported')
require(heritage, 'heritage',
        exact=('LM_MainBlock', 'LM_MainRoof_Parapet', 'LM_Main_Window_L1_03_Mullion_V',
               'LM_Main_Window_L1_03_Shutter_L_Louver_01'),
        prefixes=(('LM_Main_Window_', 100), ('LM_Rear_Window_', 80), ('LM_AC_Main_', 20)))
require(boys, 'boys',
        exact=('LM_Boys_Field_CentralBlock', 'LM_Boys_Field_Roof_Sign',
               'LM_Boys_Field_Crest_Shield', 'LM_Boys_Field_RedPipe'),
        prefixes=(('LM_Boys_Field_UpperAwning_', 5), ('LM_Boys_Field_MiddleWindow_', 7),
                  ('LM_Boys_Field_GroundOpening_', 7), ('LM_Boys_Field_DrainPipe_', 5)))
require(girls, 'girls',
        exact=('LM_Girls_CentralBay', 'LM_Girls_Pediment', 'LM_Girls_Roof_Sign',
               'LM_Girls_CentralBalcony_Top', 'LM_Girls_GroundDoor_01_Leaf_L',
               'LM_Girls_GroundDoor_02_TransomRail'),
        prefixes=(('LM_Girls_UpperCol', 28), ('LM_Girls_CentralArch_Window_', 6),
                  ('LM_Girls_GroundDoor_Shadow_', 3), ('LM_Girls_West_Window_', 60),
                  ('LM_Girls_East_Window_', 60)))
require(road, 'road',
        exact=('LM_Corridor_Floor', 'LM_Corridor_Canopy', 'LM_Modern_Block',
               'LM_Corridor_Door_01_RaisedPanel_01', 'LM_Corridor_Door_01_HandlePlate'),
        prefixes=(('LM_Corridor_Door_', 20), ('LM_Corridor_WallLamp_', 3), ('LM_Road_SpeedBreaker_Stripe_', 4)))
require(garden, 'garden',
        exact=('Memorial_Platform', 'Memorial_Plinth', 'Memorial_Column', 'Memorial_Statue_Figure'),
        prefixes=(('Garden_Bed', 8), ('LM_Palm_', 20), ('Memorial_', 9)))

for filename in ('rotunda', 'heritage', 'boys', 'girls', 'road', 'garden', 'field', 'ground', 'props', 'weathering'):
    high = os.path.join(ZONES, filename + '.glb')
    if os.path.isfile(high) and os.path.getsize(high) > 5 * 1024 * 1024:
        errors.append(f'{filename}: high zone exceeds 5 MB')

for filename in os.listdir(ZONES):
    if filename.endswith('_low.glb'):
        errors.append(f'Detailed-only pipeline still contains {filename}')

config_path = os.path.join(ROOT, 'content', 'experience-config.ts')
with open(config_path, encoding='utf-8') as handle:
    config = handle.read()
for expected in ('/models/zones/boys.glb', '/models/zones/girls.glb', '/models/zones/rotunda.glb'):
    if expected not in config:
        errors.append(f'Experience config does not reference {expected}')
if 'lowUrl' in config or '_low.glb' in config:
    errors.append('Experience config still references a low-detail model')

if errors:
    raise SystemExit('\n'.join(errors))

print('Validated distinct shared, Boys and Girls architecture zones')
print(f'Node counts: heritage={len(heritage)}, rotunda={len(rotunda)}, boys={len(boys)}, girls={len(girls)}, road={len(road)}, garden={len(garden)}')
