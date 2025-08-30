import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const Logo = () => (
    <Link to="/" className="flex items-center justify-center gap-2 mb-4">
        <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4ZM24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40Z" fill="url(#paint0_linear_login)"/>
            <path d="M22 20H26L30 34H26L25 29H23L22 34H18L22 20ZM24 22.8L23 27H25L24 22.8Z" fill="url(#paint1_linear_login)"/>
            <defs>
                <linearGradient id="paint0_linear_login" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse"><stop stopColor="#10B981"/><stop offset="1" stopColor="#059669"/></linearGradient>
                <linearGradient id="paint1_linear_login" x1="24" y1="20" x2="24" y2="34" gradientUnits="userSpaceOnUse"><stop stopColor="#10B981"/><stop offset="1" stopColor="#059669"/></linearGradient>
            </defs>
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Akshaya Patra Services</h1>
    </Link>
);

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();

  // --- SEO Best Practice & Handling URL Messages ---
  useEffect(() => {
    document.title = 'Login | Akshaya Patra Services';
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status === 'pending') {
      toast.error('Your account is pending approval. Please contact an administrator.');
    }
  }, [location]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    await login(data.email, data.password);
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 bg-gradient-to-br from-green-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center mb-8">
          <Logo />
          <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">HRMS Portal Login</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Work Email</label>
            <input type="email" {...register('email', { required: 'Email is required' })} className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
            {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>}
          </div>
          <div className="relative">
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">Password</label>
                <a href="#" className="text-sm text-brand-green-dark hover:underline">Forgot Password?</a>
            </div>
            <input type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Password is required' })} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-400">
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-brand-green-dark text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-light flex items-center justify-center gap-2">
            {isLoading ? <LoadingSpinner size="sm" /> : <FiLogIn />}
            <span>{isLoading ? 'Logging in...' : 'Login'}</span>
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600"></div></div>
          <div className="relative flex justify-center text-sm"><span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Or for Admins</span></div>
        </div>

        <div>
          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <FcGoogle size={22} />
            Sign in with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
