Created At: 2026-06-21T18:48:19Z
Completed At: 2026-06-21T18:48:19Z
File Path: `file:///Users/abhishekshow/Downloads/la-martiniere-excellence-improved/components/BuildingExperience.tsx`
Total Lines: 81
Total Bytes: 4325
Showing lines 1 to 81
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: "use client";
2: 
3: import dynamic from 'next/dynamic';
4: import Link from 'next/link';
5: import { useEffect, useRef, useState } from 'react';
6: import { getExperience } from '../content/experience-config';
7: import type { SchoolId } from '../content/site-content';
8: import SceneErrorBoundary from './SceneErrorBoundary';
9: 
10: const Canvas = dynamic(() => import('@react-three/fiber').then((module) => module.Canvas), { ssr: false });
11: const BuildingScene = dynamic(() => import('../three/BuildingScene'), { ssr: false });
12: 
13: export default function BuildingExperience({ schoolId }: { schoolId: SchoolId }) {
14:   const experience = getExperience(schoolId);
15:   const wrapper = useRef<HTMLDivElement>(null);
16:   const progressRef = useRef(0);
17:   const [active, setActive] = useState(0);
18:   const [preferences, setPreferences] = useState({ mobile: false, reducedMotion: false });
19: 
20:   useEffect(() => {
21:     const mobile = window.matchMedia('(max-width: 767px)');
22:     const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
23:     const updatePreferences = () => setPreferences({ mobile: mobile.matches, reducedMotion: motion.matches });
24:     const updateScroll = () => {
25:       if (!wrapper.current) return;
26:       const rect = wrapper.current.getBoundingClientRect();
27:       const distance = Math.max(wrapper.current.offsetHeight - window.innerHeight, 1);
28:       const progress = Math.min(Math.max(-rect.top / distance, 0), 1);
29:       progressRef.current = progress;
30:       const i
<truncated 1111 bytes>
e="experience-canvas" aria-hidden="true">
48:         <div className="experience-fallback" />
49:         <SceneErrorBoundary>
50:           <Canvas camera={{ position: [0, 1.7, 56], fov: 40, near: .1, far: 320 }} dpr={preferences.mobile ? [1, 1.15] : [1, 1.5]} gl={{ antialias: !preferences.mobile, powerPreference: 'high-performance' }}>
51:             <BuildingScene schoolId={schoolId} progressRef={progressRef} activeStage={active} mobile={preferences.mobile} reducedMotion={preferences.reducedMotion} />
52:           </Canvas>
53:         </SceneErrorBoundary>
54:         <div className="experience-vignette" />
55:       </div>
56: 
57:       <div className="experience-progress" aria-hidden="true">
58:         {experience.stages.map((stage, index) => <span key={stage.id} className={index <= active ? 'active' : ''} />)}
59:       </div>
60: 
61:       {schoolId === 'shared' ? (
62:         <nav className={`crest-access-links ${active > 1 ? 'departed' : ''}`} aria-label="Choose a school">
63:           <Link href="/boys">Enter La Martiniere for Boys</Link>
64:           <Link href="/girls">Enter La Martiniere for Girls</Link>
65:         </nav>
66:       ) : null}
67: 
68:       {experience.chapters.map((chapter, index) => (
69:         <section key={experience.stages[index].id} id={experience.stages[index].id} className={`experience-chapter ${index % 2 ? 'align-right' : 'align-left'} ${active === index ? 'current' : ''}`} aria-labelledby={`${schoolId}-${index}-title`}>
70:           <article className="experience-panel">
71:             <p className="experience-eyebrow">{chapter.eyebrow}</p>
72:             <h1 id={`${schoolId}-${index}-title`}>{chapter.title}</h1>
73:             <p>{chapter.copy}</p>
74:             {chapter.link && chapter.linkLabel ? <Link className="text-link" href={chapter.link}>{chapter.linkLabel}</Link> : null}
75:           </article>
76:         </section>
77:       ))}
78:     </div>
79:   );
80: }
81: 
The above content shows the entire, complete file contents of the requested file.
