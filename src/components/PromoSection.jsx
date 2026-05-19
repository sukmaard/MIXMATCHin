import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getHydratedPromotions } from '../utils/promotionStorage';

const PromoSection = () => {
  const defaultPromotions = [
    {
      id: 1,
      title: "Spring Collection",
      discount: "Up to 40% OFF",
      image: "/assets/hero-bg.png",
      buttonText: "Shop Now",
      link: "/catalog"
    },
    {
      id: 2,
      title: "Summer Essentials",
      discount: "Buy 2 Get 1 Free",
      image: "/assets/hero-bg.png",
      buttonText: "View Collection",
      link: "/catalog"
    },
    {
      id: 3,
      title: "Accessories Sale",
      discount: "Mulai dari Rp100.000",
      image: "/assets/hero-bg.png",
      buttonText: "Shop Accessories",
      link: "/catalog"
    }
  ];
  const [promotions, setPromotions] = useState(defaultPromotions);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const uploadedPromotions = await getHydratedPromotions();
        setPromotions(uploadedPromotions.length > 0 ? uploadedPromotions : defaultPromotions);
      } catch (error) {
        setPromotions(defaultPromotions);
      }
    };

    loadPromotions();
    window.addEventListener('storage', loadPromotions);
    window.addEventListener('promotions-changed', loadPromotions);
    return () => {
      window.removeEventListener('storage', loadPromotions);
      window.removeEventListener('promotions-changed', loadPromotions);
    };
  }, []);

  return (
    <section className="py-12 bg-luxury-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl font-playfair text-center mb-10 text-luxury-black"
        >
          Current Promotions
        </motion.h2>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.filter(Boolean).map((promo, index) => (
            <motion.div
              key={promo.id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative overflow-hidden luxury-card"
            >
              <img 
                src={promo.image || '/assets/hero-bg.png'} 
                alt={promo.title || 'Promotion'} 
                className="w-full h-48 object-cover transition-transform duration-500"
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
              <div className="absolute bottom-4 left-4 right-4 text-luxury-white">
                <h3 className="text-xl font-playfair mb-2">{promo.title || 'Current Promotion'}</h3>
                <p className="text-lg font-bold mb-4">{promo.discount}</p>
                <a href={promo.link || '#'} className="luxury-btn-outline w-full">{promo.buttonText || 'Shop Now'}</a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
