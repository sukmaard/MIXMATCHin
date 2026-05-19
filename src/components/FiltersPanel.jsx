import { useEffect, useState } from 'react';

const FiltersPanel = ({ filters, onFilterChange, maxPrice = 1000 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(filters.priceRange);
  const [selectedColor, setSelectedColor] = useState(filters.color);
  const [selectedSize, setSelectedSize] = useState(filters.size);

  useEffect(() => {
    setPriceRange(filters.priceRange);
    setSelectedColor(filters.color);
    setSelectedSize(filters.size);
  }, [filters.priceRange, filters.color, filters.size]);

  const handleApplyFilters = () => {
    onFilterChange({
      ...filters,
      priceRange,
      color: selectedColor,
      size: selectedSize
    });
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    onFilterChange({
      ...filters,
      priceRange: [0, maxPrice],
      color: '',
      size: ''
    });
    setPriceRange([0, maxPrice]);
    setSelectedColor('');
    setSelectedSize('');
  };

  // Mock data for filter options
  const categories = ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories', 'Outerwear', 'Bags'];
  const colors = ["White", "Black", "Blue", "Red", "Green", "Yellow", "Pink", "Purple"];
  const sizes = ["S", "M", "L", "XL", "28", "30", "32", "34", "36", "38", "40", "6", "7", "8", "9", "10", "One Size"];
  const displayMaxPrice = Math.ceil(maxPrice);

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="font-playfair text-lg mb-2">Filters</h3>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between text-luxury-black/70 hover:text-luxury-black transition-colors"
        >
          <span>Open Filters</span>
          {!isOpen ? <span className="text-xs">▼</span> : <span className="text-xs">▲</span>}
        </button>
      </div>
      
      {isOpen && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <h4 className="font-semibold mb-2">Category</h4>
            <div className="space-y-1">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ''}
                  onChange={(e) => onFilterChange({...filters, category: e.target.value})}
                  className="h-4 w-4 text-gold"
                />
                <span>All Categories</span>
              </label>
              {categories.map(category => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={(e) => onFilterChange({...filters, category: e.target.value})}
                    className="h-4 w-4 text-gold"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Price Range Filter */}
          <div>
            <h4 className="font-semibold mb-2">Price Range</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-20">IDR</span>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const nextMin = Math.max(0, parseInt(e.target.value) || 0);
                    setPriceRange([nextMin, Math.max(nextMin, priceRange[1])]);
                  }}
                  className="luxury-input w-20 text-center"
                  min="0"
                />
                <span className="mx-2">-</span>
                <span className="w-20">IDR</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Math.max(priceRange[0], parseInt(e.target.value) || 0)])}
                  className="luxury-input w-20 text-center"
                  min="0"
                />
              </div>
              <div className="flex justify-between text-sm text-luxury-black/50">
                <span>IDR 0</span>
                <span>IDR {displayMaxPrice.toLocaleString('id-ID')}+</span>
              </div>
              <div className="w-full">
                <input
                  type="range"
                  min="0"
                  max={displayMaxPrice}
                  value={priceRange[0]}
                  onChange={(e) => {
                    const nextMin = parseInt(e.target.value);
                    setPriceRange([nextMin, Math.max(nextMin, priceRange[1])]);
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {/* Color Filter */}
          <div>
            <h4 className="font-semibold mb-2">Color</h4>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="color"
                  value=""
                  checked={filters.color === ''}
                  onChange={(e) => onFilterChange({...filters, color: e.target.value})}
                  className="h-4 w-4 text-gold"
                />
                <span>All Colors</span>
              </label>
              {colors.map(color => (
                <label key={color} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    checked={filters.color === color}
                    onChange={(e) => onFilterChange({...filters, color: e.target.value})}
                    className="h-4 w-4 text-gold"
                  />
                   <span className={`w-3 h-3 bg-${color.toLowerCase()}`} />
                 </label>
              ))}
            </div>
          </div>
          
          {/* Size Filter */}
          <div>
            <h4 className="font-semibold mb-2">Size</h4>
            <div className="flex flex-wrap gap-1">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="size"
                  value=""
                  checked={filters.size === ''}
                  onChange={(e) => onFilterChange({...filters, size: e.target.value})}
                  className="h-4 w-4 text-gold"
                />
                <span>All Sizes</span>
              </label>
              {sizes.map(size => (
                <label key={size} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="size"
                    value={size}
                    checked={filters.size === size}
                    onChange={(e) => onFilterChange({...filters, size: e.target.value})}
                    className="h-4 w-4 text-gold"
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <button 
              onClick={handleResetFilters}
              className="flex-1 luxury-btn-outline text-sm"
            >
              Reset
            </button>
            <button 
              onClick={handleApplyFilters}
              className="flex-1 luxury-btn text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;
