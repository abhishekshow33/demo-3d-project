"use client";
import { motion } from 'framer-motion';

export default function AdmissionsExperience() {
  return (
    <section id="admissions" className="py-20 px-6 bg-navy relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="font-playfair text-4xl sm:text-5xl text-gold mb-4"
          >
            Admissions Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="text-ivory/80 mb-6"
          >
            Every journey through La&nbsp;Martiniere begins with a conversation. We invite you to discover our campus, meet our faculty and see how your child can thrive in a community of excellence.
          </motion.p>
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            className="space-y-4"
          >
            <li className="flex items-start">
              <span className="h-3 w-3 mt-2 mr-4 bg-gold rounded-full"></span>
              <span className="text-ivory/90">Schedule a personalised campus tour</span>
            </li>
            <li className="flex items-start">
              <span className="h-3 w-3 mt-2 mr-4 bg-gold rounded-full"></span>
              <span className="text-ivory/90">Meet with our admissions counselors</span>
            </li>
            <li className="flex items-start">
              <span className="h-3 w-3 mt-2 mr-4 bg-gold rounded-full"></span>
              <span className="text-ivory/90">Explore scholarships and financial aid</span>
            </li>
          </motion.ul>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="bg-navy/50 backdrop-blur-lg border border-gold/30 rounded-2xl p-8 text-center shadow-2xl"
        >
          <h3 className="font-playfair text-3xl text-gold mb-4">Begin Your Journey</h3>
          <p className="text-ivory/80 mb-8">
            We’re here to answer your questions and guide you through the admissions process.
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3 bg-gold text-navy font-semibold rounded-full hover:bg-cyan hover:text-navy transition-colors duration-300"
          >
            Contact Admissions
          </a>
        </motion.div>
      </div>
    </section>
  );
}