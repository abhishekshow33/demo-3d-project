"use client";
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import GateScene from '../three/GateScene';

/**
 * ImmersiveHero — animation_Rules.md §5.1 entrance + §1.3 immersion
 *
 * Entrance sequence:
 *   0.0s  h1 fades in with blur-clear + Y slide (§5.1)
 *   0.5s  p sub-copy fades in
 *   0.9s  CTA button pops in
 *   1.5s  scroll indicator pulses then fades as user scrolls
 */
export default function ImmersiveHero() {
  const [scrollY, setScrollY] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef });
  // Scroll indicator fades out as the user scrolls away
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY;
      setScrollY(y);
      if (y > 40) setHasScrolled(true);
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  // Shared easing — ease-out cubic for entrance (§5.1 "power2.inOut")
  const entranceEase = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex items-center justify-center h-screen w-full overflow-hidden"
    >
      {/* 3D background scene */}
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 60 }}
        className="absolute inset-0"
      >
        <Suspense fallback={null}>
          <GateScene scroll={scrollY} />
        </Suspense>
      </Canvas>

      {/* §1.3 — multi-layer cinematic gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg,
              rgba(5,11,16,0.92) 0%,
              rgba(5,11,16,0.55) 38%,
              rgba(5,11,16,0.18) 62%,
              rgba(5,11,16,0.72) 100%
            ),
            radial-gradient(ellipse at 50% 35%, transparent 30%, rgba(5,11,16,0.42) 100%)
          `,
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-16">

        {/* §5.1 — Institution label: fades before h1 */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.25em' }}
          transition={{ duration: 1.0, ease: entranceEase }}
          className="text-gold/70 text-xs font-bold tracking-[0.3em] uppercase mb-4"
        >
          La&nbsp;Martinière · Kolkata · Est. 1836
        </motion.p>

        {/* §5.1 — h1: blur-clear + Y slide + opacity */}
        <motion.h1
          initial={{ opacity: 0, y: 36, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: entranceEase }}
          className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-gold mb-6 drop-shadow-lg"
        >
          Walking Through
          <br />
          <span className="text-ivory">Excellence</span>
        </motion.h1>

        {/* §5.1 — Sub-copy: 0.5s delay */}
        <motion.p
          initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease: entranceEase, delay: 0.5 }}
          className="text-lg sm:text-xl text-ivory/80 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Experience La&nbsp;Martinière Kolkata like never before. Step through
          the gate into a world where 190&nbsp;years of heritage meets a future
          driven by innovation.
        </motion.p>

        {/* §5.1 — CTA button: 0.9s delay, spring pop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: entranceEase, delay: 0.9 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Link
            href="/boys"
            className="inline-block px-6 py-3 border border-gold/60 text-gold text-xs font-bold tracking-widest uppercase backdrop-blur-sm bg-navy/30 hover:bg-gold hover:text-navy transition-all duration-300 hover:shadow-[0_0_24px_rgba(214,180,95,0.4)]"
          >
            Boys School →
          </Link>
          <Link
            href="/girls"
            className="inline-block px-6 py-3 border border-ivory/30 text-ivory/80 text-xs font-bold tracking-widest uppercase backdrop-blur-sm bg-navy/20 hover:bg-ivory/10 hover:text-ivory transition-all duration-300"
          >
            Girls School →
          </Link>
        </motion.div>
      </div>

      {/* §5.1 — Scroll indicator: appears at 1.5s, fades on scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 1.5 }}
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-ivory/40 text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        {/* Animated chevron */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}