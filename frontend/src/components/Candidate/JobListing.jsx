import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiDollarSign, FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Animation variants for Framer Motion
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function JobListing({ job }) {
  // Destructure for cleaner access and to handle potentially missing data
  const { _id, designation, sector, city, area, salary } = job;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl dark:hover:shadow-green-900/20 hover:-translate-y-1 transition-all duration-300 border border-transparent dark:border-gray-700 flex flex-col"
    >
      {/* Sector Tag */}
      <div className="flex justify-between items-center mb-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
          <FiBriefcase className="mr-2" />
          {sector || 'General'}
        </span>
      </div>

      {/* Job Title */}
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{designation}</h3>

      {/* Job Details */}
      <div className="text-gray-600 dark:text-gray-400 space-y-2 mb-4 flex-grow">
        <p className="flex items-center gap-2">
          <FiMapPin className="text-gray-400" />
          {/* Handle case where area might be missing */}
          <span>{city}{area && `, ${area}`}</span>
        </p>
        <p className="flex items-center gap-2">
          <FiDollarSign className="text-gray-400" />
          <span>{salary}</span>
        </p>
      </div>

      {/* Apply Button */}
      <Link
        to={`/apply/${_id}`} // CRITICAL FIX: Use _id instead of id
        className="block w-full text-center bg-brand-green-dark text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-light transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-dark"
      >
        Apply Now
      </Link>
    </motion.div>
  );
}

export default JobListing;
