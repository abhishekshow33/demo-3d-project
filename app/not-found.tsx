import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/boys', label: 'Boys' },
  { href: '/girls', label: 'Girls' },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-navy text-ivory flex items-center justify-center px-6">
      <section className="w-full max-w-xl border border-gold/25 bg-ink/85 p-8 md:p-10">
        <p className="text-gold text-xs font-bold uppercase mb-3">Page not found</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight mb-4">This path is outside the campus walk.</h1>
        <p className="text-ivory/75 mb-8">
          Return to the main journey or choose one of the school experiences.
        </p>
        <nav className="flex flex-wrap gap-3" aria-label="Not found navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border border-gold/35 px-4 py-2 text-sm hover:border-gold hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
