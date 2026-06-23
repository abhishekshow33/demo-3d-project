"""Static acceptance checks for the three-building website."""

import json
import os


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
errors = []

required_routes = [
    'app/page.tsx', 'app/boys/page.tsx', 'app/girls/page.tsx', 'app/heritage/page.tsx',
    'app/admissions/page.tsx', 'app/contact/page.tsx', 'app/boys/[section]/page.tsx', 'app/girls/[section]/page.tsx',
]
for route in required_routes:
    if not os.path.isfile(os.path.join(ROOT, route)):
        errors.append(f'Missing route: {route}')

with open(os.path.join(ROOT, 'content', 'source-inventory.json'), encoding='utf-8') as handle:
    inventory = json.load(handle)
sources = inventory.get('sources', [])
for school in ('shared', 'boys', 'girls'):
    if not any(source.get('school') == school for source in sources):
        errors.append(f'No official source inventory for {school}')

config_path = os.path.join(ROOT, 'content', 'experience-config.ts')
with open(config_path, encoding='utf-8') as handle:
    config = handle.read()
for stage in ('arrival', 'identity', 'door', 'threshold', 'gallery', 'achievements', 'sports', 'pool'):
    if f"id: '{stage}'" not in config:
        errors.append(f'Missing camera stage: {stage}')
for target in ('/boys', '/girls'):
    if target not in config:
        errors.append(f'Missing internal crest target: {target}')
if 'lowUrl' in config or 'highUrl' in config or '_low.glb' in config:
    errors.append('Experience configuration is not detailed-only')

frame_source = os.path.join(ROOT, 'three', 'AchievementFrameWall.tsx')
with open(frame_source, encoding='utf-8') as handle:
    frame_content = handle.read()
for school in ('shared', 'boys', 'girls'):
    for index in range(1, 7):
        if school == 'shared':
            expected = ('shared-founder.webp', 'shared-benefactor.webp', 'shared-campus.webp',
                        'shared-legacy-1.webp', 'shared-legacy-2.webp', 'shared-legacy-3.webp')[index-1]
        else:
            expected = f'{school}-gallery-{index}.webp'
        if expected not in frame_content or not os.path.isfile(os.path.join(ROOT, 'public', 'images', 'achievements', expected)):
            errors.append(f'Missing populated frame asset: {expected}')

models_root = os.path.join(ROOT, 'public', 'models')
for directory, _, files in os.walk(models_root):
    for filename in files:
        if filename.endswith('_low.glb'):
            errors.append(f'Obsolete low-detail zone remains: {filename}')
        if filename.endswith('.glb'):
            size = os.path.getsize(os.path.join(directory, filename))
            if size > 5 * 1024 * 1024 and filename != 'la-martiniere-school.glb':
                errors.append(f'Zone exceeds 5 MB: {filename} ({size} bytes)')

if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print(f'Validated {len(required_routes)} routes, 8 camera stages, 18 populated wall frames, {len(sources)} official source records and detailed GLB limits')
