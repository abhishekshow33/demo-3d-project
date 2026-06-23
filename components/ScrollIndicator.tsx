"use client";

import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScrollIndicator() {
  const { scrollY } = useScroll();
  
  // Fade out as the user scrolls down (fully gone by 150px)
  const opacity = useTransform(scrollY, [0, 150], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-40 pointer-events-none"
    >
      <span className="text-ivory/60 text-[10px] tracking-[0.2em] uppercase font-bold">
        Scroll to Explore
      </span>
      <div className="w-[1px] h-[60px] bg-white/10 relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-[30px] bg-gradient-to-b from-transparent via-gold to-transparent"
          animate={{
            y: [-30, 60]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </motion.div>
  );
}
