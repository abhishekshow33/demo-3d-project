Created At: 2026-06-22T19:14:43Z
Completed At: 2026-06-22T19:14:43Z
File Path: `file:///Users/abhishekshow/Downloads/la-martiniere-excellence-improved/components/BuildingExperience.tsx`
Total Lines: 167
Total Bytes: 6758
Showing lines 1 to 167
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
<truncated 3958 bytes>
' }}
125:               // §2.3.3 — active panel gold border + box-shadow glow
126:               animate={
127:                 isActive
128:                   ? {
129:                       borderColor: 'rgba(214,180,95,0.72)',
130:                       boxShadow: '0 0 28px rgba(214,180,95,0.22), 0 28px 100px rgba(0,0,0,.5), inset 0 0 40px rgba(255,255,255,.03)',
131:                     }
132:                   : {
133:                       borderColor: 'rgba(214,180,95,0.20)',
134:                       boxShadow: '0 28px 100px rgba(0,0,0,.4), inset 0 0 40px rgba(255,255,255,.025)',
135:                     }
136:               }
137:               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
138:               className="experience-panel"
139:             >
140:               <p className="experience-eyebrow text-gold font-bold tracking-widest uppercase text-xs mb-2">
141:                 {chapter.eyebrow}
142:               </p>
143:               <h1
144:                 id={`${schoolId}-${index}-title`}
145:                 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-balance leading-none m-0"
146:               >
147:                 {chapter.title}
148:               </h1>
149:               <p className="text-ivory/80 text-base md:text-lg max-w-prose mt-4">
150:                 {chapter.copy}
151:               </p>
152:               {chapter.link && chapter.linkLabel ? (
153:                 <Link
154:                   className="text-link inline-flex mt-6 border-b border-gold text-ivory text-xs font-bold tracking-widest uppercase transition-colors hover:text-gold"
155:                   href={chapter.link}
156:                 >
157:                   {chapter.linkLabel}
158:                 </Link>
159:               ) : null}
160:             </motion.article>
161:           </section>
162:         );
163:       })}
164:     </div>
165:   );
166: }
167: 
The above content shows the entire, complete file contents of the requested file.
