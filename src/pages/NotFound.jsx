import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <section className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-luxury-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl font-playfair text-luxury-black mb-6">
          404
        </h1>
        <p className="text-xl text-luxury-black/70 mb-8">
          Page Not Found
        </p>
        <a 
          href="/" 
          className="luxury-btn px-8 py-3"
        >
          Return to Homepage
        </a>
      </motion.div>
    </section>
  );
};

export default NotFound;