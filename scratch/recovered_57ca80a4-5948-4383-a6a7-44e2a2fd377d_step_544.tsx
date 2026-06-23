Created At: 2026-06-22T19:14:25Z
Completed At: 2026-06-22T19:14:25Z
File Path: `file:///Users/abhishekshow/Downloads/la-martiniere-excellence-improved/three/BuildingScene.tsx`
Total Lines: 338
Total Bytes: 16955
Showing lines 1 to 338
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: 'use client';
2: 
3: import React, { useRef, useMemo, useEffect, useState } from 'react';
4: import { useFrame, useThree } from '@react-three/fiber';
5: import * as THREE from 'three';
6: import { useGLTF } from '@react-three/drei';
7: import { getExperience, CameraKeyframe, AssetZone } from '../content/experience-config';
8: import type { SchoolId } from '../content/site-content';
9: import { useRealisticTextures, SurfaceTextures } from './RealisticMaterials';
10: import { InteriorLighting, CourtyardLighting, PoolLighting } from './InteriorLighting';
11: import { AchievementFrameWall, SCHOOL_ACHIEVEMENTS } from './AchievementFrameWall';
12: import WallNarrativePlaques from './WallNarrativePlaques';
13: import { useCinematicEntrance, EntranceAmbientLight } from './CinematicEntrance';
14: import { GirlsCourtyard } from './CourtyardFeatures';
15: 
16: type Props = {
17:   schoolId: SchoolId;
18:   progressRef: React.MutableRefObject<number>;
19:   activeStage: number;
20:   mobile: boolean;
21:   reducedMotion: boolean;
22: };
23: 
24: type Rig = { position: THREE.CatmullRomCurve3; gaze: THREE.CatmullRomCurve3 };
25: 
26: function FloorEngraving({ text, position }: { text: string; position: [number, number, number] }) {
27:   const canvas = useMemo(() => {
28:     const cvs = document.createElement('canvas');
29:     cvs.width = 1024;
30:     cvs.height = 256;
31:     const ctx = cvs.getContext('2d');
32:     if (!ctx) return new THREE.Texture();
33:     ctx.clearRect(0, 0, cvs.width, cvs.height);
34:     
35:     ctx.shadowColor = 'rgba(0,0,0,
<truncated 15001 bytes>
3d3128" roughness={.2} /></mesh>
311:             <mesh position={[side * 3.82, 1.18, 0]} castShadow receiveShadow><boxGeometry args={[.16, 1.45, 28]} /><meshStandardMaterial map={textures.wood} color="#4f4035" roughness={.25} /></mesh>
312:             <mesh position={[side * 3.70, 1.98, 0]} castShadow><boxGeometry args={[.18, .12, 28]} /><meshStandardMaterial color="#b7b0a4" metalness={.6} roughness={.3} /></mesh>
313:           </group>
314:         ))}
315: 
316:         {[-8, 0, 8].map((z, index) => (
317:           <group key={z} position={[index % 2 ? 2.75 : -2.75, 0, z]}>
318:             <mesh position={[0, .62, 0]} castShadow receiveShadow><boxGeometry args={[1.65, .13, .55]} /><meshStandardMaterial map={textures.wood} color="#3d3128" roughness={.3} /></mesh>
319:             {[-.68, .68].map((x) => <mesh key={x} position={[x, .3, 0]} castShadow><boxGeometry args={[.12, .6, .45]} /><meshStandardMaterial color="#221a15" metalness={.2} roughness={.3} /></mesh>)}
320:           </group>
321:         ))}
322:         
323:         <group position={[-3.55, 1.15, -4]}>
324:           <WallNarrativePlaques schoolId={schoolId} activeStage={activeStage} />
325:         </group>
326: 
327:         <AchievementFrameWall side="left" schoolId={schoolId} accent={experience.accent} achievements={SCHOOL_ACHIEVEMENTS[schoolId]} revealOffset={0} frameReveal={cinematicState.frameReveal} />
328:         <AchievementFrameWall side="right" schoolId={schoolId} accent={experience.accent} achievements={SCHOOL_ACHIEVEMENTS[schoolId]} revealOffset={3} frameReveal={cinematicState.frameReveal} />
329: 
330:         <InteriorLighting entranceProgress={1} visible={stage.world === 'interior'} />
331:       </group>
332: 
333:       {/* 3. Sports Campus */}
334:       <SportsCampus visible={stage.world === 'sports'} accent={experience.accent} schoolId={schoolId} textures={textures} reducedMotion={reducedMotion} />
335:     </group>
336:   );
337: }
338: 
The above content shows the entire, complete file contents of the requested file.
