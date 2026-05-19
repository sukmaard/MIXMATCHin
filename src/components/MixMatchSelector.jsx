import { motion } from 'framer-motion';
import { formatIDR } from '../utils/currency';

const MixMatchSelector = ({ categories, selectedItems, onItemSelect }) => {
  const categoryNames = Object.keys(categories || {});

  return (
    <div className="space-y-6">
      {categoryNames.map(category => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryNames.indexOf(category) * 0.05, duration: 0.6 }}
          className="border-b pb-4"
        >
          <h3 className="font-playfair text-lg mb-4">{category}</h3>
          
          <div className="overflow-x-auto space-x-3">
            <div className="flex space-x-3">
              {(Array.isArray(categories[category]) ? categories[category] : []).filter(Boolean).map((item, index) => (
                 <motion.div
                   key={item.id || index}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: index * 0.02, duration: 0.5 }}
                   className={`flex-shrink-0 w-24 h-32 cursor-pointer relative luxury-card group 
                              ${selectedItems[category] && selectedItems[category].id === item.id 
                                ? 'border-2 border-gold' : 'border-luxury-black/20'}`}
                   onClick={() => onItemSelect(category, item)}
                 >
                  <img 
                    src={item.image || ''} 
                    alt={item.name || 'Product'} 
                    className="w-full h-24 object-cover rounded-t-lg"
                  />
                  <div className="flex flex-col items-center px-2 py-2">
                    <p className="text-xs font-medium text-luxury-black line-clamp-1">{item.name || 'Untitled Product'}</p>
                    <p className="text-xs text-luxury-black/50">{formatIDR(item.price)}</p>
                  </div>
                  
                  {/* Marketplace indicator */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1 text-xs">
                    <div className="w-2 h-2 rounded-full bg-gold"></div>
                    <span className="text-gold">{item.marketplace || 'Store'}</span>
                  </div>
                 </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MixMatchSelector;
