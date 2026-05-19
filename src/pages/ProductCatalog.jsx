import { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import FiltersPanel from '../components/FiltersPanel';
import SortDropdown from '../components/SortDropdown';
import { getHydratedProducts } from '../utils/productStorage';

const DEFAULT_MAX_PRICE = 1000;

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, DEFAULT_MAX_PRICE],
    color: '',
    size: '',
    sortBy: 'newest'
  });

  useEffect(() => {
    const loadProducts = async () => {
      const products = await getHydratedProducts();
      const validProducts = products.filter(Boolean);
      const highestPrice = Math.max(
        DEFAULT_MAX_PRICE,
        ...validProducts.map(product => Number(product.price) || 0)
      );
      setProducts(validProducts);
      setMaxPrice(highestPrice);
      setFilters(prev => {
        if (prev.priceRange[0] === 0 && prev.priceRange[1] === DEFAULT_MAX_PRICE && highestPrice > DEFAULT_MAX_PRICE) {
          return { ...prev, priceRange: [0, highestPrice] };
        }
        return prev;
      });
    };
    loadProducts();
    window.addEventListener('storage', loadProducts);
    window.addEventListener('products-changed', loadProducts);
    return () => {
      window.removeEventListener('storage', loadProducts);
      window.removeEventListener('products-changed', loadProducts);
    };
  }, []);

  const filteredProducts = products.filter(product => {
    if (!product) return false;

    // Category filter
    if (filters.category && product.category !== filters.category) return false;
    
    // Price filter
    const price = Number(product.price) || 0;
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
    
    // Color filter (simplified)
    const colors = Array.isArray(product.colors) ? product.colors : [];
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];

    if (filters.color && !colors.includes(filters.color)) return false;
    
    // Size filter (simplified)
    if (filters.size && !sizes.includes(filters.size)) return false;
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      case 'price-high':
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      case 'best-seller':
        // Mock: pretend some are best sellers
        return Math.random() - 0.5;
      case 'newest':
      default:
        return (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0);
    }
  });

  return (
    <section className="py-12 bg-luxury-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Panel - Hidden on desktop, shown on mobile */}
          <div className="lg:hidden">
            <FiltersPanel 
              filters={filters} 
              onFilterChange={setFilters}
              maxPrice={maxPrice}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              {/* Filters Panel - Shown on desktop */}
              <div className="lg:block w-64">
                <FiltersPanel 
                  filters={filters} 
                  onFilterChange={setFilters}
                  maxPrice={maxPrice}
                />
              </div>
              
              {/* Product Grid and Controls */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-playfair text-luxury-black">
                    Product Catalog
                  </h2>
                  <SortDropdown 
                    sortBy={filters.sortBy} 
                    onSortChange={(value) => setFilters(prev => ({...prev, sortBy: value}))} 
                  />
                </div>
                
                <ProductGrid products={sortedProducts} />
              </div>
            </div>
          </div>
          
          {/* Filters Panel - Mobile (appears as bottom sheet when active) */}
          {/* Would need additional state for mobile bottom sheet */}
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
