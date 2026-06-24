"use client";

import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll, useMotionValue } from 'framer-motion';

function MagneticLink({ children, href, hoveredLink, setHoveredLink }: { children: string, href: string, hoveredLink: string | null, setHoveredLink: (href: string | null) => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.25);
    y.set(middleY * 0.25);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    setHoveredLink(null);
  };

  return (
    <Link href={href} passHref legacyBehavior>
      <motion.a
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        onMouseEnter={() => setHoveredLink(href)}
        style={{ x, y }}
        className="relative text-ivory/75 text-xs font-bold tracking-[0.12em] uppercase py-2 px-3 hover:text-gold transition-colors z-10"
        whileHover={{ scale: 1.05, textShadow: "0px 0px 12px rgba(214,180,95,0.8)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {children}
        <AnimatePresence>
          {hoveredLink === href && (
            <motion.span
              layoutId="nav-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </motion.a>
    </Link>
  );
}

/**
 * PremiumNavbar — animation_Rules.md §1.3 (immersion/presence)
 *
 * Scroll-aware transparency:
 *   • <50px scrolled: bg-navy/70 (open, airy)
 *   • >50px scrolled: bg-navy/95 + gold shimmer top border (§1.3 anchors space)
 *
 * Link hover: animated underline slides between active links (layoutId pattern)
 * Logo entrance: already has y:-100 slide — enhanced letter-spacing spring
 */

const links = [
  { label: 'Home', href: '/' },
  { label: 'Boys', href: '/boys' },
  { label: 'Girls', href: '/girls' },
];

export default function PremiumNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { scrollY } = useScroll();

  // §1.3 — scroll-aware: switch to opaque past 50px
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 50);
  });

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      // §1.3 — transition between transparent and opaque based on scroll
      style={{
        backgroundColor: scrolled ? 'rgba(5,11,16,0.97)' : 'rgba(5,11,16,0.70)',
        borderBottomColor: scrolled ? 'rgba(214,180,95,0.35)' : 'rgba(214,180,95,0.15)',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(214,180,95,0.12)' : 'none',
        transition: 'background-color 0.35s ease, border-bottom-color 0.35s ease, box-shadow 0.35s ease',
      }}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-4 border-b backdrop-blur-md"
    >
      {/* Logo — enhanced spring entrance */}
      <Link
        className="font-display text-gold text-xl md:text-2xl font-semibold tracking-wide flex flex-col uppercase hover:text-ivory transition-colors group relative overflow-hidden py-1"
        href="/"
      >
        <motion.span
          initial={{ letterSpacing: '0.4em', opacity: 0 }}
          animate={{ letterSpacing: '0.05em', opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative block overflow-hidden"
        >
          La Martiniere
          <motion.div
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-20deg]"
            initial={{ left: '-100%' }}
            whileHover={{ left: '100%' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ mixBlendMode: 'overlay' }}
          />
        </motion.span>
        <span className="font-sans text-ivory/50 text-[10px] tracking-[0.35em] uppercase group-hover:text-ivory/70 transition-colors">
          Kolkata
        </span>
      </Link>

      {/* Mobile toggle */}
      <button
        type="button"
        className="md:hidden text-ivory p-2 border border-gold/40 rounded-sm hover:border-gold/70 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="primary-navigation"
      >
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="block text-sm font-bold">
          {open ? '✕' : '☰'}
        </motion.span>
      </button>

      {/* Desktop nav */}
      <nav
        id="primary-navigation"
        className="hidden md:flex flex-row gap-8 items-center"
        aria-label="Primary navigation"
      >
        {links.map((link) => (
          <MagneticLink key={link.href} href={link.href} hoveredLink={hoveredLink} setHoveredLink={setHoveredLink}>
            {link.label}
          </MagneticLink>
        ))}
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="primary-navigation-mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 w-full bg-navy/80 backdrop-blur-xl border-b border-gold/20 flex flex-col p-4 md:hidden shadow-2xl"
            aria-label="Primary navigation"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={link.href} passHref legacyBehavior>
                  <motion.a
                    className="text-ivory/80 text-xs font-bold tracking-[0.1em] uppercase py-3 border-b border-gold/10 block hover:text-gold transition-colors"
                    onClick={() => setOpen(false)}
                    whileHover={{ x: 10, textShadow: "0px 0px 8px rgba(214,180,95,0.6)", color: "#d6b45f" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {link.label}
                  </motion.a>
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="absolute top-full left-0 w-full bg-navy/95 text-ivory/70 text-[10px] md:text-xs tracking-widest text-center py-1.5 border-b border-gold/20 font-sans shadow-md z-[-1]">
        This website is built for demo purposes for La Martiniere. Developed by EduConnect4U.com
      </div>
    </motion.header>
  );
}
