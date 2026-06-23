Created At: 2026-06-22T18:03:47Z
Completed At: 2026-06-22T18:03:47Z
File Path: `file:///Users/abhishekshow/Downloads/la-martiniere-excellence-improved/three/BuildingScene.tsx`
Total Lines: 669
Total Bytes: 38174
Showing lines 1 to 50
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
25:   const positions = useMemo(() => {
26:     const values = new Float32Array(150 * 3);
27:     let seed = 1836;
28:     const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
29:     for (let index = 0; index < values.length; index += 3) {
30:       values[index] = (random() - .5) * 7.2;
31:       values[index + 1] = .35 + random() * 5.8;
32:       values[index + 2] = -18 + random() * 38;
33:     }
34:     return values;
35:   }, []);
36:   useFrame((state) => {
37:     if (!motes.current || reducedMotion) return;
38:     motes.current.rotation.y = Math.sin(state.clock.elapsedTime * .08) * .018;
39:     motes.current.position.y = Math.sin(state.clock.elapsedTime * .22) * .05;
40:   });
41:   return (
42:     <group>
43:       <points ref={motes}>
44:         <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
45:         <pointsMaterial color="#f6d7a2" size={.028} transparent opacity={.42} depthWrite={false} sizeAttenuation />
46:       </points>
47:       {[-2.3, 0, 2.3].map((x) => (
48:         <mesh key={x} position={[x, 3.4, 12]} rotation={[Math.PI, 0, 0]}>
49:           <coneGeometry args={[1.15, 6.5, 20, 1, true]} />
50:           <meshBasicMaterial color={accent} transparent opacity={.025} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.
