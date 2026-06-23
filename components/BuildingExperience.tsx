"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getExperience } from '../content/experience-config';
import type { SchoolId } from '../content/site-content';
import SceneErrorBoundary from './SceneErrorBoundary';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import ScrollIndicator from './ScrollIndicator';

const Canvas = dynamic(() => import('@react-three/fiber').then((module) => module.Canvas), { ssr: false });
const BuildingScene = dynamic(() => import('../three/BuildingScene'), { ssr: false });

/**
 * BuildingExperience — animation_Rules.md §5.3 scroll-driven panels
 *
 * Panel entrance: directional slide (left panels from left, right from right)
 *   + blur-clear (§5.3 follow scroll velocity)
 * Active panel: gold border glow + box-shadow pulse (§2.3.3)
 * Progress dots: height expands 1.3rem→2.2rem + glow on activation
 */
export default function BuildingExperience({ schoolId }: { schoolId: SchoolId }) {
  const experience = getExperience(schoolId);
  const wrapper = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);
  const [preferences, setPreferences] = useState({ mobile: false, reducedMotion: false });

  const { scrollYProgress } = useScroll({
    target: wrapper,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreferences = () =>
      setPreferences({ mobile: mobile.matches, reducedMotion: motionQuery.matches });
    updatePreferences();
    mobile.addEventListener('change', updatePreferences);
    motionQuery.addEventListener('change', updatePreferences);
    return () => {
      mobile.removeEventListener('change', updatePreferences);
      motionQuery.removeEventListener('change', updatePreferences);
    };
  }, []);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      progressRef.current = latest;
      const index = experience.stages.findIndex((stage) => latest <= stage.range[1]);
      setActive(index < 0 ? experience.stages.length - 1 : index);
    });
  }, [scrollYProgress, experience]);

  return (
    <div
      ref={wrapper}
      className={`building-experience building-${schoolId}`}
      style={{ '--school-accent': experience.accent } as React.CSSProperties}
    >
      <div className="experience-canvas" aria-hidden="true">
        <SceneErrorBoundary>
          <Canvas
            shadows={!preferences.mobile}
            performance={{ min: 0.55 }}
            camera={{ position: [0, 1.7, 56], fov: 40, near: 0.1, far: 320 }}
            dpr={preferences.mobile ? [1, 1.1] : [1, 1.5]}
            gl={{ antialias: !preferences.mobile, powerPreference: 'high-performance', stencil: false }}
          >
            <BuildingScene
              schoolId={schoolId}
              progressRef={progressRef}
              activeStage={active}
              mobile={preferences.mobile}
              reducedMotion={preferences.reducedMotion}
            />
          </Canvas>
        </SceneErrorBoundary>
        <div className="experience-vignette" />
        <ScrollIndicator />
      </div>

      {/* §5.3 — Scroll progress indicator dots */}
      <div className="experience-progress" role="presentation">
        {experience.stages.map((stage, i) => (
          <motion.span
            key={stage.id}
            animate={
              active === i
                ? {
                    height: '2.2rem',
                    backgroundColor: experience.accent,
                    boxShadow: `0 0 14px ${experience.accent}`,
                  }
                : {
                    height: '1.3rem',
                    backgroundColor: 'rgba(243,237,223,0.25)',
                    boxShadow: 'none',
                  }
            }
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="block rounded-full"
            style={{ width: 3 }}
          />
        ))}
      </div>

      {experience.chapters.map((chapter, index) => {
        const isActive = active === index;
        const stageId = experience.stages[index]?.id ?? `stage-${index}`;

        // §renderIn3D — hide HTML panel; the 3D scene provides the story for these chapters
        if (chapter.renderIn3D) {
          return (
            <section
              key={stageId}
              id={stageId}
              className="experience-chapter experience-3d-only"
              aria-hidden="true"
            />
          );
        }

        // §5.3 — directional entrance: left-aligned → from left, right-aligned → from right
        const alignRight = index % 2 === 1;
        const enterX = alignRight ? 35 : -35;

        return (
          <section
            key={stageId}
            id={stageId}
            className={`experience-chapter ${alignRight ? 'align-right' : 'align-left'} ${index > 0 && index < experience.chapters.length - 1 ? 'wall-mounted' : ''}`}
            aria-labelledby={`${schoolId}-${index}-title`}
          >
            <motion.article
              initial={{ opacity: 0, x: enterX, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, margin: '-20% 0px -20% 0px' }}
              // §2.3.3 — active panel gold border + box-shadow glow
              animate={
                isActive
                  ? {
                      borderColor: 'rgba(214,180,95,0.72)',
                      boxShadow: '0 0 28px rgba(214,180,95,0.22), 0 28px 100px rgba(0,0,0,.5), inset 0 0 40px rgba(255,255,255,.03)',
                    }
                  : {
                      borderColor: 'rgba(214,180,95,0.20)',
                      boxShadow: '0 28px 100px rgba(0,0,0,.4), inset 0 0 40px rgba(255,255,255,.025)',
                    }
              }
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="experience-panel"
            >
              <p className="experience-eyebrow text-gold font-bold tracking-widest uppercase text-xs mb-2">
                {chapter.eyebrow}
              </p>
              <h1
                id={`${schoolId}-${index}-title`}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-balance leading-none m-0"
              >
                {chapter.title}
              </h1>
              <p className="text-ivory/80 text-base md:text-lg max-w-prose mt-4">
                {chapter.copy}
              </p>
              {chapter.link && chapter.linkLabel ? (
                <Link
                  className="text-link inline-flex mt-6 border-b border-gold text-ivory text-xs font-bold tracking-widest uppercase transition-colors hover:text-gold"
                  href={chapter.link}
                >
                  {chapter.linkLabel}
                </Link>
              ) : null}
            </motion.article>
          </section>
        );
      })}

    </div>
  );
}
