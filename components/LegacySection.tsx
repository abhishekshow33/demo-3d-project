import { motion } from 'framer-motion';

export default function LegacySection() {
  return (
    <section id="legacy" className="relative py-24 px-6 bg-gradient-to-b from-navy via-navy to-black overflow-hidden">
      {/* Sunset lighting overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/10 to-navy" />
      </div>
      <div className="relative max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="font-playfair text-5xl sm:text-6xl text-gold mb-6"
        >
          Legacy &amp; Beyond
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className="text-ivory/80 text-lg sm:text-xl max-w-3xl mx-auto mb-10"
        >
          From 1836 to today, La&nbsp;Martiniere has forged leaders, innovators and changemakers. Join us as we continue to shape the future for generations to come.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
        >
          <a
            href="#admissions"
            className="inline-block px-10 py-4 bg-gold text-navy font-bold rounded-full hover:bg-cyan hover:text-navy transition-colors duration-300"
          >
            Apply Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}