import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';

// --- Lottie Player Script ---
// We need to ensure the Lottie player script is loaded.
// This can be added to your main index.html for a real application.
const LottiePlayer = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);
    // The lottie-player element is not a standard HTML element,
    // so we need to use this workaround for React.
    return (
        <div dangerouslySetInnerHTML={{ __html: `
            <lottie-player
                src="https://lottie.host/embed/8a79b8c0-29c8-4073-8219-5ff4f5f18730/k2yW2kP13i.json"
                background="transparent"
                speed="1"
                style="width: 300px; height: 300px; margin: 0 auto;"
                loop
                autoplay>
            </lottie-player>
        `}} />
    );
};


function NotFoundPage() {
  // --- SEO Best Practice: Set a specific title for the page ---
  useEffect(() => {
    document.title = '404 Not Found | Akshaya Patra Services';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl max-w-lg w-full border border-gray-200 dark:border-gray-700"
      >
        <LottiePlayer />

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          className="mt-4 text-4xl font-bold text-gray-800 dark:text-gray-100"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
          className="mt-2 text-base text-gray-500 dark:text-gray-400"
        >
          Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
          className="mt-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-brand-green-dark hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-dark transition-colors"
          >
            <FiHome />
            Go back home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
