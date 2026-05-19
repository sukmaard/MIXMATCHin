import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [] }) => {
  const visibleProducts = products.filter(Boolean);

  if (visibleProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-luxury-black/50">No products found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visibleProducts.map((product, index) => (
        <motion.div
          key={product.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.6 }}
          className="relative"
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
