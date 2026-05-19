import { AiOutlineMenu, AiOutlineClose, AiOutlineShoppingCart, AiOutlineLogout } from 'react-icons/ai';
import { FaInstagram } from 'react-icons/fa';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-luxury-white/90 backdrop-blur-sm fixed top-0 w-full z-50 border-b border-luxury-black/10">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between h-12">
           <div className="flex-shrink-0 flex items-center">
             <Link to="/" className="text-base font-playfair text-luxury-black">
               MIXMATCHin
             </Link>
           </div>
           <div className="flex items-center space-x-2">
             {/* Navigation Menu */}
             <nav className="hidden md:flex items-center space-x-4 text-sm">
               <NavLink to="/" className={({ isActive }) => `whitespace-nowrap text-luxury-black/70 hover:text-luxury-black transition-colors ${isActive ? 'font-semibold' : ''}`}>
                 Home
               </NavLink>
               <NavLink to="/catalog" className={({ isActive }) => `whitespace-nowrap text-luxury-black/70 hover:text-luxury-black transition-colors ${isActive ? 'font-semibold' : ''}`}>
                 Catalog
               </NavLink>
               <NavLink to="/mix-match" className={({ isActive }) => `whitespace-nowrap text-luxury-black/70 hover:text-luxury-black transition-colors ${isActive ? 'font-semibold' : ''}`}>
                 Mix & Match
               </NavLink>
               {isAuthenticated ? (
                 <>
                   <NavLink to="/upload" className={({ isActive }) => `whitespace-nowrap text-luxury-black/70 hover:text-luxury-black transition-colors ${isActive ? 'font-semibold' : ''}`}>
                     Upload
                   </NavLink>
                   <NavLink to="/instagram-upload" className={({ isActive }) => `whitespace-nowrap text-luxury-black/70 hover:text-luxury-black transition-colors ${isActive ? 'font-semibold' : ''}`}>
                     <FaInstagram className="inline mr-1" />
                     Instagram
                   </NavLink>
                   <NavLink to="/promotion-upload" className={({ isActive }) => `whitespace-nowrap text-luxury-black/70 hover:text-luxury-black transition-colors ${isActive ? 'font-semibold' : ''}`}>
                     Promo
                   </NavLink>
                   <button
                     onClick={handleLogout}
                     className="whitespace-nowrap text-luxury-black/70 hover:text-luxury-black transition-colors flex items-center"
                     title="Logout"
                   >
                     <AiOutlineLogout size={18} />
                     <span className="ml-1 hidden lg:inline">Logout</span>
                   </button>
                 </>
               ) : (
                 <NavLink to="/admin/login" className={({ isActive }) => `whitespace-nowrap text-luxury-black/70 hover:text-luxury-black transition-colors ${isActive ? 'font-semibold' : ''}`}>
                   Admin
                 </NavLink>
               )}
             </nav>
             
             {/* Mobile Menu Button */}
             <button 
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="md:hidden p-1.5 text-luxury-black hover:text-luxury-black/80 rounded"
               aria-label="Toggle menu"
             >
               {isMenuOpen ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
             </button>
             
             {/* Cart Icon */}
             <a href="/cart" className="relative p-1.5 text-luxury-black hover:text-luxury-black/80 rounded">
               <AiOutlineShoppingCart size={22} />
               {/* Cart badge */}
               <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center bg-gold text-luxury-white text-[10px] rounded-full">
                 {cartCount}
               </span>
             </a>
           </div>
         </div>
       </div>
       
       {/* Mobile Menu */}
       {isMenuOpen && (
         <div className="md:hidden bg-luxury-white/95 backdrop-blur-sm border-t border-luxury-black/10">
           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <NavLink to="/" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-luxury-black/5 text-luxury-black' : 'text-luxury-black/70 hover:bg-luxury-black/5 hover:text-luxury-black'}`}>
               Home
             </NavLink>
             <NavLink to="/catalog" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-luxury-black/5 text-luxury-black' : 'text-luxury-black/70 hover:bg-luxury-black/5 hover:text-luxury-black'}`}>
               Catalog
             </NavLink>
             <NavLink to="/mix-match" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-luxury-black/5 text-luxury-black' : 'text-luxury-black/70 hover:bg-luxury-black/5 hover:text-luxury-black'}`}>
               Mix & Match
             </NavLink>
             {isAuthenticated ? (
               <>
                 <NavLink to="/upload" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-luxury-black/5 text-luxury-black' : 'text-luxury-black/70 hover:bg-luxury-black/5 hover:text-luxury-black'}`}>
                   Upload
                 </NavLink>
                 <NavLink to="/instagram-upload" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-luxury-black/5 text-luxury-black' : 'text-luxury-black/70 hover:bg-luxury-black/5 hover:text-luxury-black'}`}>
                   <FaInstagram className="inline mr-1" />
                   Instagram Feed
                 </NavLink>
                 <NavLink to="/promotion-upload" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-luxury-black/5 text-luxury-black' : 'text-luxury-black/70 hover:bg-luxury-black/5 hover:text-luxury-black'}`}>
                   Current Promotion
                 </NavLink>
                 <button
                   onClick={handleLogout}
                   className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-luxury-black/70 hover:bg-luxury-black/5 hover:text-luxury-black"
                 >
                   Logout
                 </button>
               </>
             ) : (
               <NavLink to="/admin/login" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-luxury-black/5 text-luxury-black' : 'text-luxury-black/70 hover:bg-luxury-black/5 hover:text-luxury-black'}`}>
                 Admin Login
               </NavLink>
             )}
           </div>
         </div>
       )}
     </header>
   );
};

export default Header;
