import React, { useState, useEffect, useCallback } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import JobListing from '../../components/Candidate/JobListing';
import { FiSearch, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

// --- NEW: Skeleton Loader for a professional loading experience ---
const JobCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
    <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
  </div>
);

function CandidateHomePage() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- SEO Best Practice: Set a specific title for the page ---
  useEffect(() => {
    document.title = 'Current Openings | Akshaya Patra Services';
  }, []);

  const fetchJobs = useCallback(async (currentPage, currentSearch) => {
    setIsLoading(true);
    try {
      // --- PERFORMANCE UPGRADE: Backend-driven search and pagination ---
      // NOTE: This requires the backend /api/jobs endpoint to support ?search= and ?page= query params.
      const { data } = await api.get(`/jobs?page=${currentPage}&search=${currentSearch}`);
      setJobs(data.jobs || data); // Handle both paginated and non-paginated responses gracefully
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
    } catch (error) {
      toast.error('Failed to fetch job listings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Debounce search to avoid excessive API calls
    const handler = setTimeout(() => {
      fetchJobs(1, searchTerm); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, fetchJobs]);

  useEffect(() => {
    fetchJobs(page, searchTerm);
  }, [page]); // Removed fetchJobs and searchTerm to prevent re-fetching on every keystroke

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const renderContent = () => {
    if (isLoading && jobs.length === 0) {
      return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      );
    }
    if (jobs.length === 0) {
      return (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">No Jobs Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Your search did not match any open positions. Please try again.</p>
        </div>
      );
    }
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => <JobListing key={job._id} job={job} />)}
      </motion.div>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Find Your <span className="text-brand-green-dark">Next Opportunity</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition:{delay: 0.2} }} className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Browse through our open positions and find a role that's right for you.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition:{delay: 0.3} }} className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiSearch className="h-5 w-5 text-gray-400" /></div>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by title, sector, or city..." className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green-dark focus:border-transparent" />
            </div>
          </motion.div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {renderContent()}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-12">
            <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="p-2 disabled:opacity-50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><FiChevronLeft size={20} /></button>
            <span className="text-sm text-gray-600 dark:text-gray-400 mx-4">Page {page} of {totalPages}</span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages} className="p-2 disabled:opacity-50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><FiChevronRight size={20} /></button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CandidateHomePage;
