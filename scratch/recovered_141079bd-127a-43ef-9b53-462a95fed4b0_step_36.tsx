Created At: 2026-06-22T16:09:48Z
Completed At: 2026-06-22T16:09:48Z
File Path: `file:///Users/abhishekshow/Downloads/la-martiniere-excellence-improved/components/BuildingExperience.tsx`
Total Lines: 87
Total Bytes: 4545
Showing lines 1 to 87
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
<truncated 1355 bytes>
          camera={{ position: [0, 1.7, 56], fov: 40, near: .1, far: 320 }}
54:             dpr={preferences.mobile ? [1, 1.1] : [1, 1.5]}
55:             gl={{ antialias: !preferences.mobile, powerPreference: 'high-performance', stencil: false }}
56:           >
57:             <BuildingScene schoolId={schoolId} progressRef={progressRef} activeStage={active} mobile={preferences.mobile} reducedMotion={preferences.reducedMotion} />
58:           </Canvas>
59:         </SceneErrorBoundary>
60:         <div className="experience-vignette" />
61:       </div>
62: 
63:       <div className="experience-progress" aria-hidden="true">
64:         {experience.stages.map((stage, index) => <span key={stage.id} className={index <= active ? 'active' : ''} />)}
65:       </div>
66: 
67:       {schoolId === 'shared' ? (
68:         <nav className={`crest-access-links ${active > 1 ? 'departed' : ''}`} aria-label="Choose a school">
69:           <Link href="/boys">Enter La Martiniere for Boys</Link>
70:           <Link href="/girls">Enter La Martiniere for Girls</Link>
71:         </nav>
72:       ) : null}
73: 
74:       {experience.chapters.map((chapter, index) => (
75:         <section key={experience.stages[index].id} id={experience.stages[index].id} className={`experience-chapter ${index % 2 ? 'align-right' : 'align-left'} ${index > 0 && index < experience.chapters.length - 1 ? 'wall-mounted' : ''} ${active === index ? 'current' : ''}`} aria-labelledby={`${schoolId}-${index}-title`}>
76:           <article className="experience-panel">
77:             <p className="experience-eyebrow">{chapter.eyebrow}</p>
78:             <h1 id={`${schoolId}-${index}-title`}>{chapter.title}</h1>
79:             <p>{chapter.copy}</p>
80:             {chapter.link && chapter.linkLabel ? <Link className="text-link" href={chapter.link}>{chapter.linkLabel}</Link> : null}
81:           </article>
82:         </section>
83:       ))}
84:     </div>
85:   );
86: }
87: 
The above content shows the entire, complete file contents of the requested file.
