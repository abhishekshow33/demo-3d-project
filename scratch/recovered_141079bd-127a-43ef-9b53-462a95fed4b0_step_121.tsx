Created At: 2026-06-22T16:16:43Z
Completed At: 2026-06-22T16:16:44Z
File Path: `file:///Users/abhishekshow/Downloads/la-martiniere-excellence-improved/components/BuildingExperience.tsx`
Total Lines: 97
Total Bytes: 4867
Showing lines 1 to 97
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: "use client";
2: 
3: import dynamic from 'next/dynamic';
4: import Link from 'next/link';
5: import { useEffect, useRef, useState } from 'react';
6: import { getExperience } from '../content/experience-config';
7: import type { SchoolId } from '../content/site-content';
8: import SceneErrorBoundary from './SceneErrorBoundary';
9: import { motion, useScroll, useTransform } from 'framer-motion';
10: 
11: const Canvas = dynamic(() => import('@react-three/fiber').then((module) => module.Canvas), { ssr: false });
12: const BuildingScene = dynamic(() => import('../three/BuildingScene'), { ssr: false });
13: 
14: export default function BuildingExperience({ schoolId }: { schoolId: SchoolId }) {
15:   const experience = getExperience(schoolId);
16:   const wrapper = useRef<HTMLDivElement>(null);
17:   const progressRef = useRef(0);
18:   const [active, setActive] = useState(0);
19:   const [preferences, setPreferences] = useState({ mobile: false, reducedMotion: false });
20: 
21:   const { scrollYProgress } = useScroll({
22:     target: wrapper,
23:     offset: ["start start", "end end"]
24:   });
25: 
26:   useEffect(() => {
27:     const mobile = window.matchMedia('(max-width: 767px)');
28:     const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
29:     const updatePreferences = () => setPreferences({ mobile: mobile.matches, reducedMotion: motionQuery.matches });
30:     
31:     updatePreferences();
32:     mobile.addEventListener('change', updatePreferences);
33:     motionQuery.addEventListener('change', updatePrefe
<truncated 1717 bytes>
tive ? 'active' : ''} />)}
69:       </div>
70: 
71:       {schoolId === 'shared' ? (
72:         <nav className={`crest-access-links ${active > 1 ? 'departed' : ''}`} aria-label="Choose a school">
73:           <Link href="/boys">Enter La Martiniere for Boys</Link>
74:           <Link href="/girls">Enter La Martiniere for Girls</Link>
75:         </nav>
76:       ) : null}
77: 
78:       {experience.chapters.map((chapter, index) => (
79:         <section key={experience.stages[index].id} id={experience.stages[index].id} className={`experience-chapter ${index % 2 ? 'align-right' : 'align-left'} ${index > 0 && index < experience.chapters.length - 1 ? 'wall-mounted' : ''}`} aria-labelledby={`${schoolId}-${index}-title`}>
80:           <motion.article 
81:             initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
82:             whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
83:             viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
84:             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
85:             className={`experience-panel ${active === index ? 'border-gold' : 'border-gold/20'}`}
86:           >
87:             <p className="experience-eyebrow text-gold font-bold tracking-widest uppercase text-xs mb-2">{chapter.eyebrow}</p>
88:             <h1 id={`${schoolId}-${index}-title`} className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-balance leading-none m-0">{chapter.title}</h1>
89:             <p className="text-ivory/80 text-base md:text-lg max-w-prose mt-4">{chapter.copy}</p>
90:             {chapter.link && chapter.linkLabel ? <Link className="text-link inline-flex mt-6 border-b border-gold text-ivory text-xs font-bold tracking-widest uppercase uppercase transition-colors hover:text-gold" href={chapter.link}>{chapter.linkLabel}</Link> : null}
91:           </motion.article>
92:         </section>
93:       ))}
94:     </div>
95:   );
96: }
97: 
The above content shows the entire, complete file contents of the requested file.
