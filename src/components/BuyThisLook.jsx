import { motion } from 'framer-motion';
import { SiShopee, SiTiktok } from 'react-icons/si';
import { FaReact } from 'react-icons/fa';
import { formatIDR } from '../utils/currency';

const BuyThisLook = ({ selectedItems, totalPrice }) => {
  // Collect all marketplace links from selected items
  const marketplaceLinks = Object.values(selectedItems)
    .filter(item => item !== null)
    .reduce((acc, item) => {
      const marketplace = item.marketplace || 'Your Store';
      if (!acc[marketplace]) {
        acc[marketplace] = [];
      }
      acc[marketplace].push({
        name: item.name || 'Untitled Product',
        price: Number(item.price) || 0,
        link: item.link || '#'
      });
      return acc;
    }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="luxury-card p-6 space-y-6"
    >
      <h3 className="font-playfair text-lg mb-4 text-center">
        Buy This Look
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-baseline mb-4">
          <span className="text-lg font-medium">Total Price:</span>
          <span className="ml-2 text-2xl font-bold text-luxury-black">
            {formatIDR(totalPrice)}
          </span>
        </div>
        
        {/* Marketplace Options */}
        <div className="space-y-3">
          <p className="font-medium mb-2">Available at:</p>
          <div className="space-y-2">
            {Object.entries(marketplaceLinks).map(([marketplace, items]) => (
              <motion.div
                key={marketplace}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ['Shopee', 'Tokopedia', 'TikTok Shop'].indexOf(marketplace) * 0.1, duration: 0.5 }}
                className="flex items-center space-x-3 p-3 bg-luxury-black/5 rounded-lg hover:bg-luxury-black/10 transition-colors duration-300"
              >
                <div className="flex-shrink-0">
                  {marketplace === 'Shopee' && <SiShopee size={20} className="text-gold" />}
                  {marketplace === 'Tokopedia' && <FaReact size={20} className="text-gold" />}
                  {marketplace === 'TikTok Shop' && <SiTiktok size={20} className="text-gold" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-luxury-black">{marketplace}</p>
                  <p className="text-sm text-luxury-black/50 mt-1">
                    {items.length} item{items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <a 
                    href="#" 
                    className="text-sm luxury-btn-outline px-3 py-1"
                  >
                    Shop
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button 
            className="flex-1 luxury-btn-outline py-3"
          >
            Save for Later
          </button>
          <button 
            className="flex-1 luxury-btn py-3"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BuyThisLook;
