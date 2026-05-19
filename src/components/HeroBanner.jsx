import { motion } from 'framer-motion';
import heroImage from '../assets/hero-bg.png';

const HeroBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ backgroundImage: `url(${heroImage})` }}
      className="relative h-[550px] bg-center bg-cover flex items-center justify-center text-center overflow-hidden"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-luxury-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 space-y-6 px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-playfair text-luxury-white mb-4"
        >
          Mix & Match Your Style
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl max-w-2xl mx-auto text-luxury-white/90"
        >
          Discover premium fashion pieces and create your perfect outfit
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:space-x-4 justify-center"
        >
          <a href="/catalog" className="luxury-btn w-full sm:w-auto px-8">
            Shop Collection
          </a>
          <a href="/mix-match" className="luxury-btn-outline w-full sm:w-auto px-8">
            Mix & Match
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroBanner;