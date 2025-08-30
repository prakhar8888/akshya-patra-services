import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

/**
 * This page is a temporary stop after a successful Google login.
 * Its only job is to get the token from the URL, update the auth state,
 * and then redirect to the correct dashboard.
 */
function AuthSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthUser } = useAuth();

  // --- SEO Best Practice: Set a specific title for the page ---
  useEffect(() => {
    document.title = 'Finalizing Authentication... | Akshaya Patra Services';
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const status = params.get('status');
    const error = params.get('error');

    // Handle cases where the backend redirects with a specific status
    if (status === 'pending') {
      toast.error('Your account is pending approval. Please contact an administrator.');
      navigate('/login', { replace: true });
      return;
    }

    if (status === 'failed' || error) {
      toast.error('Google authentication failed. Please try again.');
      navigate('/login', { replace: true });
      return;
    }

    // If a token is present, let the AuthContext handle it.
    // The AuthContext will fetch the user and redirect automatically.
    if (token) {
      setAuthUser(token);
    } else {
      // If no token and no status, it's an invalid redirect
      toast.error('Invalid authentication attempt.');
      navigate('/login', { replace: true });
    }
    // No need to navigate here, the setAuthUser function in the context handles it.
  }, [location, navigate, setAuthUser]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Finalizing authentication...
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Please wait while we securely log you in.
        </p>
      </motion.div>
    </div>
  );
}

export default AuthSuccessPage;
