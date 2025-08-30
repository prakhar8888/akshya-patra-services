import React from 'react';
import { motion } from 'framer-motion';

/**
 * A flexible, accessible, and beautifully styled loading spinner component.
 * @param {object} props - The component props.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size of the spinner.
 * @param {string} [props.text] - Optional text to display below the spinner.
 * @param {string} [props.className] - Additional classes for the container.
 */
function LoadingSpinner({ size = 'md', text, className = '' }) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="status" // Accessibility: Informs screen readers of a live region
      className={`flex flex-col justify-center items-center gap-4 ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-gray-200 dark:border-gray-600 border-t-brand-green-dark ${sizeClasses[size]}`}
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </motion.div>
  );
}

export default LoadingSpinner;
