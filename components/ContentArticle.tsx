"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ContentSection, SchoolId } from '../content/site-content';

export default function ContentArticle({ section, schoolId }: { section: ContentSection; schoolId: SchoolId }) {
  return (
    <motion.article 
      id={section.slug} 
      className="max-w-4xl mx-auto py-24 px-6 md:px-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4"
      >
        {section.eyebrow}
      </motion.p>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-ivory mb-8 leading-none"
      >
        {section.title}
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="font-playfair text-2xl md:text-3xl text-gold/90 leading-relaxed mb-12 border-l-2 border-gold/30 pl-6"
      >
        {section.summary}
      </motion.p>
      
      <div className="space-y-6 text-ivory/80 text-lg leading-relaxed mb-16 max-w-prose">
        {section.paragraphs.map((paragraph, idx) => (
          <motion.p 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
      
      {section.highlights && (
        <motion.ul 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16"
        >
          {section.highlights.map((item, idx) => (
            <motion.li 
              key={item}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="p-6 bg-navy/60 border border-gold/20 rounded-xl text-ivory/90 hover:border-gold/50 transition-colors"
            >
              <div className="flex items-start">
                <span className="h-2 w-2 mt-2.5 mr-4 bg-gold rounded-full flex-shrink-0"></span>
                <span>{item}</span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap gap-6 pt-12 border-t border-gold/20"
      >
        <a 
          href={section.sourceUrl} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center justify-center px-8 py-3 bg-gold text-navy font-bold rounded-full hover:bg-white transition-colors"
        >
          View official source
        </a>
        <Link 
          href={schoolId === 'shared' ? '/' : `/${schoolId}`}
          className="inline-flex items-center justify-center px-8 py-3 border border-gold/40 text-ivory font-bold rounded-full hover:border-gold hover:text-gold transition-colors"
        >
          Return to walkthrough
        </Link>
      </motion.div>
    </motion.article>
  );
}
