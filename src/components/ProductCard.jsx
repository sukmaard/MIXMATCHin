import { motion } from 'framer-motion';
import { AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai';
import { formatIDR } from '../utils/currency';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  if (!product) return null;

  const {
    badge,
    category = 'Uncategorized',
    image = '',
    name = 'Untitled Product',
    purchaseLink = '',
    price = 0,
    id
  } = product;
  const numericPrice = Number(price) || 0;
  const badgeText = String(badge || '');
  const badgeClass = badgeText ? badgeText.toLowerCase().replace(/\s+/g, '') : '';
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="luxury-card group cursor-pointer hover:shadow-lg"
    >
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex space-x-2">
          {badgeText && (
            <span className={`luxury-badge luxury-badge-${badgeClass}`}>
              {badgeText}
            </span>
          )}
        </div>
        
        {/* Favorite and Share Icons */}
        <div className="absolute top-2 right-2 flex space-x-2 text-luxury-white/80 hover:text-luxury-white">
          <AiOutlineHeart size={20} />
          <AiOutlineShareAlt size={20} />
        </div>
        
        {/* Overlay for hover effect */}
        <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/10 transition-colors duration-300"></div>
      </div>
      
      <div className="p-4">
        <h3 className="font-playfair text-lg mb-2 line-clamp-2">
          {name}
        </h3>
        <p className="text-luxury-black/60 mb-2">{category}</p>
        <div className="flex items-baseline mb-2">
          <span className="font-bold text-xl text-luxury-black">
            {formatIDR(numericPrice)}
          </span>
          {badgeText === 'SALE' && (
            <span className="ml-2 text-luxury-black/50 line-through">
              {formatIDR(numericPrice * 1.2)}
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          {purchaseLink ? (
            <>
              <a
                href={purchaseLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 luxury-btn-outline text-sm"
              >
                Buy Now
              </a>
              <button
                onClick={handleAddToCart}
                className="flex-1 luxury-btn text-sm"
              >
                Add to Cart
              </button>
            </>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex-1 luxury-btn text-sm w-full"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
