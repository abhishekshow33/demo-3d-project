Created At: 2026-06-22T19:14:28Z
Completed At: 2026-06-22T19:14:28Z
File Path: `file:///Users/abhishekshow/Downloads/la-martiniere-excellence-improved/temp_extracted/lamartiniere-3d-redesign/components/scenes/MainBuildingScene.tsx`
Total Lines: 637
Total Bytes: 17524
Showing lines 1 to 637
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: // app/components/scenes/MainBuildingScene.tsx
2: 'use client';
3: 
4: import React, { useEffect, useRef, useState } from 'react';
5: import { Canvas, useFrame, useThree } from '@react-three/fiber';
6: import { 
7:   Environment, 
8:   Text, 
9:   useGLTF,
10:   PerspectiveCamera,
11:   Lightformer,
12:   Float
13: } from '@react-three/drei';
14: import * as THREE from 'three';
15: import gsap from 'gsap';
16: import ScrollTrigger from 'gsap/ScrollTrigger';
17: import { useRouter } from 'next/navigation';
18: import { AchievementFrameWall } from './AchievementFrameWall';
19: import { InteriorLighting } from './InteriorLighting';
20: 
21: gsap.registerPlugin(ScrollTrigger);
22: 
23: // ============================================================================
24: // MAIN BUILDING EXTERIOR COMPONENT
25: // ============================================================================
26: 
27: interface MainBuildingSceneProps {
28:   onEnterComplete?: () => void;
29: }
30: 
31: export const MainBuildingScene: React.FC<MainBuildingSceneProps> = ({ 
32:   onEnterComplete 
33: }) => {
34:   const containerRef = useRef<HTMLDivElement>(null);
35:   const [scrollProgress, setScrollProgress] = useState(0);
36:   const [isInteriorVisible, setIsInteriorVisible] = useState(false);
37: 
38:   return (
39:     <div 
40:       ref={containerRef}
41:       style={{
42:         width: '100%',
43:         height: '100vh',
44:         position: 'relative',
45:         overflow: 'hidden'
46:       }}
47:    
<truncated 17121 bytes>
er"
578:       >
579:         +91 33 4040 6601
580:       </Text>
581: 
582:       {/* ADMISSION SCROLL PEDESTAL */}
583:       <mesh position={[0, 0.5, 0.1]}>
584:         <cylinderGeometry args={[1, 1.2, 1, 8]} />
585:         <meshStandardMaterial color="#8B7355" roughness={0.6} />
586:       </mesh>
587: 
588:       <Text
589:         position={[0, 1.8, 0.2]}
590:         fontSize={0.35}
591:         color="#8B1538"
592:         anchorX="center"
593:       >
594:         Admissions Open
595:       </Text>
596:     </group>
597:   );
598: };
599: 
600: // ============================================================================
601: // SCROLL TRACKER
602: // ============================================================================
603: 
604: interface ScrollTrackerProps {
605:   onProgressUpdate: (progress: number) => void;
606: }
607: 
608: const ScrollTracker: React.FC<ScrollTrackerProps> = ({ onProgressUpdate }) => {
609:   useEffect(() => {
610:     const handleScroll = () => {
611:       const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
612:       const scrolled = window.scrollY;
613:       const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0;
614:       onProgressUpdate(progress);
615:     };
616: 
617:     window.addEventListener('scroll', handleScroll);
618:     return () => window.removeEventListener('scroll', handleScroll);
619:   }, [onProgressUpdate]);
620: 
621:   return null;
622: };
623: 
624: // ============================================================================
625: // UTILITY: TEXTURE LOADER
626: // ============================================================================
627: 
628: const useTexture = (url: string) => {
629:   const [texture, setTexture] = React.useState<THREE.Texture | null>(null);
630: 
631:   React.useEffect(() => {
632:     new THREE.TextureLoader().load(url, setTexture);
633:   }, [url]);
634: 
635:   return texture;
636: };
637: 
The above content shows the entire, complete file contents of the requested file.
