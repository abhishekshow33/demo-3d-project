import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import LenisProvider from '../components/LenisProvider';
import PremiumCursor from '../components/PremiumCursor';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'La Martiniere Kolkata · Walking Through Excellence',
  description: 'An immersive 3D cinematic journey through 189 years of La Martiniere Schools, Kolkata — founded 1836 by Major General Claude Martin. Explore the heritage hall, boys campus, girls campus, achievement galleries, and sports facilities.',
  metadataBase: new URL('https://lamartiniere.co'),
  keywords: ['La Martiniere', 'Kolkata', 'ICSE', 'ISC', 'school', 'heritage', 'Claude Martin', 'education', '3D experience'],
  openGraph: {
    title: 'La Martiniere Kolkata · Walking Through Excellence',
    description: 'An immersive 3D cinematic journey through 189 years of La Martiniere Schools, Kolkata.',
    type: 'website',
    images: [{ url: '/images/heritage-hall-cinematic.jpg', width: 2560, height: 1429, alt: 'Cinematic virtual recreation of the La Martiniere Heritage Hall' }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans bg-navy text-ivory antialiased cursor-none">
        <PremiumCursor />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
