import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to upload page
  if (isAuthenticated) {
    return <Navigate to="/upload" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = login(username, password);
      if (result.success) {
        navigate('/upload');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 bg-luxury-white min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-4"
      >
        <div className="luxury-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-playfair text-luxury-black mb-2">
              Admin Login
            </h1>
            <p className="text-luxury-black/60">
              Enter your credentials to access product upload
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-black/20"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full luxury-btn py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-luxury-black/60 hover:text-luxury-black text-sm"
            >
              ← Back to Home
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-luxury-black/50">
          <p>Demo credentials: admin / mixmatchin2024</p>
        </div>
      </motion.div>
    </section>
  );
};

export default AdminLogin;
