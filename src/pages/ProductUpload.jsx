import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaTrash, FaImages, FaTrashAlt } from 'react-icons/fa';
import { imageToBase64, getProducts, addProduct, clearImageStore } from '../utils/productStorage';

const normalizePurchaseLink = (value) => {
  const link = value.trim();
  if (!link) return '';
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(link)) return link;
  return `https://${link}`;
};

const ProductUpload = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Tops',
    description: '',
    colors: '',
    sizes: '',
    badge: '',
    purchaseLink: ''
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [productCount, setProductCount] = useState(0);

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories', 'Outerwear', 'Bags'];
  const badgeOptions = ['', 'NEW', 'HOT', 'SALE'];

  const loadProductCount = async () => {
    try {
      const products = await getProducts();
      setProductCount(products.length);
    } catch (error) {
      setProductCount(0);
    }
  };

  useEffect(() => {
    loadProductCount();
    window.addEventListener('products-changed', loadProductCount);
    return () => window.removeEventListener('products-changed', loadProductCount);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    try {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      // Convert files to base64 for preview and storage
      const newPreviewUrls = [];
      const newImages = [];

      for (const file of files) {
        if (file.type.startsWith('image/')) {
          const base64 = await imageToBase64(file);
          newPreviewUrls.push(base64);
          newImages.push({
            file,
            base64
          });
        }
      }

      setImages(prev => [...prev, ...newImages]);
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to read image file.' });
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      if (images.length === 0) {
        throw new Error('Please add at least one image');
      }

      if (!formData.name || !formData.price || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      // Convert colors and sizes from comma-separated strings to arrays
      const colors = formData.colors.split(',').map(c => c.trim()).filter(c => c);
      const sizes = formData.sizes.split(',').map(s => s.trim()).filter(s => s);

      // Use first image as main image, store all as base64
      const mainImage = images[0].base64;
      const allImages = images.map(img => img.base64);

      const newProduct = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        colors: colors.length > 0 ? colors : ['Default'],
        sizes: sizes.length > 0 ? sizes : ['One Size'],
        badge: formData.badge,
        purchaseLink: normalizePurchaseLink(formData.purchaseLink),
        image: mainImage,
        images: allImages
      };

      await addProduct(newProduct);
      await loadProductCount();

      setMessage({ type: 'success', text: 'Product added successfully!' });

      // Reset form
      setFormData({
        name: '',
        price: '',
        category: 'Tops',
        description: '',
        colors: '',
        sizes: '',
        badge: '',
        purchaseLink: ''
      });
      setImages([]);
      setPreviewUrls([]);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

    const handleResetAll = async () => {
       setIsResetting(true);
       try {
         await clearImageStore();
         await loadProductCount();
         setMessage({ type: 'success', text: 'All products have been reset.' });
         setShowResetConfirm(false);
       } catch (error) {
         setMessage({ type: 'error', text: 'Failed to reset products.' });
       } finally {
         setIsResetting(false);
       }
    };

  return (
    <section className="py-12 bg-luxury-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-playfair text-luxury-black mb-8 text-center">
            Add New Product
          </h1>

          {message.text && (
            <div
              className={`p-4 mb-6 rounded ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="luxury-card p-6">
              <label className="block text-lg font-medium mb-4">
                <FaImages className="inline mr-2" />
                Product Images *
              </label>

              <div className="flex flex-wrap gap-4">
                {/* Preview existing images */}
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg luxury-card"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}

                {/* Upload button */}
                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-luxury-black/30 rounded-lg cursor-pointer hover:border-luxury-black/50 transition-colors">
                  <FaUpload className="text-2xl mb-2 text-luxury-black/50" />
                  <span className="text-xs text-center">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-luxury-black/50 mt-2">
                You can upload multiple images. First image will be the main product image.
              </p>
            </div>

            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-lg font-medium mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20"
                placeholder="Enter product name"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-lg font-medium mb-2">
                Price (IDR) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20"
                placeholder="0.00"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-lg font-medium mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20 bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-lg font-medium mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20 resize-none"
                placeholder="Describe your product..."
              />
            </div>

            {/* Colors and Sizes Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="colors" className="block text-lg font-medium mb-2">
                  Colors (comma-separated)
                </label>
                <input
                  type="text"
                  id="colors"
                  name="colors"
                  value={formData.colors}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20"
                  placeholder="White, Black, Blue"
                />
              </div>

              <div>
                <label htmlFor="sizes" className="block text-lg font-medium mb-2">
                  Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  id="sizes"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20"
                  placeholder="S, M, L, XL"
                />
              </div>
            </div>

            {/* Badge */}
            <div>
              <label htmlFor="badge" className="block text-lg font-medium mb-2">
                Badge (optional)
              </label>
              <select
                id="badge"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20 bg-white"
              >
                {badgeOptions.map(opt => (
                  <option key={opt || 'none'} value={opt}>
                    {opt || 'None'}
                  </option>
                ))}
              </select>
            </div>

            {/* Purchase Link */}
            <div>
              <label htmlFor="purchaseLink" className="block text-lg font-medium mb-2">
                Purchase Link (optional)
              </label>
              <input
                type="text"
                id="purchaseLink"
                name="purchaseLink"
                value={formData.purchaseLink}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20"
                placeholder="https://shopee.co.id/product-link"
              />
              <p className="text-sm text-luxury-black/50 mt-2">
                Buy Now buttons will open this link directly.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full luxury-btn py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </form>

          {/* Navigation link to product catalog */}
          <div className="mt-8 text-center">
            <a
              href="/catalog"
              className="text-luxury-black/60 hover:text-luxury-black underline"
            >
              View Product Catalog
            </a>
          </div>

          {/* Reset All Products Section */}
          <div className="mt-12 pt-8 border-t border-luxury-black/10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center">
                <FaTrashAlt className="mr-2" />
                Danger Zone
              </h3>
              <p className="text-red-700 text-sm mb-4">
                Permanently delete all products. This action cannot be undone.
              </p>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="luxury-btn-outline border-red-300 text-red-700 hover:bg-red-100 px-6 py-2"
              >
                Reset All Products
              </button>
            </div>
          </div>

          {/* Reset Confirmation Modal */}
          {showResetConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg p-6 max-w-md w-full"
              >
                <h3 className="text-xl font-playfair mb-4">
                  Reset All Products?
                </h3>
                <p className="text-luxury-black/70 mb-6">
                  This will permanently delete all {productCount} product(s). 
                  This action cannot be undone. Are you sure?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 px-4 py-2 border border-luxury-black/20 rounded hover:bg-luxury-black/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetAll}
                    disabled={isResetting}
                    className="flex-1 luxury-btn bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2"
                  >
                    {isResetting ? 'Resetting...' : 'Yes, Delete All'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductUpload;
