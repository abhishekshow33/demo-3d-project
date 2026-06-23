"use client";

import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

/**
 * AcademicExcellenceSection — animation_Rules.md §5.2 hover + counter
 *
 * Counter animation: numbers count up 0→target as card enters view (§5.2)
 * Card hover: scale 1→1.04, border glow (§5.2 <100ms feel)
 * Background shimmer: subtle floating orbs
 */

const stats = [
  { label: 'Board Toppers', value: 96, unit: '%', prefix: '' },
  { label: 'International Olympiad Medals', value: 120, unit: '+', prefix: '' },
  { label: 'University Placements', value: 100, unit: '%', prefix: '' },
];

/**
 * AnimatedCounter — uses Framer Motion animate() to count from 0 to value
 * §5.2: response < 100ms feels instantaneous
 */
function AnimatedCounter({ value, unit }: { value: number; unit?: string }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [inView, motionValue, value]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {unit && <span>{unit}</span>}
    </span>
  );
}

/** Floating shimmer orb — pure CSS keyframe background animation */
function ShimmerOrb({ x, y, size, delay }: { x: string; y: string; size: number; delay: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: 'radial-gradient(circle, rgba(214,180,95,0.08) 0%, transparent 70%)',
        animation: `float-orb ${6 + delay}s ease-in-out ${delay}s infinite alternate`,
      }}
    />
  );
}

export default function AcademicExcellenceSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-10% 0px' });

  return (
    <section id="academics" className="py-24 px-6 bg-navy relative overflow-hidden">
      {/* §5.2 — Floating orb shimmer background */}
      <ShimmerOrb x="5%" y="20%" size={320} delay={0} />
      <ShimmerOrb x="75%" y="60%" size={240} delay={1.5} />
      <ShimmerOrb x="45%" y="80%" size={180} delay={3} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* §5.1 — Heading entrance with blur-clear */}
        <motion.h2
          ref={headingRef}
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={headingInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-playfair text-4xl sm:text-5xl text-gold mb-4 text-center"
        >
          Academic Excellence
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="text-ivory/70 text-center max-w-3xl mx-auto mb-14 leading-relaxed"
        >
          Our students consistently rank among the top in board examinations, excel
          in international competitions and secure placements in the world&apos;s finest
          universities.
        </motion.p>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
              // §5.2 — hover: scale 1→1.04, border + glow
              whileHover={{
                scale: 1.04,
                borderColor: 'rgba(214,180,95,0.75)',
                boxShadow: '0 0 32px rgba(214,180,95,0.18), 0 28px 100px rgba(0,0,0,.45), inset 0 0 40px rgba(255,255,255,.03)',
              }}
              transition-hover={{ duration: 0.15 }}
              style={{
                background: 'linear-gradient(135deg, rgba(8,18,26,0.88), rgba(8,14,20,0.66))',
                // §2.5.1 full panel shadow
                boxShadow: '0 28px 100px rgba(0,0,0,.4), inset 0 0 40px rgba(255,255,255,.025)',
              }}
              className="border border-gold/20 rounded-xl p-8 flex flex-col items-center backdrop-blur-md cursor-default"
            >
              {/* §5.2 — Counter animates from 0 to target on viewport entry */}
              <span className="text-gold font-playfair text-6xl sm:text-7xl font-semibold drop-shadow-lg mb-2">
                <AnimatedCounter value={stat.value} unit={stat.unit} />
              </span>
              <span className="text-ivory/70 text-base text-center leading-snug">{stat.label}</span>

              {/* Decorative gold accent line */}
              <motion.div
                className="mt-4 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent w-3/4"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 + 0.4 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
