import type { Metadata } from 'next';
import ContentArticle from '../../components/ContentArticle';
import Footer from '../../components/Footer';
import PremiumNavbar from '../../components/PremiumNavbar';
import { getSchoolContent, getSection } from '../../content/site-content';

export const metadata: Metadata = { title: 'Heritage Archive · La Martiniere Kolkata', description: 'Founder, benefactor, traditions and institutional history of La Martiniere Kolkata.' };
export default function HeritagePage() { 
  const sections = getSchoolContent('shared').sections.filter((section) => section.slug !== 'admissions');
  return (
    <div className="bg-navy min-h-screen">
      <PremiumNavbar />
      <main className="pt-32 pb-16 space-y-24">
        {sections.map((section) => (
          <ContentArticle key={section.slug} section={section} schoolId="shared" />
        ))}
      </main>
      <Footer />
    </div>
  ); 
}
