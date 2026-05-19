import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaShareAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { getHydratedProducts, getHydratedProductById } from '../utils/productStorage';
import ProductCard from '../components/ProductCard';
import { formatIDR } from '../utils/currency';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

   useEffect(() => {
     const load = async () => {
         try {
             const foundProduct = await getHydratedProductById(id);
             if (foundProduct) {
                 setProduct(foundProduct);
                 // Safely get first color and size, with fallbacks
                 const colors = Array.isArray(foundProduct.colors) ? foundProduct.colors : [];
                 const sizes = Array.isArray(foundProduct.sizes) ? foundProduct.sizes : [];
                 setSelectedColor(colors.length > 0 ? colors[0] : '');
                 setSelectedSize(sizes.length > 0 ? sizes[0] : '');
                 setActiveImage(foundProduct.image || '');

                 // Get recommended products from same category (exclude current)
                 try {
                     const allProducts = await getHydratedProducts();
                     const recommended = allProducts
                       .filter(p => p && p.category === foundProduct.category && String(p.id) !== String(foundProduct.id))
                       .slice(0, 4);
                     setRecommendedProducts(recommended);
                 } catch (err) {
                     console.error('Failed to load recommended products:', err);
                     setRecommendedProducts([]);
                 }
             } else {
                 setProduct(null);
                 setRecommendedProducts([]);
             }
         } catch (err) {
             console.error('Failed to load product:', err);
             setProduct(null);
         }
     };
     load();
   }, [id]);

  if (!product) {
    return (
      <section className="py-12 bg-luxury-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-playfair mb-4">Product Not Found</h1>
          <a href="/catalog" className="luxury-btn">Back to Catalog</a>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-luxury-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-64 w-full rounded-lg overflow-hidden luxury-card"
              >
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              {product.badge && (
                  <span className={`luxury-badge luxury-badge-${String(product.badge).toLowerCase().replace(/\s+/g, '')} absolute top-2 left-2`}>
                    {product.badge}
                  </span>
                  )}
                </motion.div>

                {/* Thumbnails */}
              <div className="flex flex-wrap gap-2">
                 {(Array.isArray(product.images) ? product.images : []).map((img, index) => (
                   <motion.div
                     key={index}
                     initial={{ opacity: 0.5, scale: 0.9 }}
                     animate={{
                       opacity: activeImage === img ? 1 : 0.5,
                       scale: activeImage === img ? 1 : 0.9
                     }}
                     transition={{ duration: 0.3 }}
                     className="w-16 h-16 cursor-pointer rounded border border-luxury-black/20 hover:border-luxury-black/40 transition-all duration-300"
                     onClick={() => setActiveImage(img)}
                     style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                   />
                 ))}
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="lg:col-span-3 flex flex-col">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl font-playfair mb-4 text-luxury-black"
            >
              {product.name}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-luxury-black/60 mb-4"
            >
              {product.description}
            </motion.p>
            
            <div className="space-y-6">
              {/* Price and Badges */}
              <div className="flex flex-wrap items-center space-x-4 mb-4">
                <span className="text-2xl font-bold text-luxury-black">
                  {formatIDR(product.price)}
                </span>
                {String(product.badge) === 'SALE' && (
                  <span className="ml-2 text-luxury-black/50 line-through">
                    {formatIDR((Number(product.price) || 0) * 1.5)}
                  </span>
                )}
                {product.badge && (
                  <span className={`luxury-badge luxury-badge-${String(product.badge).toLowerCase().replace(/\s+/g, '')}`}>
                    {product.badge}
                  </span>
                )}
              </div>
              
              {/* Color Selector */}
              <div>
                <p className="font-medium mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(product.colors) ? product.colors : []).map(color => (
                    <motion.button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full border border-luxury-black/20 
                                 ${selectedColor === color ? 'border-luxury-black' : ''}
                                 ${selectedColor === color && 'bg-luxury-black/10'}
                                 hover:border-luxury-black/40 transition-all duration-300`}
                    >
                      <span className={`w-3 h-3 bg-${String(color).toLowerCase()}`} />
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Size Selector */}
              <div>
                <p className="font-medium mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(product.sizes) ? product.sizes : []).map(size => (
                    <motion.button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 border border-luxury-black/20 rounded 
                                 ${selectedSize === size ? 'bg-luxury-black text-luxury-white' : ''}
                                 ${selectedSize === size && 'hover:bg-luxury-black/20'}
                                 hover:border-luxury-black/40 transition-all duration-300`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              {product.purchaseLink ? (
                <motion.a
                  href={product.purchaseLink}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="block w-full luxury-btn py-3 text-center"
                >
                  Buy Product
                </motion.a>
              ) : (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="w-full luxury-btn py-3 opacity-50 cursor-not-allowed"
                  disabled
                >
                  Purchase Link Not Available
                </motion.button>
              )}
              
              <div className="flex space-x-3">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex-1 luxury-btn-outline py-3"
                >
                  <FaHeart className={isFavorite ? 'text-red-500' : 'text-luxury-black'} />
                  <span className="ml-2">Save to Wishlist</span>
                </motion.button>
                
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex-1 luxury-btn-outline py-3"
                >
                  <FaShareAlt className="mr-2" />
                  Share
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Recommendations */}
          <div className="lg:col-span-4">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-2xl font-playfair mb-4 text-luxury-black"
            >
              You May Also Like
            </motion.h2>

            {recommendedProducts.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recommendedProducts.map((prod, index) => (
                  <motion.div
                    key={prod.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (index + 1) * 0.05, duration: 0.6 }}
                    className="luxury-card group"
                  >
                    <ProductCard product={prod} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-luxury-black/60">No similar products found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
