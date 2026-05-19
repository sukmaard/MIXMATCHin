import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaImages, FaTrash, FaTrashAlt, FaUpload } from 'react-icons/fa';
import {
  addPromotion,
  deleteAllPromotions,
  deletePromotion,
  getHydratedPromotions,
  imageToBase64
} from '../utils/promotionStorage';

const PromotionUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    buttonText: 'Shop Now',
    link: '/catalog'
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const loadPromotions = async () => {
    try {
      const hydratedPromotions = await getHydratedPromotions();
      setPromotions(hydratedPromotions);
    } catch (error) {
      setPromotions([]);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (event) => {
    try {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        throw new Error('Please choose an image file.');
      }

      const base64 = await imageToBase64(file);
      setImage(base64);
      setPreviewUrl(base64);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to read image file.' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      discount: '',
      buttonText: 'Shop Now',
      link: '/catalog'
    });
    setImage(null);
    setPreviewUrl('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      if (!formData.title.trim()) throw new Error('Please enter a promotion title.');
      if (!formData.discount.trim()) throw new Error('Please enter a promotion discount.');
      if (!image) throw new Error('Please add a promotion image.');

      await addPromotion({
        title: formData.title.trim(),
        discount: formData.discount.trim(),
        buttonText: formData.buttonText.trim() || 'Shop Now',
        link: formData.link.trim() || '/catalog',
        image
      });

      setMessage({ type: 'success', text: 'Promotion added successfully!' });
      resetForm();
      await loadPromotions();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to add promotion.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await deletePromotion(id);
    await loadPromotions();
    setMessage({ type: 'success', text: 'Promotion deleted.' });
  };

  const handleResetAll = async () => {
    setIsResetting(true);
    try {
      await deleteAllPromotions();
      await loadPromotions();
      setShowResetConfirm(false);
      setMessage({ type: 'success', text: 'All promotions have been deleted.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete promotions.' });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <section className="py-12 bg-luxury-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-playfair text-luxury-black mb-8 text-center">
            Current Promotion Upload
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

          <div className="grid gap-8 lg:grid-cols-5">
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
              <div className="luxury-card p-6">
                <label className="block text-lg font-medium mb-4">
                  <FaImages className="inline mr-2" />
                  Promotion Image *
                </label>

                <div className="flex flex-wrap gap-4">
                  {previewUrl && (
                    <div className="relative w-40 h-28">
                      <img
                        src={previewUrl}
                        alt="Promotion preview"
                        className="w-full h-full object-cover rounded-lg luxury-card"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setPreviewUrl('');
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}

                  <label className="w-40 h-28 flex flex-col items-center justify-center border-2 border-dashed border-luxury-black/30 rounded-lg cursor-pointer hover:border-luxury-black/50 transition-colors">
                    <FaUpload className="text-2xl mb-2 text-luxury-black/50" />
                    <span className="text-xs text-center">Add Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-lg font-medium mb-2">
                  Promotion Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20"
                  placeholder="Spring Collection"
                />
              </div>

              <div>
                <label htmlFor="discount" className="block text-lg font-medium mb-2">
                  Discount Text *
                </label>
                <input
                  type="text"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20"
                  placeholder="Up to 40% OFF"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="buttonText" className="block text-lg font-medium mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    id="buttonText"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20"
                    placeholder="Shop Now"
                  />
                </div>

                <div>
                  <label htmlFor="link" className="block text-lg font-medium mb-2">
                    Link
                  </label>
                  <input
                    type="text"
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20"
                    placeholder="/catalog"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full luxury-btn py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding Promotion...' : 'Add Promotion'}
              </button>
            </form>

            <div className="lg:col-span-2 space-y-6">
              <div className="luxury-card p-6">
                <h2 className="text-2xl font-playfair mb-4">Uploaded Promotions</h2>
                <div className="space-y-4">
                  {promotions.length > 0 ? (
                    promotions.map((promotion) => (
                      <div key={promotion.id} className="flex gap-3 border-b border-luxury-black/10 pb-4 last:border-b-0 last:pb-0">
                        <img
                          src={promotion.image || '/assets/hero-bg.png'}
                          alt={promotion.title}
                          className="w-24 h-20 object-cover rounded"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-playfair text-lg line-clamp-1">{promotion.title}</h3>
                          <p className="text-sm font-semibold text-luxury-black/70">{promotion.discount}</p>
                          <p className="text-xs text-luxury-black/50 line-clamp-1">{promotion.link}</p>
                          <button
                            type="button"
                            onClick={() => handleDelete(promotion.id)}
                            className="mt-2 text-sm text-red-600 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-luxury-black/50">
                      No uploaded promotions yet. Homepage will show default promotions.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center">
                  <FaTrashAlt className="mr-2" />
                  Danger Zone
                </h3>
                <p className="text-red-700 text-sm mb-4">
                  Delete all uploaded promotions and return homepage to default promotions.
                </p>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="luxury-btn-outline border-red-300 text-red-700 hover:bg-red-100 px-6 py-2"
                >
                  Reset Promotions
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-playfair mb-4">Reset Promotions?</h3>
              <p className="text-luxury-black/70 mb-6">
                This will permanently delete all uploaded promotions.
              </p>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 border border-luxury-black/20 rounded hover:bg-luxury-black/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetAll}
                  disabled={isResetting}
                  className="flex-1 luxury-btn bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2"
                >
                  {isResetting ? 'Resetting...' : 'Yes, Reset'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PromotionUpload;
