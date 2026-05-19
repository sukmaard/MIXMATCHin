import { motion } from 'framer-motion';
import HeroBanner from '../components/HeroBanner';
import PromoSection from '../components/PromoSection';
import FeaturedCollection from '../components/FeaturedCollection';
import BestSeller from '../components/BestSeller';
import CategoryShowcase from '../components/CategoryShowcase';
import InstagramGrid from '../components/InstagramGrid';

const HomePage = () => {
  return (
    <>
      <HeroBanner />
      <PromoSection />
      <FeaturedCollection />
      <BestSeller />
      <CategoryShowcase />
      <InstagramGrid />
    </>
  );
};

export default HomePage;