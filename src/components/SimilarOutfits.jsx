import { motion } from 'framer-motion';
import { formatIDR } from '../utils/currency';

const SimilarOutfits = ({ selectedItems, allCategories }) => {
  // Generate similar outfit recommendations based on selected items
  // In a real app, this would come from an API or recommendation engine
  const generateSimilarOutfits = () => {
    const similarOutfits = [];
    
    // Create 3 similar outfit variations
    for (let i = 0; i < 3; i++) {
      const outfit = {};
      Object.keys(allCategories).forEach(category => {
        const items = Array.isArray(allCategories[category]) ? allCategories[category].filter(Boolean) : [];
        // Select a random item that's different from the currently selected one
        const availableItems = items.filter(item => 
          !selectedItems[category] || item.id !== selectedItems[category].id
        );
        
        if (availableItems.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableItems.length);
          outfit[category] = availableItems[randomIndex];
        } else {
          // Fallback to selected item if no alternatives
          outfit[category] = selectedItems[category] || items[0];
        }
      });
      
      similarOutfits.push(outfit);
    }
    
    return similarOutfits;
  };

  const similarOutfits = generateSimilarOutfits();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="luxury-card p-6 space-y-6"
    >
      <h3 className="font-playfair text-lg mb-4 text-center">
        Similar Outfit Ideas
      </h3>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {similarOutfits.map((outfit, index) => (
         <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05, duration: 0.6 }}
          className="relative overflow-hidden luxury-card group cursor-pointer"
        >
            <div className="relative h-48">
              {/* Simple outfit representation - in a real app this would be a model or collage */}
              <div className="absolute inset-0 bg-luxury-black/5 flex items-center justify-center">
                <div className="space-y-2 text-center text-luxury-white">
                  <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center">
                    {outfit.tops ? (
                      <span className="text-xs font-medium">Top</span>
                    ) : (
                      <span className="text-xs font-medium">?</span>
                    )}
                  </div>
                  <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mt-2">
                    {outfit.bottoms ? (
                      <span className="text-xs font-medium">Bottom</span>
                    ) : (
                      <span className="text-xs font-medium">?</span>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mt-2">
                    {outfit.shoes ? (
                      <span className="text-xs font-medium">Shoe</span>
                    ) : (
                      <span className="text-xs font-medium">?</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/10 transition-colors duration-300"></div>
            </div>
            
            <div className="mt-3">
              <p className="text-sm text-luxury-black/50 center">
                Mix & Match Variation #{index + 1}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs font-medium">
                  {formatIDR([
                    Number(outfit.tops?.price) || 0,
                    Number(outfit.bottoms?.price) || 0,
                    Number(outfit.shoes?.price) || 0,
                    Number(outfit.accessories?.price) || 0
                  ].filter(Boolean).reduce((sum, price) => sum + price, 0))}
                </span>
                <button 
                  className="text-sm luxury-btn-outline px-3 py-1"
                >
                  View Details
                </button>
              </div>
            </div>
            </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SimilarOutfits;
