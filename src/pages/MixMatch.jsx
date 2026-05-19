import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import MixMatchSelector from '../components/MixMatchSelector';
import OutfitPreview from '../components/OutfitPreview';
import SimilarOutfits from '../components/SimilarOutfits';
import BuyThisLook from '../components/BuyThisLook';
import { getHydratedProducts } from '../utils/productStorage';

const MixMatch = () => {
  const [selectedItems, setSelectedItems] = useState({
    tops: null,
    bottoms: null,
    shoes: null,
    accessories: null
  });

  const [outfitComplete, setOutfitComplete] = useState(false);
  const [rawProducts, setRawProducts] = useState([]);

  // Always reload hydrated products on mount or when storage changes
  useEffect(() => {
    const load = async () => {
      try {
        const products = await getHydratedProducts();
        setRawProducts(products.filter(Boolean));
      } catch (err) {
        console.error('Failed to load products:', err);
        setRawProducts([]);
      }
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  // Group products by category, memoized on rawProducts changes
  const categoriesByCategory = useMemo(() => {
    const grouped = {
      tops: [],
      bottoms: [],
      shoes: [],
      accessories: []
    };

    rawProducts.filter(Boolean).forEach(product => {
      const category = String(product.category || '').toLowerCase();
      if (grouped[category]) {
        grouped[category].push({
          id: product.id,
          name: product.name || 'Untitled Product',
          image: product.image || '',
          price: Number(product.price) || 0,
          marketplace: "Your Store",
          link: "#"
        });
      }
    });

    return grouped;
  }, [rawProducts]);

  // Check if outfit is complete
  const isOutfitComplete = Object.values(selectedItems).every(item => item !== null);

  // Handle item selection
  const handleItemSelect = (category, item) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: item
    }));
  };

  // Handle reset
  const handleReset = () => {
    setSelectedItems({
      tops: null,
      bottoms: null,
      shoes: null,
      accessories: null
    });
    setOutfitComplete(false);
  };

  // Calculate total price
  const totalPrice = Object.values(selectedItems)
    .filter(item => item !== null)
    .reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return (
    <section className="py-16 bg-luxury-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl font-playfair text-center mb-10 text-luxury-black"
        >
          Create Your Perfect Outfit
        </motion.h2>
        
        <div className="space-y-8">
          {/* Mix Match Selector */}
          <MixMatchSelector 
            categories={categoriesByCategory} 
            selectedItems={selectedItems} 
            onItemSelect={handleItemSelect} 
          />
          
          {/* Outfit Preview and Recommendations */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Outfit Preview */}
            <div className="flex-1">
              <OutfitPreview 
                selectedItems={selectedItems} 
                onReset={handleReset} 
              />
            </div>
            
            {/* Similar Outfits and Buy This Look */}
            <div className="flex-1 space-y-6">
              {isOutfitComplete && (
                <>
                  <SimilarOutfits 
                    selectedItems={selectedItems} 
                    allCategories={categoriesByCategory} 
                  />
                  <BuyThisLook 
                    selectedItems={selectedItems} 
                    totalPrice={totalPrice} 
                  />
                </>
              )}
              
              {!isOutfitComplete && (
                <div className="text-center py-12">
                  <p className="text-luxury-black/50 text-lg">
                    Select items from each category to see your complete outfit
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MixMatch;
