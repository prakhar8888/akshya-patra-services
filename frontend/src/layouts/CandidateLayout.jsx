import React, { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Reusable, consistent SVG Logo ---
const Logo = () => (
  <Link to="/" className="flex items-center gap-2">
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4ZM24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40Z" fill="url(#paint0_linear_1_2)"/>
      <path d="M22 20H26L30 34H26L25 29H23L22 34H18L22 20ZM24 22.8L23 27H25L24 22.8Z" fill="url(#paint1_linear_1_2)"/>
      <defs>
        <linearGradient id="paint0_linear_1_2" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981"/>
          <stop offset="1" stopColor="#059669"/>
        </linearGradient>
        <linearGradient id="paint1_linear_1_2" x1="24" y1="20" x2="24" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981"/>
          <stop offset="1" stopColor="#059669"/>
        </linearGradient>
      </defs>
    </svg>
    <span className="text-2xl font-bold text-gray-800 dark:text-white">
      Akshaya Patra Services
    </span>
  </Link>
);

// The Outlet component from react-router-dom will render the specific page
// (e.g., HomePage, ApplyPage) that matches the current URL.
function CandidateLayout() {
  // --- SEO Best Practice: Set a default title for this section ---
  useEffect(() => {
    document.title = 'Current Openings | Akshaya Patra Services';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Logo />
          {/* We can add navigation links here later if needed */}
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-green-dark dark:hover:text-white transition-colors"
          >
            Admin Login
          </Link>
        </nav>
      </header>

      {/* --- Framer Motion for smooth page content transitions --- */}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Akshaya Patra Services. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default CandidateLayout;
