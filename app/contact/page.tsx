"use client";
import type { Metadata } from 'next';
import Footer from '../../components/Footer';
import PremiumNavbar from '../../components/PremiumNavbar';
import { SITE_CONTENT } from '../../content/site-content';
import { motion } from 'framer-motion';

export default function ContactPage() { 
  return (
    <div className="bg-navy min-h-screen">
      <PremiumNavbar />
      <main className="pt-32 pb-24">
        <motion.article 
          className="max-w-4xl mx-auto px-6 md:px-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4">Contact directory</p>
          <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-ivory mb-16 leading-none">Three doors. One legacy.</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(SITE_CONTENT.schools).map(([id, school], idx) => (
              <motion.section 
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (idx * 0.1), duration: 0.6 }}
                className="p-8 bg-navy/60 border border-gold/20 rounded-2xl hover:border-gold/50 transition-colors"
              >
                <h2 className="font-playfair text-2xl text-gold mb-6">{school.name}</h2>
                <div className="space-y-6 text-ivory/80 text-sm">
                  <p className="leading-relaxed">{school.contact.address}</p>
                  
                  <div className="space-y-2">
                    <p className="text-gold/60 text-xs font-bold uppercase tracking-wider">Phone</p>
                    {school.contact.phones.map((phone) => (
                      <p key={phone}>
                        <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hover:text-gold transition-colors">{phone}</a>
                      </p>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gold/60 text-xs font-bold uppercase tracking-wider">Email</p>
                    {school.contact.emails.map((email) => (
                      <p key={email}>
                        <a href={`mailto:${email}`} className="hover:text-gold transition-colors break-all">{email}</a>
                      </p>
                    ))}
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
        </motion.article>
      </main>
      <Footer />
    </div>
  ); 
}
