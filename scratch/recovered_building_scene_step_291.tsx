Created At: 2026-06-22T16:49:20Z
Completed At: 2026-06-22T16:49:20Z
File Path: `file:///Users/abhishekshow/Downloads/la-martiniere-excellence-improved/three/BuildingScene.tsx`
Total Lines: 426
Total Bytes: 30181
Showing lines 1 to 426
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: "use client";
2: 
3: import { useEffect, useMemo, useRef, useState } from 'react';
4: import { useFrame, useThree } from '@react-three/fiber';
5: import { AdaptiveDpr, ContactShadows, Sky, SoftShadows, useGLTF, useTexture } from '@react-three/drei';
6: import { useRouter } from 'next/navigation';
7: import * as THREE from 'three';
8: import { getExperience, type AssetZone, type CameraKeyframe } from '../content/experience-config';
9: import type { SchoolId } from '../content/site-content';
10: import { InteriorLighting, OutdoorLighting, PoolLighting, CourtyardLighting, StadiumLighting, FrameSpotlighting } from './InteriorLighting';
11: import { useCinematicEntrance } from './CinematicEntrance';
12: import { AchievementFrameWall, SCHOOL_ACHIEVEMENTS } from './AchievementFrameWall';
13: import { GirlsCourtyard } from './CourtyardFeatures';
14: import { useRealisticTextures, type SurfaceTextures } from './RealisticMaterials';
15: import CinematicEffects from './CinematicEffects';
16: import WallNarrativePlaques from './WallNarrativePlaques';
17: 
18: type Props = { schoolId: SchoolId; progressRef: React.MutableRefObject<number>; activeStage: number; mobile: boolean; reducedMotion: boolean };
19: type Rig = { position: THREE.CatmullRomCurve3; gaze: THREE.CatmullRomCurve3 };
20: const positionTarget = new THREE.Vector3();
21: const gazeTarget = new THREE.Vector3();
22: 
23: function InteriorAtmosphere({ reducedMotion, accent }: { reducedMotion: boolean; accent: string }) {
24:   const motes = useRef<THREE.Points>(null);
25:   const positions = use
<truncated 28667 bytes>
ed' ? (
409:           <>
410:             <Crest textureUrl="/brand/la_martiniere/la_martiniere_boys_logo.png" position={[-17, 8, 21]} accent="#62d9ff" href="/boys" progressRef={progressRef} reducedMotion={reducedMotion} />
411:             <Crest textureUrl="/brand/la_martiniere/la_martiniere_girls_logo.png" position={[17, 8, 21]} accent="#ff7edc" href="/girls" progressRef={progressRef} reducedMotion={reducedMotion} />
412:           </>
413:         ) : experience.crest ? <Crest textureUrl={experience.crest} position={[0, 10, schoolId === 'girls' ? -93.4 : -14.6]} rotation={schoolId === 'boys' ? [0, Math.PI, 0] : [0, 0, 0]} accent={experience.accent} href={schoolId === 'boys' ? '/boys/profile' : '/girls/profile'} progressRef={progressRef} reducedMotion={reducedMotion} /> : null}
414:       </group>
415:       {!mobile && stage.world === 'exterior' && <ContactShadows position={[0, .03, 0]} scale={120} far={42} opacity={.34} blur={2.6} frames={1} />}
416:       {!mobile && stage.world === 'interior' && <ContactShadows position={[0, .02, 0]} scale={42} far={12} opacity={.4} blur={2.2} frames={1} />}
417:       {!mobile && stage.world === 'sports' && <ContactShadows position={[0, .03, 0]} scale={88} far={28} opacity={.3} blur={2.5} frames={1} />}
418:       <Interior visible={stage.world === 'interior'} accent={experience.accent} schoolId={schoolId} textures={textures} progressRef={progressRef} reducedMotion={reducedMotion} />
419:       {!mobile && stage.world === 'interior' && <InteriorAtmosphere reducedMotion={reducedMotion} accent={experience.accent} />}
420:       <SportsCampus visible={stage.world === 'sports' || activeStage === 5} accent={experience.accent} schoolId={schoolId} textures={textures} reducedMotion={reducedMotion} />
421:       <WallNarrativePlaques schoolId={schoolId} activeStage={activeStage} />
422:       {!mobile && !reducedMotion && <CinematicEffects world={stage.world} />}
423:     </>
424:   );
425: }
426: 
The above content shows the entire, complete file contents of the requested file.
