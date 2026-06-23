import type { Metadata } from 'next';
import ContentArticle from '../../components/ContentArticle';
import Footer from '../../components/Footer';
import PremiumNavbar from '../../components/PremiumNavbar';
import AdmissionsExperience from '../../components/AdmissionsExperience';
import SmartSchoolSection from '../../components/SmartSchoolSection';
import { getSection } from '../../content/site-content';

export const metadata: Metadata = { title: 'Admissions 2027–2028 · La Martiniere Kolkata', description: 'Lower Nursery criteria and other-class admissions guidance.' };
export default function AdmissionsPage() { 
  const section = getSection('shared', 'admissions')!; 
  return (
    <div className="bg-navy min-h-screen">
      <PremiumNavbar />
      <main className="pt-32 pb-16">
        <SmartSchoolSection />
        <AdmissionsExperience />
        <ContentArticle section={section} schoolId="shared" />
      </main>
      <Footer />
    </div>
  ); 
}
