"use client";
import { motion } from 'framer-motion';

export default function SmartSchoolSection() {
  return (
    <section id="future" className="py-20 px-6 bg-navy relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="font-playfair text-4xl sm:text-5xl text-gold mb-4"
          >
            Smart School of the Future
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="text-ivory/80 mb-6"
          >
            La&nbsp;Martiniere is pioneering the next generation of learning. Our classrooms are equipped with AI-powered platforms that adapt to each student, holographic learning environments that bring abstract concepts to life and smart campus dashboards that ensure safety and efficiency.
          </motion.p>
          <ul className="space-y-4">
            <motion.li
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
              className="flex items-start"
            >
              <span className="h-3 w-3 mt-2 mr-4 bg-gold rounded-full"></span>
              <span className="text-ivory/90">
                Adaptive AI-driven Learning Platforms
              </span>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
              className="flex items-start"
            >
              <span className="h-3 w-3 mt-2 mr-4 bg-gold rounded-full"></span>
              <span className="text-ivory/90">Holographic Classrooms &amp; Labs</span>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
              className="flex items-start"
            >
              <span className="h-3 w-3 mt-2 mr-4 bg-gold rounded-full"></span>
              <span className="text-ivory/90">
                Smart Campus Dashboards &amp; Analytics
              </span>
            </motion.li>
          </ul>
        </div>
        <div className="relative h-80 sm:h-96 lg:h-full w-full">
          {/* Placeholder futuristic illustration using gradients */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan/40 via-electric/30 to-navy shadow-2xl backdrop-blur-lg flex items-center justify-center"
          >
            <span className="font-playfair text-3xl sm:text-4xl text-gold drop-shadow-lg text-center px-6">
              Vision&nbsp;2036
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}