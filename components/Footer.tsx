import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 p-12 md:p-24 border-t border-gold/20 bg-navy text-ivory/60 text-sm">
      <div className="space-y-4">
        <p className="font-playfair text-2xl text-gold">La Martiniere Kolkata</p>
        <p>11, Dr. U. N. Brahmachari Street, Kolkata 700017</p>
      </div>
      <div className="flex flex-wrap gap-4 md:gap-8 align-start">
        <Link href="/" className="hover:text-gold transition-colors duration-300">Home</Link>
        <Link href="/boys" className="hover:text-gold transition-colors duration-300">Boys</Link>
        <Link href="/girls" className="hover:text-gold transition-colors duration-300">Girls</Link>
      </div>
      <div className="space-y-4 md:text-right">
        <a href="https://lamartiniere.co/" target="_blank" rel="noreferrer" className="inline-block hover:text-gold transition-colors duration-300 border-b border-gold/30 pb-1">
          Official website
        </a>
        <p className="text-xs text-muted">Virtual recreation &middot; Reference-led where plans are unavailable</p>
      </div>
    </footer>
  );
}
