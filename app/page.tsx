import BuildingExperience from '../components/BuildingExperience';
import ContentLibrary from '../components/ContentLibrary';
import Footer from '../components/Footer';
import PremiumNavbar from '../components/PremiumNavbar';

export default function Home() {
  return <><a className="skip-link" href="#arrival">Skip to the Heritage Hall</a><PremiumNavbar /><main><BuildingExperience schoolId="shared" /><ContentLibrary schoolId="shared" /></main><Footer /></>;
}
