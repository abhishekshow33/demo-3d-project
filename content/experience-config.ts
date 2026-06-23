import type { SchoolId } from './site-content';

export type Vec3Tuple = readonly [number, number, number];
export type CameraKeyframe = { position: Vec3Tuple; lookAt: Vec3Tuple };
export type CameraStage = {
  id: string;
  label: string;
  range: readonly [number, number];
  fov: number;
  world: 'exterior' | 'interior' | 'sports';
  keyframes: readonly CameraKeyframe[];
};
export type AssetZone = { id: string; url: string; stages: readonly number[] };
export type BuildingExperienceConfig = {
  id: SchoolId;
  route: '/' | '/boys' | '/girls';
  name: string;
  eyebrow: string;
  accent: string;
  crest?: string;
  stages: readonly CameraStage[];
  zones: readonly AssetZone[];
  chapters: readonly { title: string; eyebrow: string; copy: string; link?: string; linkLabel?: string; renderIn3D?: boolean }[];
};

const sharedExterior: readonly CameraKeyframe[] = [
  { position: [0, 1.7, 56], lookAt: [0, 7, 2] }, { position: [0, 1.72, 44], lookAt: [0, 6.2, 2] },
];
const mainStages = (school: SchoolId): readonly CameraStage[] => {
  const girls = school === 'girls';
  const boys = school === 'boys';
  const exterior = girls
    ? [{ position: [0, 1.72, -34], lookAt: [0, 8, -94] }, { position: [0, 1.75, -44], lookAt: [0, 9, -94] }] as const
    : boys
      ? [{ position: [0, 1.72, -72], lookAt: [0, 8, -14] }, { position: [0, 1.75, -62], lookAt: [0, 9, -14] }] as const
      : sharedExterior;
  if (!girls && !boys) {
    return [
      { id: 'arrival',      label: 'Exterior arrival',               range: [0, .105],    fov: 40, world: 'exterior',  keyframes: exterior },
      { id: 'door',         label: 'Door approach',                  range: [.105, .185],  fov: 30, world: 'exterior',  keyframes: [exterior[1], { position: [0,1.76,20], lookAt: [0,3.1,14] }] },
      { id: 'threshold',    label: 'Threshold',                      range: [.185, .42],  fov: 36, world: 'interior',  keyframes: [{ position: [0,1.72,12], lookAt: [0,2,3] }, { position: [0,1.74,5], lookAt: [0,2,-2] }] },
      { id: 'gallery',      label: 'Legacy gallery',                 range: [.42, .56],  fov: 36, world: 'interior',  keyframes: [{ position: [0,1.74,5], lookAt: [-2.8,2.6,-1] }, { position: [0,1.76,-2], lookAt: [2.8,2.5,-8] }] },
      { id: 'achievements', label: 'Achievement hall and ground exit', range: [.56, .70], fov: 36, world: 'interior',  keyframes: [{ position: [0,1.76,-2], lookAt: [2.8,2.5,-8] }, { position: [0,1.76,-8], lookAt: [0,2.7,-14] }, { position: [0,1.72,-11.5], lookAt: [0,1.8,-18] }] },
      { id: 'sports',       label: 'Courts and field',               range: [.70, .85],  fov: 38, world: 'sports',    keyframes: [{ position: [0,12,-20], lookAt: [-13,0,-35] }, { position: [-15,16,-45], lookAt: [5,0,-58] }] },
      { id: 'pool',         label: 'Swimming pool',                  range: [.85, 1],    fov: 38, world: 'sports',    keyframes: [{ position: [-15,16,-45], lookAt: [5,0,-58] }, { position: [20,22,-65], lookAt: [-5,0,-75] }] },
    ];
  }
  return [
    { id: 'arrival', label: 'Exterior arrival', range: [0, .13], fov: 40, world: 'exterior', keyframes: exterior },
    { id: 'identity', label: 'Crest and façade', range: [.13, .25], fov: 36, world: 'exterior', keyframes: [exterior[1], girls ? { position: [0,1.72,-52], lookAt: [0,10,-94] } : boys ? { position: [0,1.76,-52], lookAt: [0,9,-14] } : { position: [0,1.76,34], lookAt: [0,7,2] }] },
    { id: 'door', label: 'Door approach', range: [.25, .37], fov: 31, world: 'exterior', keyframes: girls ? [{ position: [0,1.72,-52], lookAt: [0,5,-94] }, { position: [0,1.74,-70], lookAt: [0,4,-94] }] : boys ? [{ position: [0,1.76,-52], lookAt: [0,5,-14] }, { position: [0,1.76,-29], lookAt: [0,3,-14] }] : [{ position: [0,1.76,34], lookAt: [0,5,3] }, { position: [0,1.76,20], lookAt: [0,3,14] }] },
    { id: 'threshold',    label: 'Threshold',                         range: [.37, .48], fov: 36, world: 'interior',  keyframes: [{ position: [0,1.72,12], lookAt: [0,2,3] }, { position: [0,1.74,5], lookAt: [0,2,-2] }] },
    { id: 'gallery',      label: 'Legacy gallery',                     range: [.48, .61], fov: 36, world: 'interior',  keyframes: [{ position: [0,1.74,5], lookAt: [-2.8,2.6,-1] }, { position: [0,1.76,-2], lookAt: [2.8,2.5,-8] }] },
    { id: 'achievements', label: 'Achievement hall and ground exit',    range: [.61, .73], fov: 36, world: 'interior',  keyframes: [{ position: [0,1.76,-2], lookAt: [2.8,2.5,-8] }, { position: [0,1.76,-8], lookAt: [0,2.7,-14] }, { position: [0,1.72,-11.5], lookAt: [0,1.8,-18] }] },
    { id: 'sports', label: 'Courts and field', range: [.73, .86], fov: 38, world: 'sports', keyframes: [{ position: [0,12,-20], lookAt: [-13,0,-35] }, { position: [-15,16,-45], lookAt: [5,0,-58] }] },
    { id: 'pool', label: 'Swimming pool', range: [.86, 1], fov: 38, world: 'sports', keyframes: [{ position: [-15,16,-45], lookAt: [5,0,-58] }, { position: [20,22,-65], lookAt: [-5,0,-75] }] },
  ];
};

