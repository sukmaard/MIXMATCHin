import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { formatIDR } from '../utils/currency';

const CartPage = () => {
  const { cartItems, clearCart, updateQuantity, removeFromCart } = useCart();
  const [checkoutPending, setCheckoutPending] = useState(false);

  const handleCheckout = () => {
    setCheckoutPending(true);
    // Simulate checkout process
    setTimeout(() => {
      alert('Thank you for your purchase! Your order has been placed.');
      clearCart();
      setCheckoutPending(false);
    }, 1500);
  };

  if (cartItems.length === 0) {
    return (
      <section className="py-12 bg-luxury-white min-h-[calc(100vh-200px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl font-playfair text-center mb-10 text-luxury-black"
          >
            Your Cart is Empty
          </motion.h2>
          <p className="text-luxury-black/60 text-center mb-8">
            Add some products to your cart to get started.
          </p>
          <a href="/catalog" className="luxury-btn-inline">
            Browse Products
          </a>
        </div>
      </section>
    );
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (Number(item.price) * (item.quantity || 1));
    }, 0);
  };

  return (
    <section className="py-12 bg-luxury-white min-h-[calc(100vh-200px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl font-playfair text-center mb-10 text-luxury-black"
        >
          Your Cart ({cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)
        </motion.h2>

        <div className="space-y-6">
          {cartItems.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="luxury-card p-6 flex flex-col sm:flex-row gap-6"
            >
              <div className="flex-shrink-0">
                <img
                  src={item.image || ''}
                  alt={item.name || 'Product'}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="font-playfair text-lg">{item.name || 'Untitled Product'}</h3>
                <p className="text-luxury-black/60">{item.category || 'Uncategorized'}</p>
                <div className="flex items-center space-x-4">
                  <p className="font-bold text-luxury-black">{formatIDR(item.price)}</p>
                  <div className="flex items-center space-x-3 border border-luxury-black/20 rounded-lg px-3 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      className="text-luxury-black/50 hover:text-luxury-black"
                      disabled={(item.quantity || 1) <= 1}
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{item.quantity || 1}</span>
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="text-luxury-black/50 hover:text-luxury-black"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-luxury-red-500 hover:text-luxury-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-luxury-black/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Total:</span>
            <span className="text-2xl font-bold text-luxury-black">{formatIDR(calculateTotal())}</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => clearCart()}
              className="flex-1 luxury-btn-outline border-luxury-black/30 text-luxury-black hover:bg-luxury-black/5"
            >
              Clear Cart
            </button>
            <button
              onClick={handleCheckout}
              disabled={checkoutPending}
              className="flex-1 luxury-btn bg-luxury-black text-luxury-white hover:bg-luxury-black/90"
            >
              {checkoutPending ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;