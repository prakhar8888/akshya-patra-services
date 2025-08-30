import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi'; // Default icon

/**
 * A reusable card for displaying a key statistic, with a loading state.
 * @param {object} props - The component props.
 * @param {string} props.title - The title of the statistic (e.g., "Total Candidates").
 * @param {string | number} props.value - The value of the statistic.
 * @param {React.ReactNode} [props.icon] - The icon to display.
 * @param {'green' | 'blue' | 'yellow' | 'red'} [props.color='green'] - The color scheme for the icon.
 * @param {boolean} [props.isLoading] - If true, displays a skeleton loading state.
 */
function StatCard({ title, value, icon = <FiTrendingUp />, color = 'green', isLoading }) {
  const colorClasses = {
    green: 'from-green-400 to-green-600 text-white',
    blue: 'from-blue-400 to-blue-600 text-white',
    yellow: 'from-yellow-400 to-yellow-600 text-white',
    red: 'from-red-400 to-red-600 text-white',
  };

  // --- NEW: Loading Skeleton State ---
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
          <div className="h-14 w-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl dark:hover:shadow-green-900/20 transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{value}</p>
        </div>
        <div className={`p-4 rounded-full bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          {React.cloneElement(icon, { className: 'h-7 w-7' })}
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;
