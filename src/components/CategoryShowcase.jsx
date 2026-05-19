import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getHydratedProducts } from '../utils/productStorage';

const CategoryShowcase = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const products = (await getHydratedProducts()).filter(Boolean);
      const groupedProducts = products.reduce((groups, product) => {
        const category = product.category || 'Uncategorized';
        if (!groups[category]) groups[category] = [];
        groups[category].push(product);
        return groups;
      }, {});

      const categoryData = Object.entries(groupedProducts).map(([category, categoryProducts], index) => ({
        id: index + 1,
        name: category,
        image: categoryProducts.find(product => product.image)?.image || '',
        items: `${categoryProducts.length} Items`
      }));
      setCategories(categoryData);
    };
    loadCategories();
    window.addEventListener('storage', loadCategories);
    window.addEventListener('products-changed', loadCategories);
    return () => {
      window.removeEventListener('storage', loadCategories);
      window.removeEventListener('products-changed', loadCategories);
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
          Shop by Category
        </motion.h2>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(category => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: category.id * 0.05, duration: 0.6 }}
              className="relative overflow-hidden luxury-card group"
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-52 bg-luxury-black/5" />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-luxury-black/40 text-luxury-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-xl font-playfair mb-2">{category.name}</h3>
                <p className="text-luxury-white/80">{category.items}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
