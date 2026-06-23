The following changes were made by the USER to: /Users/abhishekshow/Downloads/la-martiniere-excellence-improved/components/BuildingExperience.tsx. If relevant, proactively run terminal commands to execute this code for the USER. Don't ask for permission.
[diff_block_start]
@@ -1,6 +1,5 @@
 "use client";
 
-import dynamic from 'next/dynamic';
 import Link from 'next/link';
 import { useEffect, useRef, useState } from 'react';
 import { getExperience } from '../content/experience-config';
@@ -7,5 +7,6 @@
 import SceneErrorBoundary from './SceneErrorBoundary';
-import { motion, useScroll, useTransform } from 'framer-motion';
+import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
+import dynamic from 'next/dynamic';
 
 const Canvas = dynamic(() => import('@react-three/fiber').then((module) => module.Canvas), { ssr: false });
 const BuildingScene = dynamic(() => import('../three/BuildingScene'), { ssr: false });
@@ -12,3 +12,11 @@
+/**
+ * BuildingExperience — animation_Rules.md §5.3 scroll-driven panels
+ *
+ * Panel entrance: directional slide (left panels from left, right from right)
+ *   + blur-clear (§5.3 follow scroll velocity)
+ * Active panel: gold border glow + box-shadow pulse (§2.3.3)
+ * Progress dots: height expands 1.3rem→2.2rem + glow on activation
+ */
 export default function BuildingExperience({ schoolId }: { schoolId: SchoolId }) {
   const experience = getExperience(schoolId);
   const wrapper = useRef<HTMLDivElement>(null);
@@ -17,7 +17,7 @@
 
   const { scrollYProgress } = useScroll({
     target: wrapper,
-    offset: ["start start", "end end"]
+    offset: ['start start', 'end end'],
   });
 
   useEffect(() => {
@@ -24,10 +24,9 @@
     const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
-    const updatePreferences = () => setPreferences({ mobile: mobile.matches, reducedMotion: motionQuery.matches });
-    
+    const updatePreferences = () =>
+      setPreferences({ mobile: mobile.matches, reducedMotion: motionQuery.matches });
     u
<truncated 5411 bytes>
0px -20% 0px' }}
+              // §2.3.3 — active panel gold border + box-shadow glow
+              animate={
+                isActive
+                  ? {
+                      borderColor: 'rgba(214,180,95,0.72)',
+                      boxShadow: '0 0 28px rgba(214,180,95,0.22), 0 28px 100px rgba(0,0,0,.5), inset 0 0 40px rgba(255,255,255,.03)',
+                    }
+                  : {
+                      borderColor: 'rgba(214,180,95,0.20)',
+                      boxShadow: '0 28px 100px rgba(0,0,0,.4), inset 0 0 40px rgba(255,255,255,.025)',
+                    }
+              }
+              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
+              className="experience-panel"
+            >
+              <p className="experience-eyebrow text-gold font-bold tracking-widest uppercase text-xs mb-2">
+                {chapter.eyebrow}
+              </p>
+              <h1
+                id={`${schoolId}-${index}-title`}
+                className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-balance leading-none m-0"
+              >
+                {chapter.title}
+              </h1>
+              <p className="text-ivory/80 text-base md:text-lg max-w-prose mt-4">
+                {chapter.copy}
+              </p>
+              {chapter.link && chapter.linkLabel ? (
+                <Link
+                  className="text-link inline-flex mt-6 border-b border-gold text-ivory text-xs font-bold tracking-widest uppercase transition-colors hover:text-gold"
+                  href={chapter.link}
+                >
+                  {chapter.linkLabel}
+                </Link>
+              ) : null}
+            </motion.article>
+          </section>
+        );
+      })}
     </div>
   );
 }
[diff_block_end]

Please note that the above snippet only shows the MODIFIED lines from the last change. It shows up to 3 lines of unchanged lines before and after the modified lines. The actual file contents may have many more lines not shown.