const commonZones: readonly AssetZone[] = [
  { id: 'ground', url: '/models/zones/ground.glb', stages: [0,1,2] },
  { id: 'props', url: '/models/zones/props.glb', stages: [0,1,2] },
  { id: 'weathering', url: '/models/zones/weathering.glb', stages: [0,1,2] },
];

export const EXPERIENCES: Record<SchoolId, BuildingExperienceConfig> = {
  shared: {
    id: 'shared', route: '/', name: 'La Martiniere Heritage Hall', eyebrow: 'Kolkata · Established 1836', accent: '#d6b45f', stages: mainStages('shared'),
    zones: [...commonZones, { id: 'rotunda', url: '/models/zones/rotunda.glb', stages: [0,1,2] }, { id: 'heritage', url: '/models/zones/heritage.glb', stages: [0,1,2] }, { id: 'garden', url: '/models/zones/garden.glb', stages: [0,1,2] }],
    chapters: [
      { eyebrow: 'Shared Heritage Hall', title: 'Choose a school—or enter our story.', copy: 'Two fluorescent crests flank a shared institution shaped by nearly two centuries of labour and constancy.' },
      { eyebrow: 'The great entrance', title: 'The doors remember every generation.', copy: 'Scroll closer as the crests withdraw and the ceremonial doors open.' },
      { eyebrow: 'Inside the hall', title: 'Founded for the public good.', copy: 'Warm light, worn stone and archival frames introduce the vision of Major General Claude Martin.' },
      { eyebrow: 'Legacy gallery', title: '1836—and the work continues.', copy: 'Founder, benefactor, motto, song and prayer connect generations of Martinians.', link: '/heritage', linkLabel: 'Read the full heritage archive' },
      { eyebrow: 'Admissions hall', title: 'A living institution.', copy: 'Explore organization, admissions, contact information and the current Lower Nursery process.', link: '/admissions', linkLabel: 'View admissions 2027–2028' },
      { eyebrow: 'Virtual recreation', title: 'Courts beyond the colonnade.', copy: 'The shared grounds lead toward the sports traditions of both schools.', renderIn3D: true },
      { eyebrow: 'Continue the journey', title: 'Which school will you explore?', copy: 'Enter the Boys or Girls experience, or browse the complete institutional archive.', renderIn3D: true },
    ],
  },
  boys: {
    id: 'boys', route: '/boys', name: 'La Martiniere for Boys', eyebrow: 'Kolkata · Men of Substance', accent: '#62d9ff', crest: '/brand/la_martiniere/la_martiniere_boys_logo.png', stages: mainStages('boys'),
    zones: [...commonZones, { id: 'boys', url: '/models/zones/boys.glb', stages: [0,1,2] }],
    chapters: [
      { eyebrow: 'La Martiniere for Boys', title: 'A legacy built for the future.', copy: 'The historic façade introduces a school of scholarship, character, service and sport.' },
      { eyebrow: 'School identity', title: 'Labore et Constantia.', copy: 'The crest illuminates a tradition shared by more than 3,800 pupils from Lower Nursery to Class XII.' },
      { eyebrow: 'Enter the school', title: 'Education beyond books.', copy: 'The doors open onto academic, creative and community life.' },
      { eyebrow: 'Principal’s welcome', title: 'Global thinking. Strong local roots.', copy: 'A value-based education prepares responsible citizens and leaders.' },
      { eyebrow: 'Founder gallery', title: 'Public good, made permanent.', copy: 'Claude Martin’s endowment and the Foundationer tradition remain part of daily school life.', link: '/boys/legacy', linkLabel: 'Read the founder story' },
      { eyebrow: 'Achievement hall', title: 'Excellence in many arenas.', copy: 'Academic honours, courage, social service and sporting distinction fill the gallery.', link: '/boys/achievements', linkLabel: 'Explore achievements' },
      { eyebrow: 'Sports campus', title: 'Train, compete and lead.', copy: 'Walk past the field and courts supporting football, cricket, basketball, tennis, athletics and more.', link: '/boys/sports', linkLabel: 'View the sports programme', renderIn3D: true },
      { eyebrow: 'Aquatics', title: 'Champions are made one length at a time.', copy: 'The pool deck concludes a reference-led recreation of the school’s aquatic programme.', renderIn3D: true },
    ],
  },
  girls: {
    id: 'girls', route: '/girls', name: 'La Martiniere for Girls', eyebrow: 'Kolkata · Women of Substance', accent: '#ff7edc', crest: '/brand/la_martiniere/la_martiniere_girls_logo.png', stages: mainStages('girls'),
    zones: [...commonZones, { id: 'girls', url: '/models/zones/girls.glb', stages: [0,1,2] }],
    chapters: [
      { eyebrow: 'La Martiniere for Girls', title: 'Imagine. Labour. Become.', copy: 'A distinct school identity shaped by compassion, inclusion, gratitude and excellence.' },
      { eyebrow: 'School identity', title: 'Educating the girl child.', copy: 'The illuminated crest introduces nearly 3,000 pupils and a legacy extending from 1836.' },
      { eyebrow: 'Enter the school', title: 'Character opens every door.', copy: 'The entrance leads from heritage into future-ready learning.' },
      { eyebrow: 'Mission and vision', title: 'Head, heart and hands.', copy: 'Each learner is prepared to help build a more equitable and progressive society.', link: '/girls/mission-vision', linkLabel: 'Read mission and vision' },
      { eyebrow: 'Learning gallery', title: 'Tradition meets technology.', copy: 'LED-enabled classrooms, laboratories, music, art and computing support experiential learning.', link: '/girls/academics', linkLabel: 'Explore learning spaces' },
      { eyebrow: 'Student life', title: 'Belong, create and compete.', copy: 'Four houses and a wide network of clubs animate the achievement corridor.', link: '/girls/activities', linkLabel: 'Explore houses and clubs' },
      { eyebrow: 'Sports campus', title: 'Confidence in motion.', copy: 'Walk through courts and fields supporting basketball, football, skating and athletic life.', renderIn3D: true },
      { eyebrow: 'Aquatics', title: 'Strength, rhythm and resolve.', copy: 'The pool deck completes a reference-led recreation of the school’s sporting campus.', renderIn3D: true },
    ],
  },
};

export function getExperience(id: SchoolId) { return EXPERIENCES[id]; }
