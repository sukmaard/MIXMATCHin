import { useState } from 'react';

const SortDropdown = ({ sortBy, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'best-seller', label: 'Best Sellers' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 bg-luxury-white border border-luxury-black/20 rounded-lg 
                   text-luxury-black/70 hover:text-luxury-black transition-all duration-300 
                   focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
      >
        <span>
          {sortOptions.find(option => option.value === sortBy)?.label || 'Sort By'}
        </span>
        <span className="transition-transform duration-300">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 z-10 bg-luxury-white border border-luxury-black/20 rounded-lg shadow-lg">
          {sortOptions.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex justify-between items-center px-4 py-3 
                         ${sortBy === option.value ? 'bg-luxury-black/5' : 'hover:bg-luxury-black/2'} 
                         text-luxury-black/70`}
            >
              <span>{option.label}</span>
              {sortBy === option.value && (
                <span className="text-gold">✓</span>
              )}
               </button>
           ))}
         </div>
      )}
    </div>
  );
};

export default SortDropdown;