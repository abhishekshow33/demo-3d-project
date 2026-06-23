"use client";

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

/**
 * HeritageTimeline — animation_Rules.md §5.3 scroll-driven reveal
 *
 * Animated elements:
 *   • SVG timeline line: pathLength draws from 0→1 as section enters view (§5.3)
 *   • Gold dot: scale pulse 1→1.5→1 on viewport entry (§5.2)
 *   • Cards: directional slide-in with blur-clear (§5.3 stagger 0.2s)
 *   • Panel glassmorphism: §2.5.1 box-shadow spec
 */

const events = [
  {
    year: 1836,
    title: 'Founding of La Martinière',
    description:
      'Claude Martin establishes La Martinière in Kolkata, ushering in a legacy of excellence that has endured for nearly two centuries.',
  },
  {
    year: 1925,
    title: 'The Chater Benefaction',
    description:
      'Sir Catchick Paul Chater\'s landmark benefaction preserves and transforms the institution, cementing its place as one of India\'s foremost schools.',
  },
  {
    year: 1950,
    title: 'Expansion & Growth',
    description:
      'The campus expands to accommodate thousands of students, introducing new programs, facilities and a culture of high academic achievement.',
  },
  {
    year: 2026,
    title: 'Future Ready',
    description:
      'La Martinière embraces AI-driven learning and state-of-the-art infrastructure while honouring the Latin motto: Labore et Constantia.',
  },
];

function TimelineEvent({ event, index, total }: { event: typeof events[0]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-15% 0px -15% 0px' });
  const dotRef = useRef<HTMLSpanElement>(null);

  return (
    <div ref={ref} className="mb-12 ml-6 relative pl-8">
      {/* §5.2 — Gold dot: scale pulse on view entry */}
      <motion.span
        ref={dotRef}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -left-[14px] top-1 w-4 h-4 rounded-full border-2 border-gold bg-navy flex items-center justify-center"
      >
        <motion.span
          animate={inView ? { scale: [1, 1.8, 1] } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeInOut' }}
          className="w-2 h-2 rounded-full bg-gold block"
        />
      </motion.span>

      {/* Year badge */}
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="text-gold/60 font-mono text-xs font-bold tracking-widest uppercase mb-1 block"
      >
        {event.year}
      </motion.span>

      {/* §5.3 — Card: directional slide + blur-clear, stagger 0.2s per index */}
      <motion.div
        initial={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
        animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : { opacity: 0, x: -40, filter: 'blur(8px)' }}
        transition={{ duration: 0.7, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
        // §2.5.1 — glassmorphism panel with full shadow spec
        style={{
          background: 'linear-gradient(135deg, rgba(8,18,26,0.88), rgba(8,14,20,0.66))',
          boxShadow: '0 28px 100px rgba(0,0,0,.4), inset 0 0 40px rgba(255,255,255,.025)',
        }}
        className="border border-gold/30 rounded-lg p-5 backdrop-blur-md"
        whileHover={{ borderColor: 'rgba(214,180,95,0.65)', boxShadow: '0 28px 100px rgba(0,0,0,.5), 0 0 24px rgba(214,180,95,0.12), inset 0 0 40px rgba(255,255,255,.025)' }}
      >
        <h3 className="font-playfair text-xl text-gold mb-2">
          {event.year} — {event.title}
        </h3>
        <p className="text-ivory/75 text-sm leading-relaxed">{event.description}</p>
      </motion.div>
    </div>
  );
}

export default function HeritageTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 0.8', 'end 0.2'] });

  // §5.3 — SVG line pathLength driven by scroll progress
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-10% 0px' });

  return (
    <section id="heritage" ref={sectionRef} className="py-24 px-6 bg-navy relative overflow-hidden">
      {/* Subtle background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(214,180,95,0.04) 0%, transparent 65%)' }}
      />

      <div className="max-w-3xl mx-auto">
        {/* §5.1 — Heading entrance */}
        <motion.h2
          ref={headingRef}
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={headingInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-playfair text-4xl sm:text-5xl text-gold mb-3 text-center"
        >
          Heritage Since 1836
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={headingInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-ivory/50 text-center text-sm tracking-widest uppercase mb-14"
        >
          Labore et Constantia
        </motion.p>

        {/* §5.3 — Timeline container with animated vertical line */}
        <div className="relative ml-4">
          {/* Static background line */}
          <div className="absolute left-0 top-0 w-px h-full bg-gold/15" />
          {/* §5.3 — Animated fill line that draws on scroll */}
          <motion.div
            className="absolute left-0 top-0 w-px bg-gradient-to-b from-gold to-gold/20 origin-top"
            style={{ height: lineHeight }}
          />

          {events.map((event, index) => (
            <TimelineEvent
              key={event.year}
              event={event}
              index={index}
              total={events.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}