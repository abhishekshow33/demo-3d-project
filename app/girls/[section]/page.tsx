import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContentArticle from '../../../components/ContentArticle';
import Footer from '../../../components/Footer';
import PremiumNavbar from '../../../components/PremiumNavbar';
import { getSchoolContent, getSection } from '../../../content/site-content';

type Props = { params: Promise<{ section: string }> };

export function generateStaticParams() { return getSchoolContent('girls').sections.map((section) => ({ section: section.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> { const { section: slug } = await params; const section = getSection('girls', slug); return section ? { title: `${section.title} · La Martiniere for Girls`, description: section.summary } : {}; }
export default async function GirlsSection({ params }: Props) { 
  const resolved = await params;
  const section = getSection('girls', resolved.section);
  if (!section) notFound();
  return (
    <div className="bg-navy min-h-screen">
      <PremiumNavbar />
      <main className="pt-32 pb-16">
        <ContentArticle section={section} schoolId="girls" />
      </main>
      <Footer />
    </div>
  ); 
}
