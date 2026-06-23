"use client";

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { useRef } from 'react';
import { getSchoolContent, SITE_CONTENT, type SchoolId } from '../content/site-content';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)', scale: 0.95 },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

function TiltCard({ children, variants, className }: any) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const mouseXPos = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const mouseYPos = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
  const gradient = useMotionTemplate`radial-gradient(circle at ${mouseXPos}% ${mouseYPos}%, rgba(214,180,95,0.15) 0%, transparent 60%)`;

  return (
    <motion.article 
      ref={ref}
      variants={variants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      whileHover={{ scale: 1.02, zIndex: 10, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 20px rgba(214,180,95,0.2)" }}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 mix-blend-screen"
        style={{ background: gradient }}
      />
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="flex flex-col h-full w-full">
        {children}
      </div>
    </motion.article>
  );
}

export default function ContentLibrary({ schoolId, title = 'Explore the complete story' }: { schoolId: SchoolId; title?: string }) {
  const school = getSchoolContent(schoolId);
  const base = schoolId === 'shared' ? '' : `/${schoolId}`;
  
  return (
    <section className="relative z-10 py-24 md:py-36 px-6 md:px-24 bg-gradient-to-b from-navy to-ink" aria-labelledby={`${schoolId}-library-title`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto mb-16 text-center"
      >
        <p className="text-gold font-bold tracking-[0.2em] uppercase text-[10px] mb-4">Official content snapshot · {SITE_CONTENT.capturedAt}</p>
        <h2 id={`${schoolId}-library-title`} className="font-display text-4xl md:text-6xl lg:text-7xl mb-6">{title}</h2>
        <p className="text-muted text-lg max-w-2xl mx-auto">{school.description}</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {school.sections.map((section) => {
          const href = schoolId === 'shared'
            ? section.slug === 'admissions' ? '/admissions' : section.slug === 'about' || section.slug === 'founder' || section.slug === 'benefactor' || section.slug === 'traditions' ? `/heritage#${section.slug}` : `/heritage#${section.slug}`
            : `${base}/${section.slug}`;
          return (
            <TiltCard variants={itemVariants} className="min-h-[22rem] p-8 border border-gold/20 bg-gradient-to-br from-ink/80 to-navy/90 backdrop-blur-sm group hover:border-gold/50 transition-colors" key={section.slug}>
              <p className="text-gold text-[10px] font-bold tracking-[0.16em] uppercase m-0">{section.eyebrow}</p>
              <h3 className="font-display text-3xl my-4 group-hover:text-gold transition-colors">{section.title}</h3>
              <span className="text-muted leading-relaxed">{section.summary}</span>
              <Link href={href} className="mt-auto pt-6 text-ivory font-bold uppercase text-xs tracking-widest inline-flex items-center gap-2 group-hover:text-gold transition-colors">
                Read complete section 
                <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </TiltCard>
          );
        })}
      </motion.div>
    </section>
  );
}
