import type { Metadata } from 'next';
import BuildingExperience from '../../components/BuildingExperience';
import ContentLibrary from '../../components/ContentLibrary';
import Footer from '../../components/Footer';
import PremiumNavbar from '../../components/PremiumNavbar';

export const metadata: Metadata = { title: 'La Martiniere for Boys · Immersive Campus', description: 'Walk through the heritage, achievements, courts and aquatic programme of La Martiniere for Boys.' };
export default function BoysPage() { return <><a className="skip-link" href="#arrival">Skip to the Boys campus</a><PremiumNavbar /><main><BuildingExperience schoolId="boys" /><ContentLibrary schoolId="boys" /></main><Footer /></>; }
