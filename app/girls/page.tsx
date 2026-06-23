import type { Metadata } from 'next';
import BuildingExperience from '../../components/BuildingExperience';
import ContentLibrary from '../../components/ContentLibrary';
import Footer from '../../components/Footer';
import PremiumNavbar from '../../components/PremiumNavbar';

export const metadata: Metadata = { title: 'La Martiniere for Girls · Immersive Campus', description: 'Walk through the mission, learning galleries, courts and aquatic programme of La Martiniere for Girls.' };
export default function GirlsPage() { return <><a className="skip-link" href="#arrival">Skip to the Girls campus</a><PremiumNavbar /><main><BuildingExperience schoolId="girls" /><ContentLibrary schoolId="girls" /></main><Footer /></>; }
