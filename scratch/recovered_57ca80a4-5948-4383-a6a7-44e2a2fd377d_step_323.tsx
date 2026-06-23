Created At: 2026-06-22T18:09:18Z
Completed At: 2026-06-22T18:09:18Z
File Path: `file:///Users/abhishekshow/Downloads/la-martiniere-excellence-improved/components/BuildingExperience.tsx`
Total Lines: 167
Total Bytes: 6758
Showing lines 1 to 100
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: "use client";
2: 
3: import Link from 'next/link';
4: import { useEffect, useRef, useState } from 'react';
5: import { getExperience } from '../content/experience-config';
6: import type { SchoolId } from '../content/site-content';
7: import SceneErrorBoundary from './SceneErrorBoundary';
8: import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
9: import dynamic from 'next/dynamic';
10: 
11: const Canvas = dynamic(() => import('@react-three/fiber').then((module) => module.Canvas), { ssr: false });
12: const BuildingScene = dynamic(() => import('../three/BuildingScene'), { ssr: false });
13: 
14: /**
15:  * BuildingExperience — animation_Rules.md §5.3 scroll-driven panels
16:  *
17:  * Panel entrance: directional slide (left panels from left, right from right)
18:  *   + blur-clear (§5.3 follow scroll velocity)
19:  * Active panel: gold border glow + box-shadow pulse (§2.3.3)
20:  * Progress dots: height expands 1.3rem→2.2rem + glow on activation
21:  */
22: export default function BuildingExperience({ schoolId }: { schoolId: SchoolId }) {
23:   const experience = getExperience(schoolId);
24:   const wrapper = useRef<HTMLDivElement>(null);
25:   const progressRef = useRef(0);
26:   const [active, setActive] = useState(0);
27:   const [preferences, setPreferences] = useState({ mobile: false, reducedMotion: false });
28: 
29:   const { scrollYProgress } = useScroll({
30:     target: wrapper,
31:     offset: ['start start', 'end end'],
32:   });
33: 
34:   useEffect(() => {
35:     const mobile = window
<truncated 905 bytes>
rollYProgress, experience]);
55: 
56:   return (
57:     <div
58:       ref={wrapper}
59:       className={`building-experience building-${schoolId}`}
60:       style={{ '--school-accent': experience.accent } as React.CSSProperties}
61:     >
62:       <div className="experience-canvas" aria-hidden="true">
63:         <SceneErrorBoundary>
64:           <Canvas
65:             shadows={!preferences.mobile}
66:             performance={{ min: 0.55 }}
67:             camera={{ position: [0, 1.7, 56], fov: 40, near: 0.1, far: 320 }}
68:             dpr={preferences.mobile ? [1, 1.1] : [1, 1.5]}
69:             gl={{ antialias: !preferences.mobile, powerPreference: 'high-performance', stencil: false }}
70:           >
71:             <BuildingScene
72:               schoolId={schoolId}
73:               progressRef={progressRef}
74:               activeStage={active}
75:               mobile={preferences.mobile}
76:               reducedMotion={preferences.reducedMotion}
77:             />
78:           </Canvas>
79:         </SceneErrorBoundary>
80:         <div className="experience-vignette" />
81:       </div>
82: 
83:       {/* §5.3 — Scroll progress indicator dots */}
84:       <div className="experience-progress" role="presentation">
85:         {experience.stages.map((stage, i) => (
86:           <motion.span
87:             key={stage.id}
88:             animate={
89:               active === i
90:                 ? {
91:                     height: '2.2rem',
92:                     backgroundColor: experience.accent,
93:                     boxShadow: `0 0 14px ${experience.accent}`,
94:                   }
95:                 : {
96:                     height: '1.3rem',
97:                     backgroundColor: 'rgba(243,237,223,0.25)',
98:                     boxShadow: 'none',
99:                   }
100:             }
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.
