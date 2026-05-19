import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import MixMatch from './pages/MixMatch';
import ProductUpload from './pages/ProductUpload';
import InstagramFeedUpload from './pages/InstagramFeedUpload';
import PromotionUpload from './pages/PromotionUpload';
import AdminLogin from './pages/AdminLogin';
import CartPage from './pages/CartPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-luxury-white text-luxury-black">
          <Header />
          <main className="pt-12">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<ProductCatalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/mix-match" element={<MixMatch />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <ProductUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instagram-upload"
                element={
                  <ProtectedRoute>
                    <InstagramFeedUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/promotion-upload"
                element={
                  <ProtectedRoute>
                    <PromotionUpload />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
