import { motion } from 'framer-motion';
import { formatIDR } from '../utils/currency';

const OutfitPreview = ({ selectedItems, onReset }) => {
  const isComplete = Object.values(selectedItems).every(item => item !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="luxury-card p-6 space-y-6"
    >
      <h3 className="font-playfair text-lg mb-4 text-center">
        Your Outfit Preview
      </h3>
      
      {!isComplete ? (
        <div className="text-center py-12">
          <p className="text-luxury-black/50">
            Select items from each category to see your complete outfit
          </p>
          <div className="flex flex-col space-y-3 mt-6">
            {[['Tops', 'Bottoms', 'Shoes', 'Accessories']].flat().map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-center space-x-3"
                >
                <div className="w-3 h-3 rounded-full bg-luxury-black/20"></div>
                <span className="text-luxury-black/50">{category}</span>
                    </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Outfit Display */}
          <div className="relative h-96 mb-6">
            {/* Silhouette/Mannequin placeholder */}
            <div className="absolute inset-0 bg-luxury-black/5 flex items-center justify-center">
              <div className="space-y-4 text-center">
                {/* Tops */}
                {selectedItems.tops && (
                  <motion.img
                    src={selectedItems.tops.image || ''}
                    alt={selectedItems.tops.name || 'Top'}
                    className="w-24 h-24 object-contain"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  />
                )}
                
                {/* Bottoms */}
                {selectedItems.bottoms && (
                  <motion.img
                    src={selectedItems.bottoms.image || ''}
                    alt={selectedItems.bottoms.name || 'Bottom'}
                    className="w-24 h-24 object-contain"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  />
                )}
                
                {/* Shoes */}
                {selectedItems.shoes && (
                  <motion.img
                    src={selectedItems.shoes.image || ''}
                    alt={selectedItems.shoes.name || 'Shoes'}
                    className="w-20 h-20 object-contain"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  />
                )}
                
                {/* Accessories */}
                {selectedItems.accessories && (
                  <motion.img
                    src={selectedItems.accessories.image || ''}
                    alt={selectedItems.accessories.name || 'Accessories'}
                    className="w-16 h-16 object-contain"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Outfit Details */}
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <p className="font-medium">Outfit Details:</p>
              <div className="flex flex-wrap gap-4 text-sm">
                {[['Tops', 'Bottoms', 'Shoes', 'Accessories']].flat().map(category => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ['Tops', 'Bottoms', 'Shoes', 'Accessories'].indexOf(category) * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="font-medium text-luxury-black/50">{category}:</span>
                    <span className="text-luxury-black">{selectedItems[category.toLowerCase().slice(0, -1)]?.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="flex items-baseline mb-4">
              <span className="text-lg font-medium">Total Price:</span>
              <span className="ml-2 text-2xl font-bold text-luxury-black">
                {formatIDR(Object.values(selectedItems)
                  .filter(item => item !== null)
                  .reduce((sum, item) => sum + (Number(item.price) || 0), 0)
                )}
              </span>
            </div>
          </div>
        </>
      )}
      
      <div className="mt-6">
        <button 
          onClick={onReset}
          className="w-full luxury-btn-outline py-2"
        >
          Start Over
        </button>
      </div>
    </motion.div>
  );
};

export default OutfitPreview;
