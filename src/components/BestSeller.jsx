import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getHydratedProducts } from '../utils/productStorage';
import { formatIDR } from '../utils/currency';

const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const loadBestSellers = async () => {
      const products = (await getHydratedProducts())
        .filter(Boolean)
        .sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0))
        .slice(0, 4);
      setBestSellers(products);
    };
    loadBestSellers();
    window.addEventListener('storage', loadBestSellers);
    window.addEventListener('products-changed', loadBestSellers);
    return () => {
      window.removeEventListener('storage', loadBestSellers);
      window.removeEventListener('products-changed', loadBestSellers);
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
          Best Sellers
        </motion.h2>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.length > 0 ? (
            bestSellers.map((product, index) => (
              <motion.div
                key={product.id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.6 }}
                className="luxury-card group"
              >
                <div className="relative">
                  <img 
                    src={product.image || ''} 
                    alt={product.name || 'Product'} 
                    className="w-full h-48 object-cover"
                  />
                  {product.badge && (
                    <span className={`luxury-badge luxury-badge-${String(product.badge).toLowerCase().replace(/\s+/g, '')} absolute top-2 left-2`}>
                      {product.badge}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/10 transition-colors duration-300"></div>
                </div>
                <div className="p-4">
                  <h3 className="font-playfair text-lg mb-2">{product.name || 'Untitled Product'}</h3>
                  <p className="text-luxury-black/60 mb-2">{product.category || 'Uncategorized'}</p>
                  <p className="font-bold text-luxury-black">{formatIDR(product.price)}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-4 text-center py-12">
              <p className="text-luxury-black/50">No best sellers yet. Add products in the Upload section.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
