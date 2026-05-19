import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-luxury-black text-luxury-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-playfair mb-4">MIXMATCHin</h3>
            <p className="text-luxury-white/70">
              Premium fashion showcase website with mix & match outfit feature.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-luxury-white/70 hover:text-luxury-white transition-colors">Home</a></li>
              <li><a href="#" className="text-luxury-white/70 hover:text-luxury-white transition-colors">Catalog</a></li>
              <li><a href="#" className="text-luxury-white/70 hover:text-luxury-white transition-colors">Mix & Match</a></li>
              <li><a href="#" className="text-luxury-white/70 hover:text-luxury-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Instagram */}
          <div>
            <h4 className="font-semibold mb-4">Instagram</h4>
            <a 
              href="https://www.instagram.com/mixmatchin?igsh=dXMxZG1wMnl4bXI1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-luxury-black text-luxury-white rounded-full hover:bg-luxury-black/90 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              aria-label="Visit Instagram"
            >
              <FaInstagram size={24} />
            </a>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-luxury-white/70 mb-4">
              Get updates on new collections and exclusive offers.
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="luxury-input flex-1"
              />
              <button type="submit" className="luxury-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Border and Copyright */}
        <div className="mt-10 pt-6 border-t border-luxury-black/20 text-center text-sm text-luxury-white/60">
          <p>&copy; {new Date().getFullYear()} MIXMATCHin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;